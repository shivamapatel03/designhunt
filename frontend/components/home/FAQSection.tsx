"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FAQS = [
  {
    question: "What exactly is Design-Hunt?",
    answer: "Design-Hunt is a structured learning platform for designers. We provide comprehensive resources including a theory library, tool mastery guides, and daily challenges to help you build a solid design foundation."
  },
  {
    question: "What is the Daily Duel?",
    answer: "The Daily Duel is an interactive community feature. Every day, two design implementations are pitted against each other. You can vote on your favorite and see how your design eye compares to other designers."
  },
  {
    question: "How does Critique AI work?",
    answer: "Critique AI is our upcoming advanced evaluation tool. You can submit your user interfaces, and it will analyze your work to provide instant, actionable feedback based on core design principles like typography, contrast, and balance."
  },
  {
    question: "Are the learning resources free to use?",
    answer: "Yes! A large portion of our theory library, UI tools, and daily challenges are completely free to access to help you kickstart your design journey without barriers."
  }
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative bg-[#0F172A] py-16 md:py-20 border-b-4 border-black text-white">
      {/* Reduced Top SVG Wave Height */}
      <div className="absolute top-[-2px] left-0 w-full overflow-hidden leading-[0] transform">
        <svg 
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none" 
            className="relative block w-full h-[40px] md:h-[60px]"
        >
          <path 
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
            className="fill-white"
          />
        </svg>
      </div>

      <div className="container mx-auto px-6 mt-12 md:px-16 lg:px-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
             <h2 className="text-3xl md:text-4xl font-black mb-3 font-clash uppercase tracking-tight text-white">FAQs</h2>
             <p className="text-lg text-gray-400 font-medium">Everything you need to know about our courses and community.</p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <div 
                key={index}
                className="bg-[#1E293B] border-[3px] border-black rounded-[16px] overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 sm:p-6 text-left outline-none"
                >
                  <span className="text-base sm:text-lg font-black uppercase text-white pr-6">{faq.question}</span>
                  <div className={`shrink-0 w-8 h-8 rounded-full border-2 border-black flex items-center justify-center transition-all duration-300 ${openIndex === index ? 'bg-[#FFEB3B] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-white text-black'}`}>
                    {openIndex === index ? <Minus className="w-4 h-4 font-black" /> : <Plus className="w-4 h-4 font-black" />}
                  </div>
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-4 sm:px-6 pb-6 text-gray-300 font-medium text-base border-t-2 border-black/20">
                        <div className="pt-4">{faq.answer}</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
