import { notFound } from "next/navigation";
import { ChevronLeft, Trophy, Clock, Flame, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { ChallengeSubmissionForm } from "@/components/challenges/ChallengeSubmissionForm";
import { SubmissionCard } from "@/components/challenges/SubmissionCard";
import { cookies } from "next/headers";

// Helper to fetch data
async function getChallenge(id: string) {
  try {
    const res = await fetch(`http://localhost:5000/api/challenges/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch (e) {
    return null;
  }
}

async function getSubmissions(id: string) {
    // We forward the cookie for auth-dependent fields if any (like has_voted)
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    try {
      const res = await fetch(`http://localhost:5000/api/challenges/${id}/submissions`, { 
          cache: "no-store",
          headers: token ? { Cookie: `token=${token}` } : {}
      });
      if (!res.ok) return [];
      return res.json();
    } catch (e) {
      return [];
    }
}

async function getLeaderboard(id: string) {
    try {
      const res = await fetch(`http://localhost:5000/api/challenges/${id}/leaderboard`, { cache: "no-store" });
      if (!res.ok) return [];
      return res.json();
    } catch (e) {
      return [];
    }
}

export default async function ChallengeDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const challenge = await getChallenge(id);
  const submissions = await getSubmissions(id);
  const leaderboard = await getLeaderboard(id);

  if (!challenge) return notFound();

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Header */}
        <Link href="/challenges" className="inline-flex items-center gap-2 text-gray-500 hover:text-black mb-8 transition-colors">
            <ChevronLeft className="w-5 h-5" /> Back to Challenges
        </Link>
        
        <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Left Column: Brief & Submissions */}
            <div className="lg:col-span-2 space-y-8">
                {/* Brief */}
                <div className="bg-white rounded-3xl overflow-hidden border-2 border-black shadow-[4px_4px_0px_0px_#000]">
                    {/* Cover Image */}
                    {challenge.cover_image && (
                        <div className="h-64 w-full relative border-b-2 border-black">
                            <img src={challenge.cover_image} className="w-full h-full object-cover" alt="Challenge Cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        </div>
                    )}
                    
                    <div className="p-8">
                         <div className="flex flex-wrap items-center gap-3 mb-6">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase
                                 ${challenge.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                                   challenge.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                   'bg-red-100 text-red-700'}`}>
                                {challenge.difficulty}
                            </span>
                            <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-bold uppercase">
                                {challenge.category}
                            </span>
                            {challenge.type === 'DAILY' && (
                                 <span className="px-3 py-1 rounded-full bg-accent-blue/10 text-accent-blue text-xs font-bold uppercase flex items-center gap-1">
                                    <Flame className="w-3 h-3" /> Daily Challenge
                                </span>
                            )}
                        </div>

                        <h1 className="text-4xl font-black mb-6">{challenge.title}</h1>
                        <div className="prose max-w-none text-gray-600 mb-8">
                            <p className="text-lg leading-relaxed">{challenge.description}</p>
                        </div>
                        
                        {/* Requirements Checklist */}
                        {challenge.requirements && (
                            <div className="bg-gray-50 rounded-xl p-6 border-2 border-dashed border-gray-200">
                                <h3 className="font-black text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-accent-pink rounded-full" /> Challenge Requirements
                                </h3>
                                <ul className="space-y-3">
                                    {JSON.parse(challenge.requirements).map((req: string, i: number) => (
                                        <li key={i} className="flex items-start gap-3 text-gray-700 font-medium">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-black flex-shrink-0" />
                                            {req}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Submissions Section */}
                <div>
                     <h2 className="text-2xl font-black mb-6">Community Submissions</h2>
                     
                     <div className="grid md:grid-cols-2 gap-4">
                        {submissions.length > 0 ? (
                            submissions.map((sub: any) => (
                                <SubmissionCard key={sub.id} submission={sub} />
                            ))
                        ) : (
                            <div className="col-span-full py-12 text-center text-gray-400 italic bg-white rounded-2xl border-2 border-dashed border-gray-200">
                                No submissions yet. Be the first!
                            </div>
                        )}
                     </div>
                </div>
            </div>

            {/* Right Column: Sidebar */}
            <div className="space-y-8">
                {/* Action Card */}
                <div className="bg-black text-white rounded-3xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-accent-yellow rounded-xl flex items-center justify-center text-black">
                            <Trophy className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-sm text-gray-400 uppercase font-bold">Reward</div>
                            <div className="text-2xl font-black">{challenge.points} XP</div>
                        </div>
                    </div>
                    {challenge.expires_at && (
                        <div className="flex items-center gap-2 text-gray-400 bg-white/10 p-3 rounded-xl mb-6">
                           <Clock className="w-5 h-5 text-accent-blue" />
                           <span className="font-mono font-bold">Ends in 24h 00m</span> {/* TODO: Real timer */}
                        </div>
                    )}
                    
                    {/* Submission Form Component */}
                    {/* We pass a client action or handle it via context, here just simple inclusion */}
                </div>

                {/* Submission Upload */}
                <ChallengeSubmissionForm 
                    challengeId={challenge.id} 
                />

                {/* Leaderboard */}
                <div className="bg-white border-2 border-black rounded-3xl p-6">
                    <h3 className="font-black text-lg uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-accent-yellow" /> Top Designers
                    </h3>
                    <div className="space-y-4">
                        {leaderboard.map((entry: any, i: number) => (
                             <div key={entry.id} className="flex items-center gap-3 pb-3 border-b border-gray-100 last:border-0">
                                <span className={`w-6 text-center font-black ${i === 0 ? 'text-accent-yellow' : 'text-gray-300'}`}>#{i+1}</span>
                                <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden">
                                     {entry.user_avatar && <img src={entry.user_avatar} />}
                                </div>
                                <div className="flex-1">
                                    <div className="font-bold text-sm">{entry.user_name}</div>
                                    <div className="text-xs text-gray-500">{entry.vote_count} votes</div>
                                </div>
                             </div>
                        ))}
                        {leaderboard.length === 0 && <p className="text-sm text-gray-400">No leaders yet.</p>}
                    </div>
                </div>

            </div>

        </div>
      </div>
    </div>
  );
}
