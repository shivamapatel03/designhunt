
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Code, Copy, Check } from "lucide-react";

interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
  code: string;
}

const challenges: DailyChallenge[] = [
  {
    id: "neon-glow",
    title: "Neon Glow Text",
    description: "Create a vibrant, glowing text effect using CSS text-shadow and keyframe animations.",
    component: <NeonGlowEffect />,
    code: `
// Tailwind + CSS
<h1 className="text-6xl font-bold text-white animate-pulse"
    style={{ textShadow: "0 0 10px #2196f3, 0 0 20px #2196f3, 0 0 40px #2196f3" }}>
  Neon Nights
</h1>
    `
  },
  {
     id: "magnetic-button",
     title: "Magnetic Button",
     description: "A button that follows your cursor slightly before snapping back.",
     component: <MagneticButtonEffect />,
     code: `
// Framer Motion
<motion.button
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.9 }}
  style={{ x: useMotionValue(0), y: useMotionValue(0) }}
  onMouseMove={(e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - (left + width / 2);
    const y = e.clientY - (top + height / 2);
    x.set(x * 0.2); y.set(y * 0.2);
  }}
  onMouseLeave={() => { x.set(0); y.set(0); }}
>
  Magnetic
</motion.button>
     `
  },
  {
      id: "glitch-text",
      title: "Glitch Text",
      description: "A cyberpunk-style glitch effect using pseudo-elements and clip-path.",
      component: <GlitchTextEffect />,
      code: `
/* CSS */
.glitch {
  position: relative;
}
.glitch::before, .glitch::after {
  content: attr(data-text);
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
}
.glitch::before {
  left: 2px; text-shadow: -1px 0 red; clip: rect(24px, 550px, 90px, 0); animation: glitch-anim-1 2.5s infinite linear alternate-reverse;
}
.glitch::after {
  left: -2px; text-shadow: -1px 0 blue; clip: rect(85px, 550px, 140px, 0); animation: glitch-anim-2 3s infinite linear alternate-reverse;
}
      `
  }
];

export function DailyPracticalSession() {
  const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Select challenge based on the day of the year to ensure it rotates daily for everyone
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    const index = dayOfYear % challenges.length;
    setChallenge(challenges[index]);
  }, []);

  const copyCode = () => {
    if (!challenge) return;
    navigator.clipboard.writeText(challenge.code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!challenge) return null;

  return (
    <section className="mb-20">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-black text-white px-4 py-2 rounded-full font-black uppercase text-sm tracking-widest border-2 border-accent-yellow shadow-[4px_4px_0px_0px_var(--color-accent-yellow)]">
            Daily Practical Session
        </div>
        <div className="h-px bg-black flex-grow"></div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Preview Area */}
        <div className="bg-gray-900 rounded-[32px] border-4 border-black p-12 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
            <div className="relative z-10">
                {challenge.component}
            </div>
            <div className="absolute bottom-6 left-6 text-gray-500 text-xs font-mono uppercase tracking-widest">
                Interactive Preview
            </div>
        </div>

        {/* Code & Explanation */}
        <div className="flex flex-col h-full justify-between gap-6">
            <div>
                <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">{challenge.title}</h2>
                <p className="text-xl text-gray-600 font-medium leading-relaxed">{challenge.description}</p>
            </div>

            <div className="bg-gray-50 rounded-2xl border-2 border-black p-6 relative group">
                <div className="absolute top-4 right-4 z-10">
                    <button 
                        onClick={copyCode}
                        className="p-2 bg-white border-2 border-black rounded-lg hover:bg-black hover:text-white transition-colors"
                        title="Copy Code"
                    >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                </div>
                <div className="absolute top-0 left-0 px-4 py-2 bg-black text-white text-xs font-bold uppercase rounded-br-xl">
                    Source Code
                </div>
                <pre className="font-mono text-sm overflow-x-auto pt-8 text-gray-800">
                    <code>{challenge.code.trim()}</code>
                </pre>
            </div>
        </div>
      </div>
    </section>
  );
}

// Effect Components

function NeonGlowEffect() {
    return (
        <div className="relative group cursor-default">
            <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-accent-pink via-accent-purple to-accent-blue opacity-75 blur-lg group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
            <button className="relative px-8 py-4 bg-black rounded-lg leading-none flex items-center divide-x divide-gray-600">
                <span className="flex items-center space-x-5">
                    <span className="pr-6 text-gray-100 font-bold text-xl tracking-wider">HOVER ME</span>
                </span>
                <span className="pl-6 text-indigo-400 group-hover:text-gray-100 transition duration-200 font-mono">
                    &rarr;
                </span>
            </button>
        </div>
    );
}

function MagneticButtonEffect() {
    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-accent-blue text-white font-black text-xl rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
            MAGNETIC
        </motion.button>
    );
}

function GlitchTextEffect() {
    return (
        <h1 className="text-6xl font-black text-white uppercase tracking-tighter relative select-none" data-text="GLITCH">
            <span className="relative z-10">GLITCH</span>
            <span className="absolute top-0 left-[2px] w-full text-red-500 opacity-70 animate-pulse -z-10" style={{ clipPath: "inset(40% 0 61% 0)" }}>GLITCH</span>
            <span className="absolute top-0 -left-[2px] w-full text-blue-500 opacity-70 animate-pulse delay-75 -z-10" style={{ clipPath: "inset(12% 0 55% 0)" }}>GLITCH</span>
        </h1>
    );
}
