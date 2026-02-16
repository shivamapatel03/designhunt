"use client";

import { motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { BookOpen, Palette } from "lucide-react";

export function DashboardToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const isTutor = pathname.startsWith("/tutor-dashboard");

  return (
    <div className="flex bg-gray-100 p-1 rounded-2xl border-2 border-black w-fit gap-1 relative overflow-hidden shadow-[4px_4px_0px_0px_#000]">
      {/* Background Pill */}
      <motion.div
        className="absolute inset-y-1 bg-black rounded-xl z-0"
        initial={false}
        animate={{
          left: isTutor ? "calc(50% + 2px)" : "4px",
          width: "calc(50% - 6px)",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />

      <button
        onClick={() => router.push("/profile")}
        className={`relative z-10 flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase italic tracking-widest transition-colors ${
          !isTutor ? "text-white" : "text-gray-400 hover:text-black"
        }`}
      >
        <BookOpen className={`w-4 h-4 ${!isTutor ? "text-accent-pink" : ""}`} /> Profile
      </button>
      
      <button
        onClick={() => router.push("/tutor-dashboard")}
        className={`relative z-10 flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase italic tracking-widest transition-colors ${
          isTutor ? "text-white" : "text-gray-400 hover:text-black"
        }`}
      >
        <Palette className={`w-4 h-4 ${isTutor ? "text-accent-yellow" : ""}`} /> Instructor
      </button>
    </div>
  );
}
