"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Layout, 
  BookOpen, 
  Award, 
  Briefcase, 
  Activity, 
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: Layout, label: "Dashboard", href: "/profile" },
  { icon: BookOpen, label: "My Lessons", href: "/profile/lessons" },
  { icon: Award, label: "Badges", href: "/profile/badges" },
  { icon: Briefcase, label: "Portfolio", href: "/profile/portfolio" },
  { icon: Activity, label: "Activity", href: "/profile/activity" },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-56 flex flex-col h-full bg-white border-r border-black/10 p-4">
      <div className="space-y-6">
        {/* Menu Section */}
        <div>
          <h3 className="text-[10px] font-black text-gray-400 mb-2 ml-2">Menu</h3>
          <nav className="space-y-0.5">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-1.5 rounded-lg text-[13px] font-bold transition-all group",
                    isActive 
                      ? "bg-black text-white" 
                      : "text-gray-500 hover:bg-gray-50 hover:text-black"
                  )}
                >
                  <item.icon className={cn("w-4 h-4", isActive ? "text-white" : "text-gray-400 group-hover:text-black")} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="mt-auto pt-4">
          <Link
            href="/profile/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-bold text-gray-500 hover:bg-gray-50 hover:text-black transition-all group"
          >
          <Settings className="w-4 h-4 text-gray-400 group-hover:text-black" />
          Settings
        </Link>
      </div>
    </div>
  );
}
