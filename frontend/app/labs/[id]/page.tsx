"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  FlaskConical, 
  Users, 
  MousePointer2, 
  Square, 
  Circle, 
  Type, 
  Download, 
  Share2, 
  ArrowLeft,
  Settings,
  X,
  Plus,
  Trash2,
  Undo2,
  Layers,
  Palette
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

interface Element {
  id: string;
  type: "rect" | "circle" | "text";
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  text?: string;
  fill: string;
}

export default function LabRoomPage() {
  const { id } = useParams();
  const router = useRouter();
  const [lab, setLab] = useState<any>(null);
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedTool, setSelectedTool] = useState<Element["type"] | "select">("select");
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [currentColor, setCurrentColor] = useState("#FFCF0D");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetchLab();
    // In a real app, setup WebSocket/Ably/Supabase Realtime here
    const interval = setInterval(fetchLab, 5000); // Polling as a fallback
    return () => clearInterval(interval);
  }, [id]);

  const fetchLab = async () => {
    try {
      const res = await fetch(`/api/labs/${id}`);
      const data = await res.json();
      setLab(data);
      if (data.canvas_state && data.canvas_state.elements) {
        setElements(data.canvas_state.elements);
      }
    } catch (error) {
      console.error("Failed to fetch lab:", error);
    }
  };

  const saveCanvas = async (newElements: Element[]) => {
    try {
      await fetch(`/api/labs/${id}/canvas`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ canvas_state: { elements: newElements } }),
      });
    } catch (error) {
      console.error("Failed to save canvas:", error);
    }
  };

  const handleSvgMouseDown = (e: React.MouseEvent) => {
    if (selectedTool === "select") return;

    const svg = svgRef.current;
    if (!svg) return;

    const CTM = svg.getScreenCTM();
    if (!CTM) return;

    const x = (e.clientX - CTM.e) / CTM.a;
    const y = (e.clientY - CTM.f) / CTM.d;

    const newElement: Element = {
      id: Math.random().toString(36).substr(2, 9),
      type: selectedTool as any,
      x,
      y,
      fill: currentColor,
    };

    if (selectedTool === "rect") {
      newElement.width = 100;
      newElement.height = 100;
    } else if (selectedTool === "circle") {
      newElement.radius = 50;
    } else if (selectedTool === "text") {
      newElement.text = "New Text";
    }

    const updatedElements = [...elements, newElement];
    setElements(updatedElements);
    setSelectedElementId(newElement.id);
    setSelectedTool("select");
    saveCanvas(updatedElements);
  };

  const deleteElement = (elementId: string) => {
    const updated = elements.filter(el => el.id !== elementId);
    setElements(updated);
    setSelectedElementId(null);
    saveCanvas(updated);
  };

  if (!lab) return <div className="h-screen bg-[#FDFBD4] flex items-center justify-center font-black text-4xl animate-pulse">LOADING LAB...</div>;

  return (
    <div className="h-screen flex flex-col bg-[#FDFBD4] overflow-hidden">
      {/* Top Bar */}
      <header className="h-16 border-b-4 border-black bg-white flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-6">
          <Link href="/labs" className="hover:bg-black/5 p-2 transition-colors">
            <ArrowLeft className="w-8 h-8" />
          </Link>
          <div className="flex flex-col">
            <h1 className="text-2xl font-black uppercase tracking-tight">{lab.title}</h1>
            <div className="flex items-center gap-2 text-[10px] font-black opacity-40 uppercase">
                <FlaskConical className="w-3 h-3" /> DESIGN LABORATORY V1.0
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
            <div className="flex -space-x-3 hover:translate-x-2 transition-transform mr-4 cursor-help">
                {lab.members.map((m: string, i: number) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-[#FFCF0D] flex items-center justify-center font-black text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        {m.substr(0, 1).toUpperCase()}
                    </div>
                ))}
            </div>
            <button className="bg-[#FFCF0D] border-4 border-black px-4 py-2 font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2">
                <Share2 className="w-5 h-5" /> SHARE
            </button>
            <button className="bg-black text-white border-4 border-black px-4 py-2 font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                EXPORT
            </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Toolbar (Floating center bottom) */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-white border-4 border-black p-3 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            {[
                { id: "select", icon: MousePointer2, label: "Select" },
                { id: "rect", icon: Square, label: "Rectangle" },
                { id: "circle", icon: Circle, label: "Circle" },
                { id: "text", icon: Type, label: "Text" },
            ].map((tool) => (
                <button 
                    key={tool.id}
                    onClick={() => setSelectedTool(tool.id as any)}
                    className={`p-3 border-4 transition-all ${selectedTool === tool.id ? 'bg-[#FFCF0D] border-black' : 'border-transparent hover:bg-black/5'}`}
                    title={tool.label}
                >
                    <tool.icon className="w-6 h-6" />
                </button>
            ))}
            <div className="w-[4px] h-8 bg-black/10 mx-2" />
            <button 
                className="p-3 hover:bg-black/5 transition-all text-red-500" 
                onClick={() => selectedElementId && deleteElement(selectedElementId)}
                disabled={!selectedElementId}
            >
                <Trash2 className="w-6 h-6" />
            </button>
            <button className="p-3 hover:bg-black/5 transition-all">
                <Undo2 className="w-6 h-6" />
            </button>
        </div>

        {/* Left Sidebar - Properties */}
        {isSidebarOpen && (
            <aside className="w-80 border-r-4 border-black bg-white flex flex-col p-6 z-40 overflow-y-auto">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-2">
                         <Layers className="w-5 h-5" /> Inspector
                    </h2>
                    <button onClick={() => setIsSidebarOpen(false)}><X className="w-6 h-6" /></button>
                </div>

                {selectedElementId ? (
                    <div className="space-y-8 animate-in slide-in-from-left duration-200">
                        <div>
                            <label className="block font-black text-xs uppercase opacity-40 mb-2 tracking-widest">Selected Object</label>
                            <div className="bg-[#222222] text-white p-3 font-mono text-xs font-bold">
                                ID: {selectedElementId}
                            </div>
                        </div>

                        <div>
                            <label className="block font-black text-xs uppercase opacity-40 mb-4 tracking-widest">Color Swatches</label>
                            <div className="grid grid-cols-4 gap-3">
                                {["#FF3B30", "#FF9500", "#FFCF0D", "#4CD964", "#5AC8FA", "#007AFF", "#222222", "#FFFFFF"].map(c => (
                                    <button 
                                        key={c}
                                        onClick={() => {
                                            setCurrentColor(c);
                                            const updated = elements.map(el => el.id === selectedElementId ? { ...el, fill: c } : el);
                                            setElements(updated);
                                            saveCanvas(updated);
                                        }}
                                        className={`w-full aspect-square border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:scale-110 transition-transform ${c === currentColor ? 'scale-110 ring-2 ring-black ring-offset-2' : ''}`}
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="pt-8 border-t-2 border-dashed border-black/10">
                             <div className="flex items-center gap-2 font-black text-xs uppercase opacity-40 mb-4 tracking-widest">
                                <Palette className="w-4 h-4" /> Layout Controls
                             </div>
                             <div className="space-y-4">
                                <div className="flex justify-between items-center bg-black/5 p-3 font-black text-sm">
                                    <span>ORDER</span>
                                    <div className="flex gap-2">
                                        <button className="px-2 py-1 bg-white border-2 border-black hover:bg-[#FFCF0D] transition-colors">BRING FORWARD</button>
                                    </div>
                                </div>
                             </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center opacity-20 text-center uppercase font-black">
                        <MousePointer2 className="w-12 h-12 mb-4" />
                        Select an element<br/>to inspect
                    </div>
                )}
            </aside>
        )}

        {/* Main Canvas Area */}
        <main className="flex-1 overflow-hidden relative bg-[#E5E5E5]">
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 z-0" style={{ 
                backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', 
                backgroundSize: '30px 30px',
                opacity: 0.1
            }} />
            
            <svg 
                ref={svgRef}
                className="w-full h-full relative z-10 cursor-crosshair"
                onMouseDown={handleSvgMouseDown}
            >
                {elements.map((el) => {
                    const isSelected = selectedElementId === el.id;
                    const props = {
                        key: el.id,
                        fill: el.fill,
                        stroke: isSelected ? "black" : "none",
                        strokeWidth: isSelected ? 4 : 0,
                        onClick: (e: React.MouseEvent) => {
                            e.stopPropagation();
                            setSelectedElementId(el.id);
                            setCurrentColor(el.fill);
                        },
                        className: "cursor-pointer transition-all duration-200"
                    };

                    if (el.type === "rect") {
                        return <rect x={el.x} y={el.y} width={el.width} height={el.height} {...props} />;
                    } else if (el.type === "circle") {
                        return <circle cx={el.x} cy={el.y} r={el.radius} {...props} />;
                    } else if (el.type === "text") {
                        return (
                            <text 
                                x={el.x} 
                                y={el.y} 
                                {...props} 
                                fontSize="24" 
                                fontWeight="900" 
                                fontFamily="system-ui"
                            >
                                {el.text}
                            </text>
                        );
                    }
                    return null;
                })}
            </svg>
        </main>
      </div>

      {/* Floating Status Bar */}
      <div className="h-8 bg-black text-white px-4 flex items-center justify-between text-[10px] font-black uppercase tracking-widest z-50">
          <div className="flex items-center gap-4">
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> LIVE SYNC ACTIVE</span>
              <span className="opacity-40">ROOM ID: {id}</span>
          </div>
          <div className="flex items-center gap-4">
              <span>{elements.length} OBJECTS ON CANVAS</span>
              <span className="opacity-40">COORD: 0, 0</span>
          </div>
      </div>
    </div>
  );
}
