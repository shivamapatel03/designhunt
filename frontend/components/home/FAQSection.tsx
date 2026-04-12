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
    <section className="relative bg-white py-16 md:py-20 text-black">
      <div className="container mx-auto px-6 md:px-16 lg:px-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
             <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-gray-900">Frequently Asked Questions</h2>
             <p className="text-lg text-gray-600">Everything you need to know about our platform and theoretical knowledge.</p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <div 
                key={index}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all shadow-sm"
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
