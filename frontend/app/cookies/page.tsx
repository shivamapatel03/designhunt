"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Cookie, ShieldCheck, Check } from "lucide-react";
import { motion } from "framer-motion";

export default function CookieSettingsPage() {
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: true,
    functional: true,
  });
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("cookie-preferences");
    if (saved) {
      setPreferences(JSON.parse(saved));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("cookie-preferences", JSON.stringify(preferences));
    localStorage.setItem("cookie-consent", "accepted");
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const toggle = (key: keyof typeof preferences) => {
    if (key === 'necessary') return; // Cannot toggle necessary
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-white min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6 md:px-16 lg:px-24 max-w-3xl">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-black transition-colors mb-8 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
        
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
              <Cookie className="w-6 h-6 text-black" />
            </div>
            <h1 className="text-4xl font-figtree font-semibold tracking-tight text-black">
              Cookie Settings
            </h1>
          </div>
          <p className="text-gray-500 font-medium leading-relaxed">
            Manage how Designhunt uses cookies to provide a personalized learning experience. You can update these settings at any time.
          </p>
        </header>

        <div className="space-y-6">
          {/* Strictly Necessary */}
          <div className="p-6 border border-gray-100 rounded-2xl flex items-start justify-between gap-6 transition-all hover:border-gray-200">
            <div className="flex-1">
              <h3 className="text-lg font-bold font-figtree text-black mb-1">Strictly Necessary Cookies</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">
                These cookies are essential for you to browse the website and use its features, such as accessing secure areas (Login) and processing payments. They cannot be disabled.
              </p>
            </div>
            <div className="relative inline-flex h-6 w-11 shrink-0 cursor-not-allowed rounded-full bg-black/10 transition-colors">
              <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white mt-1 shadow-sm transition-transform" />
            </div>
          </div>

          {/* Analytics */}
          <div 
            className="p-6 border border-gray-100 rounded-2xl flex items-start justify-between gap-6 transition-all hover:border-gray-200 cursor-pointer"
            onClick={() => toggle('analytics')}
          >
            <div className="flex-1">
              <h3 className="text-lg font-bold font-figtree text-black mb-1">Analytics & Performance</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">
                We use these to understand how you interact with our courses and UI kits. This helps us optimize performance and identify which materials are most helpful for our students.
              </p>
            </div>
            <button
               className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${preferences.analytics ? 'bg-black' : 'bg-gray-200'}`}
            >
              <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out mt-1 ml-1 ${preferences.analytics ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Functional */}
          <div 
            className="p-6 border border-gray-100 rounded-2xl flex items-start justify-between gap-6 transition-all hover:border-gray-200 cursor-pointer"
            onClick={() => toggle('functional')}
          >
            <div className="flex-1">
              <h3 className="text-lg font-bold font-figtree text-black mb-1">Functional Preferences</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">
                These allow our website to remember choices you make (such as your preferred language or dark mode settings) and provide enhanced, more personal features.
              </p>
            </div>
            <button
               className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${preferences.functional ? 'bg-black' : 'bg-gray-200'}`}
            >
              <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out mt-1 ml-1 ${preferences.functional ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 p-8 bg-gray-50 rounded-3xl">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-black/5 rounded-full flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-gray-600" />
            </div>
            <p className="text-sm font-semibold text-gray-600">Your privacy is our priority.</p>
          </div>
          
          <button 
            onClick={handleSave}
            className="w-full sm:w-auto px-10 py-4 bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black/90 transition-all active:scale-[0.98]"
          >
            {isSaved ? (
              <>
                <Check className="w-5 h-5" />
                Settings Saved
              </>
            ) : (
              "Save Preferences"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
