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
  const isLearningPage = pathname?.startsWith("/theory/learning");
  const showNavbar = !isFullscreen && !isAdmin && !isLearningPage && (!isAuthPage || pathname === "/login" || pathname === "/signup" || pathname?.startsWith("/onboarding"));
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
    </>
  );
}
