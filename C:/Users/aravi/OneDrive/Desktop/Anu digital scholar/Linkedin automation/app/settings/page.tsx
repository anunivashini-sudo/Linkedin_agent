"use client";

import React, { useState } from "react";
import { 
  Settings, 
  Cpu, 
  Key, 
  Sliders, 
  Save, 
  CheckCircle,
  Eye,
  EyeOff,
  TrendingUp,
  HelpCircle
} from "lucide-react";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [model, setModel] = useState("gemini-2.5-flash");
  const [temp, setTemp] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [creativity, setCreativity] = useState("creative");
  const [isSaved, setIsSaved] = useState(false);

  const saveSettings = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl space-y-8 select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Settings</h1>
          <p className="text-slate-500 text-sm mt-1">Configure your global variables, connection credentials, and AI inference configurations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main forms - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gemini API config Card */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-subtle p-6 space-y-5">
            <div className="flex items-center gap-2 pb-3.5 border-b border-slate-100">
              <Cpu className="h-4 w-4 text-blue-600" />
              <h3 className="font-bold text-slate-800 text-sm">Gemini API Credentials</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Gemini API Key
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type={showKey ? "text" : "password"}
                    placeholder="Enter your Gemini API Key..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-lg py-2 pl-10 pr-12 text-xs font-semibold outline-none transition-all duration-150 shadow-subtle select-text"
                  />
                  <button 
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1.5">
                  <HelpCircle className="h-3.5 w-3.5" />
                  <span>Obtain an API key from Google AI Studio. Keep it private.</span>
                </p>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Default AI Model
                </label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-bold text-slate-800 focus:border-blue-500 focus:bg-white outline-none transition-all duration-150 shadow-subtle"
                >
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash (Fast, optimized for general text generation)</option>
                  <option value="gemini-2.5-pro">Gemini 2.5 Pro (Highly creative, best for deep storytelling & thought leadership)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Model Inference sliders card */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-subtle p-6 space-y-5">
            <div className="flex items-center gap-2 pb-3.5 border-b border-slate-100">
              <Sliders className="h-4 w-4 text-violet-600" />
              <h3 className="font-bold text-slate-800 text-sm">Model Parameter Tuning</h3>
            </div>

            <div className="space-y-5">
              {/* Temperature */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                  <span>Temperature (Creativity)</span>
                  <span className="font-bold text-blue-600">{temp}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.5"
                  step="0.05"
                  value={temp}
                  onChange={(e) => setTemp(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-150 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[9px] text-slate-400 font-bold uppercase mt-1">
                  <span>Rigid / Facts</span>
                  <span>Creative / Flowing</span>
                </div>
              </div>

              {/* Max tokens */}
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Max Output Tokens</span>
                  <input
                    type="number"
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                    className="mt-1.5 w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-lg p-2.5 text-xs font-bold text-slate-800 outline-none transition-all duration-150 shadow-subtle"
                  />
                </label>
                
                <label className="block">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Creativity Strategy</span>
                  <select
                    value={creativity}
                    onChange={(e) => setCreativity(e.target.value)}
                    className="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-bold text-slate-800 focus:border-blue-500 focus:bg-white outline-none transition-all duration-150 shadow-subtle"
                  >
                    <option value="conservative">Conservative (Low Hallucination)</option>
                    <option value="creative">Creative (Diverse word choices)</option>
                    <option value="balanced">Balanced Options</option>
                  </select>
                </label>
              </div>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="flex justify-end">
            <button
              onClick={saveSettings}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-all duration-150 shadow-md shadow-blue-150"
            >
              {isSaved ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span>Settings Saved Successfully</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Configuration</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Info panel - Right Column */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-subtle p-6 space-y-4">
            <h3 className="font-bold text-slate-800 text-sm">Gemini API Metrics</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Below are the system metrics tracking API usage across generated workflows in the past 7 days.
            </p>

            <div className="space-y-3.5 pt-2 border-t border-slate-100">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Total API Requests</span>
                <span className="font-bold text-slate-800">324</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Total Tokens Consumed</span>
                <span className="font-bold text-slate-800">284.5K</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Average Latency</span>
                <span className="font-bold text-slate-800">1.8s</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Est. Running Costs</span>
                <span className="font-bold text-emerald-600">$0.00 (Developer Tier)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
