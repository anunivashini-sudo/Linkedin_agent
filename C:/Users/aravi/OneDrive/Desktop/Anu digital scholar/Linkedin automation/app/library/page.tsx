"use client";

import React, { useState } from "react";
import { 
  Search, 
  Calendar, 
  CheckCircle2, 
  FileEdit, 
  Copy, 
  Share2, 
  RefreshCcw, 
  Trash2,
  Bookmark,
  ExternalLink,
  Tag,
  Sparkles
} from "lucide-react";

// Mock content library posts
const mockPosts = [
  {
    id: "post_1",
    title: "Orchestration vs Code boilerplate",
    content: `🚀 The secret to building a high-growth SaaS in 2026? 

It isn't writing thousands of lines of custom boilerplate code anymore. It is intelligent orchestration.

Automations powered by large language models (LLMs) are replacing traditional, rigid Zapier connections. Modern developers are building workflows that think, rewrite, and auto-optimize themselves. 

#SaaS #AI #LLM #SoftwareEngineering #Automation`,
    status: "published",
    workflow: "Daily AI Thought Leadership",
    date: "2 hours ago",
    tags: ["Tech", "SaaS", "AI"],
    likes: 42,
    comments: 8,
  },
  {
    id: "post_2",
    title: "Founder branding checklist",
    content: `Why do 90% of founders fail at building a personal brand? 

They treat LinkedIn like a corporate press release. Nobody wants to read your company's funding update. People want to read about your mistakes, your metrics, and your momentum.

Here is the 3-step personal brand blueprint:
1. Document, don't create. Share real-time challenges.
2. Hook them in the first 50 characters. Remove fluff.
3. Drop a value-add PDF carousel. Visuals always win.

Stop hiding behind your logo. Share your founder journey.`,
    status: "draft",
    workflow: "Google Sheets Content Planner",
    date: "1 day ago",
    tags: ["Personal Brand", "Founder"],
    likes: 0,
    comments: 0,
  },
  {
    id: "post_3",
    title: "3 AI plugins you need",
    content: `Developers, if you're not integrating LLMs directly into your terminal, you're falling behind. 

Here are three open-source tools that will save you 10+ hours a week:
1️⃣ CLI Copilots: Generate perfect bash command structures from simple natural language.
2️⃣ Git Commit Automators: Write clean, standardized semantic commit messages based on diffs.
3️⃣ Terminal Log Analyzers: Auto-diagnose stack traces and debug errors instantly.

The future of engineering is about writing orchestrators, not just lines of code.`,
    status: "scheduled",
    workflow: "Blog to LinkedIn Auto-Promo",
    date: "Tomorrow, 9:00 AM",
    tags: ["Developers", "Tools", "AI"],
    likes: 0,
    comments: 0,
  },
  {
    id: "post_4",
    title: "Leveraging automation in business",
    content: `Automation isn't about replacing people. It is about magnifying human capabilities.

By offloading repetitive, tedious scheduling and data entry to intelligent systems, you free up your team's creative capacity to focus on strategy, relationships, and product excellence.

Invest in your team by investing in automated workflows.`,
    status: "published",
    workflow: "Daily AI Thought Leadership",
    date: "3 days ago",
    tags: ["Leadership", "Business"],
    likes: 124,
    comments: 23,
  }
];

export default function ContentLibrary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTab, setFilterTab] = useState<"all" | "draft" | "scheduled" | "published">("all");
  const [posts, setPosts] = useState(mockPosts);

  // Filter logic
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = filterTab === "all" ? true : post.status === filterTab;
    return matchesSearch && matchesTab;
  });

  const duplicatePost = (id: string) => {
    const postToDup = posts.find(p => p.id === id);
    if (postToDup) {
      const newPost = {
        ...postToDup,
        id: `post_${Date.now()}`,
        title: `${postToDup.title} (Copy)`,
        date: "Just now",
        status: "draft",
        likes: 0,
        comments: 0
      };
      setPosts([newPost, ...posts]);
    }
  };

  const deletePost = (id: string) => {
    setPosts(posts.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Content Library</h1>
          <p className="text-slate-500 text-sm mt-1">Manage and edit all generated LinkedIn posts, drafts, and archives.</p>
        </div>
      </div>

      {/* Tabs & Search controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-white p-4 border border-slate-200 rounded-xl shadow-subtle">
        {/* Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-lg self-start">
          {(["all", "draft", "scheduled", "published"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-all duration-150 ${
                filterTab === tab
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search content, tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg py-1.5 pl-9 pr-4 text-xs font-semibold outline-none transition-all duration-150"
          />
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPosts.length === 0 ? (
          <div className="col-span-2 border-2 border-dashed border-slate-200 bg-white rounded-xl p-12 text-center text-slate-400">
            <Bookmark className="h-8 w-8 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-semibold">No posts found matching the criteria</p>
            <p className="text-xs mt-0.5">Try adjusting your search filters or generate new posts.</p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div key={post.id} className="bg-white border border-slate-200 rounded-xl shadow-subtle p-5 hover:shadow-premium transition-all duration-150 flex flex-col justify-between">
              <div>
                {/* Post Top Card info */}
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                      post.status === "published" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                      post.status === "scheduled" ? "bg-blue-50 text-blue-600 border-blue-100" :
                      "bg-amber-50 text-amber-600 border-amber-100"
                    }`}>
                      {post.status}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">Generated {post.date}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-slate-400" />
                    <span>{post.workflow}</span>
                  </span>
                </div>

                {/* Post content */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900">{post.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line selection:bg-blue-100 line-clamp-6 select-text">
                    {post.content}
                  </p>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                {/* Tags and stats */}
                <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                  <div className="flex gap-1.5">
                    {post.tags.map((tag) => (
                      <span key={tag} className="flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">
                        <Tag className="h-2 w-2" />
                        <span>{tag}</span>
                      </span>
                    ))}
                  </div>
                  {post.status === "published" && (
                    <div className="flex gap-3 text-[10px] font-semibold text-slate-500">
                      <span>👍 {post.likes} Likes</span>
                      <span>💬 {post.comments} Comments</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors duration-150 shadow-sm" title="Edit Post">
                      <FileEdit className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => duplicatePost(post.id)} className="p-2 text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors duration-150 shadow-sm" title="Duplicate">
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <button className="p-2 text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors duration-150 shadow-sm" title="Post now">
                      <Share2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <button onClick={() => deletePost(post.id)} className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 border border-rose-100 rounded-lg transition-colors duration-150 shadow-sm" title="Delete">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
