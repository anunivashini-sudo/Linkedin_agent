"use client";

import React, { useState } from "react";
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Save, 
  Layers, 
  Search, 
  Copy, 
  CheckCircle,
  HelpCircle
} from "lucide-react";

// Mock AI prompt templates
const initialTemplates = [
  {
    id: "tpl_1",
    name: "Founder Journey Storyteller",
    description: "Write an authentic, narrative-style post documenting a major failure, a lesson learned, and a final actionable takeaway.",
    prompt: `Act as an expert personal branding coach and storyteller. Write a LinkedIn post about:
Topic: {{topic}}
Industry: {{industry}}

Guidelines:
1. Start with a hook sharing a vulnerability or unexpected metric (e.g., "We spent 6 months building X, only to delete it...").
2. Describe the emotional pivot point and the specific mistake made.
3. Provide three bulleted actionable lessons for other {{audience}} leaders.
4. End with an engaging question to drive comments (Call to Action).
5. Tone: {{tone}}. Avoid buzzwords (leverage, synergy). Keep paragraphs under 2 sentences.`,
    variables: ["topic", "industry", "audience", "tone"],
    category: "Storytelling",
  },
  {
    id: "tpl_2",
    name: "Educational Framework (3-Steps)",
    description: "Ideal for sharing technical tutorials, productivity tips, or structural breakdowns for developers and operators.",
    prompt: `You are a thought leader in the {{industry}} space. Write an educational LinkedIn post answering how to do:
Topic: {{topic}}

Structure:
- Hook: A polarizing statement about why the current method is broken.
- Problem: The hidden time-waste or cost.
- Solution: Introducing a 3-step solution for {{audience}}.
  Step 1: [Actionable item]
  Step 2: [Actionable item]
  Step 3: [Actionable item]
- CTA: Link to resource or ask for experiences.
- Tone: {{tone}}.`,
    variables: ["topic", "industry", "audience", "tone"],
    category: "Educational",
  },
  {
    id: "tpl_3",
    name: "Viral Contrast Hook",
    description: "Highly engaging, contrasting statement format designed to drive clicks, views, and shares quickly.",
    prompt: `Write a short, high-impact LinkedIn post.
Topic: {{topic}}
Goal: {{goal}}

Contrast Formula:
- "Everyone tells you to do A. But the top 1% actually do B."
- Detail why A is a legacy trap.
- Detail why B builds leverage in {{industry}} for {{audience}}.
- Add one key metric/statistic to prove the point.
- End with a short, punchy sentence.`,
    variables: ["topic", "goal", "industry", "audience"],
    category: "Viral",
  }
];

export default function PromptStudio() {
  const [templates, setTemplates] = useState(initialTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(initialTemplates[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const filteredTemplates = templates.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const saveTemplate = () => {
    setTemplates(templates.map(t => t.id === selectedTemplate.id ? selectedTemplate : t));
    // Trigger small confirmation
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const createNewTemplate = () => {
    const newTpl = {
      id: `tpl_${Date.now()}`,
      name: "New Prompt Template",
      description: "Customize this description...",
      prompt: "Write your AI instructions here. Use {{variable_name}} for dynamic fields.",
      variables: ["topic", "tone"],
      category: "General"
    };
    setTemplates([newTpl, ...templates]);
    setSelectedTemplate(newTpl);
  };

  const deleteTemplate = (id: string) => {
    const remaining = templates.filter(t => t.id !== id);
    setTemplates(remaining);
    setSelectedTemplate(remaining[0] || null);
  };

  // Add variable tag at cursor
  const injectVariable = (variable: string) => {
    if (!selectedTemplate) return;
    const updatedPrompt = selectedTemplate.prompt + ` {{${variable}}}`;
    setSelectedTemplate({
      ...selectedTemplate,
      prompt: updatedPrompt
    });
  };

  return (
    <div className="h-[calc(100vh-8.5rem)] flex -m-8 select-none bg-slate-50 relative">
      {/* Left List of templates */}
      <div className="w-80 border-r border-slate-200 bg-white flex flex-col h-full">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Prompt Studio</h2>
            <p className="text-[10px] text-slate-400 mt-0.5">Reusable post templates</p>
          </div>
          <button 
            onClick={createNewTemplate}
            className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors duration-150 border border-blue-100"
            title="Create Template"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-slate-100 bg-slate-50/50">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search prompt styles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg py-1.5 pl-8 pr-3 text-xs outline-none focus:border-blue-500 transition-colors duration-150 font-medium"
            />
          </div>
        </div>

        {/* Templates list scroll area */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredTemplates.map((tpl) => (
            <div
              key={tpl.id}
              onClick={() => setSelectedTemplate(tpl)}
              className={`p-3 rounded-lg border text-left cursor-pointer transition-all duration-150 ${
                selectedTemplate?.id === tpl.id
                  ? "bg-blue-50/55 border-blue-200"
                  : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 uppercase tracking-wider">
                  {tpl.category}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-800 mt-1.5 truncate">{tpl.name}</h4>
              <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">{tpl.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Editor Section */}
      {selectedTemplate ? (
        <div className="flex-1 flex flex-col h-full bg-white">
          {/* Header toolbar */}
          <div className="h-14 border-b border-slate-200 px-6 flex items-center justify-between bg-slate-50/50 select-none">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-600 animate-pulse" />
              <span className="text-xs font-semibold text-slate-500 uppercase">Editor Mode</span>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={saveTemplate}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 shadow-md shadow-blue-150"
              >
                {isCopied ? (
                  <>
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="h-3.5 w-3.5" />
                    <span>Save Template</span>
                  </>
                )}
              </button>
              <button 
                onClick={() => deleteTemplate(selectedTemplate.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-lg transition-all duration-150"
                title="Delete Template"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Form edit body */}
          <div className="flex-1 overflow-y-auto p-8 max-w-4xl space-y-6">
            <div className="grid grid-cols-3 gap-6">
              {/* Template settings */}
              <div className="col-span-2 space-y-4">
                <label className="block">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Template Name</span>
                  <input
                    type="text"
                    value={selectedTemplate.name}
                    onChange={(e) => setSelectedTemplate({...selectedTemplate, name: e.target.value})}
                    className="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-bold text-slate-800 focus:border-blue-500 focus:bg-white outline-none transition-all duration-150 shadow-subtle"
                  />
                </label>

                <label className="block">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Description</span>
                  <input
                    type="text"
                    value={selectedTemplate.description}
                    onChange={(e) => setSelectedTemplate({...selectedTemplate, description: e.target.value})}
                    className="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-600 focus:border-blue-500 focus:bg-white outline-none transition-all duration-150 shadow-subtle"
                  />
                </label>
              </div>

              <div className="space-y-4">
                <label className="block">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</span>
                  <select
                    value={selectedTemplate.category}
                    onChange={(e) => setSelectedTemplate({...selectedTemplate, category: e.target.value})}
                    className="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-bold text-slate-800 focus:border-blue-500 focus:bg-white outline-none transition-all duration-150 shadow-subtle"
                  >
                    <option value="Storytelling">Storytelling</option>
                    <option value="Educational">Educational</option>
                    <option value="Viral">Viral</option>
                    <option value="General">General</option>
                  </select>
                </label>
              </div>
            </div>

            {/* Prompt Body and Variable injection */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center select-none">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI Prompt Instructions</span>
                
                {/* Variable tags for quick injection */}
                <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500 bg-slate-50 border border-slate-200 rounded-md p-1">
                  <span>Variables:</span>
                  {["topic", "industry", "audience", "tone", "goal"].map((v) => (
                    <button
                      key={v}
                      onClick={() => injectVariable(v)}
                      className="px-1 py-0.5 rounded bg-white hover:bg-blue-50 hover:text-blue-600 border border-slate-200 hover:border-blue-200 transition-colors duration-100"
                    >
                      {`{{${v}}}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt Textarea */}
              <div className="relative border border-slate-200 rounded-xl overflow-hidden shadow-subtle">
                <textarea
                  rows={15}
                  value={selectedTemplate.prompt}
                  onChange={(e) => setSelectedTemplate({...selectedTemplate, prompt: e.target.value})}
                  className="w-full bg-slate-50/30 p-5 text-xs font-semibold text-slate-700 leading-relaxed outline-none focus:bg-white resize-none transition-colors duration-150 select-text"
                />
              </div>

              <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
                <HelpCircle className="h-3.5 w-3.5" />
                <span>Make sure variables are wrapped in double curly brackets: `{"{{variable}}"}`, they will be automatically replaced by workflow triggers.</span>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
          <Layers className="h-10 w-10 text-slate-200 mb-2" />
          <p className="text-sm font-semibold">Select or create a template to begin</p>
        </div>
      )}
    </div>
  );
}
