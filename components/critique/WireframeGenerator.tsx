"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Copy, Layout, Terminal } from "lucide-react";

export function WireframeGenerator() {
  const [prompt, setPrompt] = useState("");
  const [layout, setLayout] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const generateWireframe = async () => {
    if (!prompt) return;
    setLoading(true);
    setLayout(null);

    // Simulate think time
    await new Promise(r => setTimeout(r, 1500));

    const res = await fetch("/api/wireframe", {
      method: "POST",
      body: JSON.stringify({ prompt })
    });
    const data = await res.json();
    setLayout(data);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Input Section */}
      <div className="bg-white border-2 border-black rounded-[32px] p-2 flex items-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="p-4 bg-accent-yellow rounded-2xl border border-black">
            <Sparkles className="w-6 h-6 text-black" />
        </div>
        <input 
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe a layout (e.g. 'Login screen for a travel app')..."
            className="flex-1 px-4 py-2 outline-none text-lg font-medium bg-transparent placeholder:text-gray-400"
            onKeyDown={(e) => e.key === "Enter" && generateWireframe()}
        />
        <button 
            onClick={generateWireframe}
            disabled={loading || !prompt}
            className="px-8 py-4 bg-black text-white font-black text-sm uppercase tracking-widest rounded-2xl hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
        >
            {loading ? "Generating..." : "Spark It"}
        </button>
      </div>

      {/* Canvas Area */}
      <div className="min-h-[500px] border-4 border-dashed border-gray-200 rounded-[40px] flex items-center justify-center relative overflow-hidden bg-[#f8f9fa]">
          {!layout && !loading && (
              <div className="text-center opacity-30">
                  <Layout className="w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-xl font-bold">Waiting for Spark...</h3>
              </div>
          )}

          {loading && (
              <div className="text-center">
                  <div className="animate-spin w-12 h-12 border-4 border-black border-t-transparent rounded-full mx-auto mb-4" />
                  <div className="font-mono text-sm">Processing Layout Logic...</div>
              </div>
          )}

          {layout && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full h-full p-8 overflow-y-auto"
              >
                  <div className="absolute top-4 right-4 z-10">
                      <button className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-black rounded-xl font-bold text-xs hover:bg-gray-50 transition-colors shadow-sm">
                          <Copy className="w-4 h-4" /> Copy JSX
                      </button>
                  </div>
                  
                  {/* Renderer - This acts as a 'compiler' for our mock JSON */}
                  <div className="w-full max-w-2xl mx-auto bg-white shadow-xl rounded-xl min-h-[600px] overflow-hidden border border-gray-200 relative">
                     {layout.type === 'login' && <LoginWireframe />}
                     {layout.type === 'dashboard' && <DashboardWireframe />}
                     {layout.type === 'landing' && <LandingWireframe />}
                     {layout.type === 'profile' && <ProfileWireframe />}
                     {layout.type === 'generic' && <div className="p-20 text-center text-gray-400 font-bold">Try "Login", "Dashboard", or "Landing"</div>}
                  </div>
              </motion.div>
          )}
      </div>

      <div className="flex justify-center gap-8 text-xs font-bold text-gray-400 uppercase tracking-widest">
         <div className="flex items-center gap-2"><Layout className="w-4 h-4" /> Auto-Flexbox</div>
         <div className="flex items-center gap-2"><Terminal className="w-4 h-4" /> Tailwind Ready</div>
      </div>
    </div>
  );
}

/* --- Internal Mock Renderers for the Wireframes --- */

function LoginWireframe() {
    return (
        <div className="flex flex-col items-center justify-center h-full p-8 space-y-6">
            <div className="w-full max-w-sm p-8 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 space-y-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto" />
                <div className="h-8 w-3/4 bg-gray-200 rounded mx-auto" />
                <div className="space-y-3 pt-4">
                    <div className="h-12 w-full bg-white border-2 border-gray-200 rounded-xl" />
                    <div className="h-12 w-full bg-white border-2 border-gray-200 rounded-xl" />
                </div>
                <div className="h-12 w-full bg-black rounded-xl" />
            </div>
        </div>
    )
}

function DashboardWireframe() {
     return (
        <div className="flex h-full">
            <div className="w-20 border-r-2 border-gray-100 p-4 space-y-4">
                <div className="w-8 h-8 bg-black rounded-lg" />
                <div className="w-8 h-8 bg-gray-200 rounded-lg" />
                <div className="w-8 h-8 bg-gray-200 rounded-lg" />
            </div>
            <div className="flex-1 p-8 space-y-8">
                <div className="flex justify-between">
                    <div className="h-8 w-48 bg-gray-200 rounded-lg" />
                    <div className="h-8 w-8 bg-gray-200 rounded-full" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl" />
                    <div className="h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl" />
                    <div className="h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl" />
                </div>
                 <div className="h-64 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl" />
            </div>
        </div>
     )
}

function LandingWireframe() {
    return (
        <div className="space-y-12">
            <div className="flex justify-between p-6 border-b border-gray-100">
                <div className="w-24 h-6 bg-gray-200 rounded" />
                <div className="flex gap-4">
                     <div className="w-16 h-6 bg-gray-100 rounded" />
                     <div className="w-16 h-6 bg-gray-100 rounded" />
                </div>
            </div>
            <div className="text-center px-12 space-y-6">
                 <div className="h-16 w-3/4 bg-gray-200 rounded-xl mx-auto" />
                 <div className="h-4 w-1/2 bg-gray-100 rounded mx-auto" />
                 <div className="flex justify-center gap-4 pt-4">
                     <div className="w-32 h-10 bg-black rounded-full" />
                     <div className="w-32 h-10 border-2 border-black rounded-full" />
                 </div>
            </div>
        </div>
    )
}

function ProfileWireframe() {
    return (
        <div>
            <div className="h-32 bg-gray-100 border-b border-gray-200 relative mb-16">
                 <div className="absolute -bottom-12 left-8 w-24 h-24 bg-gray-300 border-4 border-white rounded-full" />
            </div>
            <div className="px-8 space-y-6">
                <div className="space-y-2">
                    <div className="h-8 w-48 bg-gray-200 rounded" />
                    <div className="h-4 w-64 bg-gray-100 rounded" />
                </div>
                <div className="h-px w-full bg-gray-100" />
                <div className="grid grid-cols-3 gap-4">
                    <div className="aspect-square bg-gray-50 rounded-xl border border-gray-200" />
                    <div className="aspect-square bg-gray-50 rounded-xl border border-gray-200" />
                    <div className="aspect-square bg-gray-50 rounded-xl border border-gray-200" />
                </div>
            </div>
        </div>
    )
}
