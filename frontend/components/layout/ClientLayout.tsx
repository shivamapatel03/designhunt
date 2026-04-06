"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CookieConsent } from "./CookieConsent";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFullscreen = pathname === "/library/wireframes/editor";
  const isAdmin = pathname?.startsWith("/admin") || pathname?.startsWith("/super-admin");

  return (
    <>
      {!isFullscreen && !isAdmin && <Navbar />}
      <main className="flex-1">
        {children}
      </main>
      {!isFullscreen && !isAdmin && <Footer />}
      <CookieConsent />
    </>
  );
}
