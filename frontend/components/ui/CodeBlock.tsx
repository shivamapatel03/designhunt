"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language = "bash" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-900 text-gray-100 font-mono text-sm">
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
            onClick={handleCopy}
            className={cn(
                "p-1.5 rounded-md text-white transition-all",
                copied ? "bg-green-500/20 text-green-400" : "bg-white/10 hover:bg-white/20"
            )}
            title="Copy to clipboard"
        >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre><code className={`language-${language}`}>{code}</code></pre>
      </div>
    </div>
  );
}
