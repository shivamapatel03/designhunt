
"use client";

import { useState, useEffect } from "react";
import { Plus, Trophy, Calendar, CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";

export function ChallengesManager() {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newChallenge, setNewChallenge] = useState({
      title: "",
      description: "",
      difficulty: "Medium",
      points: 50,
      category: "UI Design",
      requirements: [""]
  });

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
        const res = await fetch("/api/admin/challenges");
        if (res.ok) {
            setChallenges(await res.json());
        }
    } catch (e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          const res = await fetch("/api/admin/challenges", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  ...newChallenge,
                  requirements: newChallenge.requirements.filter(r => r.trim() !== ""),
                  is_active: false // Default inactive
              })
          });
          if (res.ok) {
              setShowCreate(false);
              setNewChallenge({
                title: "",
                description: "",
                difficulty: "Medium",
                points: 50,
                category: "UI Design",
                requirements: [""]
              });
              fetchChallenges();
          }
      } catch (e) {
          alert("Failed to create");
      }
  };

  const toggleActive = async (id: string, currentStatus: number) => {
      // If turning ON, it will auto-off others via backend logic
      // If turning OFF, just off.
      try {
          const res = await fetch("/api/admin/challenges", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id, is_active: currentStatus ? 0 : 1 })
          });
          if (res.ok) {
              fetchChallenges();
          }
      } catch (e) {
          console.error(e);
      }
  };

  // Helper for requirements input
  const updateRequirement = (index: number, value: string) => {
      const newReqs = [...newChallenge.requirements];
      newReqs[index] = value;
      setNewChallenge({...newChallenge, requirements: newReqs});
  };

  const addRequirement = () => {
      setNewChallenge({...newChallenge, requirements: [...newChallenge.requirements, ""]});
  };

  if (loading) return <div className="p-12 text-center text-gray-500">Loading challenges...</div>;

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-black uppercase italic">Daily Challenges</h2>
                <p className="text-sm text-gray-500 font-bold">Manage the active daily challenge</p>
            </div>
            <button 
                onClick={() => setShowCreate(true)}
                className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl font-bold uppercase hover:bg-gray-800 transition-all shadow-[4px_4px_0px_0px_#000]"
            >
                <Plus className="w-5 h-5" /> New Challenge
            </button>
        </div>

        {/* Challenge List */}
        <div className="bg-white border-2 border-black rounded-[32px] overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <table className="w-full text-left">
                <thead className="bg-gray-50 border-b-2 border-black">
                    <tr>
                        <th className="p-4 font-black uppercase text-xs">Status</th>
                        <th className="p-4 font-black uppercase text-xs">Title</th>
                        <th className="p-4 font-black uppercase text-xs">Category</th>
                        <th className="p-4 font-black uppercase text-xs">Metrics</th>
                        <th className="p-4 font-black uppercase text-xs text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {challenges.map(c => (
                        <tr key={c.id} className={c.is_active ? "bg-green-50" : "hover:bg-gray-50"}>
                            <td className="p-4">
                                {c.is_active ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-black uppercase">
                                        <CheckCircle2 className="w-3 h-3" /> Active
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-500 rounded-lg text-xs font-black uppercase">
                                        Inactive
                                    </span>
                                )}
                            </td>
                            <td className="p-4">
                                <div className="font-bold">{c.title}</div>
                                <div className="text-xs text-gray-500 truncate max-w-[200px]">{c.description}</div>
                            </td>
                            <td className="p-4">
                                <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded">{c.category}</span>
                            </td>
                            <td className="p-4 text-xs font-medium text-gray-500">
                                <div>{c.points} XP</div>
                                <div>{c.difficulty}</div>
                            </td>
                            <td className="p-4 text-right">
                                <button 
                                    onClick={() => toggleActive(c.id, c.is_active)}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                                        c.is_active 
                                            ? "bg-red-100 text-red-600 hover:bg-red-200" 
                                            : "bg-black text-white hover:bg-gray-800"
                                    }`}
                                >
                                    {c.is_active ? "Deactivate" : "Set Active"}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
             {challenges.length === 0 && (
                <div className="p-12 text-center text-gray-400 font-bold italic">
                    No challenges found. Create one to get started!
                </div>
            )}
        </div>

        {/* Create Modal */}
        {showCreate && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-[32px] border-4 border-black p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-[8px_8px_0px_0px_#000]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-black uppercase">Create Challenge</h3>
                        <button onClick={() => setShowCreate(false)} className="p-2 hover:bg-gray-100 rounded-full">
                            <XCircle className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase mb-1">Title</label>
                                <input 
                                    className="w-full px-4 py-2 border-2 border-black rounded-xl font-bold"
                                    value={newChallenge.title}
                                    onChange={e => setNewChallenge({...newChallenge, title: e.target.value})}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase mb-1">Category</label>
                                <input 
                                    className="w-full px-4 py-2 border-2 border-black rounded-xl font-bold"
                                    value={newChallenge.category}
                                    onChange={e => setNewChallenge({...newChallenge, category: e.target.value})}
                                    placeholder="e.g. UI Design"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase mb-1">Description</label>
                            <textarea 
                                className="w-full px-4 py-2 border-2 border-black rounded-xl font-medium"
                                value={newChallenge.description}
                                onChange={e => setNewChallenge({...newChallenge, description: e.target.value})}
                                rows={3}
                                required
                            />
                        </div>

                         <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase mb-1">Difficulty</label>
                                <select 
                                    className="w-full px-4 py-2 border-2 border-black rounded-xl font-bold"
                                    value={newChallenge.difficulty}
                                    onChange={e => setNewChallenge({...newChallenge, difficulty: e.target.value})}
                                >
                                    <option>Easy</option>
                                    <option>Medium</option>
                                    <option>Hard</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase mb-1">Points</label>
                                <input 
                                    type="number"
                                    className="w-full px-4 py-2 border-2 border-black rounded-xl font-bold"
                                    value={newChallenge.points}
                                    onChange={e => setNewChallenge({...newChallenge, points: parseInt(e.target.value)})}
                                />
                            </div>
                        </div>

                        <div>
                             <label className="block text-xs font-bold uppercase mb-1">Requirements (Checklist)</label>
                             <div className="space-y-2">
                                {newChallenge.requirements.map((req, i) => (
                                    <input 
                                        key={i}
                                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm"
                                        value={req}
                                        onChange={e => updateRequirement(i, e.target.value)}
                                        placeholder={`Requirement ${i+1}`}
                                    />
                                ))}
                                <button type="button" onClick={addRequirement} className="text-xs font-bold text-accent-blue hover:underline">
                                    + Add Requirement
                                </button>
                             </div>
                        </div>

                        <div className="pt-4 flex gap-4">
                             <button type="button" onClick={() => setShowCreate(false)} className="flex-1 py-3 font-bold uppercase bg-gray-100 rounded-xl hover:bg-gray-200">
                                Cancel
                             </button>
                             <button type="submit" className="flex-1 py-3 font-bold uppercase bg-black text-white rounded-xl hover:bg-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
                                Create Challenge
                             </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
}
