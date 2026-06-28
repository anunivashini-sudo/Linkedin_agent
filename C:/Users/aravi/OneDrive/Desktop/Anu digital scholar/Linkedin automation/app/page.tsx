"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  FileText, 
  CheckCircle2, 
  GitBranch, 
  TrendingUp, 
  Zap, 
  Cpu, 
  ArrowUpRight, 
  Clock, 
  Play, 
  ChevronRight,
  AlertCircle
} from "lucide-react";

// Mock Data for Dashboard
const kpis = [
  {
    title: "Total Posts Generated",
    value: "148",
    change: "+12.5%",
    trend: "up",
    icon: FileText,
    color: "text-blue-600 bg-blue-50 border-blue-100",
  },
  {
    title: "Total Posts Published",
    value: "92",
    change: "+8.2%",
    trend: "up",
    icon: CheckCircle2,
    color: "text-emerald-600 bg-emerald-50 border-emerald-100",
  },
  {
    title: "Active Automations",
    value: "6",
    change: "3 Drafts",
    trend: "neutral",
    icon: GitBranch,
    color: "text-purple-600 bg-purple-50 border-purple-100",
  },
  {
    title: "LinkedIn Engagement Rate",
    value: "5.84%",
    change: "+1.45%",
    trend: "up",
    icon: TrendingUp,
    color: "text-rose-600 bg-rose-50 border-rose-100",
  },
  {
    title: "AI Credits Used",
    value: "840 / 1,000",
    change: "84%",
    trend: "down",
    icon: Zap,
    color: "text-amber-600 bg-amber-50 border-amber-100",
  },
  {
    title: "Gemini API Usage",
    value: "284.5K tkn",
    change: "7-day total",
    trend: "neutral",
    icon: Cpu,
    color: "text-indigo-600 bg-indigo-50 border-indigo-100",
  },
];

const recentExecutions = [
  {
    id: "exec_01",
    workflow: "Daily AI Thought Leadership",
    trigger: "Schedule Trigger (9:00 AM)",
    time: "10 mins ago",
    status: "success",
    steps: 3,
  },
  {
    id: "exec_02",
    workflow: "Blog to LinkedIn Auto-Promo",
    trigger: "RSS: TechCrunch Feed",
    time: "2 hours ago",
    status: "success",
    steps: 5,
  },
  {
    id: "exec_03",
    workflow: "Google Sheets Content Planner",
    trigger: "Google Sheets Row added",
    time: "5 hours ago",
    status: "failed",
    steps: 2,
    error: "Gemini API rate limit reached",
  },
  {
    id: "exec_04",
    workflow: "Daily AI Thought Leadership",
    trigger: "Schedule Trigger (9:00 AM)",
    time: "Yesterday",
    status: "success",
    steps: 3,
  },
];

const templates = [
  {
    title: "Daily Thought Leadership",
    desc: "Generate and publish industry insights daily at 9:00 AM.",
    nodes: ["Schedule", "Gemini AI", "LinkedIn Publish"],
    color: "from-blue-500 to-indigo-600",
  },
  {
    title: "RSS Feed to LinkedIn Post",
    desc: "Auto-summarize blog posts and share as a LinkedIn digest with approval.",
    nodes: ["RSS Feed", "Gemini AI", "Manual Approval", "LinkedIn Draft"],
    color: "from-emerald-500 to-teal-600",
  },
  {
    title: "Google Sheets Content Planner",
    desc: "Fetch ideas from a sheet, generate posts with AI, and schedule.",
    nodes: ["Google Sheets", "Gemini AI", "LinkedIn Schedule"],
    color: "from-purple-500 to-pink-600",
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-8 select-none">
      {/* Welcome & Action header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Home</h1>
          <p className="text-slate-500 text-sm mt-1">Welcome back, John! Here is how your LinkedIn automations are performing.</p>
        </div>
        <Link 
          href="/workflow"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 shadow-md shadow-blue-200"
        >
          <Play className="h-4 w-4 fill-current" />
          <span>Create New Workflow</span>
        </Link>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpis.map((kpi) => (
          <div key={kpi.title} className="bg-white border border-slate-200 p-6 rounded-xl shadow-subtle hover:shadow-premium transition-all duration-150 flex items-start justify-between">
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{kpi.title}</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900">{kpi.value}</span>
                <span className={`text-xs font-bold ${
                  kpi.trend === "up" ? "text-emerald-600" : kpi.trend === "down" ? "text-amber-600" : "text-slate-500"
                }`}>
                  {kpi.change}
                </span>
              </div>
            </div>
            <div className={`p-3 rounded-xl border ${kpi.color}`}>
              <kpi.icon className="h-5 w-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Graphs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Post Performance graph */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-subtle lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-md">Post Performance Trend</h3>
              <p className="text-xs text-slate-500">LinkedIn reach and engagement over the past 30 days</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 font-medium text-slate-600">
                <span className="h-2.5 w-2.5 bg-blue-500 rounded-full"></span> Impressions
              </span>
              <span className="flex items-center gap-1.5 font-medium text-slate-600">
                <span className="h-2.5 w-2.5 bg-emerald-500 rounded-full"></span> Engagement
              </span>
            </div>
          </div>

          {/* SVG High-Fidelity Chart Mockup */}
          <div className="h-64 w-full bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-end p-4 relative overflow-hidden">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between py-6 px-4 pointer-events-none">
              <div className="border-b border-slate-200/60 w-full"></div>
              <div className="border-b border-slate-200/60 w-full"></div>
              <div className="border-b border-slate-200/60 w-full"></div>
              <div className="w-full"></div>
            </div>
            
            {/* Chart Curves */}
            <svg className="w-full h-full absolute inset-0 pt-6 px-4" viewBox="0 0 500 180" preserveAspectRatio="none">
              {/* Impressions Curve */}
              <path
                d="M 0 150 Q 50 110 100 120 T 200 70 T 300 90 T 400 40 T 500 20"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M 0 150 Q 50 110 100 120 T 200 70 T 300 90 T 400 40 T 500 20 L 500 180 L 0 180 Z"
                fill="url(#blueGrad)"
                opacity="0.08"
              />
              
              {/* Engagement Curve */}
              <path
                d="M 0 170 Q 50 140 100 150 T 200 110 T 300 125 T 400 80 T 500 60"
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              <defs>
                <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>

            {/* X Axis Labels */}
            <div className="flex justify-between text-[10px] font-semibold text-slate-400 pt-2 border-t border-slate-100 mt-2 z-10">
              <span>Jun 01</span>
              <span>Jun 07</span>
              <span>Jun 14</span>
              <span>Jun 21</span>
              <span>Jun 28</span>
            </div>
          </div>
        </div>

        {/* Workflow Stats panel */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-subtle space-y-5">
          <div>
            <h3 className="font-bold text-slate-900 text-md">Execution Success Rate</h3>
            <p className="text-xs text-slate-500">Automation efficiency dashboard</p>
          </div>
          
          <div className="flex flex-col items-center py-4 space-y-4">
            {/* Donut progress */}
            <div className="relative h-32 w-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="50" stroke="#f1f5f9" strokeWidth="12" fill="transparent" />
                <circle cx="64" cy="64" r="50" stroke="#3b82f6" strokeWidth="12" fill="transparent" 
                        strokeDasharray="314" strokeDashoffset="45" strokeLinecap="round" />
              </svg>
              <div className="absolute text-center">
                <span className="text-2xl font-bold text-slate-800">95.6%</span>
                <p className="text-[10px] font-semibold text-slate-400">Success Rate</p>
              </div>
            </div>

            {/* Breakdown */}
            <div className="w-full grid grid-cols-3 gap-2 text-center border-t border-slate-100 pt-4">
              <div>
                <span className="text-xs font-bold text-emerald-600">324</span>
                <p className="text-[10px] text-slate-400">Succeeded</p>
              </div>
              <div className="border-x border-slate-100">
                <span className="text-xs font-bold text-rose-600">12</span>
                <p className="text-[10px] text-slate-400">Failed</p>
              </div>
              <div>
                <span className="text-xs font-bold text-amber-500">3</span>
                <p className="text-[10px] text-slate-400">Retried</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Grid: Executions and Templates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent executions */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-subtle lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-md">Recent Workflow Executions</h3>
              <p className="text-xs text-slate-500">Real-time status of your automation pipelines</p>
            </div>
            <Link href="/workflow" className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
              <span>View History</span>
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentExecutions.map((exec) => (
              <div key={exec.id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg mt-0.5 ${
                    exec.status === "success" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100"
                  }`}>
                    {exec.status === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">{exec.workflow}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-slate-500">{exec.trigger}</span>
                      <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                      <span className="text-[10px] text-slate-400">{exec.steps} nodes executed</span>
                    </div>
                    {exec.error && (
                      <p className="text-xs text-rose-600 font-medium mt-1 flex items-center gap-1">
                        <span>•</span> {exec.error}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-slate-800">{exec.time}</span>
                  <p className="text-[10px] text-slate-400 mt-1 flex items-center justify-end gap-1 font-medium">
                    <Clock className="h-2.5 w-2.5" /> {exec.status === "success" ? "1.4s" : "0.8s"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick templates */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-subtle space-y-5">
          <div>
            <h3 className="font-bold text-slate-900 text-md">Recommended Templates</h3>
            <p className="text-xs text-slate-500">Deploy high-converting LinkedIn automation quickly</p>
          </div>

          <div className="space-y-4">
            {templates.map((tpl) => (
              <div key={tpl.title} className="group border border-slate-100 hover:border-blue-100 hover:bg-blue-50/20 p-4 rounded-xl transition-all duration-150 relative overflow-hidden cursor-pointer">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <span>{tpl.title}</span>
                  <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 text-blue-600 transition-opacity duration-150" />
                </h4>
                <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{tpl.desc}</p>
                
                {/* Node representation badges */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {tpl.nodes.map((node, idx) => (
                    <div key={idx} className="flex items-center gap-1">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {node}
                      </span>
                      {idx < tpl.nodes.length - 1 && (
                        <ChevronRight className="h-2.5 w-2.5 text-slate-300" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
