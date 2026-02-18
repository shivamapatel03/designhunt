
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";

export default function BecomeTutorPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    bio: "",
    experience: "",
    portfolio: "",
    expertise: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [existingStatus, setExistingStatus] = useState<string | null>(null);

  useEffect(() => {
    // Check if marketplace is enabled
    fetch("http://localhost:5000/api/settings")
      .then(res => res.json())
      .then(settings => {
        if (settings.ENABLE_MARKETPLACE !== true) {
            alert("This feature is currently disabled.");
            router.push("/");
        }
      });
      
    // Check existing application status
    fetch("http://localhost:5000/api/tutor/status", {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } // simplistic
    })
    .then(res => res.json())
    .then(data => {
        if (data && data.status) {
            setExistingStatus(data.status);
        }
    });

  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    
    try {
      const res = await fetch("http://localhost:5000/api/tutor/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit application");
      }

      setStatus("success");
    } catch (err: any) {
      setErrorMessage(err.message);
      setStatus("error");
    }
  };

  if (existingStatus === 'PENDING') {
      return (
          <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center">
              <div className="max-w-md w-full bg-yellow-50 border-2 border-yellow-200 p-8 rounded-3xl text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full animate-ping" />
                  </div>
                  <h2 className="text-2xl font-black mb-2">Application Pending</h2>
                  <p className="text-gray-600">We are reviewing your application. You will be notified via email once a decision is made.</p>
                  <Link href="/profile" className="inline-block mt-6 font-bold underline">Back to Profile</Link>
              </div>
          </div>
      )
  }

  if (existingStatus === 'APPROVED') {
      return (
          <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center">
              <div className="max-w-md w-full bg-green-50 border-2 border-green-200 p-8 rounded-3xl text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-black mb-2">You are a Tutor!</h2>
                  <p className="text-gray-600">Your application has been approved. Access your dashboard to start creating courses.</p>
                  <Link href="/tutor-dashboard" className="inline-block mt-6 px-6 py-3 bg-black text-white rounded-xl font-bold">Go to Dashboard</Link>
              </div>
          </div>
      )
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/profile" className="inline-flex items-center gap-2 text-gray-500 hover:text-black mb-8 transition-colors font-bold">
          <ArrowLeft className="w-4 h-4" /> Back to Profile
        </Link>
        
        <div className="mb-12">
            <span className="px-3 py-1 bg-accent-purple/10 text-accent-purple text-xs font-black uppercase tracking-widest rounded-full border border-accent-purple/20">
                Join the Faculty
            </span>
            <h1 className="text-4xl md:text-5xl font-black mt-4 mb-4">Become a DesignHunt Tutor</h1>
            <p className="text-xl text-gray-500">Share your expertise, create courses, and earn revenue. Join our community of world-class educators.</p>
        </div>

        {status === "success" ? (
          <div className="bg-green-50 border-2 border-green-200 p-8 rounded-3xl text-center animate-in fade-in zoom-in duration-300">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-black mb-2">Application Submitted!</h2>
            <p className="text-gray-600 mb-6">We have received your application and will review it shortly.</p>
            <Link href="/profile" className="px-6 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-900 transition-colors">
              Return to Profile
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <label className="block text-sm font-bold uppercase tracking-wide">Expertise Area</label>
                    <input 
                        type="text" 
                        required
                        placeholder="e.g. UI Design, Framer, Typography"
                        className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-black focus:outline-none transition-colors font-medium"
                        value={formData.expertise}
                        onChange={(e) => setFormData({...formData, expertise: e.target.value})}
                    />
                </div>
                 <div className="space-y-4">
                    <label className="block text-sm font-bold uppercase tracking-wide">Years of Experience</label>
                    <input 
                        type="text" 
                        required
                        placeholder="e.g. 5 Years"
                        className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-black focus:outline-none transition-colors font-medium"
                        value={formData.experience}
                        onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    />
                </div>
            </div>

            <div className="space-y-4">
                <label className="block text-sm font-bold uppercase tracking-wide">Portfolio URL</label>
                <input 
                    type="url" 
                    required
                    placeholder="https://your-portfolio.com"
                    className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-black focus:outline-none transition-colors font-medium"
                    value={formData.portfolio}
                    onChange={(e) => setFormData({...formData, portfolio: e.target.value})}
                />
            </div>

            <div className="space-y-4">
                <label className="block text-sm font-bold uppercase tracking-wide">Bio & Motivation</label>
                <textarea 
                    required
                    rows={6}
                    placeholder="Tell us about yourself and why you want to teach..."
                    className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-black focus:outline-none transition-colors font-medium resize-none"
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                />
            </div>

            {status === "error" && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 border border-red-100">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">{errorMessage}</span>
              </div>
            )}

            <button 
                type="submit" 
                disabled={status === "submitting"}
                className="w-full py-5 bg-black text-white text-lg font-black uppercase tracking-widest rounded-2xl hover:bg-accent-yellow hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
            >
                {status === "submitting" ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
