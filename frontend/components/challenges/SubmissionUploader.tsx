"use client";

import { useState, useRef } from "react";
import { UploadCloud, File, X, Loader2, CheckCircle } from "lucide-react";

interface SubmissionUploaderProps {
  onAnalysisStart: () => void;
  onAnalysisComplete: (data: any) => void;
}

export function SubmissionUploader({ onAnalysisStart, onAnalysisComplete }: SubmissionUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith("image/")) {
        setFile(droppedFile);
      } else {
        alert("Please upload an image file.");
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
       setFile(e.target.files[0]);
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
  };

  const handleSubmit = async () => {
    if (!file) return;

    setIsUploading(true);
    onAnalysisStart();

    // Trigger API simulation
    try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/challenges/feedback", {
            method: "POST",
            body: formData,
        });
        
        const data = await res.json();
        onAnalysisComplete(data);
    } catch (error) {
        console.error("Error analyzing design:", error);
    } finally {
        setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      {!file ? (
        <div 
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
                border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all
                ${isDragging ? 'border-accent-blue bg-blue-50' : 'border-gray-300 hover:border-black hover:bg-gray-50'}
            `}
        >
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
            />
            <div className={`p-4 rounded-full mb-4 ${isDragging ? 'bg-blue-100 text-accent-blue' : 'bg-gray-100 text-gray-500'}`}>
                <UploadCloud className="w-8 h-8" />
            </div>
            <p className="text-lg font-bold mb-2">Click or Drag to Upload Design</p>
            <p className="text-sm text-gray-500">Supports JPG, PNG (Max 5MB)</p>
        </div>
      ) : (
        <div className="bg-white border-2 border-black rounded-xl p-6 shadow-[4px_4px_0px_0px_#000]">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-gray-100 rounded-lg border border-gray-200">
                        <File className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                        <p className="font-bold truncate max-w-[200px]">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                </div>
                {!isUploading && (
                    <button onClick={removeFile} className="p-2 hover:bg-red-50 text-gray-500 hover:text-red-500 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            <button 
                onClick={handleSubmit} 
                disabled={isUploading}
                className="w-full py-3 bg-black text-white font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isUploading ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Analyzing...
                    </>
                ) : (
                    <>
                        Submit for AI Feedback
                    </>
                )}
            </button>
        </div>
      )}
    </div>
  );
}
