"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Menu, X, Sparkles, CircleUser, ChevronDown, 
  Smile, Type, LayoutDashboard, Palette, PenTool, 
  PlaySquare, MonitorSmartphone, Layers,
  Accessibility, Brain, Component, Eye, Loader2, Search, ChevronRight, Globe
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";
import { searchEverything, SearchResult } from "@/app/actions/search";
import { BookOpen, Lightbulb, Users } from "lucide-react";
import { SearchModal } from "@/components/ui/SearchModal";

const navItems = [
  { name: "Library", href: "/library", hasDropdown: true },
  { name: "Theory", href: "/theory", hasDropdown: true },
  { name: "Critique", href: "/critique" },
  { name: "Tools", href: "/tools" },
  // { name: "Community", href: "/ideas" },
];

const SEARCH_PHRASES = [
  "Typography...", 
  "Color Theory...", 
  "Layouts...", 
  "UX Laws...", 
  "UI Kits..."
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
        <span className="text-sm font-medium hidden lg:inline-block">{currentLang.name}</span>
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
  const [scrolled, setScrolled] = useState(false);
  const { user, loading } = useAuth();

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [placeholderText, setPlaceholderText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Don't open if mobile
      if (window.innerWidth < 768) return;
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsSearchModalOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        const results = await searchEverything(searchQuery.trim());
        setSuggestions(results.slice(0, 6));
        setIsSearching(false);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchQuery.trim().length >= 2) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
      setIsMobileSearchOpen(false);
    }
  };

  const handleKeyDownMobile = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    const currentPhrase = SEARCH_PHRASES[phraseIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting && placeholderText === currentPhrase) {
      timeout = setTimeout(() => setIsDeleting(true), 2500);
    } else if (isDeleting && placeholderText === "") {
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % SEARCH_PHRASES.length);
    } else {
      timeout = setTimeout(() => {
        setPlaceholderText(
          isDeleting 
            ? currentPhrase.substring(0, placeholderText.length - 1)
            : currentPhrase.substring(0, placeholderText.length + 1)
        );
      }, isDeleting ? 40 : 80);
    }

    return () => clearTimeout(timeout);
  }, [placeholderText, isDeleting, phraseIndex]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getDashboardHref = () => {
    if (!user) return "/login";
    if (user.role === 'SUPER_ADMIN' && user.email === 'shivampatel2330@gmail.com') return "/super-admin";
    if (user.role === 'ADMIN') return "/admin";
    if (user.role === 'TUTOR') return "/tutor-dashboard";
    return "/profile";
  };

  return (
    <>
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out bg-white",
        scrolled ? "shadow-sm border-b border-black/5" : ""
      )}>
        <div className={cn(
          "container mx-auto px-6 md:px-12 lg:px-20 transition-all duration-300",
          scrolled ? "py-1.5" : "py-2.5"
        )}>
          <nav className="flex items-center justify-between">
            {/* Logo - Left */}
            <div className="flex items-center gap-8">
              <Link href="/" className="group flex items-center gap-3 shrink-0">
                <Image
                  src="/logo/gloom.png"
                  alt="DesignHunt Logo"
                  width={96}
                  height={96}
                  className="group-hover:rotate-6 transition-transform"
                />
              </Link>

              {/* Mobile Search - Icon Toggle */}
              <div className="flex md:hidden items-center">
                <AnimatePresence>
                  {!isMobileSearchOpen ? (
                    <motion.button
                      key="search-icon"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={() => setIsMobileSearchOpen(true)}
                      className="p-2 rounded-full bg-black/5 text-blue-500 hover:bg-black/10 transition-colors"
                    >
                      <Search className="w-5 h-5" />
                    </motion.button>
                  ) : (
                    <motion.div
                      key="search-overlay"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="fixed inset-x-0 top-0 h-[72px] bg-[#1a232c] z-[100] flex items-center px-4 gap-3 shadow-lg"
                    >
                      <div className="flex-1 relative">
                        <input 
                          autoFocus
                          type="text" 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={handleKeyDownMobile}
                          placeholder="Search..." 
                          className="w-full bg-white rounded-full py-2.5 pl-5 pr-12 text-sm font-medium font-clash text-black border-none outline-none placeholder:text-gray-400 shadow-inner"
                        />
                        <Search className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-gray-900" />
                      </div>
                      <button 
                        onClick={() => {
                          setIsMobileSearchOpen(false);
                          setSearchQuery("");
                          setShowSuggestions(false);
                        }}
                        className="p-1 rounded-full text-blue-400 hover:bg-white/10 transition-colors"
                      >
                        <X className="w-6 h-6" />
                      </button>

                      {/* Suggestions Dropdown (Mobile Full Width) */}
                      <AnimatePresence>
                        {showSuggestions && suggestions.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-full left-0 right-0 mt-2 mx-4 bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-2xl overflow-hidden z-[101]"
                          >
                            <div className="p-1.5">
                              {suggestions.map((s) => (
                                <Link
                                  key={`${s.type}-${s.id}`}
                                  href={s.url}
                                  onClick={() => {
                                    setShowSuggestions(false);
                                    setIsMobileSearchOpen(false);
                                  }}
                                  className="flex items-center gap-3 p-3 hover:bg-black/5 rounded-xl transition-colors group"
                                >
                                  <div className={cn(
                                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                                    s.type === 'theory' ? "bg-accent-blue/10 text-accent-blue" :
                                    s.type === 'idea' ? "bg-accent-pink/10 text-accent-pink" :
                                    s.type === 'page' ? "bg-emerald-500/10 text-emerald-500" :
                                    "bg-accent-purple/10 text-accent-purple"
                                  )}>
                                    {s.type === 'theory' && <BookOpen className="w-4 h-4" />}
                                    {s.type === 'idea' && <Lightbulb className="w-4 h-4" />}
                                    {s.type === 'person' && <Users className="w-4 h-4" />}
                                    {s.type === 'page' && <Globe className="w-4 h-4" />}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium font-clash truncate group-hover:text-accent-blue transition-colors">{s.title}</p>
                                    <p className="text-[10px] font-normal font-clash text-gray-400 uppercase tracking-widest">{s.type}</p>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            {/* Desktop Menu - Center */}
            <div className="hidden md:flex items-center gap-8">
              {/* Library with Dropdown */}
              <div className="relative group py-2">
                <Link href="/library" className={cn("text-sm font-medium transition-colors flex items-center gap-1.5", pathname === "/library" || pathname?.startsWith("/library/") ? "text-black" : "text-black hover:opacity-70")}>
                  Library <ChevronDown className="w-3.5 h-3.5 opacity-40 transition-transform group-hover:rotate-180" />
                </Link>
                
                {/* Dropdown Card */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_12px_40px_rgb(0,0,0,0.12)] border border-gray-100/80 w-[440px] sm:w-[480px] p-5 sm:p-6 grid grid-cols-2 gap-x-6 gap-y-2 relative before:absolute before:-top-2 before:left-1/2 before:-translate-x-1/2 before:border-8 before:border-transparent before:border-b-white/95">
                    
                    {/* Left Column */}
                    <div className="flex flex-col gap-4">
                      <h3 className="text-xs font-bold tracking-wider uppercase text-gray-400 mb-1">Design Essentials</h3>
                      <Link href="/library/icons" className="flex items-center gap-3 group/item">
                        <div className="w-8 h-8 rounded-md bg-[#FF6B4A]/10 flex items-center justify-center text-[#FF6B4A] shrink-0 transition-all group-hover/item:scale-105 group-hover/item:bg-[#FF6B4A] group-hover/item:text-white"><Smile className="w-4 h-4" /></div>
                        <span className="text-sm font-bold text-gray-700 group-hover/item:text-black transition-colors">Icons</span>
                      </Link>

                      <Link href="/library/wireframes" className="flex items-center gap-3 group/item">
                        <div className="w-8 h-8 rounded-md bg-[#FFB6C1]/10 flex items-center justify-center text-[#d6336c] shrink-0 transition-all group-hover/item:scale-105 group-hover/item:bg-[#FFB6C1] group-hover/item:text-black"><LayoutDashboard className="w-4 h-4" /></div>
                        <span className="text-sm font-bold text-gray-700 group-hover/item:text-black transition-colors">Wireframe</span>
                      </Link>
                      <Link href="/library/colors" className="flex items-center gap-3 group/item">
                        <div className="w-8 h-8 rounded-md bg-[#B19CD9]/10 flex items-center justify-center text-[#663399] shrink-0 transition-all group-hover/item:scale-105 group-hover/item:bg-[#B19CD9] group-hover/item:text-white"><Palette className="w-4 h-4" /></div>
                        <span className="text-sm font-bold text-gray-700 group-hover/item:text-black transition-colors">Colors</span>
                      </Link>
                      <Link href="/library/illustrations" className="flex items-center gap-3 group/item">
                        <div className="w-8 h-8 rounded-md bg-[#4CBB17]/10 flex items-center justify-center text-[#2e8b57] shrink-0 transition-all group-hover/item:scale-105 group-hover/item:bg-[#4CBB17] group-hover/item:text-white"><PenTool className="w-4 h-4" /></div>
                        <span className="text-sm font-bold text-gray-700 group-hover/item:text-black transition-colors">Illustrations</span>
                      </Link>
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col gap-4">
                      <h3 className="text-xs font-bold tracking-wider uppercase text-gray-400 mb-1">Advanced Tools</h3>
                      <Link href="/library/animations" className="flex items-center gap-3 group/item">
                        <div className="w-8 h-8 rounded-md bg-[#B19CD9]/10 flex items-center justify-center text-[#663399] shrink-0 transition-all group-hover/item:scale-105 group-hover/item:bg-[#B19CD9] group-hover/item:text-white"><PlaySquare className="w-4 h-4" /></div>
                        <span className="text-sm font-bold text-gray-700 group-hover/item:text-black transition-colors">Animations</span>
                      </Link>
                      <Link href="/library/mockups" className="flex items-center gap-3 group/item">
                        <div className="w-8 h-8 rounded-md bg-[#FFD700]/10 flex items-center justify-center text-[#b8860b] shrink-0 transition-all group-hover/item:scale-105 group-hover/item:bg-[#FFD700] group-hover/item:text-black"><MonitorSmartphone className="w-4 h-4" /></div>
                        <span className="text-sm font-bold text-gray-700 group-hover/item:text-black transition-colors">Mockups</span>
                      </Link>
                      <Link href="/library/ui-kits" className="flex items-center gap-3 group/item">
                        <div className="w-8 h-8 rounded-md bg-[#00BFFF]/10 flex items-center justify-center text-[#0066cc] shrink-0 transition-all group-hover/item:scale-105 group-hover/item:bg-[#00BFFF] group-hover/item:text-white"><Layers className="w-4 h-4" /></div>
                        <span className="text-sm font-bold text-gray-700 group-hover/item:text-black transition-colors">UI Kits</span>
                      </Link>
                      <Link href="/library/ai-toolbox" className="flex items-center gap-3 group/item">
                        <div className="w-8 h-8 rounded-md bg-[#E8F0AA]/20 flex items-center justify-center text-[#808000] shrink-0 transition-all group-hover/item:scale-105 group-hover/item:bg-[#E8F0AA] group-hover/item:text-black"><Sparkles className="w-4 h-4" /></div>
                        <span className="text-sm font-bold text-gray-700 group-hover/item:text-black transition-colors">AI Tool Box</span>
                      </Link>
                    </div>

                  </div>
                </div>
              </div>

              {/* Theory with Dropdown */}
              <div className="relative group py-2">
                <Link href="/theory" className={cn("text-sm font-medium transition-colors flex items-center gap-1.5", pathname === "/theory" || pathname?.startsWith("/theory/") ? "text-black" : "text-black hover:opacity-70")}>
                  Theory <ChevronDown className="w-3.5 h-3.5 opacity-40 transition-transform group-hover:rotate-180" />
                </Link>
                
                {/* Dropdown Card */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_12px_40px_rgb(0,0,0,0.12)] border border-gray-100/80 w-[440px] sm:w-[480px] p-5 sm:p-6 grid grid-cols-2 gap-x-6 gap-y-2 relative before:absolute before:-top-2 before:left-1/2 before:-translate-x-1/2 before:border-8 before:border-transparent before:border-b-white/95">
                    
                    {/* Left Column */}
                    <div className="flex flex-col gap-4">
                      <h3 className="text-xs font-bold tracking-wider uppercase text-gray-400 mb-1">Foundations</h3>
                      <Link href="/theory/color" className="flex items-center gap-3 group/item">
                        <div className="w-8 h-8 rounded-md bg-[#B19CD9]/10 flex items-center justify-center text-[#663399] shrink-0 transition-all group-hover/item:scale-105 group-hover/item:bg-[#B19CD9] group-hover/item:text-white"><Palette className="w-4 h-4" /></div>
                        <span className="text-sm font-bold text-gray-700 group-hover/item:text-black transition-colors">Colour Theory</span>
                      </Link>
                      <Link href="/theory/typography" className="flex items-center gap-3 group/item">
                        <div className="w-8 h-8 rounded-md bg-[#89CFF0]/10 flex items-center justify-center text-[#0066cc] shrink-0 transition-all group-hover/item:scale-105 group-hover/item:bg-[#89CFF0] group-hover/item:text-black"><Type className="w-4 h-4" /></div>
                        <span className="text-sm font-bold text-gray-700 group-hover/item:text-black transition-colors">Typography</span>
                      </Link>
                      <Link href="/theory/layout" className="flex items-center gap-3 group/item">
                        <div className="w-8 h-8 rounded-md bg-[#FFB6C1]/10 flex items-center justify-center text-[#d6336c] shrink-0 transition-all group-hover/item:scale-105 group-hover/item:bg-[#FFB6C1] group-hover/item:text-black"><LayoutDashboard className="w-4 h-4" /></div>
                        <span className="text-sm font-bold text-gray-700 group-hover/item:text-black transition-colors">Layout & Grids</span>
                      </Link>
                      <Link href="/theory/visual-hierarchy" className="flex items-center gap-3 group/item">
                        <div className="w-8 h-8 rounded-md bg-[#FFD700]/10 flex items-center justify-center text-[#b8860b] shrink-0 transition-all group-hover/item:scale-105 group-hover/item:bg-[#FFD700] group-hover/item:text-black"><Eye className="w-4 h-4" /></div>
                        <span className="text-sm font-bold text-gray-700 group-hover/item:text-black transition-colors">Visual Hierarchy</span>
                      </Link>
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col gap-4">
                      <h3 className="text-xs font-bold tracking-wider uppercase text-gray-400 mb-1">Advanced Principles</h3>
                      <Link href="/theory/motion" className="flex items-center gap-3 group/item">
                        <div className="w-8 h-8 rounded-md bg-[#FF6B4A]/10 flex items-center justify-center text-[#FF6B4A] shrink-0 transition-all group-hover/item:scale-105 group-hover/item:bg-[#FF6B4A] group-hover/item:text-white"><PlaySquare className="w-4 h-4" /></div>
                        <span className="text-sm font-bold text-gray-700 group-hover/item:text-black transition-colors">Motion & Animation</span>
                      </Link>
                      <Link href="/theory/ux-laws" className="flex items-center gap-3 group/item">
                        <div className="w-8 h-8 rounded-md bg-[#4CBB17]/10 flex items-center justify-center text-[#2e8b57] shrink-0 transition-all group-hover/item:scale-105 group-hover/item:bg-[#4CBB17] group-hover/item:text-white"><Brain className="w-4 h-4" /></div>
                        <span className="text-sm font-bold text-gray-700 group-hover/item:text-black transition-colors">Laws of UX</span>
                      </Link>
                      <Link href="/theory/accessibility" className="flex items-center gap-3 group/item">
                        <div className="w-8 h-8 rounded-md bg-[#00BFFF]/10 flex items-center justify-center text-[#0066cc] shrink-0 transition-all group-hover/item:scale-105 group-hover/item:bg-[#00BFFF] group-hover/item:text-white"><Accessibility className="w-4 h-4" /></div>
                        <span className="text-sm font-bold text-gray-700 group-hover/item:text-black transition-colors">Accessibility</span>
                      </Link>
                      <Link href="/theory/design-systems" className="flex items-center gap-3 group/item">
                        <div className="w-8 h-8 rounded-md bg-[#E8F0AA]/20 flex items-center justify-center text-[#808000] shrink-0 transition-all group-hover/item:scale-105 group-hover/item:bg-[#E8F0AA] group-hover/item:text-black"><Component className="w-4 h-4" /></div>
                        <span className="text-sm font-bold text-gray-700 group-hover/item:text-black transition-colors">Design System</span>
                      </Link>
                    </div>

                  </div>
                </div>
              </div>

              <Link href="/critique" className={cn("text-sm font-medium transition-colors flex items-center gap-1.5", pathname === "/critique" ? "text-black" : "text-black hover:opacity-70")}>
                Critique
                <span className="px-1.5 py-0.5 rounded-md bg-accent-blue/10 text-accent-blue text-[10px] font-black uppercase tracking-wider">AI</span>
              </Link>
              <Link href="/tools" className={cn("text-sm font-medium transition-colors flex items-center gap-1.5", pathname === "/tools" ? "text-black" : "text-black hover:opacity-70")}>
                Tools
              </Link>
              {/* <Link href="/ideas" className={cn("text-sm font-medium transition-colors", pathname === "/ideas" ? "text-black" : "text-black hover:opacity-70")}>Community</Link> */}
            </div>

            <div className="hidden md:flex items-center gap-4">
              <div className="relative flex items-center">
                <button
                  type="button"
                  onClick={() => setIsSearchModalOpen(true)}
                  className="group flex items-center justify-between pl-4 pr-3 py-1.5 bg-black/5 hover:bg-black/10 border border-transparent rounded-full text-sm font-medium font-clash text-gray-500 transition-all w-[240px]"
                >
                  <span className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-blue-500" />
                    <span className="truncate">Search {placeholderText}</span>
                  </span>
                  <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-sans font-bold bg-white text-gray-400 rounded-md shadow-sm border border-black/5">⌘K</kbd>
                </button>
              </div>

              <LanguageSelector />

              <Link
                href={getDashboardHref()}
                className="px-5 py-1.5 border border-black/10 rounded-xl text-sm font-bold flex items-center gap-2 text-black hover:border-black hover:bg-black/5 transition-all active:scale-95"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : user ? (
                  user.avatar ? (
                    <img src={user.avatar} className="w-5 h-5 rounded-full object-cover border border-black/10" alt="" />
                  ) : (
                    <User className="w-4 h-4" />
                  )
                ) : (
                  null
                )}
                <span>{loading ? "..." : user ? (user.name?.split(' ')[0] || "Profile") : "Sign in"}</span>
              </Link>
            </div>

            {/* Mobile Toggle */}
            <button 
              className="md:hidden p-2 rounded-md hover:bg-black/5 transition-colors text-black"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
               {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </nav>
        </div>
      </header>



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
                  <Image
                    src="/logo/gloom.png"
                    alt="DesignHunt Logo"
                    width={80}
                    height={80}
                  />
                </Link>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-black/5 transition-colors"
                >
                  <X className="w-6 h-6 text-black" />
                </button>
              </div>

              {/* Sidebar Links */}
              <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1">
                {navItems.map((item) => (
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
                    <span className="text-base font-medium font-clash">
                      {item.name.charAt(0).toUpperCase() + item.name.slice(1).toLowerCase()}
                    </span>
                    <ChevronRight className={cn(
                      "w-4 h-4 transition-transform group-hover:translate-x-1",
                      pathname === item.href ? "opacity-100" : "opacity-40"
                    )} />
                  </Link>
                ))}
              </div>

              {/* Sidebar Footer - Buttons */}
              <div className="p-6 border-t border-black/5 flex flex-col gap-3">
                {user ? (
                  <Link
                    href={getDashboardHref()}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-4 bg-black text-white rounded-2xl font-medium font-clash group"
                  >
                    {user.avatar ? (
                      <img src={user.avatar} className="w-8 h-8 rounded-full border border-white/20" alt="" />
                    ) : (
                      <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">{user.name || "My Account"}</p>
                      <p className="text-[10px] text-white/60 uppercase tracking-widest">Dashboard</p>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-40 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  <>
                    <Link 
                      href="/login" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full py-4 bg-accent-blue text-white rounded-2xl font-medium font-clash text-center hover:bg-blue-600 transition-colors"
                    >
                      Log in
                    </Link>
                    <Link 
                      href="/login?tab=signup" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full py-4 border-2 border-black/5 text-black rounded-2xl font-medium font-clash text-center hover:bg-black/5 transition-colors"
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <SearchModal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} />
    </>
  );
}
