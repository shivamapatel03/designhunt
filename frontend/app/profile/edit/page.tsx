"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Edit3, ArrowLeft, Loader2, Image as ImageIcon, Upload } from "lucide-react";
import Image from "next/image";
import LinkNext from "next/link";
import { toast } from "sonner";

export default function EditProfilePage() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    bio: "",
    avatar: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
 
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
 
    if (file.size > 5 * 1024 * 1024) {
      setError("File size too large (max 5MB)");
      return;
    }
 
    setUploading(true);
    setError("");
 
    const formDataUpload = new FormData();
    formDataUpload.append("avatar", file);
 
    try {
      const res = await fetch("/api/profile/upload-avatar", {
        method: "POST",
        body: formDataUpload,
      });
 
      const data = await res.json();
 
      if (res.ok) {
        setFormData((prev) => ({ ...prev, avatar: data.url }));
        toast.success("Image uploaded!");
      } else {
        setError(data.error || "Upload failed");
      }
    } catch (err) {
      setError("An unexpected error occurred during upload");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      setFormData({
        name: data.user.name || "",
        username: data.user.handle?.replace("@", "") || "",
        bio: data.user.bio || "",
        avatar: data.user.avatar || ""
      });
    } catch (err) {
      console.error(err);
      setError("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/profile/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Profile updated successfully");
        router.push("/profile");
      } else {
        setError(data.error || "Update failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
      <div className="animate-spin w-6 h-6 border-2 border-black border-t-transparent rounded-full"/>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-[family-name:var(--font-plus-jakarta)] selection:bg-black selection:text-white overflow-hidden">
      {/* Header - Back Link */}
      <div className="w-full p-8 md:p-12 flex justify-start items-center absolute top-20 left-0 z-20">
        <LinkNext href="/profile" className="p-2 bg-white rounded-full border border-black/5 hover:bg-gray-50 transition-all active:scale-95 group">
           <ArrowLeft className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
        </LinkNext>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 pt-24 max-w-[340px] mx-auto w-full relative z-10">
        <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center mb-6"
        >
             <h1 className="text-xl font-semibold tracking-tight text-black">
                Edit Profile
             </h1>
             <p className="text-[9px] font-semibold text-gray-400 mt-0.5 text-center uppercase tracking-widest">
                Update your identity
             </p>
        </motion.div>

        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full space-y-6"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-2 bg-red-50 text-red-500 rounded-xl text-[9px] font-bold text-center border border-red-100 italic">
                        {error}
                    </div>
                )}

                <div className="space-y-3">
                    <div className="space-y-1">
                        <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider pl-1" htmlFor="name">Full Name</label>
                        <input 
                            type="text" 
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-black/5 rounded-xl font-semibold text-sm focus:outline-none focus:ring-1 focus:ring-black/10 transition-all text-black placeholder:text-gray-300"
                            placeholder="Design Wanderer"
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider pl-1" htmlFor="username">Handle</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold">@</span>
                            <input 
                                type="text" 
                                id="username"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s+/g, '') })}
                                className="w-full px-4 py-2.5 pl-8 bg-gray-50 border border-black/5 rounded-xl font-semibold text-sm focus:outline-none focus:ring-1 focus:ring-black/10 transition-all text-black placeholder:text-gray-300"
                                placeholder="handle"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-4 mb-6">
                        <div 
                            className="relative w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden group cursor-pointer bg-gray-100"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {formData.avatar ? (
                                <img src={formData.avatar} alt="Avatar Preview" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <ImageIcon className="w-8 h-8" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Upload className="w-6 h-6 text-white" />
                            </div>
                            {uploading && (
                                <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
                                    <Loader2 className="w-6 h-6 animate-spin text-black" />
                                </div>
                            )}
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Click to change photo</p>
                        <input 
                            type="file" 
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            accept="image/*"
                            className="hidden"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider pl-1" htmlFor="bio">About You</label>
                        <textarea 
                            id="bio"
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-black/5 rounded-xl font-semibold text-sm focus:outline-none focus:ring-1 focus:ring-black/10 transition-all text-black placeholder:text-gray-300 resize-none h-20"
                            placeholder="Tell us about yourself..."
                        />
                    </div>
                </div>

                <button 
                    disabled={saving} 
                    className="w-full py-3 bg-black text-white font-semibold text-sm rounded-xl hover:bg-gray-900 transition-all disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95"
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </form>

            <div className="text-center">
                <LinkNext href="/profile" className="text-[10px] font-semibold text-gray-400 hover:text-black transition-colors">
                   Discard changes
                </LinkNext>
            </div>
        </motion.div>
      </div>
    </div>
  );
}
