"use client";

import Link from "next/link";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { MouseEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function Footer() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <footer className="border-t bg-background relative overflow-hidden" onMouseMove={handleMouseMove}>
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-lg font-bold border-2 border-primary px-2 py-1 bg-primary text-primary-foreground">
                DH
              </span>
              <span className="text-lg font-bold">Design-Hunt</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              The structured learning platform for designers. Master your craft with theory, tools, and practice.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Learn</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/theory" className="hover:underline">Theory Library</Link></li>
              <li><Link href="/tools" className="hover:underline">Tool Mastery</Link></li>
              <BecomeTutorLink />
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/theory/color" className="hover:underline">Color Wheel</Link></li>
              <li><Link href="/theory/typography" className="hover:underline">Type Scale</Link></li>
              <li><Link href="/library/illustrations" className="hover:underline">Illustrations</Link></li>
              <li><Link href="/theory/layout" className="hover:underline">Grid Generator</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:underline">About</Link></li>
              <li><Link href="/critique" className="hover:underline font-bold text-accent-yellow">Explore AI Execution Lab</Link></li>
              <li><Link href="/critique" className="hover:underline">AI Feedback</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground flex justify-between items-center">
          <p>&copy; {new Date().getFullYear()} Design-Hunt. All rights reserved.</p>
        </div>
      </div>
      
      {/* Large Typographic Effect - Dancing Letters */}
      <div className="w-full relative overflow-hidden flex justify-center items-center bg-background select-none cursor-default pb-0 pt-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        
        <div className="flex relative z-10 pointer-events-auto">
          {"DesignHunt".split("").map((letter, i) => (
            <motion.span
              key={i}
              className="text-[13vw] font-black uppercase tracking-tighter leading-[0.8] transition-colors duration-300 text-neutral-200 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-br hover:from-accent-blue hover:via-accent-pink hover:to-accent-yellow cursor-pointer inline-block"
              whileHover={{ 
                scale: 1.1,
                y: -10,
                rotate: Math.random() * 10 - 5
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {letter}
            </motion.span>
          ))}
        </div>
      </div>
    </footer>
  );
}

function BecomeTutorLink() {
    const [enableMarketplace, setEnableMarketplace] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetch("http://localhost:5000/api/settings")
            .then(res => res.json())
            .then(data => {
                if (data && data.ENABLE_MARKETPLACE) {
                    setEnableMarketplace(data.ENABLE_MARKETPLACE);
                }
            })
            .catch(err => console.error("Failed to fetch settings:", err));
    }, []);

    const handleClick = (e: any) => {
        if (!enableMarketplace) {
            e.preventDefault();
            alert("This feature is presently under development.");
        } else {
            router.push("/become-tutor");
        }
    };

    return (
        <li>
            <button onClick={handleClick} className="hover:underline text-left">
                Become a Tutor
            </button>
        </li>
    );
}
