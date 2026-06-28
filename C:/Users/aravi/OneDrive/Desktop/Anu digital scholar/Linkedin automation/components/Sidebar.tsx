"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  GitBranch, 
  BookOpen, 
  Calendar, 
  BarChart3, 
  Sparkles, 
  Link2, 
  Settings, 
  Users, 
  HelpCircle,
  TrendingUp
} from "lucide-react";

interface MenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems: MenuItem[] = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Workflow Builder", href: "/workflow", icon: GitBranch, badge: "N8N" },
    { name: "Content Library", href: "/library", icon: BookOpen },
    { name: "AI Prompt Studio", href: "/studio", icon: Sparkles },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Connections", href: "/connections", icon: Link2 },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const secondaryItems: MenuItem[] = [
    { name: "Team & Roles", href: "/team", icon: Users },
    { name: "Documentation", href: "/docs", icon: HelpCircle },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 bg-white flex flex-col h-screen sticky top-0 z-20 select-none">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100 gap-3">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center text-white shadow-md shadow-blue-200">
          <TrendingUp className="h-5 w-5" />
        </div>
        <div>
          <span className="font-semibold text-slate-900 tracking-tight text-md">LinkedFlow</span>
          <span className="text-xs font-bold text-blue-600 ml-1 px-1.5 py-0.5 bg-blue-50 rounded-md">AI</span>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-7">
        <div>
          <span className="px-3 text-[10px] font-bold text-slate-400 tracking-wider uppercase">Platform</span>
          <nav className="mt-2 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`h-4 w-4 ${isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      isActive ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
          <span className="px-3 text-[10px] font-bold text-slate-400 tracking-wider uppercase">Management</span>
          <nav className="mt-2 space-y-1">
            {secondaryItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <item.icon className={`h-4 w-4 ${isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User Info / Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-slate-200 border-2 border-white overflow-hidden flex items-center justify-center text-slate-700 font-semibold text-sm shadow-sm">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold text-slate-900 truncate">John Doe</h4>
            <p className="text-[10px] text-slate-500 truncate">john@linkedflow.ai</p>
          </div>
          <div className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-100">
            PRO
          </div>
        </div>
      </div>
    </aside>
  );
}
