"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Copy, Layout, Terminal, Check, Info } from "lucide-react";
import { toast } from "sonner";

interface UIElement {
  type: string;
  class?: string;
  content?: string;
  placeholder?: string;
  children?: UIElement[];
}

export function WireframeGenerator() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("modern");
  const [layout, setLayout] = useState<UIElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const styles = [
    { id: "modern", name: "Modern", description: "Clean, rounded, soft shadows" },
    { id: "brutalist", name: "Brutalist", description: "Bold borders, high contrast" },
    { id: "minimal", name: "Minimalist", description: "Extreme simplicity, gray tones" }
  ];

  const generateWireframe = async () => {
    if (!prompt) return;
    setLoading(true);
    setLayout(null);

    try {
      const res = await fetch("/api/wireframe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, style })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setLayout(data);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong during generation");
    } finally {
      setLoading(false);
    }
  };

  const copyAsJSX = () => {
    if (!layout) return;
    
    const generateJSX = (el: UIElement, indent = 0): string => {
      const spaces = "  ".repeat(indent);
      const tag = el.type === "input" ? "input" : "div";
      const props = [];
      if (el.class) props.push(`className="${el.class}"`);
      if (el.placeholder) props.push(`placeholder="${el.placeholder}"`);
      
      const propsStr = props.length > 0 ? " " + props.join(" ") : "";
      
      if (el.type === "input") return `${spaces}<${tag}${propsStr} />`;
      
      const childrenStr = el.children?.map(c => generateJSX(c, indent + 1)).join("\n") || "";
      const content = el.content ? `${spaces}  ${el.content}\n` : "";
      
      return `${spaces}<${tag}${propsStr}>\n${content}${childrenStr ? childrenStr + "\n" : ""}${spaces}</${tag}>`;
    };

    const jsx = `const GeneratedUI = () => {\n  return (\n${generateJSX(layout, 2)}\n  );\n};`;
    navigator.clipboard.writeText(jsx);
    setCopied(true);
    toast.success("JSX Component copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      {/* Input & Styles Section */}
      <div className="space-y-6">
          <div className="flex flex-wrap justify-center gap-4">
              {styles.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStyle(s.id)}
                    className={`flex flex-col items-start p-4 rounded-2xl border-2 transition-all text-left w-48 ${
                        style === s.id 
                        ? 'border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' 
                        : 'border-transparent bg-gray-50 text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                      <span className="font-black uppercase text-xs tracking-widest mb-1">{s.name}</span>
                      <span className="text-[10px] font-bold opacity-60 leading-tight">{s.description}</span>
                  </button>
              ))}
          </div>

          <div className="bg-white border-2 border-black rounded-[32px] p-2 flex items-center shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] max-w-3xl mx-auto">
            <div className={`p-4 rounded-2xl border border-black transition-colors ${loading ? 'bg-accent-blue animate-pulse' : 'bg-accent-yellow'}`}>
                <Sparkles className={`w-6 h-6 text-black ${loading ? 'animate-spin' : ''}`} />
            </div>
            <input 
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe a layout (e.g. 'Modern fitness dashboard mobile')..."
                className="flex-1 px-4 py-2 outline-none text-lg font-medium bg-transparent placeholder:text-gray-400"
                onKeyDown={(e) => e.key === "Enter" && generateWireframe()}
            />
            <button 
                onClick={generateWireframe}
                disabled={loading || !prompt}
                className="px-8 py-4 bg-black text-white font-black text-sm uppercase tracking-widest rounded-2xl hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
            >
                {loading ? "SPARKING..." : "SPARK"}
            </button>
          </div>
      </div>

      {/* Canvas Area */}
      <div className="min-h-[650px] border-4 border-dashed border-gray-200 rounded-[40px] flex items-center justify-center relative overflow-hidden bg-white/50 backdrop-blur-sm">
          {!layout && !loading && (
              <div className="text-center">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-accent-blue/10 blur-3xl rounded-full" />
                    <Layout className="w-20 h-20 mx-auto text-gray-200 relative z-10" />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter opacity-20 italic">Visualizing your Spark...</h3>
                  <div className="mt-4 flex gap-4 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                      <span>Grid Engine Ready</span>
                      <span>•</span>
                      <span>Gemini 2.5 Active</span>
                  </div>
              </div>
          )}

          {loading && (
              <div className="text-center space-y-6">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-black border-t-accent-blue rounded-full animate-spin mx-auto" />
                    <Sparkles className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <div className="font-black uppercase text-xs tracking-[0.2em] animate-pulse">Processing Design Logic</div>
                    <div className="text-[10px] font-bold text-gray-400 italic">Synthesizing layouts via Neural Sparks...</div>
                  </div>
              </div>
          )}

          {layout && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full h-full p-8"
              >
                  <div className="absolute top-6 right-6 z-20 flex gap-2">
                       <div className="group relative">
                          <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-black text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                              This AI-generated layout uses standard Tailwind CSS classes.
                          </div>
                          <button className="p-3 bg-white border-2 border-black rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                              <Info className="w-4 h-4" />
                          </button>
                       </div>
                      <button 
                        onClick={copyAsJSX}
                        className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition-transform"
                      >
                          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                          {copied ? "COPIED" : "COPY JSX"}
                      </button>
                  </div>
                  
                  <div className="w-full max-w-3xl mx-auto bg-white shadow-2xl rounded-2xl min-h-[600px] overflow-auto border-2 border-gray-100 p-8 custom-scrollbar">
                     <RecursiveRenderer element={layout} />
                  </div>
              </motion.div>
          )}
      </div>

      <div className="flex justify-center gap-12 text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">
         <div className="flex items-center gap-3">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
             Tailwind Ready
         </div>
         <div className="flex items-center gap-3">
             <div className="w-2 h-2 bg-accent-blue rounded-full" />
             AI Auto-Flex
         </div>
         <div className="flex items-center gap-3">
             <div className="w-2 h-2 bg-accent-yellow rounded-full" />
             Component Export
         </div>
      </div>
    </div>
  );
}

function RecursiveRenderer({ element }: { element: UIElement }) {
    const { type, class: className, content, placeholder, children } = element;
    
    const commonProps = { className };

    switch (type) {
        case "text":
            return <div {...commonProps}>{content}</div>;
        case "button":
            return <button {...commonProps}>{content}</button>;
        case "input":
            return <input {...commonProps} placeholder={placeholder} readOnly />;
        case "avatar":
            return <div {...commonProps} />;
        case "icon":
            return <div {...commonProps} />;
        case "grid":
        case "row":
        case "box":
        case "container":
            return (
                <div {...commonProps}>
                    {content}
                    {children?.map((child, i) => (
                        <RecursiveRenderer key={i} element={child} />
                    ))}
                </div>
            );
        default:
            return (
                <div {...commonProps}>
                    {content}
                    {children?.map((child, i) => (
                        <RecursiveRenderer key={i} element={child} />
                    ))}
                </div>
            );
    }
}
