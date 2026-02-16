import { Inter } from "next/font/google";
import "@/app/globals.css";
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ["latin"] });

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.className} min-h-screen bg-black text-white selection:bg-accent-blue selection:text-white`}>
      {children}
      <Toaster position="top-center" theme="dark" />
    </div>
  );
}
