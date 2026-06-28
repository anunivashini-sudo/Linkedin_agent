"use client";

import React from "react";
import { Handle, Position } from "@xyflow/react";
import { 
  Play, 
  Calendar, 
  Rss, 
  Table, 
  Webhook, 
  FileText, 
  Cpu, 
  Sparkles, 
  CheckSquare, 
  Linkedin, 
  BarChart3,
  HelpCircle
} from "lucide-react";

// Color mapping for nodes
const themeMap: Record<string, {
  border: string;
  bg: string;
  accent: string;
  iconBg: string;
  iconColor: string;
}> = {
  trigger: {
    border: "border-emerald-200",
    bg: "bg-emerald-50/40",
    accent: "bg-emerald-500",
    iconBg: "bg-emerald-100 border-emerald-200",
    iconColor: "text-emerald-600",
  },
  ai: {
    border: "border-blue-200",
    bg: "bg-blue-50/40",
    accent: "bg-blue-500",
    iconBg: "bg-blue-100 border-blue-200",
    iconColor: "text-blue-600",
  },
  enhancement: {
    border: "border-violet-200",
    bg: "bg-violet-50/40",
    accent: "bg-violet-500",
    iconBg: "bg-violet-100 border-violet-200",
    iconColor: "text-violet-600",
  },
  approval: {
    border: "border-amber-200",
    bg: "bg-amber-50/40",
    accent: "bg-amber-500",
    iconBg: "bg-amber-100 border-amber-200",
    iconColor: "text-amber-600",
  },
  linkedin: {
    border: "border-sky-200",
    bg: "bg-sky-50/40",
    accent: "bg-sky-600",
    iconBg: "bg-sky-100 border-sky-200",
    iconColor: "text-sky-700",
  },
  analytics: {
    border: "border-rose-200",
    bg: "bg-rose-50/40",
    accent: "bg-rose-500",
    iconBg: "bg-rose-100 border-rose-200",
    iconColor: "text-rose-600",
  },
};

// Node Icon selector
const getIcon = (type: string, subType?: string) => {
  if (type === "trigger") {
    switch (subType) {
      case "schedule": return Calendar;
      case "rss": return Rss;
      case "sheet": return Table;
      case "webhook": return Webhook;
      case "blog": return FileText;
      case "prompt": return Sparkles;
      default: return Play;
    }
  }
  if (type === "ai") return Cpu;
  if (type === "enhancement") return Sparkles;
  if (type === "approval") return CheckSquare;
  if (type === "linkedin") return Linkedin;
  if (type === "analytics") return BarChart3;
  return HelpCircle;
};

interface CustomNodeProps {
  data: {
    label: string;
    type: "trigger" | "ai" | "enhancement" | "approval" | "linkedin" | "analytics";
    subType?: string;
    status?: "idle" | "running" | "success" | "failed";
    config?: Record<string, any>;
    selected?: boolean;
  };
  selected?: boolean;
}

const CustomNode: React.FC<CustomNodeProps> = ({ data, selected }) => {
  const theme = themeMap[data.type] || themeMap.ai;
  const Icon = getIcon(data.type, data.subType);

  // Status mapping
  const statusColors = {
    idle: "bg-slate-300",
    running: "bg-blue-500 animate-pulse",
    success: "bg-emerald-500",
    failed: "bg-rose-500",
  };

  const statusClass = data.status ? `node-${data.status}` : "";

  return (
    <div className={`w-64 bg-white border-2 rounded-xl shadow-md transition-all duration-200 overflow-hidden ${
      selected ? "border-blue-500 ring-2 ring-blue-100" : theme.border
    } ${statusClass}`}>
      {/* Node Top Header */}
      <div className={`px-4 py-3 flex items-center justify-between border-b border-slate-100 ${theme.bg}`}>
        <div className="flex items-center gap-2.5">
          <div className={`p-1.5 rounded-lg border ${theme.iconBg}`}>
            <Icon className={`h-4 w-4 ${theme.iconColor}`} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 tracking-tight">{data.label}</h4>
            <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">{data.subType || data.type}</p>
          </div>
        </div>
        
        {/* Status Indicator */}
        <div className="flex items-center gap-1.5">
          <span className={`h-2 w-2 rounded-full ${statusColors[data.status || "idle"]}`}></span>
        </div>
      </div>

      {/* Node Info Summary Body */}
      <div className="px-4 py-3 bg-white text-[11px] text-slate-500 space-y-1.5">
        {data.type === "trigger" && (
          <div className="space-y-1">
            <span className="font-semibold text-slate-400 uppercase text-[9px] tracking-wider">Trigger Config</span>
            <p className="text-slate-700 truncate font-medium">
              {data.subType === "schedule" && `Interval: ${data.config?.interval || "Daily @ 9:00 AM"}`}
              {data.subType === "rss" && `Feed: ${data.config?.feedUrl || "TechCrunch Feed"}`}
              {data.subType === "sheet" && `Sheet: ${data.config?.sheetId || "Content Planner"}`}
              {data.subType === "webhook" && `Path: /webhooks/linkedin-post`}
              {data.subType === "manual" && "Run manually via dashboard"}
              {!data.subType && "Ready to trigger"}
            </p>
          </div>
        )}

        {data.type === "ai" && (
          <div className="grid grid-cols-2 gap-x-2 gap-y-1">
            <div>
              <span className="text-[9px] text-slate-400 font-bold uppercase block">Tone</span>
              <span className="text-slate-700 font-medium truncate block">{data.config?.tone || "Thought Leadership"}</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 font-bold uppercase block">Audience</span>
              <span className="text-slate-700 font-medium truncate block">{data.config?.audience || "Tech Founders"}</span>
            </div>
            <div className="col-span-2 mt-1">
              <span className="text-[9px] text-slate-400 font-bold uppercase block">Topic</span>
              <span className="text-slate-700 font-medium truncate block">{data.config?.topic || "AI Automation"}</span>
            </div>
          </div>
        )}

        {data.type === "enhancement" && (
          <div className="space-y-1">
            <span className="font-semibold text-slate-400 uppercase text-[9px] tracking-wider">Active Functions</span>
            <div className="flex flex-wrap gap-1">
              {data.config?.hook && <span className="px-1.5 py-0.5 rounded bg-violet-50 text-violet-600 font-bold text-[9px] border border-violet-100">Hook</span>}
              {data.config?.cta && <span className="px-1.5 py-0.5 rounded bg-violet-50 text-violet-600 font-bold text-[9px] border border-violet-100">CTA</span>}
              {data.config?.statistics && <span className="px-1.5 py-0.5 rounded bg-violet-50 text-violet-600 font-bold text-[9px] border border-violet-100">Stats</span>}
              {!data.config?.hook && !data.config?.cta && !data.config?.statistics && (
                <span className="text-slate-400 italic">None selected</span>
              )}
            </div>
          </div>
        )}

        {data.type === "approval" && (
          <div className="space-y-1">
            <span className="font-semibold text-slate-400 uppercase text-[9px] tracking-wider">Approval Mode</span>
            <p className="text-slate-700 font-semibold flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
              {data.config?.approvalMode || "Manual Review"}
            </p>
          </div>
        )}

        {data.type === "linkedin" && (
          <div className="space-y-1">
            <span className="font-semibold text-slate-400 uppercase text-[9px] tracking-wider">Action</span>
            <p className="text-slate-700 font-semibold">{data.config?.action || "Save Draft"}</p>
          </div>
        )}

        {data.type === "analytics" && (
          <div className="grid grid-cols-2 gap-1 text-[10px]">
            <div><span className="text-slate-400 font-medium">Likes:</span> <span className="font-bold text-slate-700">Fetch Live</span></div>
            <div><span className="text-slate-400 font-medium">Views:</span> <span className="font-bold text-slate-700">Fetch Live</span></div>
          </div>
        )}
      </div>

      {/* Handles */}
      {data.type !== "trigger" && (
        <Handle
          type="target"
          position={Position.Left}
          id="input"
          style={{ top: "50%" }}
        />
      )}
      
      {data.type !== "analytics" && data.type !== "linkedin" && (
        <Handle
          type="source"
          position={Position.Right}
          id="output"
          style={{ top: "50%" }}
        />
      )}
    </div>
  );
};

export const CustomNodeTypes = {
  customNode: CustomNode,
};
