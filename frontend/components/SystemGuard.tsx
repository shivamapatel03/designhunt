"use client";

import { useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";

export default function SystemGuard({ children }: { children: React.ReactNode }) {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkSystemStatus();
    // Poll every 5 minutes
    const interval = setInterval(checkSystemStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const checkSystemStatus = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/settings");
      if (res.ok) {
        const data = await res.json();
        setMaintenanceMode(data.MAINTENANCE_MODE === true);
      }
    } catch (err) {
      console.error("Failed to check system status");
    } finally {
        setIsLoading(false);
    }
  };

  // Allow bypass for admin routes (rudimentary check here, better handled by middleware but good for UX)
  // Also passing specific query param ?admin=true could be a hidden backdoor for admins if auth fails
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/super-admin')) {
      return <>{children}</>;
  }

  if (maintenanceMode) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center text-white z-[9999] p-4 text-center">
        <div className="p-6 bg-white/10 rounded-[32px] backdrop-blur-xl border border-white/20 mb-8">
            <ShieldAlert className="w-16 h-16 text-yellow-500 mx-auto" />
        </div>
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
          Under Maintenance
        </h1>
        <p className="text-xl text-gray-400 font-medium max-w-lg">
          We are currently upgrading the DesignHunt platform. Please check back shortly.
        </p>
        
        {/* Maintenance End Time Display */}
        {/* We need to fetch this from the settings API as well, but for now let's assume it's part of the check */}
        <div className="mt-8 p-4 bg-white/10 rounded-xl border border-white/20 backdrop-blur-md">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Estimated Completion</p>
            <MaintenanceTimer />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function MaintenanceTimer() {
    const [endTime, setEndTime] = useState<string | null>(null);

    useEffect(() => {
        fetch("http://localhost:5000/api/settings")
            .then(res => res.json())
            .then(data => {
                if (data.MAINTENANCE_END_TIME) {
                    setEndTime(data.MAINTENANCE_END_TIME);
                }
            })
            .catch(console.error);
    }, []);

    if (!endTime) return <span className="text-xl font-mono font-bold">Soon</span>;

    return (
        <div className="text-xl font-mono font-bold text-accent-yellow">
            {new Date(endTime).toLocaleString()}
        </div>
    );
}
