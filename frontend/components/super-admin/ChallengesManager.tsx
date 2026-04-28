"use client";

import { useState, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  Add01Icon, 
  Award01Icon, 
  Calendar01Icon, 
  CheckmarkCircle01Icon, 
  CancelCircleIcon, 
  AlertCircleIcon, 
  Loading01Icon 
} from "@hugeicons/core-free-icons";

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

  if (loading) return (
    <div className="p-12 text-center text-gray-500 flex flex-col items-center justify-center gap-4">
      <HugeiconsIcon icon={Loading01Icon} className="w-8 h-8 animate-spin text-black" />
      <span className="font-bold">Loading challenges...</span>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Daily Challenges</h2>
          <p className="text-sm text-gray-500 font-bold">Manage the active daily challenge</p>
        </div>
        <button 
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-sm"
        >
          <HugeiconsIcon icon={Add01Icon} className="w-5 h-5" /> New Challenge
        </button>
      </div>

      {/* Challenge List */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b-2 border-black">
            <tr>
              <th className="p-4 font-bold text-xs uppercase tracking-tight">Status</th>
              <th className="p-4 font-bold text-xs uppercase tracking-tight">Title</th>
              <th className="p-4 font-bold text-xs uppercase tracking-tight">Category</th>
              <th className="p-4 font-bold text-xs uppercase tracking-tight">Metrics</th>
              <th className="p-4 font-bold text-xs uppercase tracking-tight text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {challenges.map(c => (
              <tr key={c.id} className={c.is_active ? "bg-green-50/50" : "hover:bg-gray-50"}>
                <td className="p-4">
                  {c.is_active ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-lg text-[10px] font-bold uppercase tracking-wide">
                      <HugeiconsIcon icon={CheckmarkCircle01Icon} className="w-3.5 h-3.5" /> Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-500 rounded-lg text-[10px] font-bold uppercase tracking-wide">
                      Inactive
                    </span>
                  )}
                </td>
                <td className="p-4">
                  <div className="font-bold text-sm text-black">{c.title}</div>
                  <div className="text-[11px] text-gray-400 font-medium truncate max-w-[200px] mt-0.5">{c.description}</div>
                </td>
                <td className="p-4">
                  <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded-md uppercase tracking-wide">{c.category}</span>
                </td>
                <td className="p-4 text-[11px] font-bold text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <HugeiconsIcon icon={Award01Icon} className="w-3 h-3 text-accent-yellow" />
                    {c.points} XP
                  </div>
                  <div className="mt-1 flex items-center gap-1.5">
                    <HugeiconsIcon icon={Calendar01Icon} className="w-3 h-3 text-gray-400" />
                    {c.difficulty}
                  </div>
                </td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => toggleActive(c.id, c.is_active)}
                    className={`px-4 py-2 rounded-xl text-[11px] font-bold transition-all shadow-sm ${
                      c.is_active 
                        ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100" 
                        : "bg-black text-white hover:bg-gray-800 border border-black"
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
          <div className="p-20 text-center flex flex-col items-center gap-4">
            <div className="p-4 bg-gray-50 rounded-full border border-gray-100 italic">
              <HugeiconsIcon icon={AlertCircleIcon} className="w-8 h-8 text-gray-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-400">No challenges found</h3>
              <p className="text-xs text-gray-400 font-bold mt-1">Create one to get started!</p>
            </div>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-gray-100 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-bold text-black tracking-tight">Create Challenge</h3>
                <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-widest">New Daily Content</p>
              </div>
              <button onClick={() => setShowCreate(false)} className="p-2 hover:bg-gray-50 rounded-xl transition-all border border-transparent hover:border-gray-100">
                <HugeiconsIcon icon={CancelCircleIcon} className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Challenge Title</label>
                  <input 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-bold text-sm focus:bg-white focus:outline-none focus:border-black transition-all"
                    value={newChallenge.title}
                    onChange={e => setNewChallenge({...newChallenge, title: e.target.value})}
                    placeholder="e.g. Modern Card UI"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Category</label>
                  <input 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-bold text-sm focus:bg-white focus:outline-none focus:border-black transition-all"
                    value={newChallenge.category}
                    onChange={e => setNewChallenge({...newChallenge, category: e.target.value})}
                    placeholder="e.g. UI Design"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Description</label>
                <textarea 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-medium text-sm focus:bg-white focus:outline-none focus:border-black transition-all min-h-[100px]"
                  value={newChallenge.description}
                  onChange={e => setNewChallenge({...newChallenge, description: e.target.value})}
                  placeholder="Explain what the user needs to build..."
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Difficulty</label>
                  <select 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-bold text-sm focus:bg-white focus:outline-none focus:border-black transition-all cursor-pointer"
                    value={newChallenge.difficulty}
                    onChange={e => setNewChallenge({...newChallenge, difficulty: e.target.value})}
                  >
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Reward Points</label>
                  <input 
                    type="number"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-bold text-sm focus:bg-white focus:outline-none focus:border-black transition-all"
                    value={newChallenge.points}
                    onChange={e => setNewChallenge({...newChallenge, points: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Requirements checklist</label>
                <div className="space-y-3">
                  {newChallenge.requirements.map((req, i) => (
                    <input 
                      key={i}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium text-xs focus:bg-white transition-all shadow-sm"
                      value={req}
                      onChange={e => updateRequirement(i, e.target.value)}
                      placeholder={`Requirement #${i+1}`}
                    />
                  ))}
                  <button type="button" onClick={addRequirement} className="flex items-center gap-1.5 text-xs font-bold text-accent-blue hover:text-blue-600 transition-colors uppercase tracking-tight">
                    <HugeiconsIcon icon={Add01Icon} className="w-3.5 h-3.5" />
                    Add Requirement
                  </button>
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <button type="button" onClick={() => setShowCreate(false)} className="flex-1 py-4 font-bold bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-100 hover:text-gray-600 transition-all uppercase tracking-widest text-[10px] border border-gray-100">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-4 font-bold bg-black text-white rounded-2xl hover:bg-gray-900 shadow-lg active:scale-[0.98] transition-all uppercase tracking-widest text-[10px] border border-black">
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
