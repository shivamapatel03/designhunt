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
    <section className="relative bg-white py-16 md:py-20 text-black overflow-hidden">
      <div className="container mx-auto px-6 md:px-16 lg:px-24 relative">
        <div className="max-w-3xl mx-auto relative">
          {/* Decorative Side Shapes - Static */}
          <img 
            src="/bg/e1.png" 
            alt="" 
            className="absolute -left-12 md:-left-24 top-0 w-12 h-12 md:w-16 md:h-16 opacity-20 pointer-events-none"
          />
          <img 
            src="/bg/e2.png" 
            alt="" 
            className="absolute -right-12 md:-right-24 top-20 w-10 h-10 md:w-14 md:h-14 opacity-15 pointer-events-none"
          />
          <img 
            src="/bg/e3.png" 
            alt="" 
            className="absolute -left-16 md:-left-32 bottom-20 w-14 h-14 md:w-20 md:h-20 opacity-20 pointer-events-none"
          />
          <img 
            src="/bg/e1.png" 
            alt="" 
            className="absolute -right-16 md:-right-28 bottom-0 w-12 h-12 md:w-16 md:h-16 opacity-15 pointer-events-none"
          />

          <div className="text-center mb-12 relative">
             {/* Small shapes around heading */}
             <img src="/bg/e2.png" alt="" className="absolute -top-6 left-1/4 w-6 h-6 opacity-20" />
             <img src="/bg/e3.png" alt="" className="absolute -bottom-4 right-1/4 w-5 h-5 opacity-20" />
             
             <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-gray-900">Frequently Asked Questions</h2>
             <p className="text-lg text-gray-600">Everything you need to know about our platform and theoretical knowledge.</p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <div 
                key={index}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all shadow-sm hover:shadow-md hover:border-gray-300"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left outline-none hover:bg-gray-50 transition-colors"
                >
                  <span className="text-base sm:text-lg font-semibold text-gray-900 pr-6">{faq.question}</span>
                  <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${openIndex === index ? 'bg-gray-100 text-gray-900' : 'bg-gray-50 text-gray-500'}`}>
                    {openIndex === index ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
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
                      <div className="px-6 pb-6 text-gray-600 font-medium text-base">
                        <div className="pt-2">{faq.answer}</div>
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
