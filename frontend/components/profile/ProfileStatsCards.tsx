"use client";

import { cn } from "@/lib/utils";

interface StatsProps {
  streak: number;
  xp: number;
  rank: string;
  badge: {
    name: string;
    image: string;
  };
}

export function ProfileStatsCards({ streak, xp, rank, badge }: StatsProps) {
  const stats = [
    {
      label: "Day Streak",
      value: `${streak} Days`,
      image: "/dashboardicons/streaks.png",
    },
    {
      label: "Total XP",
      value: xp.toLocaleString(),
      image: "/dashboardicons/xp.png",
    },
    {
      label: "User Rank",
      value: rank,
      image: "/dashboardicons/rank.png", // Assuming this exists or using a fallback
    },
    {
      label: "Mastery Badge",
      value: badge.name,
      image: badge.image,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white p-5 rounded-2xl border border-black/10 transition-all hover:border-black/20 group">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 bg-gray-50 rounded-xl group-hover:bg-gray-100 transition-colors flex items-center justify-center p-1.5 overflow-hidden">
              <img src={stat.image} alt={stat.label} className="w-full h-full object-contain" />
            </div>
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 mb-1 uppercase tracking-wider">{stat.label}</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-base font-extrabold text-black leading-tight">{stat.value}</h4>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
