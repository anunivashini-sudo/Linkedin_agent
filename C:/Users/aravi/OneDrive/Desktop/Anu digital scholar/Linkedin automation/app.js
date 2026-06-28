/*
  LinkedIn AI Automation Studio
  Core SPA Controller & Interactive Canvas Engine
*/

document.addEventListener('DOMContentLoaded', () => {
  // Global App State
  const state = {
    currentView: 'dashboard',
    theme: localStorage.getItem('theme') || 'light',
    credits: 12450,
    searchQuery: '',
    notifications: [
      { id: 1, type: 'success', text: 'LinkedIn post published successfully via "Founder Weekly Digest"', time: '10 mins ago', unread: true },
      { id: 2, type: 'error', text: 'Gemini Research Node failed: Rate limit exceeded on Gemini 1.5 Pro', time: '1 hour ago', unread: true },
      { id: 3, type: 'warning', text: 'AI Credit alert: Remaining credits dropped below 15%', time: '1 day ago', unread: false },
      { id: 4, type: 'info', text: 'New LinkedIn account linked: "Aravind R (Company Page)"', time: '2 days ago', unread: false }
    ],
    canvas: {
      zoom: 1,
      panX: 0,
      panY: 0,
      isPanning: false,
      startX: 0,
      startY: 0,
      selectedNodeId: null,
      nodes: [
        { id: 'node-1', type: 'trigger', name: 'Schedule Trigger', desc: 'Every Monday at 9:00 AM', x: 80, y: 220, data: { cron: '0 9 * * 1' } },
        { id: 'node-2', type: 'source', name: 'Website Scraper', desc: 'Scrape techcrunch.com/ai', x: 340, y: 220, data: { url: 'https://techcrunch.com/category/artificial-intelligence/' } },
        { id: 'node-3', type: 'ai', name: 'Gemini Research', desc: 'Extract key insights & trends', x: 600, y: 220, data: { prompt: 'Analyze the text and extract the top 3 trends in AI agent technology. Provide quotes and structural details.' } },
        { id: 'node-4', type: 'ai', name: 'Gemini LinkedIn Post', desc: 'Draft post & suggestions', x: 860, y: 220, data: { prompt: 'Write a high-impact LinkedIn post summarizing these insights.', audience: 'Founders & VC', tone: 'Thought leadership', length: 'Medium', emojis: true, hashtags: 3 } },
        { id: 'node-5', type: 'logic', name: 'Human Approval', desc: 'Review post before publish', x: 1120, y: 220, data: { notifyEmail: 'aravind@studio.ai' } },
        { id: 'node-6', type: 'linkedin', name: 'Publish Post', desc: 'Share on connected feed', x: 1380, y: 220, data: { account: 'Aravind R (Personal)' } },
        { id: 'node-7', type: 'data', name: 'Analytics Tracking', desc: 'Log analytics impressions', x: 1640, y: 220, data: { sheetId: 'linkedin-growth-tracker' } }
      ],
      connections: [
        { from: 'node-1', to: 'node-2' },
        { from: 'node-2', to: 'node-3' },
        { from: 'node-3', to: 'node-4' },
        { from: 'node-4', to: 'node-5' },
        { from: 'node-5', to: 'node-6' },
        { from: 'node-6', to: 'node-7' }
      ]
    },
    carouselSlides: [
      { id: 1, text: "🚀 Top 3 AI Trends of 2026 changing corporate structure." },
      { id: 2, text: "🧠 Trend 1: Agentic Orchestration. AI agents talking to AI agents to resolve workflows autonomously." },
      { id: 3, text: "⚡ Trend 2: Micro-models at the Edge. Lower token cost, instantaneous responses." },
      { id: 4, text: "🤝 Trend 3: Human-in-the-loop APIs. Handing off complex tasks to human supervisors natively." },
      { id: 5, text: "💬 What is your company doing to adapt? Leave a comment below! 👇" }
    ],
    activeCarouselIndex: 0,
    team: [
      { name: 'Aravind R', email: 'aravind@studio.ai', role: 'Admin', avatar: 'AR' },
      { name: 'Sarah Chen', email: 'sarah@studio.ai', role: 'Editor', avatar: 'SC' },
      { name: 'Michael Beck', email: 'michael@studio.ai', role: 'Viewer', avatar: 'MB' }
    ],
    executions: [
      { id: 'EX-98012', name: 'Weekly Newsletter Pipeline', started: '2026-06-28 09:00:15', duration: '14.2s', status: 'success', logs: 'All nodes finished.' },
      { id: 'EX-98011', name: 'Founder Branding Workflow', started: '2026-06-27 18:30:22', duration: '2.1s', status: 'failed', logs: 'Gemini Research Node failed: Rate limit exceeded.' },
      { id: 'EX-98010', name: 'Daily Tech News Scraper', started: '2026-06-27 08:00:04', duration: '15.6s', status: 'success', logs: 'All nodes finished.' },
      { id: 'EX-98009', name: 'Weekly Newsletter Pipeline', started: '2026-06-21 09:00:08', duration: '13.9s', status: 'success', logs: 'All nodes finished.' }
    ]
  };

  // Drag state for canvas nodes
  let activeDragNodeId = null;
  let dragOffsetX = 0;
  let dragOffsetY = 0;

  // Initialize Theme
  if (state.theme === 'dark') {
    document.body.classList.add('dark-mode');
  }

  // DOM Elements cache
  const elements = {
    sidebarItems: document.querySelectorAll('.nav-item'),
    viewPanels: document.querySelectorAll('.view-panel'),
    themeToggle: document.getElementById('theme-toggle'),
    notificationsToggle: document.getElementById('notifications-toggle'),
    notificationsDropdown: document.getElementById('notifications-dropdown'),
    notificationBadge: document.getElementById('notification-badge'),
    notificationList: document.getElementById('notification-list'),
    canvas: document.getElementById('canvas-wrapper'),
    canvasGrid: document.getElementById('canvas-grid'),
    svgOverlay: document.getElementById('connections-svg'),
    btnZoomIn: document.getElementById('zoom-in-btn'),
    btnZoomOut: document.getElementById('zoom-out-btn'),
    btnZoomReset: document.getElementById('zoom-reset-btn'),
    btnTestWorkflow: document.getElementById('test-workflow-btn'),
    configPanel: document.getElementById('config-panel'),
    configPanelClose: document.getElementById('config-panel-close'),
    configTitle: document.getElementById('config-node-title'),
    configBody: document.getElementById('config-panel-inputs'),
    linkedinPreviewBody: document.getElementById('linkedin-body'),
    linkedinCarouselWrap: document.getElementById('linkedin-carousel-wrap'),
    linkedinCarouselContent: document.getElementById('carousel-slide-content'),
    linkedinCarouselSlideNum: document.getElementById('carousel-slide-num'),
    linkedinCarouselPrev: document.getElementById('carousel-prev'),
    linkedinCarouselNext: document.getElementById('carousel-next'),
    btnGeneratePost: document.getElementById('generate-post-btn'),
    btnCopyPost: document.getElementById('copy-post-btn'),
    btnPublishPost: document.getElementById('publish-post-btn'),
    btnSchedulePost: document.getElementById('schedule-post-btn'),
    btnInviteTeam: document.getElementById('invite-team-btn'),
    modalInvite: document.getElementById('modal-invite-team'),
    modalInviteClose: document.getElementById('modal-invite-close'),
    btnSubmitInvite: document.getElementById('btn-submit-invite'),
    modalApproval: document.getElementById('modal-human-approval'),
    btnApproveModal: document.getElementById('btn-approve-post'),
    btnRejectModal: document.getElementById('btn-reject-post'),
    approvalTextArea: document.getElementById('approval-post-text'),
    execDrawer: document.getElementById('exec-drawer'),
    execDrawerClose: document.getElementById('exec-drawer-close'),
    execTableBody: document.getElementById('exec-table-body'),
    teamTableBody: document.getElementById('team-table-body'),
    globalSearch: document.getElementById('global-search'),
    // Pages / Switchers
    authContainer: document.getElementById('auth-container'),
    authCardTitle: document.getElementById('auth-card-title'),
    authCardSubtitle: document.getElementById('auth-card-subtitle'),
    authFormInputs: document.getElementById('auth-form-inputs'),
    authBtnSubmit: document.getElementById('auth-btn-submit'),
    authSwitchText: document.getElementById('auth-switch-text'),
    authSwitchLink: document.getElementById('auth-switch-link'),
    btnGoogleAuth: document.getElementById('auth-btn-google'),
    btnSidebarProfileLogout: document.getElementById('logout-btn')
  };

  /* ==========================================================================
     AUTHENTICATION ROUTER / TOGGLER
     ========================================================================== */
  let authMode = 'login'; // 'login' or 'signup'

  const showDashboard = () => {
    elements.authContainer.classList.add('hidden');
    elements.authContainer.style.display = 'none';
    showToast('Welcome back, Aravind!', 'success');
  };

  const showAuth = () => {
    elements.authContainer.style.display = 'flex';
    elements.authContainer.classList.remove('hidden');
  };

  // Toggle Auth mode (Login vs Signup)
  elements.authSwitchLink.addEventListener('click', (e) => {
    e.preventDefault();
    if (authMode === 'login') {
      authMode = 'signup';
      elements.authCardTitle.textContent = 'Create your Account';
      elements.authCardSubtitle.textContent = 'Get started with LinkedIn AI Automation Studio';
      elements.authFormInputs.innerHTML = `
        <div class="auth-form-group">
          <label class="auth-label">Full Name</label>
          <div class="auth-input-wrapper">
            <i class="fas fa-user"></i>
            <input type="text" class="auth-input" placeholder="Aravind R" required>
          </div>
        </div>
        <div class="auth-form-group">
          <label class="auth-label">Email Address</label>
          <div class="auth-input-wrapper">
            <i class="fas fa-envelope"></i>
            <input type="email" class="auth-input" placeholder="aravind@example.com" required>
          </div>
        </div>
        <div class="auth-form-group">
          <label class="auth-label">Password</label>
          <div class="auth-input-wrapper">
            <i class="fas fa-lock"></i>
            <input type="password" class="auth-input" placeholder="••••••••" required>
          </div>
        </div>
      `;
      elements.authBtnSubmit.textContent = 'Create Account';
      elements.authSwitchText.innerHTML = 'Already have an account? <a href="#" id="auth-switch-link-sub">Log in</a>';
    } else {
      authMode = 'login';
      elements.authCardTitle.textContent = 'Welcome Back';
      elements.authCardSubtitle.textContent = 'Log in to LinkedIn AI Automation Studio to continue';
      elements.authFormInputs.innerHTML = `
        <div class="auth-form-group">
          <label class="auth-label">Email Address</label>
          <div class="auth-input-wrapper">
            <i class="fas fa-envelope"></i>
            <input type="email" class="auth-input" placeholder="aravind@example.com" required>
          </div>
        </div>
        <div class="auth-form-group">
          <label class="auth-label">Password</label>
          <div class="auth-input-wrapper">
            <i class="fas fa-lock"></i>
            <input type="password" class="auth-input" placeholder="••••••••" required>
          </div>
        </div>
      `;
      elements.authBtnSubmit.textContent = 'Log In';
      elements.authSwitchText.innerHTML = 'New to Automation Studio? <a href="#" id="auth-switch-link-sub">Sign up free</a>';
    }
    // Re-bind click listener for the dynamically added switch link
    document.getElementById('auth-switch-link-sub').addEventListener('click', (ev) => {
      ev.preventDefault();
      elements.authSwitchLink.click();
    });
  });

  // Submit forms
  elements.authBtnSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    showDashboard();
  });

  elements.btnGoogleAuth.addEventListener('click', () => {
    showDashboard();
  });

  elements.btnSidebarProfileLogout.addEventListener('click', () => {
    showAuth();
  });

  /* ==========================================================================
     TOAST ALERTS SYSTEM
     ========================================================================== */
  const showToast = (message, type = 'info') => {
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '24px';
    toast.style.right = '24px';
    toast.style.padding = '14px 20px';
    toast.style.background = 'var(--bg-surface)';
    toast.style.border = '1px solid var(--border)';
    toast.style.borderRadius = 'var(--radius-md)';
    toast.style.boxShadow = 'var(--shadow-xl)';
    toast.style.zIndex = '9999';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '10px';
    toast.style.fontSize = '13.5px';
    toast.style.fontWeight = '600';
    toast.style.transform = 'translateY(100px)';
    toast.style.opacity = '0';
    toast.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';

    let icon = '<i class="fas fa-info-circle text-primary"></i>';
    if (type === 'success') {
      icon = '<i class="fas fa-check-circle" style="color: var(--success);"></i>';
      toast.style.borderLeft = '4px solid var(--success)';
    } else if (type === 'error') {
      icon = '<i class="fas fa-exclamation-triangle" style="color: var(--error);"></i>';
      toast.style.borderLeft = '4px solid var(--error)';
    } else if (type === 'warning') {
      icon = '<i class="fas fa-exclamation-circle" style="color: var(--warning);"></i>';
      toast.style.borderLeft = '4px solid var(--warning)';
    }

    toast.innerHTML = `${icon} <span>${message}</span>`;
    document.body.appendChild(toast);

    // Trigger animate-in
    setTimeout(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    }, 50);

    // Auto dismiss
    setTimeout(() => {
      toast.style.transform = 'translateY(100px)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  };

  /* ==========================================================================
     SPA ROUTER & VIEW SWITCHING
     ========================================================================== */
  elements.sidebarItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const view = item.getAttribute('data-view');
      if (!view) return;

      // Update active nav-item
      elements.sidebarItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      // Switch panels
      elements.viewPanels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.id === `view-${view}`) {
          panel.classList.add('active');
        }
      });

      state.currentView = view;

      // Draw SVG overlay if switching back to builder
      if (view === 'builder') {
        setTimeout(renderConnections, 50);
      }

      // Close other floating cards
      elements.notificationsDropdown.classList.remove('show');
    });
  });

  /* ==========================================================================
     GLOBAL SEARCH FILTERS
     ========================================================================== */
  elements.globalSearch.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    state.searchQuery = query;

    if (state.currentView === 'builder') {
      // Highlight search match nodes on builder canvas
      state.canvas.nodes.forEach(node => {
        const el = document.getElementById(node.id);
        if (el) {
          if (query && (node.name.toLowerCase().includes(query) || node.desc.toLowerCase().includes(query))) {
            el.style.boxShadow = '0 0 0 4px var(--accent)';
          } else {
            el.style.boxShadow = '';
          }
        }
      });
    } else if (state.currentView === 'templates') {
      // Filter template cards
      document.querySelectorAll('.template-card').forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(query)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    } else if (state.currentView === 'executions') {
      // Filter executions table
      document.querySelectorAll('#exec-table-body tr').forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(query)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    }
  });

  /* ==========================================================================
     DARK MODE TOGGLER
     ========================================================================== */
  elements.themeToggle.addEventListener('click', () => {
    if (state.theme === 'light') {
      state.theme = 'dark';
      document.body.classList.add('dark-mode');
      elements.themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
      showToast('Dark mode enabled.', 'info');
    } else {
      state.theme = 'light';
      document.body.classList.remove('dark-mode');
      elements.themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
      showToast('Light mode enabled.', 'info');
    }
    localStorage.setItem('theme', state.theme);
  });

  /* ==========================================================================
     NOTIFICATION DROPDOWN & COUNTERS
     ========================================================================== */
  const renderNotifications = () => {
    const unreadCount = state.notifications.filter(n => n.unread).length;
    if (unreadCount > 0) {
      elements.notificationBadge.style.display = 'block';
    } else {
      elements.notificationBadge.style.display = 'none';
    }

    elements.notificationList.innerHTML = '';
    state.notifications.forEach(notif => {
      const item = document.createElement('div');
      item.className = `notification-item ${notif.unread ? 'unread' : ''}`;
      item.innerHTML = `
        <div class="notification-icon-wrapper ${notif.type}">
          <i class="fas ${notif.type === 'success' ? 'fa-check' : notif.type === 'error' ? 'fa-times' : notif.type === 'warning' ? 'fa-exclamation' : 'fa-info'}"></i>
        </div>
        <div class="notification-content">
          <p class="notification-msg">${notif.text}</p>
          <span class="notification-time">${notif.time}</span>
        </div>
      `;
      item.addEventListener('click', () => {
        notif.unread = false;
        renderNotifications();
      });
      elements.notificationList.appendChild(item);
    });
  };

  elements.notificationsToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    elements.notificationsDropdown.classList.toggle('show');
  });

  document.addEventListener('click', () => {
    elements.notificationsDropdown.classList.remove('show');
  });

  elements.notificationsDropdown.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  renderNotifications();

  /* ==========================================================================
     EXECUTION MONITORING DRAWER & SIMULATED RUNS
     ========================================================================== */
  const renderExecTable = () => {
    elements.execTableBody.innerHTML = '';
    state.executions.forEach(exec => {
      const tr = document.createElement('tr');
      tr.style.cursor = 'pointer';
      tr.innerHTML = `
        <td style="font-weight: 600; color: var(--primary);">${exec.id}</td>
        <td style="font-weight: 500;">${exec.name}</td>
        <td>${exec.started}</td>
        <td>${exec.duration}</td>
        <td>
          <span class="execution-status-pill ${exec.status}">
            <i class="fas ${exec.status === 'success' ? 'fa-check-circle' : exec.status === 'running' ? 'fa-spinner fa-spin' : 'fa-exclamation-circle'}"></i>
            ${exec.status.toUpperCase()}
          </span>
        </td>
        <td style="color: var(--text-muted); font-size: 12px; max-width: 160px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${exec.logs}</td>
      `;
      tr.addEventListener('click', () => openExecutionDrawer(exec));
      elements.execTableBody.appendChild(tr);
    });
  };

  const openExecutionDrawer = (exec) => {
    document.getElementById('exec-drawer-id').textContent = exec.id;
    document.getElementById('exec-drawer-workflow-name').textContent = exec.name;

    const timelineContainer = document.getElementById('exec-timeline');
    timelineContainer.innerHTML = '';

    // Create a mock list of completed steps inside the drawer
    const steps = [
      { nodeName: 'Schedule Trigger', status: 'success', time: '09:00:15', msg: 'Cron rule match: Trigger fired.' },
      { nodeName: 'Website Scraper', status: 'success', time: '09:00:18', msg: 'Successfully fetched techcrunch.com/category/artificial-intelligence. Size: 140KB.' },
      { nodeName: 'Gemini Research', status: exec.status === 'failed' ? 'error' : 'success', time: '09:00:23', msg: exec.status === 'failed' ? 'Error: Model response status code 429.' : 'Tokens Processed: 8,421. Extracted top trends.' },
      { nodeName: 'Gemini LinkedIn Post', status: exec.status === 'failed' ? 'idle' : 'success', time: '09:00:26', msg: 'Draft generated: "Top AI Trends of 2026..."' },
      { nodeName: 'Human Approval', status: exec.status === 'failed' ? 'idle' : 'success', time: '09:00:28', msg: 'Post reviewed and approved by Admin.' },
      { nodeName: 'Publish Post', status: exec.status === 'failed' ? 'idle' : 'success', time: '09:00:29', msg: 'Post shared to LinkedIn feed. Link: linkedin.com/feed/update/urn:li:activity:7892182' },
      { nodeName: 'Analytics Tracking', status: exec.status === 'failed' ? 'idle' : 'success', time: '09:00:30', msg: 'Appended data point to Google Sheet.' }
    ];

    steps.forEach((step, idx) => {
      const stepDiv = document.createElement('div');
      stepDiv.className = `timeline-step ${step.status}`;
      stepDiv.innerHTML = `
        <div class="timeline-step-icon">
          <i class="fas ${step.status === 'success' ? 'fa-check' : step.status === 'error' ? 'fa-times' : 'fa-minus'}"></i>
        </div>
        <div class="timeline-step-info">
          <div class="timeline-step-title">${step.nodeName}</div>
          <div class="timeline-step-time">${step.status !== 'idle' ? `${step.time} • ${step.msg}` : 'Halted/Idle'}</div>
          ${step.status === 'success' || step.status === 'error' ? `
            <div class="timeline-payload-box">
              {
                "node_id": "node-${idx + 1}",
                "status": "${step.status}",
                "timestamp": "2026-06-28T09:00:${15 + idx * 3}Z",
                "output": { "text": "${step.msg.replace(/"/g, '\\"')}" }
              }
            </div>
          ` : ''}
        </div>
      `;
      timelineContainer.appendChild(stepDiv);
    });

    elements.execDrawer.classList.add('show');
  };

  elements.execDrawerClose.addEventListener('click', () => {
    elements.execDrawer.classList.remove('show');
  });

  document.getElementById('exec-retry-btn').addEventListener('click', () => {
    elements.execDrawer.classList.remove('show');
    showToast('Restarting simulation run on canvas...', 'info');
    elements.sidebarItems.forEach(i => {
      if (i.getAttribute('data-view') === 'builder') i.click();
    });
    // Trigger Simulation automatically
    setTimeout(() => {
      elements.btnTestWorkflow.click();
    }, 400);
  });

  renderExecTable();

  /* ==========================================================================
     INTERACTIVE WORKFLOW CANVAS BUILDER
     ========================================================================== */
  const canvasConfig = state.canvas;

  // Render nodes on canvas
  const renderNodes = () => {
    // Keep existing node nodes by removing dynamic class structures
    const existingNodeElements = elements.canvas.querySelectorAll('.canvas-node');
    existingNodeElements.forEach(el => el.remove());

    canvasConfig.nodes.forEach(node => {
      const nodeEl = document.createElement('div');
      nodeEl.id = node.id;
      nodeEl.className = `canvas-node ${node.type} status-idle`;
      nodeEl.style.left = `${node.x}px`;
      nodeEl.style.top = `${node.y}px`;

      // Set internal state values for reference
      nodeEl.innerHTML = `
        <div class="node-header-row">
          <div class="node-icon-wrapper">
            <i class="fas ${getNodeIcon(node.type)}"></i>
          </div>
          <span class="node-title-label">${node.name}</span>
        </div>
        <div class="node-desc-label">${node.desc}</div>
        <div class="node-port input"></div>
        <div class="node-port output"></div>
        <div class="node-status-bar"></div>
      `;

      // Bind node interactions
      nodeEl.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('node-port')) return; // let connecting port logic happen
        activeDragNodeId = node.id;
        // Compute offset corrected by current Zoom ratio
        dragOffsetX = e.clientX / canvasConfig.zoom - node.x;
        dragOffsetY = e.clientY / canvasConfig.zoom - node.y;
        e.stopPropagation();

        // Select Node visually
        elements.canvas.querySelectorAll('.canvas-node').forEach(n => n.classList.remove('selected'));
        nodeEl.classList.add('selected');
        canvasConfig.selectedNodeId = node.id;

        // Open config panel
        openConfigDrawer(node);
      });

      elements.canvas.appendChild(nodeEl);
    });

    renderConnections();
  };

  const getNodeIcon = (type) => {
    switch (type) {
      case 'trigger': return 'fa-clock';
      case 'linkedin': return 'fa-linkedin-in';
      case 'ai': return 'fa-brain';
      case 'source': return 'fa-globe';
      case 'logic': return 'fa-code-branch';
      case 'data': return 'fa-database';
      default: return 'fa-cog';
    }
  };

  // Redraw SVG connections curves from ports
  const renderConnections = () => {
    elements.svgOverlay.innerHTML = '';
    canvasConfig.connections.forEach(conn => {
      const fromNode = canvasConfig.nodes.find(n => n.id === conn.from);
      const toNode = canvasConfig.nodes.find(n => n.id === conn.to);

      if (!fromNode || !toNode) return;

      // Get ports center coordinates relative to canvas bounding box
      // Target elements on DOM for exact dimensions
      const fromEl = document.getElementById(fromNode.id);
      const toEl = document.getElementById(toNode.id);

      if (!fromEl || !toEl) return;

      const fromX = fromNode.x + fromEl.offsetWidth;
      const fromY = fromNode.y + fromEl.offsetHeight / 2;

      const toX = toNode.x;
      const toY = toNode.y + toEl.offsetHeight / 2;

      // Bezier curve layout
      const dx = Math.abs(toX - fromX) * 0.5;
      const pathData = `M ${fromX} ${fromY} C ${fromX + dx} ${fromY}, ${toX - dx} ${toY}, ${toX} ${toY}`;

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', pathData);
      path.setAttribute('class', 'connection-path');
      path.id = `connection-${fromNode.id}-${toNode.id}`;
      elements.svgOverlay.appendChild(path);
    });
  };

  // Node Drag and Pan handlers
  elements.canvas.parentElement.addEventListener('mousemove', (e) => {
    if (activeDragNodeId) {
      const node = canvasConfig.nodes.find(n => n.id === activeDragNodeId);
      if (node) {
        node.x = Math.round(e.clientX / canvasConfig.zoom - dragOffsetX);
        node.y = Math.round(e.clientY / canvasConfig.zoom - dragOffsetY);

        // Keep inside bounds
        node.x = Math.max(0, Math.min(node.x, 3000));
        node.y = Math.max(0, Math.min(node.y, 2000));

        const el = document.getElementById(activeDragNodeId);
        if (el) {
          el.style.left = `${node.x}px`;
          el.style.top = `${node.y}px`;
        }
        renderConnections();
      }
    } else if (canvasConfig.isPanning) {
      canvasConfig.panX = e.clientX - canvasConfig.startX;
      canvasConfig.panY = e.clientY - canvasConfig.startY;
      updateCanvasTransform();
    }
  });

  elements.canvas.parentElement.addEventListener('mouseup', () => {
    activeDragNodeId = null;
    canvasConfig.isPanning = false;
  });

  elements.canvas.parentElement.addEventListener('mousedown', (e) => {
    if (e.target.id === 'canvas-wrapper' || e.target.id === 'canvas-grid' || e.target.classList.contains('connections-svg')) {
      canvasConfig.isPanning = true;
      canvasConfig.startX = e.clientX - canvasConfig.panX;
      canvasConfig.startY = e.clientY - canvasConfig.panY;
      // Deselect selected nodes
      canvasConfig.selectedNodeId = null;
      elements.canvas.querySelectorAll('.canvas-node').forEach(n => n.classList.remove('selected'));
      elements.configPanel.classList.remove('show');
    }
  });

  const updateCanvasTransform = () => {
    elements.canvas.style.transform = `scale(${canvasConfig.zoom}) translate(${canvasConfig.panX / canvasConfig.zoom}px, ${canvasConfig.panY / canvasConfig.zoom}px)`;
  };

  // Zoom Button Controls
  elements.btnZoomIn.addEventListener('click', () => {
    canvasConfig.zoom = Math.min(1.5, canvasConfig.zoom + 0.1);
    document.getElementById('zoom-val').textContent = `${Math.round(canvasConfig.zoom * 100)}%`;
    updateCanvasTransform();
  });

  elements.btnZoomOut.addEventListener('click', () => {
    canvasConfig.zoom = Math.max(0.5, canvasConfig.zoom - 0.1);
    document.getElementById('zoom-val').textContent = `${Math.round(canvasConfig.zoom * 100)}%`;
    updateCanvasTransform();
  });

  elements.btnZoomReset.addEventListener('click', () => {
    canvasConfig.zoom = 1.0;
    canvasConfig.panX = 0;
    canvasConfig.panY = 0;
    document.getElementById('zoom-val').textContent = '100%';
    updateCanvasTransform();
  });

  // Adding draggable elements to canvas
  document.querySelectorAll('.node-item-draggable').forEach(item => {
    item.addEventListener('click', () => {
      // Simply create a new node at a central offset
      const type = item.getAttribute('data-type');
      const name = item.textContent.trim();
      const id = `node-${Date.now()}`;
      const newNode = {
        id: id,
        type: type,
        name: name,
        desc: `Configuration for ${name}`,
        x: Math.round(-canvasConfig.panX + 200 + Math.random() * 80),
        y: Math.round(-canvasConfig.panY + 150 + Math.random() * 80),
        data: {}
      };
      
      // Connect to the last selected or last node in pipeline if feasible
      const lastNode = canvasConfig.nodes[canvasConfig.nodes.length - 1];
      canvasConfig.nodes.push(newNode);
      if (lastNode) {
        canvasConfig.connections.push({ from: lastNode.id, to: newNode.id });
      }

      renderNodes();
      showToast(`Added node: ${name}`, 'info');
    });
  });

  // Initialize nodes list on startup
  renderNodes();

  /* ==========================================================================
     NODE CONFIGURATION PANEL
     ========================================================================== */
  const openConfigDrawer = (node) => {
    elements.configTitle.textContent = node.name;
    elements.configBody.innerHTML = '';

    // Create dynamically rendered configuration settings based on node properties
    if (node.type === 'trigger') {
      elements.configBody.innerHTML = `
        <div class="config-form-group">
          <label class="config-label">Trigger Frequency</label>
          <select class="config-input" id="cfg-freq">
            <option value="cron">Cron Expression (Custom)</option>
            <option value="daily">Daily News Check</option>
            <option value="weekly" selected>Weekly LinkedIn Digest</option>
          </select>
        </div>
        <div class="config-form-group">
          <label class="config-label">Cron Expression</label>
          <input type="text" class="config-input" value="${node.data.cron || '0 9 * * 1'}" id="cfg-cron">
        </div>
      `;
    } else if (node.type === 'source') {
      elements.configBody.innerHTML = `
        <div class="config-form-group">
          <label class="config-label">Scraper Feed URL</label>
          <input type="text" class="config-input" value="${node.data.url || 'https://example.com'}" id="cfg-url">
        </div>
        <div class="config-form-group">
          <label class="config-label">CSS Selectors to Extract</label>
          <input type="text" class="config-input" value="article, p.content-body" id="cfg-selector">
        </div>
      `;
    } else if (node.type === 'ai') {
      const isGenerate = node.name.includes('LinkedIn');
      if (isGenerate) {
        elements.configBody.innerHTML = `
          <div class="config-form-group">
            <label class="config-label">Target Audience</label>
            <input type="text" class="config-input" value="${node.data.audience || 'Founders & Developers'}" id="cfg-audience">
          </div>
          <div class="config-form-group">
            <label class="config-label">Tone & Style</label>
            <select class="config-input" id="cfg-tone">
              <option value="Thought leadership" selected>Thought leadership</option>
              <option value="Inspirational">Inspirational</option>
              <option value="Educational / Tactical">Educational / Tactical</option>
              <option value="Contrarian">Contrarian / Spicy</option>
            </select>
          </div>
          <div class="config-form-group">
            <label class="config-label">Post Length</label>
            <select class="config-input" id="cfg-length">
              <option value="Short">Short (1-2 sentences hook + callout)</option>
              <option value="Medium" selected>Medium (Detailed breakdown)</option>
              <option value="Long">Long (Full newsletter essay)</option>
            </select>
          </div>
          <div class="config-form-group">
            <label class="config-label">Gemini Output Prompt Template</label>
            <textarea class="config-input config-textarea" id="cfg-prompt">${node.data.prompt || ''}</textarea>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div class="config-form-group">
              <label class="config-label">Temperature</label>
              <input type="number" class="config-input" value="0.7" step="0.1" min="0" max="1" id="cfg-temp">
            </div>
            <div class="config-form-group">
              <label class="config-label">Model Selection</label>
              <select class="config-input" id="cfg-model">
                <option value="gemini-1.5-flash">Gemini 1.5 Flash (Fast)</option>
                <option value="gemini-1.5-pro" selected>Gemini 1.5 Pro (Logical)</option>
              </select>
            </div>
          </div>
          <button class="btn btn-primary" id="btn-cfg-preview" style="margin-top: 10px;">
            <i class="fas fa-eye"></i> Preview in Generator
          </button>
        `;

        document.getElementById('btn-cfg-preview').addEventListener('click', () => {
          elements.configPanel.classList.remove('show');
          elements.sidebarItems.forEach(i => {
            if (i.getAttribute('data-view') === 'generator') i.click();
          });
        });
      } else {
        // Generic AI node config
        elements.configBody.innerHTML = `
          <div class="config-form-group">
            <label class="config-label">Model Prompt Instruct</label>
            <textarea class="config-input config-textarea" id="cfg-prompt">${node.data.prompt || ''}</textarea>
          </div>
          <div class="config-form-group">
            <label class="config-label">AI Model</label>
            <select class="config-input" id="cfg-model">
              <option value="gemini-1.5-pro" selected>Gemini 1.5 Pro</option>
              <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
            </select>
          </div>
        `;
      }
    } else if (node.type === 'logic') {
      elements.configBody.innerHTML = `
        <div class="config-form-group">
          <label class="config-label">Approval Notifications</label>
          <input type="text" class="config-input" value="${node.data.notifyEmail || 'aravind@studio.ai'}" id="cfg-email">
        </div>
        <div class="config-form-group">
          <label class="config-label">Fallback Action (if no approval within 24h)</label>
          <select class="config-input" id="cfg-fallback">
            <option value="halt" selected>Halt execution (Safe)</option>
            <option value="publish">Auto-publish anyway</option>
          </select>
        </div>
      `;
    } else if (node.type === 'linkedin') {
      elements.configBody.innerHTML = `
        <div class="config-form-group">
          <label class="config-label">LinkedIn account</label>
          <select class="config-input" id="cfg-li-acc">
            <option value="personal" selected>Aravind R (Personal Feed)</option>
            <option value="company">Digital Scholar (Company Page)</option>
          </select>
        </div>
      `;
    } else {
      elements.configBody.innerHTML = `
        <div class="config-form-group">
          <label class="config-label">Node name</label>
          <input type="text" class="config-input" value="${node.name}" id="cfg-node-name">
        </div>
        <div class="config-form-group">
          <label class="config-label">Description</label>
          <input type="text" class="config-input" value="${node.desc}" id="cfg-node-desc">
        </div>
      `;
    }

    elements.configPanel.classList.add('show');
  };

  elements.configPanelClose.addEventListener('click', () => {
    elements.configPanel.classList.remove('show');
  });

  /* ==========================================================================
     WORKFLOW EXECUTION SIMULATION ENGINE
     ========================================================================== */
  let simulationActive = false;
  let currentSimStep = 0;
  let simTimer = null;

  elements.btnTestWorkflow.addEventListener('click', () => {
    if (simulationActive) {
      stopSimulation();
      return;
    }
    startSimulation();
  });

  const startSimulation = () => {
    simulationActive = true;
    currentSimStep = 0;
    elements.btnTestWorkflow.innerHTML = '<i class="fas fa-stop"></i> Stop Testing';
    elements.btnTestWorkflow.className = 'btn btn-danger';

    // Clear all status configurations
    state.canvas.nodes.forEach(n => {
      const el = document.getElementById(n.id);
      if (el) {
        el.className = `canvas-node ${n.type} status-idle`;
      }
    });
    // Remove running line connections
    document.querySelectorAll('.connection-path').forEach(p => {
      p.setAttribute('class', 'connection-path');
    });

    showToast('Starting workflow test sequence...', 'info');
    runNextSimulationStep();
  };

  const stopSimulation = () => {
    simulationActive = false;
    clearTimeout(simTimer);
    elements.btnTestWorkflow.innerHTML = '<i class="fas fa-play"></i> Test Workflow';
    elements.btnTestWorkflow.className = 'btn btn-primary';
    showToast('Workflow test stopped.', 'warning');
  };

  const runNextSimulationStep = () => {
    if (!simulationActive) return;

    if (currentSimStep >= state.canvas.nodes.length) {
      // Simulation finished successfully
      stopSimulation();
      showToast('Simulation complete: Post published to LinkedIn!', 'success');
      // Append to executions
      state.executions.unshift({
        id: `EX-${Math.floor(10000 + Math.random() * 90000)}`,
        name: 'Weekly Newsletter Pipeline',
        started: 'Just now',
        duration: '11.8s',
        status: 'success',
        logs: 'Simulation test finished manually.'
      });
      renderExecTable();
      return;
    }

    const node = state.canvas.nodes[currentSimStep];
    const nodeEl = document.getElementById(node.id);

    if (nodeEl) {
      // Shift node status to running
      nodeEl.className = `canvas-node ${node.type} status-running`;
      
      // Animate feeding line connecting this to the next node
      if (currentSimStep > 0) {
        const prevNode = state.canvas.nodes[currentSimStep - 1];
        const line = document.getElementById(`connection-${prevNode.id}-${node.id}`);
        if (line) {
          line.setAttribute('class', 'connection-path running');
        }
      }

      // Check for human-in-the-loop modal trigger
      if (node.type === 'logic' && node.name === 'Human Approval') {
        simTimer = setTimeout(() => {
          openHumanApprovalModal();
        }, 1200);
      } else {
        // Standard auto-success timing delays
        simTimer = setTimeout(() => {
          nodeEl.className = `canvas-node ${node.type} status-success`;
          if (currentSimStep > 0) {
            const prevNode = state.canvas.nodes[currentSimStep - 1];
            const line = document.getElementById(`connection-${prevNode.id}-${node.id}`);
            if (line) {
              line.setAttribute('class', 'connection-path success');
            }
          }
          currentSimStep++;
          runNextSimulationStep();
        }, 1500);
      }
    }
  };

  // Human Approval Modal Popup logic
  const openHumanApprovalModal = () => {
    elements.approvalTextArea.value = `🚀 AI Agentic Orchestration is set to dominate 2026.

Here are the key takeaways from TechCrunch this week:

1. Autonomous Communication: Multiple specialist models collaborating through agentic mesh topologies to solve enterprise workflows.
2. Low Latency: Optimized model layers operating directly on localized edge databases.
3. Supervision Interfaces: Transition from passive prompts to proactive human-in-the-loop review portals.

Which trend aligns closest to your current roadmap? Let us know below! 👇

#AI #ProductManagement #Founders`;
    elements.modalApproval.classList.add('show');
  };

  elements.btnApproveModal.addEventListener('click', () => {
    elements.modalApproval.classList.remove('show');
    const node = state.canvas.nodes[currentSimStep];
    const nodeEl = document.getElementById(node.id);
    if (nodeEl) {
      nodeEl.className = `canvas-node ${node.type} status-success`;
      if (currentSimStep > 0) {
        const prevNode = state.canvas.nodes[currentSimStep - 1];
        const line = document.getElementById(`connection-${prevNode.id}-${node.id}`);
        if (line) {
          line.setAttribute('class', 'connection-path success');
        }
      }
      currentSimStep++;
      showToast('Human approved. Proceeding with publish sequence...', 'success');
      runNextSimulationStep();
    }
  });

  elements.btnRejectModal.addEventListener('click', () => {
    elements.modalApproval.classList.remove('show');
    const node = state.canvas.nodes[currentSimStep];
    const nodeEl = document.getElementById(node.id);
    if (nodeEl) {
      nodeEl.className = `canvas-node ${node.type} status-error`;
      if (currentSimStep > 0) {
        const prevNode = state.canvas.nodes[currentSimStep - 1];
        const line = document.getElementById(`connection-${prevNode.id}-${node.id}`);
        if (line) {
          line.setAttribute('class', 'connection-path error');
        }
      }
      stopSimulation();
      showToast('Workflow halted: Post draft was rejected.', 'error');
      // Log failure
      state.executions.unshift({
        id: `EX-${Math.floor(10000 + Math.random() * 90000)}`,
        name: 'Weekly Newsletter Pipeline',
        started: 'Just now',
        duration: '4.5s',
        status: 'failed',
        logs: 'Workflow rejected by human operator at node: Human Approval.'
      });
      renderExecTable();
    }
  });

  /* ==========================================================================
     LINKEDIN POST GENERATOR (PREVIEW & CAROUSEL TOGGLE)
     ========================================================================== */
  let postFormat = 'text';

  document.querySelectorAll('input[name="gen-format"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      postFormat = e.target.value;
      if (postFormat === 'carousel') {
        elements.linkedinCarouselWrap.style.display = 'flex';
        renderCarouselSlide();
      } else {
        elements.linkedinCarouselWrap.style.display = 'none';
      }
    });
  });

  const renderCarouselSlide = () => {
    const total = state.carouselSlides.length;
    elements.linkedinCarouselSlideNum.textContent = `Slide ${state.activeCarouselIndex + 1} of ${total}`;
    elements.linkedinCarouselContent.textContent = state.carouselSlides[state.activeCarouselIndex].text;
  };

  elements.linkedinCarouselPrev.addEventListener('click', () => {
    if (state.activeCarouselIndex > 0) {
      state.activeCarouselIndex--;
      renderCarouselSlide();
    }
  });

  elements.linkedinCarouselNext.addEventListener('click', () => {
    if (state.activeCarouselIndex < state.carouselSlides.length - 1) {
      state.activeCarouselIndex++;
      renderCarouselSlide();
    }
  });

  // Generate Post triggers typewriter style loading
  elements.btnGeneratePost.addEventListener('click', () => {
    elements.btnGeneratePost.disabled = true;
    elements.btnGeneratePost.innerHTML = '<span class="typewriter-loader"><span class="typewriter-dot"></span><span class="typewriter-dot"></span><span class="typewriter-dot"></span></span> Generating...';

    const topic = document.getElementById('gen-topic').value || 'Artificial Intelligence';
    const audience = document.getElementById('gen-audience').value || 'Founders';
    const tone = document.getElementById('gen-tone').value;

    setTimeout(() => {
      elements.btnGeneratePost.disabled = false;
      elements.btnGeneratePost.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> Generate with Gemini';

      // Inject custom text outputs
      elements.linkedinPreviewBody.textContent = `🚀 How is AI transforming strategy for ${audience} in 2026?

Let's break down the key parameters that matter most:

🌐 Decentralized Operations: Small teams executing billion-dollar workflows via custom agency models.
⚡ Core Efficiency: Why building API endpoints beats hiring standard development wrappers.
📈 Direct Feedback Loops: Using AI to analyze comment semantics in real-time.

What is your take on this topic? Let us know in the comments below! 👇

#${topic.replace(/\s+/g, '')} #Innovation #Strategy`;

      // Update Carousel slides with custom topics
      state.carouselSlides = [
        { id: 1, text: `👉 AI strategy overview for ${audience}:` },
        { id: 2, text: "🧠 Step 1: Automate standard repetitive logic nodes." },
        { id: 3, text: "💡 Step 2: Establish strict human-in-the-loop review criteria." },
        { id: 4, text: "🚀 Step 3: Publish natively to LinkedIn for real-time analytics loop." }
      ];
      state.activeCarouselIndex = 0;
      renderCarouselSlide();

      // Deduct credits
      state.credits = Math.max(0, state.credits - 15);
      document.getElementById('credit-badge-val').textContent = `${state.credits.toLocaleString()} / 15,000`;

      showToast('LinkedIn post draft generated successfully!', 'success');
    }, 1800);
  });

  elements.btnCopyPost.addEventListener('click', () => {
    navigator.clipboard.writeText(elements.linkedinPreviewBody.textContent);
    showToast('Post copied to clipboard!', 'success');
  });

  elements.btnPublishPost.addEventListener('click', () => {
    showToast('Successfully published post directly to LinkedIn feed!', 'success');
  });

  elements.btnSchedulePost.addEventListener('click', () => {
    showToast('Post scheduled successfully in queue!', 'success');
  });

  /* ==========================================================================
     TEAM INVITE & ROLES MANAGEMENT
     ========================================================================== */
  const renderTeamTable = () => {
    elements.teamTableBody.innerHTML = '';
    state.team.forEach(member => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div style="display: flex; align-items: center; gap: 10px;">
            <div class="sidebar-avatar" style="width:30px; height:30px; font-size:12px;">${member.avatar}</div>
            <span style="font-weight:600;">${member.name}</span>
          </div>
        </td>
        <td>${member.email}</td>
        <td><span class="tag-badge" style="background: var(--primary-light); color: var(--primary);">${member.role}</span></td>
        <td style="color: var(--success); font-weight:600;"><i class="fas fa-check-circle"></i> Active</td>
        <td>
          <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 11px;"><i class="fas fa-trash"></i> Revoke</button>
        </td>
      `;
      elements.teamTableBody.appendChild(tr);
    });
  };

  elements.btnInviteTeam.addEventListener('click', () => {
    elements.modalInvite.classList.add('show');
  });

  elements.modalInviteClose.addEventListener('click', () => {
    elements.modalInvite.classList.remove('show');
  });

  elements.btnSubmitInvite.addEventListener('click', () => {
    const name = document.getElementById('invite-name').value;
    const email = document.getElementById('invite-email').value;
    const role = document.getElementById('invite-role').value;

    if (name && email) {
      const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
      state.team.push({ name, email, role, avatar: initials });
      renderTeamTable();
      elements.modalInvite.classList.remove('show');
      showToast(`Invited ${name} as ${role}!`, 'success');
      document.getElementById('invite-name').value = '';
      document.getElementById('invite-email').value = '';
    } else {
      showToast('Please fill in all invite fields.', 'warning');
    }
  });

  renderTeamTable();

  /* ==========================================================================
     AI SETTINGS KEYS VISIBILITY
     ========================================================================== */
  document.querySelectorAll('.key-reveal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling;
      if (input.type === 'password') {
        input.type = 'text';
        btn.innerHTML = '<i class="fas fa-eye-slash"></i>';
      } else {
        input.type = 'password';
        btn.innerHTML = '<i class="fas fa-eye"></i>';
      }
    });
  });

  // Save Settings forms Toast feedback
  document.querySelectorAll('.btn-save-settings').forEach(btn => {
    btn.addEventListener('click', () => {
      showToast('Settings saved successfully.', 'success');
    });
  });

  /* ==========================================================================
     TEMPLATES GRID SELECTION
     ========================================================================== */
  document.querySelectorAll('.btn-use-template').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-template-name');
      showToast(`Imported template: "${name}" to Builder!`, 'success');
      elements.sidebarItems.forEach(i => {
        if (i.getAttribute('data-view') === 'builder') i.click();
      });
    });
  });

  /* ==========================================================================
     INTERACTIVE HEATMAP & SVG GRAPHIC INITIALIZATION
     ========================================================================== */
  const renderHeatmap = () => {
    const container = document.getElementById('heatmap-container');
    if (!container) return;

    container.innerHTML = '';
    const date = new Date();
    // Render 120 grid cells for execution density
    for (let i = 0; i < 120; i++) {
      const cell = document.createElement('div');
      const level = Math.floor(Math.random() * 5); // 0 to 4 density
      cell.className = `heatmap-cell level-${level}`;

      // Date calculations
      const cellDate = new Date(date);
      cellDate.setDate(date.getDate() - (120 - i));

      const tooltip = document.createElement('span');
      tooltip.className = 'tooltip';
      tooltip.textContent = `${cellDate.toLocaleDateString()}: ${level * 3 + Math.floor(Math.random() * 3)} Executions`;
      cell.appendChild(tooltip);

      container.appendChild(cell);
    }
  };

  renderHeatmap();

});
