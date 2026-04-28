"use client";

import { useState, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  Delete02Icon, 
  CheckmarkCircle01Icon, 
  Clock01Icon, 
  CheckmarkSquare01Icon, 
  Square01Icon, 
  Notification01Icon, 
  SentIcon, 
  Comment01Icon, 
  Tick01Icon, 
  Cancel01Icon, 
  Refresh01Icon 
} from "@hugeicons/core-free-icons";

interface Idea {
  id: number;
  name: string;
  email: string;
  idea: string;
  status: string;
  admin_feedback?: string;
  user_image?: string;
  created_at: string;
}

interface IdeasManagerProps {
  isAdmin?: boolean;
}

export function IdeasManager({ isAdmin = false }: IdeasManagerProps) {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [respondingTo, setRespondingTo] = useState<Idea | null>(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    try {
      const res = await fetch("/api/admin/ideas");
      const data = await res.json();
      setIdeas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch ideas", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      const res = await fetch("/api/admin/ideas/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      if (res.ok) {
        setIdeas(prev => prev.map(idea => idea.id === id ? { ...idea, status } : idea));
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error("Status update error", error);
    }
  };

  const handleSendResponse = async () => {
    if (!respondingTo || !responseMessage) return;
    setIsSending(true);
    try {
      const res = await fetch("/api/admin/ideas/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: respondingTo.id, message: responseMessage }),
      });

      if (res.ok) {
        setIdeas(prev => prev.map(idea => 
          idea.id === respondingTo.id ? { ...idea, status: 'reviewed', admin_feedback: responseMessage } : idea
        ));
        setRespondingTo(null);
        setResponseMessage("");
        alert("Response sent via email simulation!");
      } else {
        alert("Failed to send response");
      }
    } catch (error) {
      console.error("Response error", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleDelete = async (ids: number[]) => {
    if (!confirm(`Are you sure you want to delete ${ids.length} idea(s)?`)) return;

    try {
      const res = await fetch("/api/admin/ideas/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });

      if (res.ok) {
        setIdeas(prev => prev.filter(idea => !ids.includes(idea.id)));
        setSelectedIds(prev => prev.filter(id => !ids.includes(id)));
      } else {
        alert("Failed to delete ideas");
      }
    } catch (error) {
      console.error("Delete error", error);
      alert("Error deleting ideas");
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === ideas.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(ideas.map(i => i.id));
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  if (loading) return <div className="p-8 text-center text-gray-500 font-bold tracking-wide animate-pulse">Scanning for ideas...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <HugeiconsIcon icon={Notification01Icon} className="w-7 h-7 text-accent-yellow fill-black" />
            Idea Submissions
          </h2>
          <p className="text-sm font-bold text-gray-400 tracking-tight mt-1">Manage user-requested experiments</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          {selectedIds.length > 0 && (
            <button 
              onClick={() => handleDelete(selectedIds)}
              className="flex items-center gap-2 px-6 py-2 bg-red-500 text-white rounded-xl border border-gray-100 font-bold text-xs shadow-sm active:scale-95 transition-all"
            >
              <HugeiconsIcon icon={Delete02Icon} className="w-4 h-4" />
              Delete ({selectedIds.length})
            </button>
          )}

          <button 
            onClick={toggleSelectAll}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl border border-gray-100 text-xs font-bold transition-all"
          >
            {selectedIds.length === ideas.length && ideas.length > 0 ? (
              <HugeiconsIcon icon={CheckmarkSquare01Icon} className="w-4 h-4" />
            ) : (
              <HugeiconsIcon icon={Square01Icon} className="w-4 h-4" />
            )}
            {selectedIds.length === ideas.length && ideas.length > 0 ? "Deselect All" : "Select All"}
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {ideas.map((idea: Idea) => (
          <div 
            key={idea.id} 
            className={`group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm transition-all hover:translate-y-[-2px] ${
              selectedIds.includes(idea.id) ? 'bg-accent-yellow/5 border-accent-yellow shadow-sm' : ''
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-start gap-4">
                <button 
                  onClick={() => toggleSelect(idea.id)}
                  className="mt-1 transition-transform active:scale-90"
                >
                  {selectedIds.includes(idea.id) ? (
                    <HugeiconsIcon icon={CheckmarkSquare01Icon} className="w-6 h-6 text-black fill-accent-yellow" />
                  ) : (
                    <HugeiconsIcon icon={Square01Icon} className="w-6 h-6 text-gray-300" />
                  )}
                </button>
                <div>
                  <h3 className="font-bold text-base text-black">{idea.name}</h3>
                  <p className="text-gray-400 text-xs font-bold tracking-wide">{idea.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!isAdmin ? (
                  /* Super Admin Filtering Buttons */
                  <div className="flex items-center bg-gray-50 rounded-lg border border-gray-100 p-0.5">
                    <button 
                      onClick={() => handleStatusUpdate(idea.id, 'approved')}
                      className={`p-1.5 rounded-md transition-all ${idea.status === 'approved' ? 'bg-green-500 text-white shadow-inner' : 'text-gray-400 hover:text-green-500'}`}
                      title="Approve Idea"
                    >
                      <HugeiconsIcon icon={Tick01Icon} className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(idea.id, 'under_process')}
                      className={`p-1.5 rounded-md transition-all ${idea.status === 'under_process' ? 'bg-accent-yellow text-black shadow-inner' : 'text-gray-400 hover:text-accent-yellow'}`}
                      title="Under Process"
                    >
                      <HugeiconsIcon icon={Refresh01Icon} className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(idea.id, 'rejected')}
                      className={`p-1.5 rounded-md transition-all ${idea.status === 'rejected' ? 'bg-red-500 text-white shadow-inner' : 'text-gray-400 hover:text-red-500'}`}
                      title="Reject Idea"
                    >
                      <HugeiconsIcon icon={Cancel01Icon} className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  /* Admin Execution Buttons (Only if approved by Super Admin) */
                  (idea.status === 'approved' || idea.status === 'under_process' || idea.status === 'implemented' || idea.status === 'reviewed') ? (
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setRespondingTo(idea)}
                        className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-md transition-all"
                        title="Send Email Response"
                      >
                        <HugeiconsIcon icon={SentIcon} className="w-4 h-4" />
                      </button>
                      <div className="w-[2px] h-6 bg-gray-200" />
                      <button 
                        onClick={() => handleStatusUpdate(idea.id, 'implemented')}
                        className={`p-1.5 rounded-md transition-all ${idea.status === 'implemented' ? 'bg-accent-blue text-white shadow-inner' : 'text-gray-400 hover:text-accent-blue'}`}
                        title="Mark as Implemented"
                      >
                        <HugeiconsIcon icon={CheckmarkCircle01Icon} className="w-4 h-4" />
                      </button>
                    </div>
                  ) : null
                )}

                <span className={`ml-2 px-3 py-1 rounded-lg text-[10px] font-bold tracking-wide border border-gray-100 ${
                  idea.status === 'approved' ? 'bg-green-100 text-green-700' : 
                  idea.status === 'implemented' ? 'bg-accent-blue text-white' :
                  idea.status === 'under_process' ? 'bg-accent-yellow/20 text-accent-yellow' :
                  idea.status === 'rejected' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-500'
                }`}>
                  {isAdmin && idea.status === 'pending' ? 'Wait for Super Admin' : 
                   isAdmin && (idea.status === 'approved' || idea.status === 'under_process') ? 'Ready for Launch' : 
                   idea.status.replace('_', ' ')}
                </span>
                <button 
                  onClick={() => handleDelete([idea.id])}
                  className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  <HugeiconsIcon icon={Delete02Icon} className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-accent-yellow rounded-full opacity-50" />
              <div className="space-y-3">
                <p className="text-gray-800 font-bold leading-relaxed bg-gray-50/50 p-4 pl-6 rounded-xl border-2 border-gray-100">
                  "{idea.idea}"
                </p>
                
                {idea.admin_feedback && (
                  <div className="bg-accent-blue/5 border-2 border-accent-blue/20 p-4 rounded-xl flex items-start gap-3">
                    <HugeiconsIcon icon={Comment01Icon} className="w-4 h-4 text-accent-blue mt-1 shrink-0" />
                    <div>
                      <h4 className="text-[10px] font-bold text-accent-blue tracking-wide mb-1">Your Response</h4>
                      <p className="text-xs font-bold text-gray-600">"{idea.admin_feedback}"</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center text-[10px] text-gray-400 font-bold tracking-tight">
              <div className="flex items-center gap-1.5">
                <HugeiconsIcon icon={Clock01Icon} className="w-3 h-3" />
                {new Date(idea.created_at).toLocaleDateString()} @ {new Date(idea.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="font-mono opacity-50">#IDE-{idea.id.toString().padStart(4, '0')}</div>
            </div>
          </div>
        ))}

        {ideas.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border-4 border-dashed border-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-gray-100">
              <HugeiconsIcon icon={Notification01Icon} className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-300">Inbox Empty</h3>
            <p className="text-gray-400 font-bold text-xs tracking-wide mt-2">No experiment requests at the moment.</p>
          </div>
        )}
      </div>

      {/* Respond Modal */}
      {respondingTo && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b-4 border-black bg-accent-blue text-white">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold tracking-tight">Send Feedback</h2>
                <button onClick={() => setRespondingTo(null)} className="p-2 hover:bg-white/20 rounded-xl transition-all">
                  <HugeiconsIcon icon={Cancel01Icon} className="w-6 h-6" />
                </button>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl border-2 border-white/20">
                <p className="text-xs font-bold opacity-60 mb-2">User's Idea</p>
                <p className="font-bold text-sm">"{respondingTo?.idea}"</p>
              </div>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-xs font-bold mb-2 tracking-wide">Your Message</label>
                <textarea
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  className="w-full px-4 py-4 rounded-2xl border border-gray-100 font-bold text-sm focus:outline-none focus:shadow-sm transition-all min-h-[150px]"
                  placeholder='e.g., "Thanks for your idea! We are adding this to the lab next week..."'
                ></textarea>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setRespondingTo(null)}
                  className="flex-1 px-6 py-4 rounded-2xl border border-gray-100 font-bold text-sm hover:bg-gray-50 transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSendResponse}
                  disabled={isSending || !responseMessage}
                  className="flex-1 px-6 py-4 rounded-2xl bg-black text-white hover:bg-gray-900 border border-gray-100 font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 active:translate-x-1 active:scale-95 disabled:opacity-50"
                >
                  {isSending ? 'Sending...' : (
                    <>
                      <HugeiconsIcon icon={SentIcon} className="w-4 h-4" />
                      Send Email
                    </>
                  )}
                </button>
              </div>
              <p className="text-[10px] text-gray-400 font-bold text-center">User will receive this via email: {respondingTo?.email}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
