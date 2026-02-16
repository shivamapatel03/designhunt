"use client";

import { CheckCircle2, Circle, Clock } from "lucide-react";
import { motion } from "framer-motion";

const STAGES = [
  { id: 'REVIEW', label: 'Portfolio Review', desc: 'Admin is checking your experience' },
  { id: 'INTERVIEW', label: 'Interview', desc: 'Scheduling a call to chat' },
  { id: 'VETTING', label: 'Final Vetting', desc: 'Background check and verification' },
  { id: 'ONBOARDING', label: 'Onboarding', desc: 'Welcome to the platform!' }
];

export function VerificationFlow({ currentStage }: { currentStage: string }) {
  const currentIndex = STAGES.findIndex(s => s.id === currentStage);

  return (
    <div className="bg-white border-4 border-black rounded-[32px] p-8 shadow-[8px_8px_0px_0px_#000]">
      <h3 className="text-2xl font-black uppercase mb-8">Verification Journey</h3>
      
      <div className="space-y-8">
        {STAGES.map((stage, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          
          return (
            <div key={stage.id} className="flex gap-6 relative">
              {/* Connector line */}
              {index !== STAGES.length - 1 && (
                <div className={`absolute left-4 top-10 w-1 h-12 border-l-4 border-dashed ${index < currentIndex ? 'border-black' : 'border-gray-200'}`} />
              )}

              <div className="relative z-10">
                {isCompleted ? (
                  <CheckCircle2 className="w-8 h-8 text-green-500 bg-white" />
                ) : isCurrent ? (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <Clock className="w-8 h-8 text-accent-blue bg-white" />
                  </motion.div>
                ) : (
                  <Circle className="w-8 h-8 text-gray-200 bg-white" />
                )}
              </div>

              <div className={isCurrent || isCompleted ? 'opacity-100' : 'opacity-40'}>
                <h4 className="font-black uppercase text-sm leading-none mb-1">{stage.label}</h4>
                <p className="text-xs font-bold text-gray-500 italic">{stage.desc}</p>
                {isCurrent && (
                  <span className="mt-2 inline-block px-2 py-1 bg-accent-blue text-white text-[10px] font-black uppercase rounded">In Progress</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
