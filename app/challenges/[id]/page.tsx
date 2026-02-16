"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Users, Clock, Award } from "lucide-react";
import { SubmissionUploader } from "@/components/challenges/SubmissionUploader";
import { AIFeedbackPanel } from "@/components/challenges/AIFeedbackPanel";

export default function ChallengeDetailPage({ params }: { params: { id: string } }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleAnalysisStart = () => {
    setIsAnalyzing(true);
    setFeedback(null);
  }

  const handleAnalysisComplete = (data: any) => {
    setIsAnalyzing(false);
    setFeedback(data);
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <Link href="/challenges" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-black mb-8">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Challenges
      </Link>

      <div className="grid lg:grid-cols-[1fr_400px] gap-12">
        {/* Main Brief & Feedback Area */}
        <div className="space-y-12">
           <header>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Redesign Coffee App Checkout</h1>
              <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-gray-600 mb-6">
                 <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> 24 Hours Left</span>
                 <span className="flex items-center gap-2"><Users className="w-4 h-4" /> 128 Participants</span>
                 <span className="flex items-center gap-2 text-accent-blue font-bold"><Award className="w-4 h-4" /> 500 XP Reward</span>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                The current checkout flow for "BeanThere" has a 60% drop-off rate. Your task is to redesign the 3-step payment process to be intuitive, accessible, and reassuring for users.
              </p>
           </header>
           
           <section className="space-y-4">
              <h2 className="text-2xl font-bold">Requirements</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                 <li>Must include guest checkout option.</li>
                 <li>Show clear progress indicators (Steps 1-3).</li>
                 <li>Prioritize mobile-first layout.</li>
                 <li>Adhere to WCAG AA accessibility standards.</li>
              </ul>
           </section>

           <section>
              <h2 className="text-2xl font-bold mb-6">Your Submission</h2>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-8">
                 <SubmissionUploader 
                    onAnalysisStart={handleAnalysisStart} 
                    onAnalysisComplete={handleAnalysisComplete} 
                 />
              </div>
           </section>

           {/* AI Feedback Section */}
           <section id="feedback">
              <h2 className="text-2xl font-bold mb-6">AI Feedback Analysis</h2>
              <AIFeedbackPanel isAnalyzing={isAnalyzing} feedback={feedback} />
           </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
           <div className="p-6 border-2 border-black rounded-xl bg-accent-yellow shadow-[4px_4px_0px_0px_#000]">
              <h3 className="font-bold mb-4 text-lg">Assets & Resources</h3>
              <p className="text-sm mb-4">Download the logo, color palette, and existing screenshots.</p>
              <button className="w-full flex items-center justify-center gap-2 py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800">
                 <Download className="w-4 h-4" /> Download Kit (24MB)
              </button>
           </div>

           <div className="p-6 border border-gray-200 rounded-xl">
              <h3 className="font-bold mb-4">Top Submissions</h3>
              <div className="space-y-4">
                 {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold border border-black">U{i}</div>
                       <div className="flex-1">
                          <p className="font-bold text-sm">Design Ninja {i}</p>
                          <p className="text-xs text-gray-500">Score: {98 - i}</p>
                       </div>
                       <span className="text-xl font-bold bg-gray-100 w-8 h-8 flex items-center justify-center rounded-full text-gray-500">#{i}</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
