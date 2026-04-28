"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CookieConsent } from "./CookieConsent";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFullscreen = pathname === "/library/wireframes/editor";
  const isAdmin = pathname?.startsWith("/admin") || pathname?.startsWith("/super-admin");
  const isAuthPage = pathname === "/login" || pathname === "/signup" || pathname === "/verify-email" || pathname?.startsWith("/onboarding");
  const isLearningPage = pathname?.startsWith("/theory/learning") && !pathname?.endsWith("/report");
  const showNavbar = !isFullscreen && !isAdmin && !isLearningPage && !isAuthPage;
  const showFooter = !isFullscreen && !isAdmin && !isAuthPage && !isLearningPage;

  const applyExtraGap = showNavbar && (pathname?.startsWith("/theory") || pathname?.startsWith("/library"));

  return (
    <>
      {showNavbar && <Navbar />}
      <main className={cn("flex-1", applyExtraGap && "pt-6 md:pt-8")}>
        {children}
      </main>
      {showFooter && <Footer />}
      <CookieConsent />
      
      {/* Global SVG Gooey Filter for Blob Buttons */}
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style={{ display: 'none' }}>
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10"></feGaussianBlur>
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 21 -7" result="goo"></feColorMatrix>
            <feBlend in2="goo" in="SourceGraphic" result="mix"></feBlend>
          </filter>
        </defs>
      </svg>
    </>
  );
}
