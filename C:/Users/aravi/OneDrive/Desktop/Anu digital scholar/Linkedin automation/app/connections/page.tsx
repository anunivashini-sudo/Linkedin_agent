"use client";

import React, { useState } from "react";
import { 
  Link2, 
  CheckCircle, 
  AlertTriangle, 
  HelpCircle, 
  ArrowRight,
  Settings2,
  Trash2,
  Plus,
  Linkedin,
  Cpu,
  Table,
  BookOpen,
  Webhook,
  Rss,
  MessageSquare
} from "lucide-react";

// Mock Integrations data
const initialIntegrations = [
  {
    id: "int_linkedin",
    name: "LinkedIn API OAuth",
    description: "OAuth integration to post content, schedule posts, publish drafts, and track impressions.",
    status: "connected",
    category: "Social Network",
    icon: Linkedin,
    color: "bg-sky-50 text-sky-700 border-sky-100",
    account: "John Doe (Professional Account)",
  },
  {
    id: "int_gemini",
    name: "Gemini API Engine",
    description: "Connect your Google AI studio developer keys to run Gemini 2.5 Flash/Pro text models.",
    status: "connected",
    category: "AI Service",
    icon: Cpu,
    color: "bg-blue-50 text-blue-700 border-blue-100",
    account: "API Key Active (Credits Remaining)",
  },
  {
    id: "int_sheets",
    name: "Google Sheets",
    description: "Fetch topics, scheduled times, and custom queues directly from rows of spreadsheets.",
    status: "disconnected",
    category: "Data Source",
    icon: Table,
    color: "bg-emerald-50 text-emerald-700 border-emerald-100",
    account: "Not Connected",
  },
  {
    id: "int_notion",
    name: "Notion Workspaces",
    description: "Pull content plans from your Notion kanban databases and sync workflow outcomes.",
    status: "disconnected",
    category: "Data Source",
    icon: BookOpen,
    color: "bg-slate-50 text-slate-800 border-slate-100",
    account: "Not Connected",
  },
  {
    id: "int_webhook",
    name: "Custom Webhooks",
    description: "Incoming HTTP POST triggers to launch workflows from external apps (e.g. GitHub actions, Webflow).",
    status: "connected",
    category: "Developer Utility",
    icon: Webhook,
    color: "bg-purple-50 text-purple-700 border-purple-100",
    account: "Webhook URL Active",
  },
  {
    id: "int_rss",
    name: "RSS Feed Reader",
    description: "Read, parse, and auto-summarize articles from standard blog or corporate feeds.",
    status: "connected",
    category: "Developer Utility",
    icon: Rss,
    color: "bg-amber-50 text-amber-700 border-amber-100",
    account: "TechCrunch Feed Connected",
  },
  {
    id: "int_slack",
    name: "Slack Notifications",
    description: "Send status reports, failure stack traces, and manual approval prompts directly to channels.",
    status: "disconnected",
    category: "Notification Channel",
    icon: MessageSquare,
    color: "bg-rose-50 text-rose-700 border-rose-100",
    account: "Not Connected",
  }
];

export default function Connections() {
  const [integrations, setIntegrations] = useState(initialIntegrations);
  const [selectedInt, setSelectedInt] = useState<any>(null);

  const toggleConnection = (id: string) => {
    setIntegrations(integrations.map(item => {
      if (item.id === id) {
        const isConnected = item.status === "connected";
        return {
          ...item,
          status: isConnected ? "disconnected" : "connected",
          account: isConnected ? "Not Connected" : "Account Connected (Syncing)"
        };
      }
      return item;
    }));
  };

  return (
    <div className="space-y-6 select-none relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Integrations & Connections</h1>
          <p className="text-slate-500 text-sm mt-1">Connect your workspace tools to trigger flows and distribute content.</p>
        </div>
      </div>

      {/* Grid listing integrations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="bg-white border border-slate-200 rounded-xl shadow-subtle p-5 hover:shadow-premium transition-all duration-150 flex flex-col justify-between h-56">
              <div>
                {/* Integration Top Card info */}
                <div className="flex items-start justify-between">
                  <div className={`p-2 rounded-xl border ${item.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                    item.status === "connected" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-100 text-slate-500 border-slate-200"
                  }`}>
                    {item.status}
                  </span>
                </div>

                <div className="mt-3.5 space-y-1">
                  <h3 className="text-xs font-bold text-slate-800">{item.name}</h3>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">{item.category}</span>
                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[9.5px] font-semibold text-slate-600 truncate max-w-xs">{item.account}</span>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => toggleConnection(item.id)}
                    className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-colors duration-150 shadow-sm ${
                      item.status === "connected"
                        ? "bg-slate-50 text-rose-600 hover:bg-rose-50 border-slate-200 hover:border-rose-100"
                        : "bg-blue-600 text-white hover:bg-blue-700 border-blue-600"
                    }`}
                  >
                    {item.status === "connected" ? "Disconnect" : "Connect"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
