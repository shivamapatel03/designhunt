"use client";

import { useState, useRef } from "react";
import { UploadCloud, File, X, Loader2, Link as LinkIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface ChallengeSubmissionFormProps {
  challengeId: string;
}

export function ChallengeSubmissionForm({ challengeId }: ChallengeSubmissionFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!file && !url) {
        setError("Please upload an image or provide a link.");
        return;
    }

    setIsUploading(true);
    setError("");

    try {
      let content = url;

      if (file) {
        // Convert to Base64
        content = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
      }

      const res = await fetch(`/api/challenges/${challengeId}/submit`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      const data = await res.json();
      
      if (!res.ok) {
          throw new Error(data.error || "Submission failed");
      }

      setFile(null);
      setUrl("");
      router.refresh(); // Refresh server components to show new submission
    } catch (err: any) {
      console.error("Submission error:", err);
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_0px_#000]">
      <h3 className="text-xl font-black mb-4">Submit Your Work</h3>
      
      {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-500 text-red-700 rounded-lg text-sm">
              {error}
          </div>
      )}

      {/* File Upload Area */}
      {!file ? (
        <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 hover:border-black hover:bg-gray-50 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all mb-4"
        >
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])} 
                className="hidden" 
                accept="image/*"
            />
            <div className="p-3 bg-gray-100 rounded-full mb-3 text-gray-500">
                <UploadCloud className="w-6 h-6" />
            </div>
            <p className="font-bold">Upload Image</p>
            <p className="text-xs text-gray-400">JPG, PNG (Max 1MB)</p>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl mb-4">
            <div className="flex items-center gap-3">
                <File className="w-5 h-5 text-blue-500" />
                <span className="font-bold text-sm truncate max-w-[200px]">{file.name}</span>
            </div>
            <button onClick={() => setFile(null)} className="text-gray-400 hover:text-red-500">
                <X className="w-5 h-5" />
            </button>
        </div>
      )}

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Or provide a link</span>
        </div>
      </div>

      <div className="flex items-center gap-2 border-2 border-gray-200 focus-within:border-black rounded-xl px-3 py-2 mb-6 transition-colors">
          <LinkIcon className="w-5 h-5 text-gray-400" />
          <input 
            type="url" 
            placeholder="Figma, Dribbble, or Website URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 outline-none text-sm font-medium"
          />
      </div>

      <button 
        onClick={handleSubmit} 
        disabled={isUploading}
        className="w-full py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Entry"}
      </button>

    </div>
  );
}
