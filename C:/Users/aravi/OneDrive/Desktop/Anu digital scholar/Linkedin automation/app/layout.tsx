import React from "react";
import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar";
import "@/app/globals.css";
import { Bell, Search, ShieldCheck, Sparkles, User } from "lucide-react";

export const metadata: Metadata = {
  title: "LinkedFlow AI - LinkedIn Content Automation & N8N Builder",
  description: "Create visual LinkedIn content automation workflows using Gemini AI, schedule posts, track analytics, and manage workflows.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 flex min-h-screen">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          {/* Top Navbar */}
          <header className="h-16 border-b border-slate-200 bg-white px-8 flex items-center justify-between sticky top-0 z-10 select-none">
            {/* Left Search / Action */}
            <div className="flex items-center gap-3 w-96">
              <div className="relative w-full">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search workflows, posts, templates..."
                  className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg py-1.5 pl-9 pr-4 text-sm outline-none transition-all duration-150"
                />
              </div>
            </div>

            {/* Right Status / Notification / Profile */}
            <div className="flex items-center gap-6">
              {/* API and Integration Status */}
              <div className="flex items-center gap-4 text-xs font-medium border-r border-slate-200 pr-6">
                <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 text-blue-700 px-2.5 py-1 rounded-full">
                  <Sparkles className="h-3 w-3 text-blue-600" />
                  <span>Gemini Credits: 840/1,000</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>LinkedIn Linked</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                {/* Notifications */}
                <button className="relative p-2 text-slate-500 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-all duration-150 shadow-sm">
                  <Bell className="h-4 w-4" />
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600 border border-white"></span>
                </button>

                {/* User Menu */}
                <button className="flex items-center gap-2 p-1.5 text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-all duration-150 shadow-sm">
                  <div className="h-6 w-6 rounded-md bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center text-white text-xs font-semibold">
                    JD
                  </div>
                </button>
              </div>
            </div>
          </header>

          {/* Core Page Viewport */}
          <main className="flex-1 p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
