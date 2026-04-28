"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Send, Loader2, Image as ImageIcon, AlignLeft, Link2, Users, Mail, Clock, CheckCircle2, RefreshCw, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NewsletterAdmin() {
  const [subject, setSubject] = useState("");
  const [headerImageUrl, setHeaderImageUrl] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaLink, setCtaLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [isFetchingSubs, setIsFetchingSubs] = useState(true);
  const [showAudience, setShowAudience] = useState(false);

  const fetchSubscribers = async () => {
    try {
      setIsFetchingSubs(true);
      const res = await fetch("/api/admin/newsletter/subscribers", {
        headers: {
          "Authorization": `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setSubscribers(data.subscribers);
      }
    } catch (err) {
      console.error("Failed to fetch subscribers:", err);
    } finally {
      setIsFetchingSubs(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleDeleteSubscriber = async (id: number, email: string) => {
    if (!confirm(`Are you sure you want to permanently remove ${email}?`)) return;
    try {
      const res = await fetch(`/api/admin/newsletter/subscribers/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}`
        }
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Subscriber removed");
        fetchSubscribers();
      } else {
        toast.error("Failed to remove subscriber");
      }
    } catch (err) {
      toast.error("Network error");
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !bodyText) {
      return toast.error("Subject and Message body are required");
    }

    if (!confirm("Are you sure you want to send this email to ALL active subscribers?")) return;

    try {
      setLoading(true);
      const res = await fetch("/api/admin/newsletter/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add your admin auth token headers if necessary based on your project setup
          "Authorization": `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}`
        },
        body: JSON.stringify({
          subject,
          headerImageUrl,
          bodyText,
          ctaText,
          ctaLink,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(data.message || "Newsletter sent successfully!");
        // Reset form
        setSubject("");
        setHeaderImageUrl("");
        setBodyText("");
        setCtaText("");
        setCtaLink("");
      } else {
        toast.error(data.error || "Failed to send newsletter");
      }
    } catch (err) {
      toast.error("Network error. Could not send.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight italic">Newsletter Dispatch</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Compose and send updates to your audience</p>
        </div>

        <div className="relative">
            <button 
                onClick={() => setShowAudience(!showAudience)}
                className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all border",
                    showAudience ? "bg-black text-white border-black" : "bg-white text-gray-600 border-gray-100 hover:border-gray-200"
                )}
            >
                <Users className="w-4 h-4" />
                {subscribers.filter(s => s.status === 'SUBSCRIBED').length} Subscribers
            </button>

            {showAudience && (
                <>
                <div className="fixed inset-0 z-40" onClick={() => setShowAudience(false)} />
                <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-100 rounded-2xl p-4 z-50 animate-in fade-in zoom-in duration-200">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Recent Signups</p>
                        <button onClick={() => fetchSubscribers()} className="p-1 hover:bg-gray-50 rounded text-gray-400"><RefreshCw className={cn("w-3 h-3", isFetchingSubs && "animate-spin")} /></button>
                    </div>

                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                        {subscribers.length > 0 ? (
                            subscribers.map((sub) => (
                                <div key={sub.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between group/item">
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold truncate text-gray-700">{sub.email}</p>
                                        <p className="text-[8px] font-black text-gray-400 uppercase mt-0.5">{new Date(sub.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <button 
                                        onClick={() => handleDeleteSubscriber(sub.id, sub.email)}
                                        className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                        title="Delete Subscriber"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="py-8 text-center text-gray-300">
                                <p className="text-[10px] font-bold uppercase tracking-widest">No subscribers</p>
                            </div>
                        )}
                    </div>
                </div>
                </>
            )}
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-[28px] overflow-hidden flex flex-col lg:flex-row">
        
        {/* Editor Form */}
        <div className="flex-1 p-8 border-r lg:border-b-0 border-b">
          <form onSubmit={handleSend} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Email Subject *</label>
              <input 
                type="text" 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Designhunt. Daily: Top UI Trends"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-black transition-all font-medium text-sm"
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                <ImageIcon className="w-4 h-4" /> Header Image URL
              </label>
              <input 
                type="url" 
                value={headerImageUrl}
                onChange={(e) => setHeaderImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... (Image Link Address)"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-black transition-all font-medium text-sm"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                <AlignLeft className="w-4 h-4" /> Message Body *
              </label>
              <textarea 
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                placeholder="Write your newsletter content here..."
                className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-black transition-all min-h-[220px] resize-y font-medium text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Button Text</label>
                <input 
                  type="text" 
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  placeholder="e.g. Read Full Article"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-black transition-all font-medium text-sm"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                  <Link2 className="w-4 h-4" /> Button Link
                </label>
                <input 
                  type="url" 
                  value={ctaLink}
                  onChange={(e) => setCtaLink(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-black transition-all font-medium text-sm"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading || subscribers.length === 0}
              className="w-full mt-6 flex items-center justify-center gap-2 bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-800 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              {loading ? "Sending..." : `Send to ${subscribers.filter(s => s.status === 'SUBSCRIBED').length} Subscribers`}
            </button>
          </form>
        </div>

        {/* Live Preview Pane */}
        <div className="flex-1 bg-gray-50 p-8">
          <div className="flex items-center justify-between mb-6">
              <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Preview</h2>
              <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-400/20" />
                  <div className="w-2 h-2 rounded-full bg-yellow-400/20" />
                  <div className="w-2 h-2 rounded-full bg-green-400/20" />
              </div>
          </div>
          
          <div className="bg-white border border-gray-100 rounded-3xl p-6 space-y-5 max-w-sm mx-auto">
            {headerImageUrl ? (
              <img src={headerImageUrl} alt="Header Preview" className="w-full h-36 object-cover rounded-2xl" />
            ) : (
              <div className="w-full h-36 bg-gray-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-200">
                <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Header Image</span>
              </div>
            )}

            <h3 className="text-xl font-black leading-tight italic">{subject || "Email Subject Goes Here"}</h3>
            
            <p className="text-gray-600 text-sm whitespace-pre-wrap leading-relaxed font-medium">
              {bodyText || "Your newsletter message will appear here. Start typing to see the preview..."}
            </p>

            {ctaText && (
              <div className="pt-4 flex justify-center">
                <div className="bg-[#4F39F6] text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest pointer-events-none">
                  {ctaText}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
