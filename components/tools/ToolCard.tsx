import { ExternalLink, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

interface ToolCardProps {
  name: string;
  category: string;
  description: string;
  url: string;
  icon?: ReactNode;
  color?: string; // Tailwind bg color class
  pricing: "Free" | "Freemium" | "Premium";
}

export function ToolCard({ name, category, description, url, icon, color = "bg-black", pricing }: ToolCardProps) {
  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="group flex flex-col p-6 bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_#000] hover:shadow-[8px_8px_0px_0px_#000] hover:-translate-y-1 transition-all h-full"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl border-2 border-black flex items-center justify-center text-white ${color}`}>
            {icon || <span className="font-bold text-lg">{name.substring(0,2)}</span>}
        </div>
        <div className="flex flex-col items-end gap-1">
            <div className="bg-gray-100 border border-black px-2 py-1 rounded-md text-xs font-bold whitespace-nowrap">
                {category}
            </div>
            <div className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-black border border-black ${
                pricing === 'Free' ? 'bg-green-100 text-green-700' :
                pricing === 'Freemium' ? 'bg-blue-100 text-blue-700' :
                'bg-purple-100 text-purple-700'
            }`}>
                {pricing}
            </div>
        </div>
      </div>

      <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
        {name} 
        <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" />
      </h3>
      <p className="text-sm text-gray-600 mb-6 flex-grow">
        {description}
      </p>

      <div className="mt-auto font-bold text-sm text-center py-2 border-2 border-black rounded-lg group-hover:bg-black group-hover:text-white transition-colors">
        Visit Website
      </div>
    </a>
  );
}
