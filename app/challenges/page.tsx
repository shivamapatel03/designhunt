import { ChallengeCard } from "@/components/challenges/ChallengeCard";
import { Zap } from "lucide-react";

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  points: number;
  category: string;
}

async function getChallenges(): Promise<Challenge[]> {
  try {
    const res = await fetch("http://localhost:3000/api/challenges", { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

export default async function ChallengesPage() {
  const challenges = await getChallenges();

  return (
    <div className="container mx-auto px-6 py-12 md:px-16 lg:px-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
         <div>
            <div className="flex items-center gap-3 mb-4">
               <div className="p-3 bg-accent-pink rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_#000]">
                 <Zap className="w-6 h-6 text-white" />
               </div>
               <h1 className="text-4xl font-bold">Design Challenges</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Sharpen your skills with bite-sized design problems. Earn XP and build your portfolio.
            </p>
         </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {challenges.length > 0 ? (
          challenges.map(challenge => (
            <ChallengeCard key={challenge.id} {...challenge} />
          ))
        ) : (
          <div className="col-span-full text-center py-20">
            <p className="text-xl text-muted-foreground">No challenges found. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
