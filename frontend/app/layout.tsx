import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { CustomCursor } from "@/components/ui/custom-cursor";
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

export const metadata: Metadata = {
  title: "Design-Hunt | Master UI/UX Design",
  description: "Interactive learning platform for modern designers. Master theory, tools, and challenges with AI feedback.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col pb-24 md:pb-32 bg-background text-foreground`}
      >
        <AuthProvider>
          <SystemGuard>
            <CustomCursor />
            <SystemBanner />
            <ClientLayout>
              {children}
            </ClientLayout>
          </SystemGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
