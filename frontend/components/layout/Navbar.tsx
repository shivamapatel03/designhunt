"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Library, BookOpen, PenTool, Trophy, User, Zap, Rocket, Menu, X, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Library", href: "/library", icon: Library },
  { name: "Theory", href: "/theory", icon: BookOpen },
  { name: "Tools", href: "/tools", icon: PenTool },
  // { name: "Challenges", href: "/challenges", icon: Trophy },
];

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading } = useAuth();

  const getDashboardHref = () => {
    if (!user) return "/login";
    if (user.role === 'SUPER_ADMIN') return "/super-admin";
    if (user.role === 'ADMIN') return "/super-admin"; // Fallback to super-admin if admin UI not separate
    // if (user.role === 'TUTOR') return "/tutor-dashboard";
    return "/profile";
  };

  return (
    <>
      {/* Mobile Top Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/10 px-4 py-3 flex md:hidden justify-between items-center">
        <span className="font-black text-xl tracking-tighter">Design-Hunt</span>
        <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed inset-0 z-[60] bg-white flex flex-col"
            >
                <div className="flex justify-between items-center p-4 border-b border-gray-100">
                    <span className="font-black text-xl tracking-tighter">Design-Hunt</span>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="flex flex-col p-4 gap-2 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={cn(
                                "flex items-center gap-4 p-4 rounded-xl text-lg font-bold transition-colors",
                                pathname === item.href ? "bg-black text-white" : "hover:bg-gray-100"
                            )}
                        >
                            <item.icon className="w-6 h-6" />
                            {item.name}
                        </Link>
                    ))}
                    <Link
                        href={getDashboardHref()}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                            "flex items-center gap-4 p-4 rounded-xl text-lg font-bold transition-colors mt-4 border-t border-gray-100",
                             (pathname === "/dashboard" || pathname === "/profile" || pathname === "/tutor-dashboard" || pathname === "/super-admin") ? "bg-accent-yellow text-black" : "hover:bg-gray-50"
                        )}
                    >
                        {user ? <LayoutDashboard className="w-6 h-6" /> : <User className="w-6 h-6" />}
                        {user ? "Profile" : "Login"}
                    </Link>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Floating Navbar */}
      <div className="hidden md:block fixed bottom-8 md:top-8 md:bottom-auto left-1/2 -translate-x-1/2 z-50 w-max max-w-[95vw]">
      <nav className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 md:py-3 bg-white/80 backdrop-blur-md border-2 border-black rounded-full shadow-[4px_4px_0px_0px_#000]">
        
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative group p-2 md:p-3 rounded-full hover:bg-gray-100 transition-colors"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-black rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              <div className="relative z-10 flex flex-col items-center">
                 <Icon className={cn("w-5 h-5 md:w-6 md:h-6 transition-colors", isActive ? "text-white" : "text-black")} />
                 
                 {/* Tooltip - Desktop only */}
                 <span className="hidden md:block absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-xs font-bold px-2 py-1 rounded border border-black whitespace-nowrap pointer-events-none">
                    {item.name}
                 </span>
              </div>
            </Link>
          );
        })}

        <div className="w-px h-6 md:h-8 bg-gray-200 mx-1 md:mx-2"></div>

        <Link
            href={getDashboardHref()}
            className={cn(
                "group relative p-2 md:p-3 rounded-full transition-colors border-2 border-transparent hover:border-black",
                (pathname === "/profile" || pathname === "/tutor-dashboard" || pathname === "/super-admin") ? "bg-accent-yellow text-black border-black" : "hover:bg-accent-yellow"
            )}
        >
             {user ? <LayoutDashboard className="w-5 h-5 md:w-6 md:h-6 text-black" /> : <User className="w-5 h-5 md:w-6 md:h-6 text-black" />}
              <span className="hidden md:block absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-xs font-bold px-2 py-1 rounded border border-black whitespace-nowrap pointer-events-none">
                {user ? "Profile" : "Login"}
             </span>
        </Link>
      </nav>

      </div>
    </>
  );
}
