"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Instagram, 
  Linkedin,
  Loader2,
  CheckCircle2
} from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter an email address");

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Successfully subscribed to Design Hunt news!");
        setIsSuccess(true);
        setEmail("");
        // Reset after 5 seconds
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        toast.error(data.error || "Failed to subscribe");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <footer className="bg-white text-black py-16 md:py-24 border-t border-gray-100 font-plus-jakarta">
      <div className="container mx-auto px-6 md:px-16 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand & Newsletter Section */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <Link href="/" className="flex items-center gap-2 group shrink-0" translate="no">
              <div className="text-3xl md:text-4xl font-bold tracking-tighter text-black transition-colors group-hover:text-blue-600">
                Designhunt<span className="text-blue-500">.</span>
              </div>
            </Link>
            
            <div className="max-w-md">
              <h3 className="text-lg md:text-xl font-semibold mb-6 leading-snug">
                Get design insights delivered straight to your inbox.
              </h3>
              <div className="relative min-h-[52px]">
                <AnimatePresence mode="wait">
                  {!isSuccess ? (
                    <motion.form 
                      key="form"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex flex-col sm:flex-row gap-3" 
                      onSubmit={handleSubscribe}
                    >
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email" 
                        disabled={loading}
                        className="flex-1 px-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-black transition-colors text-sm font-medium disabled:opacity-50"
                        required
                      />
                      <button 
                        type="submit" 
                        disabled={loading}
                        className="blob-btn disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                      >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin relative z-10" /> : <span className="relative z-10">Subscribe</span>}
                        <span className="blob-btn__inner">
                          <span className="blob-btn__blobs">
                            <span className="blob-btn__blob"></span>
                            <span className="blob-btn__blob"></span>
                            <span className="blob-btn__blob"></span>
                            <span className="blob-btn__blob"></span>
                          </span>
                        </span>
                      </button>
                    </motion.form>
                  ) : (
                    <motion.div 
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute inset-0 flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-green-700"
                    >
                      <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                      <span className="text-sm font-bold">You're on the list! Check your inbox.</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <p className="mt-4 text-[11px] text-gray-400 leading-relaxed max-w-[340px]">
                By subscribing you agree to our <Link href="/privacy" className="underline hover:text-black transition-colors">Privacy Policy</Link> and consent to receive updates.
              </p>
            </div>
          </div>

          {/* Navigation Links Columns */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            {/* Theory Section */}
            <div className="flex flex-col gap-6">
              <h4 className="text-sm font-black text-gray-400">Theory</h4>
              <ul className="flex flex-col gap-4">
                <li><Link href="/theory/color" className="text-sm font-semibold hover:text-blue-500 transition-colors">Colour Theory</Link></li>
                <li><Link href="/theory/typography" className="text-sm font-semibold hover:text-blue-500 transition-colors">Typography</Link></li>
                <li><Link href="/theory/layout" className="text-sm font-semibold hover:text-blue-500 transition-colors">Layout & Grids</Link></li>
                <li><Link href="/theory/visual-hierarchy" className="text-sm font-semibold hover:text-blue-500 transition-colors">Visual Hierarchy</Link></li>
                <li><Link href="/theory/motion" className="text-sm font-semibold hover:text-blue-500 transition-colors">Motion & Animation</Link></li>
                <li><Link href="/theory/ux-laws" className="text-sm font-semibold hover:text-blue-500 transition-colors">Laws of UX</Link></li>
              </ul>
            </div>

            {/* Library Section */}
            <div className="flex flex-col gap-6">
              <h4 className="text-sm font-black text-gray-400">Library</h4>
              <ul className="flex flex-col gap-4">
                <li><Link href="/library/icons" className="text-sm font-semibold hover:text-blue-500 transition-colors">Icons</Link></li>
                <li><Link href="/library/wireframes" className="text-sm font-semibold hover:text-blue-500 transition-colors">Wireframe</Link></li>
                <li><Link href="/library/colors" className="text-sm font-semibold hover:text-blue-500 transition-colors">Colors</Link></li>
                <li><Link href="/library/illustrations" className="text-sm font-semibold hover:text-blue-500 transition-colors">Illustrations</Link></li>
                <li><Link href="/library/animations" className="text-sm font-semibold hover:text-blue-500 transition-colors">Animations</Link></li>
                <li><Link href="/library/ui-kits" className="text-sm font-semibold hover:text-blue-500 transition-colors">UI Kits</Link></li>
              </ul>
            </div>

            {/* Follow Us */}
            <div className="flex flex-col gap-6 col-span-2 md:col-span-1">
              <h4 className="text-sm font-black text-gray-400">Follow us</h4>
              <ul className="flex flex-col gap-4">
                <li className="flex items-center gap-3 group">
                  <Instagram className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity" />
                  <Link href="#" className="text-sm font-semibold group-hover:text-pink-600 transition-colors">Instagram</Link>
                </li>
                <li className="flex items-center gap-3 group">
                  <Linkedin className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity" />
                  <Link href="#" className="text-sm font-semibold group-hover:text-blue-700 transition-colors">LinkedIn</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="mt-20 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs font-semibold text-gray-400">
            © {new Date().getFullYear()} Designhunt. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs font-bold text-gray-500">
            <Link href="/privacy" className="hover:text-black transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-black transition-colors">Terms of Service</Link>
            <Link href="/cookies" className="hover:text-black transition-colors">Cookies Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
