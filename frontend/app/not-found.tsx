
import Link from 'next/link';
import { SnakeGame } from '@/components/ui/SnakeGame';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 relative overflow-hidden pt-32 md:pt-40">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative z-10 flex flex-col items-center max-w-4xl w-full">
            <div className="text-center mb-12 relative">
                <h1 className="text-[12rem] font-black tracking-tighter mb-0 opacity-5 select-none leading-none">404</h1>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
                    <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tight drop-shadow-sm">
                        Lost in the <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue via-purple-500 to-accent-pink">Void?</span>
                    </h2>
                </div>
                <p className="text-xl text-gray-600 font-medium max-w-lg mx-auto mt-8 relative z-10">
                    The page you're looking for has vanished. While you're here, why not set a new high score?
                </p>
            </div>

            <SnakeGame />

            <div className="mt-12 flex gap-4">
                <Link 
                    href="/"
                    className="flex items-center gap-2 bg-black text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:-translate-y-1 hover:shadow-lg transition-all"
                >
                    <Home className="w-5 h-5" /> Return Home
                </Link>
                <Link 
                    href="/library"
                    className="flex items-center gap-2 bg-white text-black border-2 border-black px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:-translate-y-1 hover:bg-gray-50 transition-all"
                >
                    <ArrowLeft className="w-5 h-5" /> Back to Library
                </Link>
            </div>
        </div>
    </div>
  );
}
