"use client";

import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { usePathname } from "next/navigation";

export default function SystemBanner() {
  const [banner, setBanner] = useState({ show: false, message: "" });
  const pathname = usePathname();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          setBanner({
            show: data.SHOW_BANNER === true,
            message: data.BANNER_MESSAGE || "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch settings");
      }
    };

    fetchSettings();
  }, [pathname]); // Re-fetch on navigation checks

  if (!banner.show || !banner.message) return null;

  return (
    <div className="bg-gradient-to-r from-accent-blue/10 to-accent-purple/10 border-b border-black/5 p-3 text-center relative z-50">
        <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider">
            <AlertCircle className="w-4 h-4 text-accent-blue" />
            <span>{banner.message}</span>
        </div>
    </div>
  );
}
