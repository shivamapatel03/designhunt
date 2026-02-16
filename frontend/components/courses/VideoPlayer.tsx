"use client";

import { Play, Lock } from "lucide-react";

interface VideoPlayerProps {
    videoUrl: string | null | undefined;
    thumbnail?: string;
    isLocked?: boolean;
}

export function VideoPlayer({ videoUrl, thumbnail, isLocked = false }: VideoPlayerProps) {
    if (isLocked) {
        return (
            <div className="aspect-video bg-gray-900 rounded-2xl flex flex-col items-center justify-center text-white border-2 border-black shadow-[4px_4px_0px_0px_#000]">
                <Lock className="w-12 h-12 mb-4 text-gray-500" />
                <p className="font-bold text-lg">This lesson is locked</p>
                <p className="text-sm text-gray-400">Complete previous lessons to unlock</p>
            </div>
        );
    }

    if (!videoUrl) {
        return (
            <div className="aspect-video bg-gray-100 rounded-2xl flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300">
                <p className="font-bold">No video available</p>
            </div>
        );
    }

    // Handle YouTube embeds
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
        const videoId = videoUrl.split('v=')[1]?.split('&')[0] || videoUrl.split('/').pop();
        return (
            <div className="aspect-video bg-black rounded-2xl overflow-hidden border-2 border-black shadow-[4px_4px_0px_0px_#000]">
                <iframe 
                    width="100%" 
                    height="100%" 
                    src={`https://www.youtube.com/embed/${videoId}`} 
                    title="Course Video" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    className="w-full h-full"
                ></iframe>
            </div>
        );
    }

    // Default video tag for direct files
    return (
        <div className="aspect-video bg-black rounded-2xl overflow-hidden border-2 border-black shadow-[4px_4px_0px_0px_#000]">
            <video 
                controls 
                poster={thumbnail}
                className="w-full h-full"
            >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
}
