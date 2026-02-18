
"use client";

import { useState } from "react";
import { ThumbsUp, Heart, ExternalLink, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface Submission {
  id: string;
  user_name: string;
  user_avatar?: string;
  content: string;
  vote_count: number;
  has_voted: boolean;
}

export function SubmissionCard({ submission }: { submission: Submission }) {
  const [voteCount, setVoteCount] = useState(submission.vote_count);
  const [hasVoted, setHasVoted] = useState(submission.has_voted);
  const [isVoting, setIsVoting] = useState(false);
  const router = useRouter();

  const handleVote = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isVoting) return;

    // Optimistic Update
    const previousVoted = hasVoted;
    const previousCount = voteCount;

    setHasVoted(!hasVoted);
    setVoteCount(hasVoted ? voteCount - 1 : voteCount + 1);
    setIsVoting(true);

    try {
      const res = await fetch("/api/challenges/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId: submission.id }),
      });

      if (!res.ok) {
        if (res.status === 401) {
            alert("Please log in to vote!");
        }
        throw new Error("Vote failed");
      }

      const data = await res.json();
      // Sync with server source of truth
      setVoteCount(data.newCount); 
      setHasVoted(data.voted);
      router.refresh(); 

    } catch (error) {
      // Revert if error
      setHasVoted(previousVoted);
      setVoteCount(previousCount);
      console.error(error);
    } finally {
        setIsVoting(false);
    }
  };

  const isImage = submission.content?.match(/\.(jpeg|jpg|gif|png|webp)$/) || submission.content?.startsWith("data:image");

  return (
    <div className="group relative bg-white border-2 border-black rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_#000] hover:shadow-[8px_8px_0px_0px_#000] transition-all hover:-translate-y-1">
      
      {/* Image / Content */}
      <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
        {isImage ? (
          <img 
            src={submission.content} 
            alt={`Submission by ${submission.user_name}`} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
            <ExternalLink className="w-12 h-12 text-gray-300 mb-4" />
            <a 
                href={submission.content} 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-bold text-blue-600 hover:underline break-all"
            >
                View External Link
            </a>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleVote}
                className={`
                    px-6 py-3 rounded-full font-black uppercase tracking-wider flex items-center gap-2 shadow-xl border-2
                    ${hasVoted 
                        ? "bg-accent-pink text-white border-accent-pink" 
                        : "bg-white text-black border-white hover:bg-gray-100"
                    }
                `}
            >
                <Heart className={`w-5 h-5 ${hasVoted ? "fill-current" : ""}`} />
                {hasVoted ? "Voted!" : "Vote"}
            </motion.button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-4 bg-white flex items-center justify-between border-t-2 border-black">
        <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-gray-200 border border-black flex items-center justify-center overflow-hidden flex-shrink-0">
                {submission.user_avatar ? (
                    <img src={submission.user_avatar} alt={submission.user_name} />
                ) : (
                    <User className="w-4 h-4 text-gray-500" />
                )}
            </div>
            <span className="font-bold text-sm truncate">{submission.user_name}</span>
        </div>

        <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
            <Heart className={`w-4 h-4 ${hasVoted ? "text-accent-pink fill-current" : "text-gray-400"}`} />
            <span className={`font-black text-sm ${hasVoted ? "text-accent-pink" : "text-gray-600"}`}>
                {voteCount}
            </span>
        </div>
      </div>
    </div>
  );
}
