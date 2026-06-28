"use client";

import React, { useState } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MousePointerClick, 
  Eye, 
  ChevronDown, 
  Calendar,
  Sparkles,
  ArrowUpRight
} from "lucide-react";

// Mock Top posts data
const topPosts = [
  {
    id: "tp_1",
    title: "Orchestration vs Code boilerplate in SaaS",
    date: "Jun 22, 2026",
    impressions: "12.4K",
    likes: 342,
    comments: 42,
    clicks: 184,
    engagement: "7.2%"
  },
  {
    id: "tp_2",
    title: "Why 90% of founders fail at personal branding",
    date: "Jun 18, 2026",
    impressions: "8.9K",
    likes: 218,
    comments: 29,
    clicks: 95,
    engagement: "6.5%"
  },
  {
    id: "tp_3",
    title: "Developers, stop writing git commits from scratch",
    date: "Jun 14, 2026",
    impressions: "6.2K",
    likes: 184,
    comments: 18,
    clicks: 64,
    engagement: "5.8%"
  }
];

export default function Analytics() {
  const [timeRange, setTimeRange] = useState<"daily" | "weekly" | "monthly">("weekly");

  return (
    <div className="space-y-8 select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">LinkedIn Analytics</h1>
          <p className="text-slate-500 text-sm mt-1">Track post reach, clicks, followers, and engagement rates over time.</p>
        </div>
        
        {/* Time range selector */}
        <div className="flex items-center gap-2 bg-white border border-slate-200 p-1.5 rounded-lg shadow-subtle">
          {(["daily", "weekly", "monthly"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-all duration-150 ${
                timeRange === range
                  ? "bg-blue-50 text-blue-600 border border-blue-100"
                  : "text-slate-500 hover:text-slate-950"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Analytics KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-subtle flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Impressions</span>
            <Eye className="h-4 w-4 text-blue-500" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900">42,508</h3>
            <span className="text-xs font-bold text-emerald-600 mt-1 block">▲ +18.4% this week</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-subtle flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Net Followers Growth</span>
            <Users className="h-4 w-4 text-violet-500" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900">+482</h3>
            <span className="text-xs font-bold text-emerald-600 mt-1 block">▲ +8.2% this week</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-subtle flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average Engagement</span>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900">5.84%</h3>
            <span className="text-xs font-bold text-emerald-600 mt-1 block">▲ +1.4% this week</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-subtle flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Link Clicks</span>
            <MousePointerClick className="h-4 w-4 text-rose-500" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900">842</h3>
            <span className="text-xs font-bold text-emerald-600 mt-1 block">▲ +24.6% this week</span>
          </div>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trend chart */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-subtle lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900 text-md">Performance Over Time</h3>
              <p className="text-xs text-slate-500">Impressions vs clicks trends based on active workflows</p>
            </div>
            
            <div className="flex gap-4 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-500"></span> Impressions</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-violet-500"></span> Link Clicks</span>
            </div>
          </div>

          <div className="h-72 w-full bg-slate-50 rounded-xl border border-slate-100 p-4 relative overflow-hidden flex flex-col justify-end">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between py-6 px-4 pointer-events-none">
              <div className="border-b border-slate-200/50 w-full"></div>
              <div className="border-b border-slate-200/50 w-full"></div>
              <div className="border-b border-slate-200/50 w-full"></div>
              <div className="w-full"></div>
            </div>

            {/* SVG Plot */}
            <svg className="w-full h-full absolute inset-0 pt-6 px-4" viewBox="0 0 500 180" preserveAspectRatio="none">
              {/* Impressions Area & Line */}
              <path
                d="M 0 160 Q 100 110 200 130 T 400 60 T 500 20"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M 0 160 Q 100 110 200 130 T 400 60 T 500 20 L 500 180 L 0 180 Z"
                fill="url(#gradBlue)"
                opacity="0.08"
              />

              {/* Click Line */}
              <path
                d="M 0 175 Q 100 150 200 160 T 400 120 T 500 80"
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              
              <defs>
                <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>

            {/* X Labels */}
            <div className="flex justify-between text-[10px] font-semibold text-slate-400 pt-2 border-t border-slate-100 z-10">
              <span>Monday</span>
              <span>Wednesday</span>
              <span>Friday</span>
              <span>Sunday</span>
            </div>
          </div>
        </div>

        {/* Breakdown Panel */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-subtle space-y-6">
          <div>
            <h3 className="font-bold text-slate-900 text-md">Audience Demographics</h3>
            <p className="text-xs text-slate-500">Professional sectors of your audience</p>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                <span>Founders & C-Level</span>
                <span>42%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: "42%" }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                <span>Software Engineers</span>
                <span>28%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-violet-500 h-full rounded-full" style={{ width: "28%" }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                <span>Product Managers</span>
                <span>18%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: "18%" }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                <span>Marketers & Sales</span>
                <span>12%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: "12%" }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Posts section */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-subtle p-6 space-y-5">
        <div>
          <h3 className="font-bold text-slate-900 text-md">Top Performing Posts</h3>
          <p className="text-xs text-slate-500">Your highest-impact LinkedIn publications ranked by engagement rate</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-4 w-1/2">Post Hook Preview</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Impressions</th>
                <th className="py-3 px-4">Likes</th>
                <th className="py-3 px-4">Clicks</th>
                <th className="py-3 px-4 text-right">Engagement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topPosts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50/50 group transition-all duration-100">
                  <td className="py-3.5 px-4 font-semibold text-slate-800 flex items-center gap-2">
                    <span className="truncate max-w-sm">{post.title}</span>
                    <ArrowUpRight className="h-3 w-3 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-medium">{post.date}</td>
                  <td className="py-3.5 px-4 text-slate-700 font-semibold">{post.impressions}</td>
                  <td className="py-3.5 px-4 text-slate-700 font-semibold">{post.likes}</td>
                  <td className="py-3.5 px-4 text-slate-700 font-semibold">{post.clicks}</td>
                  <td className="py-3.5 px-4 text-right"><span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">{post.engagement}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
