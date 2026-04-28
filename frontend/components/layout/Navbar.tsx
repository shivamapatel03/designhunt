"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  UserIcon, 
  Menu01Icon, 
  Cancel01Icon, 
  ArtificialIntelligence01Icon, 
  ArrowDown01Icon, 
  ArrowRight01Icon,
  Search01Icon,
  HappyIcon,
  TextIcon,
  LayoutGridIcon,
  ColorsIcon,
  PencilIcon,
  PlaySquareIcon,
  ComputerIcon,
  Layers01Icon,
  Brain01Icon,
  ComponentIcon,
  EyeIcon,
  UniversalAccessIcon,
  Logout01Icon, 
  LifebuoyIcon,
  Book01Icon,
  Idea01Icon,
  GlobeIcon,
  UserGroupIcon
} from "@hugeicons/core-free-icons";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";
import SystemBanner from "@/components/SystemBanner";

const navItems = [
  { name: "Library", href: "/library", hasDropdown: true },
  { name: "Theory", href: "/theory", hasDropdown: true },
  { name: "Critique", href: "/critique" },
  { name: "Tools", href: "/tools" },
  // { name: "Community", href: "/ideas" },
];



const LANGUAGES = [
  { code: 'en', name: 'English', country: 'us' },
  { code: 'es', name: 'Español', country: 'es' },
  { code: 'hi', name: 'हिन्दी', country: 'in' },
  { code: 'fr', name: 'Français', country: 'fr' },
  { code: 'de', name: 'Deutsch', country: 'de' },
  { code: 'ja', name: '日本語', country: 'jp' },
  { code: 'zh-CN', name: '中文', country: 'cn' },
  { code: 'pt', name: 'Português', country: 'br' },
  { code: 'ar', name: 'العربية', country: 'sa' },
];

function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(LANGUAGES[0]);

  useEffect(() => {
    const match = document.cookie.match(/googtrans=\/en\/([a-zA-Z-]+)/);
    if (match && match[1]) {
      const found = LANGUAGES.find(l => l.code === match[1]);
      if (found) setCurrentLang(found);
    }
  }, []);

  const handleSelect = (lang: typeof LANGUAGES[0]) => {
    setCurrentLang(lang);
    setIsOpen(false);
    
    if (lang.code === 'en') {
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
    } else {
      document.cookie = `googtrans=/en/${lang.code}; path=/;`;
      document.cookie = `googtrans=/en/${lang.code}; path=/; domain=${window.location.hostname};`;
    }
    window.location.reload();
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 p-2 text-gray-600 hover:text-black transition-all hover:bg-black/5 rounded-lg active:scale-95"
      >
        <img src={`https://flagcdn.com/w40/${currentLang.country}.png`} alt={currentLang.name} className="w-5 h-[14px] object-cover rounded-[2px] shadow-sm shrink-0" />
        <span className="text-sm font-semibold font-plus-jakarta hidden lg:inline-block">{currentLang.name}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 z-50 overflow-hidden py-2"
            >
              {LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang)}
                  className={cn(
                    "w-full text-left px-4 py-2 text-sm transition-colors hover:bg-black/5 flex items-center justify-between",
                    currentLang.code === lang.code ? "bg-black/5 text-black font-semibold" : "text-gray-600"
                  )}
                >
                  <span className="flex items-center gap-3">
                    <img src={`https://flagcdn.com/w40/${lang.country}.png`} alt={lang.name} className="w-5 h-[14px] object-cover rounded-[2px] shadow-sm shrink-0" />
                    {lang.name}
                  </span>
                  {currentLang.code === lang.code && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, loading, logout } = useAuth();
  
  // Dropdown state
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [sysSettings, setSysSettings] = useState<any>(null);

  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(data => setSysSettings(data));
  }, []);

  const handleMouseEnter = (name: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(name);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  // Staggered variants
  const dropdownVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.98 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 24,
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      y: 8, 
      scale: 0.98,
      transition: { duration: 0.15, ease: "easeOut" }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getDashboardHref = () => {
    if (!user) return "/login";
    const SUPER_ADMIN_EMAILS = ["shivampatel2330@gmail.com", "shivamsenton@gmail.com"];
    if (user.role === 'SUPER_ADMIN' && SUPER_ADMIN_EMAILS.includes(user.email)) return "/super-admin";
    if (user.role === 'ADMIN') return "/admin";
    if (user.role === 'TUTOR') return "/tutor-dashboard";
    return "/profile";
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
        <SystemBanner />
      <header 
        translate="no"
        className={cn(
        "transition-all duration-300 ease-in-out bg-white font-plus-jakarta",
        scrolled ? "shadow-sm border-b border-black/5" : ""
      )}>
        <div className={cn(
          "max-w-7xl mx-auto px-6 md:px-12 transition-all duration-300",
          scrolled ? "py-2" : "py-5 md:py-6"
        )}>
          <nav className="flex items-center justify-between">
            {/* Logo - Left */}
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-1.5 sm:gap-2 group shrink-0" translate="no">
                <div className="text-lg sm:text-xl md:text-2xl font-bold tracking-tighter text-black font-plus-jakarta transition-colors group-hover:text-blue-600" suppressHydrationWarning>
                  Designhunt<span className="text-blue-500">.</span>
                </div>
              </Link>
            </div>
            {/* Desktop Menu - Center */}
            <div className="hidden md:flex items-center gap-8">
              {/* Library with Dropdown */}
              {(sysSettings?.ENABLE_LIBRARY !== false) && (
              <div 
                className="relative py-2"
                onMouseEnter={() => handleMouseEnter('library')}
                onMouseLeave={handleMouseLeave}
              >
                <Link href="/library" className={cn("text-sm font-semibold transition-colors flex items-center gap-1.5", pathname === "/library" || pathname?.startsWith("/library/") ? "text-black" : "text-black hover:opacity-70")}>
                  Library <HugeiconsIcon icon={ArrowDown01Icon} className={cn("w-3.5 h-3.5 opacity-40 transition-transform duration-300", activeDropdown === 'library' ? "rotate-180" : "")} />
                </Link>
                
                {/* Dropdown Card */}
                <AnimatePresence>
                  {activeDropdown === 'library' && (
                    <motion.div 
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={dropdownVariants}
                      className="absolute top-full left-[-40px] pt-4 z-50"
                    >
                      <div className="bg-white rounded-[24px] border-2 border-black w-[640px] p-6 relative before:absolute before:-top-2.5 before:left-[70px] before:-translate-x-1/2 before:border-[10px] before:border-transparent before:border-b-black after:absolute after:-top-2 after:left-[70px] after:-translate-x-1/2 after:border-[8px] after:border-transparent after:border-b-white">
                        <motion.div variants={itemVariants} className="grid grid-cols-3 gap-x-4 gap-y-6">
                          {[
                            { href: "/library/icons", icon: HappyIcon, text: "Icons", desc: "50,000+ premium icons.", color: "#FFEDD5" },
                            { href: "/library/wireframes", icon: LayoutGridIcon, text: "Wireframe", desc: "Build blueprints in seconds.", color: "#FCE7F3" },
                            { href: "/library/colors", icon: ColorsIcon, text: "Colors", desc: "Curated palettes & gradients.", color: "#F3E8FF" },
                            { href: "/library/illustrations", icon: PencilIcon, text: "Illustrations", desc: "Beautiful vector assets.", color: "#DCFCE7" },
                            { href: "/library/animations", icon: PlaySquareIcon, text: "Animations", desc: "Lottie & SVG animations.", color: "#F3E8FF" },
                            { href: "/library/mockups", icon: ComputerIcon, text: "Mockups", desc: "High-res device mockups.", color: "#FEF3C7" },
                            { href: "/library/ui-kits", icon: Layers01Icon, text: "UI Kits", desc: "Ready-to-use components.", color: "#DBEAFE" },
                            { href: "/library/ai-toolbox", icon: ArtificialIntelligence01Icon, text: "AI Tool Box", desc: "Supercharge your workflow.", color: "#F3E8FF" }
                          ].map((item) => (
                            <Link key={item.href} href={item.href} className="flex items-start gap-3 group/item transition-all hover:translate-y-[-2px]">
                              <div 
                                className="w-10 h-10 rounded-xl border-2 border-black flex items-center justify-center shrink-0 transition-transform group-hover/item:scale-110"
                                style={{ backgroundColor: item.color }}
                              >
                                <HugeiconsIcon icon={item.icon} className="w-5 h-5 text-black" />
                              </div>
                              <div className="flex flex-col gap-0.5">
                                <span className="text-xs font-bold text-black leading-none">{item.text}</span>
                                <span className="text-[10px] text-gray-500 leading-tight font-medium line-clamp-1">{item.desc}</span>
                              </div>
                            </Link>
                          ))}
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              )}

              {(sysSettings?.ENABLE_THEORY !== false) && (
              <div 
                className="relative py-2"
                onMouseEnter={() => handleMouseEnter('theory')}
                onMouseLeave={handleMouseLeave}
              >
                <Link href="/theory" className={cn("text-sm font-semibold transition-colors flex items-center gap-1.5", pathname === "/theory" || pathname?.startsWith("/theory/") ? "text-black" : "text-black hover:opacity-70")}>
                  Theory <HugeiconsIcon icon={ArrowDown01Icon} className={cn("w-3.5 h-3.5 opacity-40 transition-transform duration-300", activeDropdown === 'theory' ? "rotate-180" : "")} />
                </Link>
                
                <AnimatePresence>
                  {activeDropdown === 'theory' && (
                    <motion.div 
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={dropdownVariants}
                      className="absolute top-full left-[-200px] pt-4 z-50"
                    >
                      <div className="bg-white rounded-[24px] border-2 border-black w-[640px] p-6 relative before:absolute before:-top-2.5 before:left-[230px] before:-translate-x-1/2 before:border-[10px] before:border-transparent before:border-b-black after:absolute after:-top-2 after:left-[230px] after:-translate-x-1/2 after:border-[8px] after:border-transparent after:border-b-white">
                        <motion.div variants={itemVariants} className="grid grid-cols-3 gap-x-4 gap-y-6">
                          {[
                            { href: "/theory/typography", icon: TextIcon, text: "Typography", desc: "The foundation of UI design.", color: "#E0F2FE" },
                            { href: "/theory/color", icon: ColorsIcon, text: "Colour Theory", desc: "Master the art of color.", color: "#F3E8FF" },
                            { href: "/theory/layout", icon: LayoutGridIcon, text: "Layout & Grids", desc: "Structure your interface.", color: "#FCE7F3" },
                            { href: "/theory/visual-hierarchy", icon: EyeIcon, text: "Visual Hierarchy", desc: "Guide the user's eye.", color: "#FEF3C7" },
                            { href: "/theory/motion", icon: PlaySquareIcon, text: "Motion", desc: "Bring your UI to life.", color: "#FFEDD5" },
                            { href: "/theory/ux-laws", icon: Brain01Icon, text: "Laws of UX", desc: "Psychology for designers.", color: "#DCFCE7" },
                            { href: "/theory/ux-design", icon: UserGroupIcon, text: "UX Design", desc: "Design for humans first.", color: "#DBEAFE" },
                            { href: "/theory/product-strategy", icon: Idea01Icon, text: "Strategy", desc: "Business meets design.", color: "#ECFCCB" },
                            { href: "/theory/accessibility", icon: UniversalAccessIcon, text: "Accessibility", desc: "Design for everyone.", color: "#E0F2FE" },
                            { href: "/theory/user-research", icon: Search01Icon, text: "User Research", desc: "Understand your users.", color: "#F3E8FF" },
                            { href: "/theory/information-architecture", icon: GlobeIcon, text: "Information IA", desc: "Organize the chaos.", color: "#DCFCE7" },
                            { href: "/theory/design-systems", icon: ComponentIcon, text: "Design Systems", desc: "Build at scale easily.", color: "#FEF3C7" }
                          ].map((item) => (
                            <Link key={item.href} href={item.href} className="flex items-start gap-3 group/item transition-all hover:translate-y-[-2px]">
                              <div 
                                className="w-10 h-10 rounded-xl border-2 border-black flex items-center justify-center shrink-0 transition-transform group-hover/item:scale-110"
                                style={{ backgroundColor: item.color }}
                              >
                                <HugeiconsIcon icon={item.icon} className="w-5 h-5 text-black" />
                              </div>
                              <div className="flex flex-col gap-0.5">
                                <span className="text-xs font-bold text-black leading-none">{item.text}</span>
                                <span className="text-[10px] text-gray-500 leading-tight font-medium line-clamp-1">{item.desc}</span>
                              </div>
                            </Link>
                          ))}
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              )}

              {(sysSettings?.ENABLE_CRITIQUE !== false) && (
              <Link href="/critique" className={cn("text-sm font-semibold transition-colors flex items-center gap-1.5", pathname === "/critique" ? "text-black" : "text-black hover:opacity-70")}>
                Critique
                <span className="px-1.5 py-0.5 rounded-md bg-accent-blue/10 text-accent-blue text-[10px] font-black uppercase tracking-wider">AI</span>
              </Link>
              )}
              
              {(sysSettings?.ENABLE_TOOLS !== false) && (
              <Link href="/tools" className={cn("text-sm font-semibold transition-colors flex items-center gap-1.5", pathname === "/tools" ? "text-black" : "text-black hover:opacity-70")}>
                Tools
              </Link>
              )}
            </div>

            <div className="hidden md:flex items-center gap-6">

              <LanguageSelector />

              {loading ? (
                <div className="w-10 h-10 flex items-center justify-center">
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                </div>
              ) : user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="w-10 h-10 border border-black/10 rounded-full flex items-center justify-center text-black hover:border-black hover:bg-black/5 transition-all active:scale-95 shrink-0 overflow-hidden"
                    title="Profile"
                  >
                    {user.avatar ? (
                      <img src={user.avatar} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <HugeiconsIcon icon={UserIcon} className="w-5 h-5" />
                    )}
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <>
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 z-40"
                          onClick={() => setIsProfileOpen(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl border border-gray-200 z-50 overflow-hidden font-plus-jakarta"
                        >
                          {/* User Header */}
                          <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-black/5">
                              {user.avatar ? (
                                <img src={user.avatar} className="w-full h-full object-cover" alt="" />
                              ) : (
                                <div className="w-full h-full bg-black/5 flex items-center justify-center text-black/40">
                                  <HugeiconsIcon icon={UserIcon} className="w-6 h-6" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p className="text-sm font-bold truncate text-black leading-none">{user.name || user.email?.split('@')[0]}</p>
                                {user.is_pro && (
                                  <span className="px-1.5 py-0.5 bg-black text-white text-[8px] font-black rounded-[4px] uppercase tracking-tighter shrink-0 leading-none">PRO</span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 truncate mt-1">{user.role?.toLowerCase().replace('_', ' ') || 'Product Designer'}</p>
                            </div>
                          </div>

                          {/* Action Items */}
                          <div className="py-2 border-b border-gray-100">
                            <Link
                              href="/profile"
                              onClick={() => setIsProfileOpen(false)}
                              className="w-full px-4 py-2 flex items-center gap-3 text-sm font-semibold text-gray-700 hover:bg-black/5 transition-colors"
                            >
                              <HugeiconsIcon icon={UserIcon} className="w-4 h-4 opacity-70" />
                              View Profile
                            </Link>
                          </div>

                          {/* Logout */}
                          <div className="py-1">
                            <button
                              onClick={() => {
                                setIsProfileOpen(false);
                                logout();
                              }}
                              className="w-full px-4 py-3 flex items-center gap-3 text-sm font-bold text-black hover:bg-red-50 hover:text-red-600 transition-colors"
                            >
                              <HugeiconsIcon icon={Logout01Icon} className="w-4 h-4" />
                              Log Out
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link 
                    href="/login" 
                    className="blob-btn"
                  >
                    Log in
                    <span className="blob-btn__inner">
                      <span className="blob-btn__blobs">
                        <span className="blob-btn__blob"></span>
                        <span className="blob-btn__blob"></span>
                        <span className="blob-btn__blob"></span>
                        <span className="blob-btn__blob"></span>
                      </span>
                    </span>
                  </Link>
                  <Link 
                    href="/signup" 
                    className="blob-btn blob-btn--solid"
                  >
                    Start Learning
                    <span className="blob-btn__inner">
                      <span className="blob-btn__blobs">
                        <span className="blob-btn__blob"></span>
                        <span className="blob-btn__blob"></span>
                        <span className="blob-btn__blob"></span>
                        <span className="blob-btn__blob"></span>
                      </span>
                    </span>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Toggle */}
            <button 
              className="md:hidden p-2 rounded-md hover:bg-black/5 transition-colors text-black"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
               {isMobileMenuOpen ? <HugeiconsIcon icon={Cancel01Icon} className="w-6 h-6" /> : <HugeiconsIcon icon={Menu01Icon} className="w-6 h-6" />}
            </button>
          </nav>
        </div>
      </header>
    </div>



      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[55]"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[300px] bg-white z-[56] flex flex-col shadow-2xl"
            >
              {/* Sidebar Header */}
              <div className="p-6 flex items-center justify-between border-b border-black/5">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2">
                  <div className="text-xl font-bold tracking-tighter text-black font-plus-jakarta">
                    Designhunt<span className="text-blue-500">.</span>
                  </div>
                </Link>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-black/5 transition-colors"
                >
                  <HugeiconsIcon icon={Cancel01Icon} className="w-6 h-6 text-black" />
                </button>
              </div>

              {/* Sidebar Links */}
              <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1">
                {navItems.filter(item => {
                  if (item.name === "Library") return sysSettings?.ENABLE_LIBRARY !== false;
                  if (item.name === "Theory") return sysSettings?.ENABLE_THEORY !== false;
                  if (item.name === "Critique") return sysSettings?.ENABLE_CRITIQUE !== false;
                  if (item.name === "Tools") return sysSettings?.ENABLE_TOOLS !== false;
                  return true;
                }).map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "group flex items-center justify-between px-4 py-4 rounded-xl transition-all",
                      pathname === item.href || pathname?.startsWith(item.href)
                        ? "bg-accent-blue/5 text-accent-blue" 
                        : "text-[#222222] hover:bg-black/5 hover:text-black"
                    )}
                  >
                    <span className="text-base font-semibold">
                      {item.name.charAt(0).toUpperCase() + item.name.slice(1).toLowerCase()}
                    </span>
                    <HugeiconsIcon icon={ArrowRight01Icon} className={cn(
                      "w-4 h-4 transition-transform group-hover:translate-x-1",
                      pathname === item.href ? "opacity-100" : "opacity-40"
                    )} />
                  </Link>
                ))}
              </div>

              {/* Sidebar Footer - Buttons */}
              <div className="p-6 border-t border-black/5 flex flex-col gap-3">
                {user ? (
                  <div className="flex flex-col gap-2">
                    <Link
                      href={getDashboardHref()}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-4 bg-black text-white rounded-2xl font-semibold font-plus-jakarta group"
                    >
                      {user.avatar ? (
                        <img src={user.avatar} className="w-8 h-8 rounded-full border border-white/20" alt="" />
                      ) : (
                        <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                          <HugeiconsIcon icon={UserIcon} className="w-5 h-5" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">{user.name || "My Account"}</p>
                        <p className="text-[10px] text-white/60 uppercase tracking-widest">Dashboard</p>
                      </div>
                      <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4 opacity-40 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        logout();
                      }}
                      className="w-full py-4 text-red-600 font-bold font-clash text-center hover:bg-red-50 rounded-2xl transition-colors border border-red-100"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <>
                    <Link 
                      href="/login" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full py-4 bg-black text-white rounded-2xl font-bold font-plus-jakarta text-center hover:bg-black/90 transition-all active:scale-[0.98]"
                    >
                      Log in
                    </Link>
                    <Link 
                      href="/signup" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full py-4 border-2 border-black text-black rounded-2xl font-bold font-plus-jakarta text-center hover:bg-black/5 transition-all active:scale-[0.98]"
                    >
                      Start Learning
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </>
  );
}
