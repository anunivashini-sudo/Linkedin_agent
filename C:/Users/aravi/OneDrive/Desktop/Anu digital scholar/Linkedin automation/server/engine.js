const { GoogleGenAI } = require("@google/generative-ai");
const db = require("./db");

// Sequential execution engine orchestrator
const executeWorkflow = async (workflowId) => {
  const executionId = `exec_${Date.now()}`;
  const logs = [];
  
  const addLog = (msg) => {
    const logStr = `[${new Date().toISOString()}] ${msg}`;
    console.log(`[Workflow Engine - ${workflowId}]: ${msg}`);
    logs.push(logStr);
  };

  addLog(`Starting execution pipeline for workflow: ${workflowId}`);

  try {
    // 1. Fetch nodes associated with this workflow
    let nodes = [];
    if (db.isConnected) {
      const res = await db.query("SELECT * FROM nodes WHERE workflow_id = $1", [workflowId]);
      nodes = res.rows;
    } else {
      // Mock Nodes if DB not available
      nodes = [
        { id: "node_1", type: "trigger", config: { interval: "Manual" }, label: "Trigger" },
        { id: "node_2", type: "ai", config: { topic: "AI Automations", tone: "Professional" }, label: "Gemini Post Gen" },
        { id: "node_3", type: "linkedin", config: { action: "Save Draft" }, label: "LinkedIn Publish" }
      ];
    }

    if (nodes.length === 0) {
      throw new Error("No nodes found for this workflow.");
    }

    // 2. Identify Node Types
    const triggerNode = nodes.find(n => n.type === "trigger");
    const aiNode = nodes.find(n => n.type === "ai");
    const enhancerNode = nodes.find(n => n.type === "enhancement");
    const approvalNode = nodes.find(n => n.type === "approval");
    const linkedinNode = nodes.find(n => n.type === "linkedin");

    // Start database log
    if (db.isConnected) {
      await db.query(
        "INSERT INTO executions (id, workflow_id, status, logs) VALUES ($1, $2, 'running', $3)",
        [executionId, workflowId, logs]
      );
    }

    let currentPayload = {};

    // --- Execute STEP 1: Trigger ---
    addLog(`Step 1: Running Trigger node [${triggerNode?.label || "Manual Trigger"}]`);
    currentPayload = {
      triggerFired: true,
      timestamp: new Date().toISOString(),
      ...triggerNode?.config
    };
    addLog("Trigger output loaded successfully.");

    // --- Execute STEP 2: Gemini Post Generation ---
    if (aiNode) {
      addLog(`Step 2: Running Gemini AI Generator [${aiNode.label}]`);
      const { topic, tone, audience, model, prompt: customPrompt } = aiNode.config || {};
      
      let generatedText = "";
      const apiKey = process.env.GEMINI_API_KEY;

      if (apiKey && apiKey !== "YOUR_KEY_HERE") {
        addLog(`Contacting Gemini API endpoint using model: ${model || "gemini-2.5-flash"}`);
        try {
          // Live API call structure
          const ai = new GoogleGenAI({ apiKey });
          const textModel = model === "Gemini 2.5 Pro" ? "gemini-2.5-pro" : "gemini-2.5-flash";
          const prompt = customPrompt || `Write a LinkedIn post about ${topic || "Tech Growth"} tailored for an audience of ${audience || "Founders"}. Make the tone ${tone || "Thought Leadership"}.`;
          
          const response = await ai.models.generateContent({
            model: textModel,
            contents: prompt,
          });
          generatedText = response.text;
        } catch (apiErr) {
          addLog(`Gemini API Call failed: ${apiErr.message}. Defaulting to backup content templates.`);
          generatedText = getFallbackContent(topic, tone);
        }
      } else {
        addLog("No active Gemini API Key found in environment. Utilizing local sandbox generator.");
        await new Promise(r => setTimeout(r, 1000)); // Simulate latency
        generatedText = getFallbackContent(topic, tone);
      }

      currentPayload.postContent = generatedText;
      addLog(`Gemini Generation complete. Output length: ${generatedText.length} characters.`);
    }

    // --- Execute STEP 3: Content Enhancement (Optional) ---
    if (enhancerNode && currentPayload.postContent) {
      addLog(`Step 3: Running Content Enhancer [${enhancerNode.label}]`);
      const { hook, cta } = enhancerNode.config || {};
      
      let content = currentPayload.postContent;
      if (hook) {
        content = "🔥 MUST READ FOR OPERATORS:\n\n" + content;
      }
      if (cta) {
        content = content + "\n\n👇 What are your thoughts on this? Let me know in the comments!";
      }

      currentPayload.postContent = content;
      addLog("Enhancement hooks and CTAs appended to post payload.");
    }

    // --- Execute STEP 4: Approval (Optional) ---
    if (approvalNode) {
      addLog(`Step 4: Running Approval Gate [${approvalNode.label}]`);
      const { approvalMode } = approvalNode.config || {};
      
      if (approvalMode === "Manual Review" || approvalMode === "Team Approval") {
        addLog("Approval Mode is set to MANUAL. Halting execution chain. Status set to: AWAITING_APPROVAL");
        if (db.isConnected) {
          await db.query(
            "UPDATE executions SET status = 'awaiting_approval', logs = $1, finished_at = CURRENT_TIMESTAMP WHERE id = $2",
            [logs, executionId]
          );
        }
        return { executionId, status: "awaiting_approval", payload: currentPayload };
      }
      addLog("Approval Mode: Auto-Approve. Continuing pipeline.");
    }

    // --- Execute STEP 5: LinkedIn Publishing ---
    if (linkedinNode && currentPayload.postContent) {
      addLog(`Step 5: Running LinkedIn Publish Node [${linkedinNode.label}]`);
      const { action } = linkedinNode.config || {};
      
      addLog(`Executing action: ${action || "Save Draft"}`);
      await new Promise(r => setTimeout(r, 800)); // mock network roundtrip

      // Save post object to Content Library (PostgreSQL)
      if (db.isConnected) {
        const postId = `post_${Date.now()}`;
        await db.query(
          "INSERT INTO posts (id, workflow_id, execution_id, content, status, published_at) VALUES ($1, $2, $3, $4, $5, $6)",
          [
            postId, 
            workflowId, 
            executionId, 
            currentPayload.postContent, 
            action === "Publish Post" ? "published" : "draft",
            action === "Publish Post" ? new Date() : null
          ]
        );
      }
      addLog(`LinkedIn action completed successfully. Payload cataloged.`);
    }

    addLog("Workflow execution completed successfully.");
    
    // Update execution history
    if (db.isConnected) {
      await db.query(
        "UPDATE executions SET status = 'success', logs = $1, finished_at = CURRENT_TIMESTAMP WHERE id = $2",
        [logs, executionId]
      );
    }

    return { executionId, status: "success", payload: currentPayload };

  } catch (err) {
    addLog(`CRITICAL ERROR: ${err.message}`);
    if (db.isConnected) {
      await db.query(
        "UPDATE executions SET status = 'failed', logs = $1, finished_at = CURRENT_TIMESTAMP, error_message = $2 WHERE id = $3",
        [logs, err.message, executionId]
      );
    }
    return { executionId, status: "failed", error: err.message };
  }
};

// Fallback high-quality LinkedIn post template generator
function getFallbackContent(topic = "Leveraging AI for Automations", tone = "Thought Leadership") {
  const date = new Date().getFullYear();
  return `🚀 The key to scaling operations in ${date}?

It isn't expanding headcount or working longer hours. It is visual orchestration.

By linking generative models like Gemini API to automation scripts, smart teams are building content engines that run entirely in the background.

Here is the 3-step stack:
1️⃣ Triggers: RSS feeds or webhook integrations capture ideas.
2️⃣ AI Generation: Gemini compiles detailed posts, adapting hooks and tones.
3️⃣ LinkedIn Publish: Automatically queue drafts for optimal audience reach.

The future belongs to those who build workflows, not just scripts.

#LinkedFlow #Automation #SaaS #AI #GenerativeAI`;
}

module.exports = {
  executeWorkflow
};
