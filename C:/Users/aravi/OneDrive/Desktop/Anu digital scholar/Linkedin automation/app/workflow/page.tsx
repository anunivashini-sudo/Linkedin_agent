"use client";

import React, { useState, useCallback, useRef } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { CustomNodeTypes } from "@/components/CustomNodes";
import { 
  Play, 
  Save, 
  Trash2, 
  ChevronRight, 
  Layers, 
  Cpu, 
  CheckCircle2, 
  X, 
  Code,
  Sparkles,
  RefreshCw,
  Plus,
  HelpCircle
} from "lucide-react";

// Standard pre-populated nodes for Demo Template
const initialNodes = [
  {
    id: "node_1",
    type: "customNode",
    position: { x: 80, y: 150 },
    data: { 
      label: "Schedule Trigger", 
      type: "trigger", 
      subType: "schedule",
      status: "idle",
      config: { interval: "Daily @ 9:00 AM" }
    },
  },
  {
    id: "node_2",
    type: "customNode",
    position: { x: 420, y: 150 },
    data: { 
      label: "Gemini AI Generator", 
      type: "ai",
      status: "idle",
      config: { 
        model: "Gemini 2.5 Flash",
        topic: "Leveraging AI for SaaS Automations", 
        audience: "Tech Founders",
        tone: "Thought Leadership",
        goal: "Increase Newsletter Signups",
        prompt: "Write a high-converting LinkedIn post about AI and SaaS workflows."
      }
    },
  },
  {
    id: "node_3",
    type: "customNode",
    position: { x: 760, y: 150 },
    data: { 
      label: "LinkedIn Publish", 
      type: "linkedin",
      status: "idle",
      config: { action: "Publish Post" }
    },
  },
];

const initialEdges: Edge[] = [
  { 
    id: "edge_1", 
    source: "node_1", 
    target: "node_2", 
    sourceHandle: "output",
    targetHandle: "input",
    animated: false,
    style: { stroke: "#94a3b8", strokeWidth: 2.5 }
  },
  { 
    id: "edge_2", 
    source: "node_2", 
    target: "node_3", 
    sourceHandle: "output",
    targetHandle: "input",
    animated: false,
    style: { stroke: "#94a3b8", strokeWidth: 2.5 }
  },
];

export default function WorkflowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState<any>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>(initialEdges);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [generatedPost, setGeneratedPost] = useState<string>("");
  const [logOpen, setLogOpen] = useState(false);
  
  // Connect handles
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({
      ...params,
      animated: false,
      style: { stroke: "#94a3b8", strokeWidth: 2.5 }
    }, eds)),
    [setEdges]
  );

  // Click Node to configure
  const onNodeClick = useCallback((event: React.MouseEvent, node: any) => {
    setSelectedNode(node);
  }, []);

  // Update Node configuration fields
  const updateSelectedNodeConfig = (key: string, val: any) => {
    if (!selectedNode) return;
    
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          const updatedConfig = {
            ...node.data.config,
            [key]: val
          };
          
          // Update local selected node state as well to sync UI
          setSelectedNode({
            ...node,
            data: {
              ...node.data,
              config: updatedConfig
            }
          });

          return {
            ...node,
            data: {
              ...node.data,
              config: updatedConfig
            }
          };
        }
        return node;
      })
    );
  };

  // Add Node helper
  const addNode = (type: string, subType?: string) => {
    const id = `node_${Date.now()}`;
    const labels: Record<string, string> = {
      trigger: `${subType ? subType.charAt(0).toUpperCase() + subType.slice(1) : "Manual"} Trigger`,
      ai: "Gemini AI Generator",
      enhancement: "Content Enhancer",
      approval: "Manual Approval Gate",
      linkedin: "LinkedIn Publisher",
      analytics: "LinkedIn Analytics Fetcher"
    };

    const defaultConfigs: Record<string, any> = {
      trigger: { interval: "Daily @ 9:00 AM" },
      ai: { model: "Gemini 2.5 Flash", topic: "LinkedIn growth", tone: "Educational", audience: "Developers", prompt: "" },
      enhancement: { hook: true, cta: true, statistics: false },
      approval: { approvalMode: "Manual Review" },
      linkedin: { action: "Save Draft" },
      analytics: { metrics: ["likes", "impressions"] }
    };

    const newNode = {
      id,
      type: "customNode",
      position: { x: 200 + Math.random() * 100, y: 150 + Math.random() * 100 },
      data: {
        label: labels[type] || "Custom Node",
        type,
        subType,
        status: "idle",
        config: defaultConfigs[type] || {}
      }
    };

    setNodes((nds) => nds.concat(newNode));
    setLogs((prev) => [...prev, `[System] Added node: ${newNode.data.label}`]);
  };

  // Delete Node helper
  const deleteNode = (nodeId: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
    setSelectedNode(null);
    setLogs((prev) => [...prev, `[System] Deleted node: ${nodeId}`]);
  };

  // Execute Workflow (Animation and Mocking logic)
  const runWorkflow = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setLogOpen(true);
    setLogs([]);
    setGeneratedPost("");

    const addLog = (msg: string) => {
      setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    };

    try {
      // Step 1: Trigger Node
      addLog("Starting workflow execution...");
      setNodes((nds) => nds.map(n => n.data.type === "trigger" ? { ...n, data: { ...n.data, status: "running" } } : n));
      await new Promise(r => setTimeout(r, 1000));
      setNodes((nds) => nds.map(n => n.data.type === "trigger" ? { ...n, data: { ...n.data, status: "success" } } : n));
      addLog("Trigger fired: Schedule matches daily publishing queue.");

      // Animate edge 1
      setEdges(eds => eds.map(e => e.source === "node_1" ? { ...e, animated: true } : e));
      await new Promise(r => setTimeout(r, 800));

      // Step 2: Gemini Node
      addLog("Initializing Gemini AI Engine...");
      setNodes((nds) => nds.map(n => n.data.type === "ai" ? { ...n, data: { ...n.data, status: "running" } } : n));
      addLog(`Sending prompt variables: Model=Gemini 2.5 Flash, Topic="${nodes[1]?.data?.config?.topic || "Leveraging AI"}", Tone=Thought Leadership`);
      await new Promise(r => setTimeout(r, 1800));
      
      const responseText = `🚀 The secret to building a high-growth SaaS in 2026? 

It isn't writing thousands of lines of custom boilerplate code anymore. It is intelligent orchestration.

Automations powered by large language models (LLMs) are replacing traditional, rigid Zapier connections. Modern developers are building workflows that think, rewrite, and auto-optimize themselves. 

Here are the 3 workflows you should automate today:
1️⃣ Customer feedback routing & automated sentiment response.
2️⃣ Technical documentation generation based on Git commits.
3️⃣ RSS-to-social post syndication with AI branding guardrails.

Stop building integrations from scratch. Start building automated agents that orchestrate your ecosystem.

#SaaS #AI #LLM #SoftwareEngineering #Automation #LinkedFlow`;

      setGeneratedPost(responseText);
      setNodes((nds) => nds.map(n => n.data.type === "ai" ? { ...n, data: { ...n.data, status: "success" } } : n));
      addLog("Gemini API content generation successful (384 input tokens, 192 output tokens).");

      // Animate edge 2
      setEdges(eds => eds.map(e => e.source === "node_2" ? { ...e, animated: true } : e));
      await new Promise(r => setTimeout(r, 800));

      // Step 3: LinkedIn Node
      addLog("Formatting post output for LinkedIn API...");
      setNodes((nds) => nds.map(n => n.data.type === "linkedin" ? { ...n, data: { ...n.data, status: "running" } } : n));
      await new Promise(r => setTimeout(r, 1200));
      setNodes((nds) => nds.map(n => n.data.type === "linkedin" ? { ...n, data: { ...n.data, status: "success" } } : n));
      addLog("Success! Post successfully published to LinkedIn (ID: li_post_983274).");
      addLog("Workflow execution finished successfully.");

    } catch (err) {
      addLog("Error: Execution halted due to an unexpected error.");
    } finally {
      setIsRunning(false);
      // Reset animations after short delay
      setTimeout(() => {
        setEdges(eds => eds.map(e => ({ ...e, animated: false })));
      }, 3000);
    }
  };

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col -m-8 relative select-none bg-slate-50">
      {/* Top Builder Control Panel */}
      <div className="h-14 border-b border-slate-200 bg-white px-6 flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Workflow</span>
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 -mt-0.5">
              <span>Daily AI Thought Leadership</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={runWorkflow}
            disabled={isRunning}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 shadow-md shadow-blue-150"
          >
            {isRunning ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>Executing...</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Run Workflow</span>
              </>
            )}
          </button>
          <button className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 shadow-sm">
            <Save className="h-3.5 w-3.5" />
            <span>Save Flow</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Workspace */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Left Drag/Add Panel */}
        <div className="w-56 border-r border-slate-200 bg-white flex flex-col z-10 select-none">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-slate-500" />
              <span>Canvas Elements</span>
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Click to add nodes onto the canvas.</p>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {/* Triggers Group */}
            <div>
              <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase px-1">Triggers</span>
              <div className="mt-1.5 space-y-1">
                <button onClick={() => addNode("trigger", "manual")} className="w-full text-left px-2 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-lg flex items-center gap-2 border border-transparent hover:border-slate-100 transition-all duration-150">
                  <Play className="h-3.5 w-3.5 text-emerald-600 bg-emerald-50 p-0.5 border border-emerald-100 rounded" />
                  <span>Manual Trigger</span>
                </button>
                <button onClick={() => addNode("trigger", "schedule")} className="w-full text-left px-2 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-lg flex items-center gap-2 border border-transparent hover:border-slate-100 transition-all duration-150">
                  <Play className="h-3.5 w-3.5 text-emerald-600 bg-emerald-50 p-0.5 border border-emerald-100 rounded" />
                  <span>Schedule Trigger</span>
                </button>
                <button onClick={() => addNode("trigger", "rss")} className="w-full text-left px-2 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-lg flex items-center gap-2 border border-transparent hover:border-slate-100 transition-all duration-150">
                  <Play className="h-3.5 w-3.5 text-emerald-600 bg-emerald-50 p-0.5 border border-emerald-100 rounded" />
                  <span>RSS Feed Trigger</span>
                </button>
              </div>
            </div>

            {/* AI Nodes Group */}
            <div>
              <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase px-1">AI Modules</span>
              <div className="mt-1.5 space-y-1">
                <button onClick={() => addNode("ai")} className="w-full text-left px-2 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-lg flex items-center gap-2 border border-transparent hover:border-slate-100 transition-all duration-150">
                  <Cpu className="h-3.5 w-3.5 text-blue-600 bg-blue-50 p-0.5 border border-blue-100 rounded" />
                  <span>Gemini Post Gen</span>
                </button>
                <button onClick={() => addNode("enhancement")} className="w-full text-left px-2 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-lg flex items-center gap-2 border border-transparent hover:border-slate-100 transition-all duration-150">
                  <Sparkles className="h-3.5 w-3.5 text-violet-600 bg-violet-50 p-0.5 border border-violet-100 rounded" />
                  <span>Content Enhancer</span>
                </button>
              </div>
            </div>

            {/* Actions Group */}
            <div>
              <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase px-1">Actions</span>
              <div className="mt-1.5 space-y-1">
                <button onClick={() => addNode("approval")} className="w-full text-left px-2 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-lg flex items-center gap-2 border border-transparent hover:border-slate-100 transition-all duration-150">
                  <CheckCircle2 className="h-3.5 w-3.5 text-amber-600 bg-amber-50 p-0.5 border border-amber-100 rounded" />
                  <span>Approval Gate</span>
                </button>
                <button onClick={() => addNode("linkedin")} className="w-full text-left px-2 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-lg flex items-center gap-2 border border-transparent hover:border-slate-100 transition-all duration-150">
                  <Code className="h-3.5 w-3.5 text-sky-600 bg-sky-50 p-0.5 border border-sky-100 rounded" />
                  <span>LinkedIn Publish</span>
                </button>
                <button onClick={() => addNode("analytics")} className="w-full text-left px-2 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-lg flex items-center gap-2 border border-transparent hover:border-slate-100 transition-all duration-150">
                  <Code className="h-3.5 w-3.5 text-rose-600 bg-rose-50 p-0.5 border border-rose-100 rounded" />
                  <span>Fetch Analytics</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Core Canvas Wrapper */}
        <div className="flex-1 h-full relative bg-slate-50">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={CustomNodeTypes}
            fitView
            minZoom={0.2}
            maxZoom={2}
          >
            <Background color="#cbd5e1" gap={16} size={1} />
            <Controls />
            <MiniMap style={{ bottom: logOpen ? 190 : 20, right: 20 }} />
          </ReactFlow>
        </div>

        {/* Right Configuration Sidebar Panel */}
        {selectedNode && (
          <div className="w-80 border-l border-slate-200 bg-white h-full z-10 flex flex-col select-none">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Configure Node</h3>
                <p className="text-[10px] font-bold text-blue-600 mt-0.5">{selectedNode.data.label}</p>
              </div>
              <button 
                onClick={() => setSelectedNode(null)}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors duration-150"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {/* Conditional Node Editor Rendering */}
              {selectedNode.data.type === "trigger" && (
                <div className="space-y-4">
                  <label className="block">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Trigger Type</span>
                    <select 
                      value={selectedNode.data.subType || "manual"} 
                      className="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-700 focus:border-blue-500 focus:bg-white outline-none"
                    >
                      <option value="manual">Manual Trigger</option>
                      <option value="schedule">Schedule Trigger</option>
                      <option value="rss">RSS Feed Trigger</option>
                      <option value="sheet">Google Sheets Trigger</option>
                    </select>
                  </label>
                  
                  {selectedNode.data.subType === "schedule" && (
                    <label className="block">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Schedule Interval</span>
                      <input 
                        type="text"
                        value={selectedNode.data.config?.interval || ""}
                        onChange={(e) => updateSelectedNodeConfig("interval", e.target.value)}
                        className="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-700 focus:border-blue-500 focus:bg-white outline-none"
                      />
                    </label>
                  )}
                </div>
              )}

              {selectedNode.data.type === "ai" && (
                <div className="space-y-4">
                  <label className="block">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Gemini Model</span>
                    <select
                      value={selectedNode.data.config?.model || "Gemini 2.5 Flash"}
                      onChange={(e) => updateSelectedNodeConfig("model", e.target.value)}
                      className="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-700 focus:border-blue-500 focus:bg-white outline-none"
                    >
                      <option value="Gemini 2.5 Flash">Gemini 2.5 Flash</option>
                      <option value="Gemini 2.5 Pro">Gemini 2.5 Pro</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Post Topic</span>
                    <input 
                      type="text"
                      value={selectedNode.data.config?.topic || ""}
                      onChange={(e) => updateSelectedNodeConfig("topic", e.target.value)}
                      className="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-700 focus:border-blue-500 focus:bg-white outline-none"
                    />
                  </label>

                  <label className="block">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Audience</span>
                    <input 
                      type="text"
                      value={selectedNode.data.config?.audience || ""}
                      onChange={(e) => updateSelectedNodeConfig("audience", e.target.value)}
                      className="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-700 focus:border-blue-500 focus:bg-white outline-none"
                    />
                  </label>

                  <label className="block">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Tone & Style</span>
                    <select
                      value={selectedNode.data.config?.tone || "Thought Leadership"}
                      onChange={(e) => updateSelectedNodeConfig("tone", e.target.value)}
                      className="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-700 focus:border-blue-500 focus:bg-white outline-none"
                    >
                      <option value="Thought Leadership">Thought Leadership</option>
                      <option value="Storytelling">Storytelling</option>
                      <option value="Educational">Educational</option>
                      <option value="Viral Style">Viral Style</option>
                      <option value="Founder Style">Founder Style</option>
                    </select>
                  </label>
                  
                  <label className="block">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Base Prompt Instructions</span>
                    <textarea 
                      rows={3}
                      value={selectedNode.data.config?.prompt || ""}
                      onChange={(e) => updateSelectedNodeConfig("prompt", e.target.value)}
                      className="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-700 focus:border-blue-500 focus:bg-white outline-none resize-none"
                    />
                  </label>
                </div>
              )}

              {selectedNode.data.type === "enhancement" && (
                <div className="space-y-4">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-2">Enhancement Steps</span>
                  <div className="space-y-2.5">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={selectedNode.data.config?.hook || false}
                        onChange={(e) => updateSelectedNodeConfig("hook", e.target.checked)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-xs font-semibold text-slate-700">Improve Hook (Punchy Intro)</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={selectedNode.data.config?.cta || false}
                        onChange={(e) => updateSelectedNodeConfig("cta", e.target.checked)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-xs font-semibold text-slate-700">Improve CTA (Call-to-Action)</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={selectedNode.data.config?.statistics || false}
                        onChange={(e) => updateSelectedNodeConfig("statistics", e.target.checked)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-xs font-semibold text-slate-700">Add Storytelling & Data</span>
                    </label>
                  </div>
                </div>
              )}

              {selectedNode.data.type === "linkedin" && (
                <div className="space-y-4">
                  <label className="block">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Publishing Action</span>
                    <select
                      value={selectedNode.data.config?.action || "Save Draft"}
                      onChange={(e) => updateSelectedNodeConfig("action", e.target.value)}
                      className="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-700 focus:border-blue-500 focus:bg-white outline-none"
                    >
                      <option value="Publish Post">Publish Immediately</option>
                      <option value="Save Draft">Save as LinkedIn Draft</option>
                      <option value="Schedule Post">Schedule Post Time</option>
                    </select>
                  </label>
                </div>
              )}
            </div>

            {/* Delete Node Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50">
              <button 
                onClick={() => deleteNode(selectedNode.id)}
                className="w-full flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 py-2 rounded-lg text-xs font-semibold transition-all duration-150"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete Node</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Drawer Execution Console */}
      <div className={`border-t border-slate-200 bg-white z-10 transition-all duration-300 flex flex-col shadow-lg select-none ${
        logOpen ? "h-64" : "h-10"
      }`}>
        {/* Console Header */}
        <div className="h-10 px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 cursor-pointer" onClick={() => setLogOpen(!logOpen)}>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Execution Console & Output</span>
            <span className={`h-2 w-2 rounded-full ${isRunning ? "bg-blue-500 animate-pulse" : "bg-slate-300"}`}></span>
          </div>
          <button className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase">
            {logOpen ? "Hide Console" : "Show Console"}
          </button>
        </div>

        {/* Console logs & generated content split */}
        {logOpen && (
          <div className="flex-1 flex overflow-hidden text-xs">
            {/* Terminal logs */}
            <div className="flex-1 bg-slate-950 p-4 font-mono text-[11px] text-slate-300 overflow-y-auto space-y-1.5 selection:bg-blue-600 selection:text-white border-r border-slate-900">
              {logs.length === 0 ? (
                <p className="text-slate-500 italic">No executions have run in this session. Click "Run Workflow" to execute.</p>
              ) : (
                logs.map((log, idx) => {
                  let colorClass = "text-slate-300";
                  if (log.includes("[System]")) colorClass = "text-blue-400 font-semibold";
                  if (log.includes("fired") || log.includes("successful") || log.includes("published")) colorClass = "text-emerald-400";
                  if (log.includes("Error") || log.includes("halted")) colorClass = "text-rose-400";

                  return (
                    <p key={idx} className={colorClass}>
                      {log}
                    </p>
                  );
                })
              )}
            </div>

            {/* Generated LinkedIn Post Display */}
            <div className="w-[450px] bg-slate-50 p-4 overflow-y-auto flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Generated Output</span>
              {generatedPost ? (
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex-1 font-sans text-xs text-slate-700 leading-relaxed whitespace-pre-line select-text">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-3 select-none">
                    <div className="h-7 w-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">
                      IN
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 text-[11px] leading-tight">John Doe</h4>
                      <p className="text-[9px] text-slate-400">LinkedIn Content Draft</p>
                    </div>
                  </div>
                  {generatedPost}
                </div>
              ) : (
                <div className="flex-1 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                  <Sparkles className="h-6 w-6 text-slate-300 mb-1.5" />
                  <p className="text-[11px]">Generate a LinkedIn post using the Gemini AI node to preview outputs here.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
