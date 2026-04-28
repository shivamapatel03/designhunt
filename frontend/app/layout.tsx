import type { Metadata } from "next";
import { Geist, Geist_Mono, Edu_SA_Beginner, Inter, Black_Han_Sans, Plus_Jakarta_Sans, Figtree, Bungee } from "next/font/google";
import { ClientLayout } from "@/components/layout/ClientLayout";

import { AuthProvider } from "@/components/providers/auth-provider";
import SystemGuard from "@/components/SystemGuard";
import SystemBanner from "@/components/SystemBanner";
import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

const eduSA = Edu_SA_Beginner({
  variable: "--font-edu-sa",
  subsets: ["latin"],
});

const blackHanSans = Black_Han_Sans({
  weight: "400",
  variable: "--font-black-han-sans",
  subsets: ["latin"],
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

const bungee = Bungee({
  weight: "400",
  variable: "--font-bungee",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Designhunt. - Design learning platform",
  description: "Interactive learning platform for modern designers. Master theory, tools, and challenges with AI feedback.",
};

import { GoogleTranslate } from "@/components/providers/google-translate";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
          className={`${geistSans.variable} ${geistMono.variable} ${eduSA.variable} ${inter.variable} ${blackHanSans.variable} ${plusJakartaSans.variable} ${figtree.variable} ${bungee.variable} antialiased min-h-screen flex flex-col bg-background text-foreground`}
        >
        <AuthProvider>
          <GoogleTranslate />
          <SystemGuard>
            <ClientLayout>
              {children}
            </ClientLayout>
          </SystemGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
