"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  Video, 
  Settings, 
  Layout, 
  Copy, // Added this
  BarChart, 
  Plus, 
  CheckCircle, 
  ShieldCheck, // Added this
  Clock,
  Trash2,
  Edit,
  Search,
  DollarSign,
  Play,
  Monitor,
  Check,
  XCircle,
  ExternalLink,
  Edit2,
  Save,
  Globe,
  Trophy, 
  Hammer,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getCourses, updateCoursePrice, Course } from "@/app/actions/courses";
import { getPendingCourses, approveCourse, rejectCourse, getSystemStats } from "@/app/actions/admin";
import { DuelsManager } from "@/components/admin/DuelsManager"; 
import { ToolsManager } from "@/components/admin/ToolsManager"; 

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("courses");
  const [uploading, setUploading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [content, setContent] = useState<any[]>([]);
  const [pendingCourses, setPendingCourses] = useState<any[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [contentType, setContentType] = useState('tools');
  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [accessCode, setAccessCode] = useState<string | null>(null);
  const [showCode, setShowCode] = useState(true);
  const [minimized, setMinimized] = useState(false);
  const [timer, setTimer] = useState(60); // Start with 1 minute for current code
  const [phase, setPhase] = useState<'current' | 'next'>('current');

  /* 
     Shared Helper Functions 
  */
  const [rotating, setRotating] = useState(false);

  const handleApproveCourse = async (id: string) => {
    const res = await approveCourse(id);
    if (res.success) {
        setPendingCourses(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleRejectCourse = async (id: string) => {
    const res = await rejectCourse(id);
    if (res.success) {
        setPendingCourses(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleEditPrice = (id: string, currentPrice: string) => {
      setEditingPrice(id);
      setTempPrice(currentPrice);
  };

  const handleSavePrice = async (id: string) => {
      await updateCoursePrice(id, tempPrice);
      setAllCourses(prev => prev.map(c => c.id === id ? { ...c, price: tempPrice } : c));
      setEditingPrice(null);
  };

  const handleRotateCode = async () => {
    setRotating(true);
    try {
      const res = await fetch("http://localhost:5000/api/admin/rotate-access-code", {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        setAccessCode(data.code);
        setPhase('next');
        setTimer(300); // 5 minutes for next code
      }
    } catch (err) {
      console.error("Failed to rotate access code");
    } finally {
      setRotating(false);
    }
  };
  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
        if (activeTab === 'dash') {
            const systemStats = await getSystemStats();
            setStats(systemStats);
        } else if (activeTab === 'courses') {
            const data = await getPendingCourses();
            setPendingCourses(data);
        } else if (activeTab === 'pricing') {
            const data = await getCourses();
            setAllCourses(data);
        } else if (activeTab === 'content') {
            const res = await fetch(`/api/admin/content?type=${contentType}`);
            const data = await res.json();
            setContent(data);
        }
    } catch (err) {
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  };

  const fetchAccessCode = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/code");
      const data = await res.json();
      if (data.code) {
        setAccessCode(data.code);
        // Auto-minimize after 10 seconds
        setTimeout(() => setMinimized(true), 10000);
      }
    } catch (err) {
      console.error("Failed to fetch access code");
    }
  };

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (accessCode) {
      navigator.clipboard.writeText(accessCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  /* 
     Effects
  */
  useEffect(() => {
    fetchInitialData();
    fetchAccessCode();
  }, [activeTab, contentType]);

  useEffect(() => {
    if (timer > 0 && showCode) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      if (phase === 'current') {
        handleRotateCode();
      } else {
        setShowCode(false);
      }
    }
  }, [timer, showCode, phase]);

  return (
    <div className="container mx-auto px-4 pt-32 md:pt-40 pb-12 relative">
      <AnimatePresence>
        {showCode && accessCode && (
           <motion.div
             layout
             initial={{ scale: 0.9, opacity: 0, y: 20, x: "-50%" }}
             animate={minimized ? 
                { scale: 0.8, opacity: 1, x: 0, y: 0, top: 20, right: 20, left: "auto", position: "fixed", zIndex: 100 } : 
                { scale: 1, opacity: 1, x: "-50%", y: "-50%", top: "40%", left: "50%", position: "fixed", zIndex: 100 }
             }
             exit={{ opacity: 0, scale: 0.8 }}
             className={cn(
                "bg-[#050505] text-white border-2 border-white/20 shadow-2xl cursor-default overflow-hidden transition-all backdrop-blur-xl",
                minimized ? "rounded-xl p-3 w-auto flex items-center gap-4 cursor-pointer hover:border-accent-yellow" : "rounded-2xl p-6 w-[90vw] max-w-sm text-center"
             )}
             onClick={() => minimized && setMinimized(false)}
           >
              {!minimized ? (
                  <div className="relative">


                      <div className="space-y-4">
                          <div className="flex justify-center">
                             <div className={cn(
                                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-2",
                                phase === 'current' ? "bg-accent-yellow/10 text-accent-yellow border-accent-yellow/20" : "bg-red-500/10 text-red-500 border-red-500/20"
                             )}>
                                <ShieldCheck className="w-3 h-3" /> {phase === 'current' ? 'Rotating Soon' : 'Save For Next Login'}
                             </div>
                          </div>
                          
                          <div>
                              <p className="text-gray-400 font-bold text-xs uppercase mb-2">
                                {phase === 'current' ? 'Current Access Code' : 'Your Next Access Code'}
                              </p>
                              <div className="bg-white/5 p-2 rounded-xl border-2 border-dashed border-white/10 group hover:border-accent-yellow/50 transition-colors flex items-center justify-between pl-4">
                                  <code className="text-2xl font-mono font-black tracking-widest text-accent-yellow select-all">
                                    {accessCode}
                                  </code>
                                  <div className="flex items-center gap-2 ml-2">
                                      <button 
                                        onClick={handleCopy}
                                        className="p-3 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all shadow-inner"
                                        title="Copy Code"
                                      >
                                        {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                                      </button>
                                  </div>
                              </div>
                          </div>

                          <div className="text-[10px] font-bold text-gray-600 uppercase flex justify-center gap-4">
                             <span className={cn(phase === 'current' && "text-accent-yellow animate-pulse")}>
                                {phase === 'current' ? 'Rotating in' : 'Expires in'} {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                             </span>
                             <span className="text-gray-700 mx-1">|</span>
                             <button 
                                onClick={() => setMinimized(true)} 
                                className="hover:text-white underline transition-colors"
                             >
                                Minimize
                             </button>
                          </div>
                      </div>
                  </div>
              ) : (
                  <>
                      <div className="w-8 h-8 bg-accent-yellow rounded flex items-center justify-center text-black font-black text-[10px]">
                          {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                      </div>
                      <div className="text-left">
                          <p className="text-[8px] font-bold uppercase text-gray-500 leading-none mb-1">
                             {phase === 'current' ? 'Current Code' : 'Next Code'}
                          </p>
                          <code className="font-mono font-bold text-sm text-white leading-none">{accessCode}</code>
                      </div>

                  </>
              )}
           </motion.div>
        )}
      </AnimatePresence>
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar */}
        <aside className="lg:w-64 space-y-2">
           <AdminSidebarItem 
            icon={Layout} 
            label="Dashboard" 
            active={activeTab === "dash"} 
            onClick={() => setActiveTab("dash")} 
          />
          {/* <AdminSidebarItem 
            icon={Video} 
            label="Course Queue" 
            active={activeTab === "courses"} 
            onClick={() => setActiveTab("courses")} 
          />
          <AdminSidebarItem 
            icon={DollarSign} 
            label="Pricing" 
            active={activeTab === "pricing"} 
            onClick={() => setActiveTab("pricing")} 
          />
          <AdminSidebarItem 
            icon={Settings} 
            label="Library" 
            active={activeTab === "content"} 
            onClick={() => setActiveTab("content")} 
          /> */}
          <AdminSidebarItem 
            icon={Trophy} 
            label="Daily Duels" 
            active={activeTab === "duels"} 
            onClick={() => setActiveTab("duels")} 
          />
          <AdminSidebarItem 
            icon={Hammer} 
            label="Tools" 
            active={activeTab === "tools"} 
            onClick={() => setActiveTab("tools")} 
          />
          <div className="pt-8 border-t border-gray-100 mt-auto">
            <button 
                onClick={() => window.location.href = '/api/auth/logout'}
                className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-black uppercase text-sm transition-all text-left text-red-500 hover:bg-red-50"
            >
                <Trash2 className="w-5 h-5" />
                Logout
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-black uppercase tracking-tighter">
                {activeTab === 'dash' ? 'Admin Hub' : 
                 activeTab === 'courses' ? 'Review Queue' : 
                 activeTab === 'pricing' ? 'Pricing Control' : 
                 activeTab === 'duels' ? 'Duel Arena' : 
                 activeTab === 'tools' ? 'Tools Manager' : 'Library'}
            </h1>
          </div>

          {activeTab === 'dash' && stats && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <StatCard label="Total Users" value={stats.totalUsers} icon={Monitor} color="bg-accent-blue" />
                  <StatCard label="Trainers" value={stats.totalTrainers} icon={Video} color="bg-accent-pink" />
                  <StatCard label="Pending Review" value={stats.pendingVerifications} icon={Clock} color="bg-accent-yellow" />
                  <StatCard label="Status" value="OK" icon={CheckCircle} color="bg-green-400" />
              </div>
          )}

          {activeTab === 'duels' && (
              <DuelsManager />
          )}

          {activeTab === 'tools' && (
              <ToolsManager />
          )}

          {activeTab === 'courses' && (
              <div className="space-y-6">
                 <AnimatePresence mode="popLayout">
                    {pendingCourses.length > 0 ? (
                        pendingCourses.map((course) => (
                            <motion.div 
                                key={course.id}
                                layout
                                className="p-8 bg-white border-2 border-black rounded-[32px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col lg:flex-row items-center gap-8 hover:bg-gray-50 transition-colors"
                            >
                                <div className="w-full lg:w-48 aspect-video bg-black rounded-2xl overflow-hidden border-2 border-black flex-shrink-0 relative group">
                                    <img src={course.thumbnail} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Play className="w-10 h-10 text-white drop-shadow-lg" />
                                    </div>
                                </div>

                                <div className="flex-1 space-y-2">
                                    <h3 className="text-2xl font-black tracking-tighter">{course.title}</h3>
                                    <p className="text-gray-500 text-sm font-medium line-clamp-2">{course.description}</p>
                                    <div className="pt-2 flex items-center gap-4">
                                        <span className="text-xs font-black uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full border border-black/5">{course.instructor_name}</span>
                                        <a href={course.video_url} target="_blank" className="text-xs font-black text-accent-blue underline flex items-center gap-1">
                                            <ExternalLink className="w-3 h-3" /> WATCH VIDEO
                                        </a>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 w-full lg:w-auto">
                                    <button 
                                        onClick={() => handleApproveCourse(course.id)}
                                        className="w-full lg:w-40 py-3 bg-green-500 text-white border-2 border-black rounded-xl font-black text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
                                    >
                                        APPROVE
                                    </button>
                                    <button 
                                        onClick={() => handleRejectCourse(course.id)}
                                        className="w-full lg:w-40 py-3 bg-white text-red-500 border-2 border-red-500 rounded-xl font-black text-sm hover:bg-red-50 transition-all uppercase"
                                    >
                                        REJECT
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="p-20 text-center border-4 border-dashed border-gray-100 rounded-[32px]">
                            <h3 className="text-2xl font-black tracking-tighter italic text-gray-300">Queue is Clear!</h3>
                            <p className="text-gray-400 font-bold uppercase text-xs tracking-widest mt-2">No courses waiting for review.</p>
                        </div>
                    )}
                 </AnimatePresence>
              </div>
          )}

          {activeTab === 'pricing' && (
              <div className="bg-white border-2 border-black rounded-[32px] overflow-hidden shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                  <div className="overflow-x-auto">
                      <table className="w-full text-left">
                          <thead className="bg-gray-50 border-b-2 border-gray-100">
                              <tr>
                                  <th className="p-6 font-black uppercase text-xs tracking-widest text-gray-400">Course</th>
                                  <th className="p-6 font-black uppercase text-xs tracking-widest text-gray-400">Instructor</th>
                                  <th className="p-6 font-black uppercase text-xs tracking-widest text-gray-400">Price</th>
                                  <th className="p-6 font-black uppercase text-xs tracking-widest text-gray-400 text-right">Action</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                              {allCourses.map((course) => (
                                  <tr key={course.id} className="hover:bg-gray-50 transition-colors group">
                                      <td className="p-6">
                                          <h3 className="font-bold text-base">{course.title}</h3>
                                          <span className="text-xs text-gray-400 font-mono italic">{course.id}</span>
                                      </td>
                                      <td className="p-6 font-medium text-sm">{course.instructor_name}</td>
                                      <td className="p-6">
                                          {editingPrice === course.id ? (
                                              <input 
                                                  type="text" 
                                                  value={tempPrice}
                                                  onChange={(e) => setTempPrice(e.target.value)}
                                                  className="w-24 px-3 py-2 border-2 border-black rounded-lg font-bold text-sm"
                                                  autoFocus
                                              />
                                          ) : (
                                              <span className={`px-3 py-1 rounded-full text-sm font-bold border-2 ${course.price === 'Free' ? 'bg-green-100 border-green-200' : 'bg-white border-black'}`}>
                                                  {course.price}
                                              </span>
                                          )}
                                      </td>
                                      <td className="p-6 text-right">
                                          {editingPrice === course.id ? (
                                              <button onClick={() => handleSavePrice(course.id)} className="px-4 py-2 bg-black text-white rounded-lg font-bold text-xs"><Save className="w-3 h-3" /></button>
                                          ) : (
                                              <button onClick={() => handleEditPrice(course.id, course.price)} className="px-4 py-2 hover:bg-black hover:text-white transition-colors rounded-lg font-bold text-xs border-2 border-black">EDIT</button>
                                          )}
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>
          )}

          {activeTab === 'content' && (
             <div className="space-y-6">
                <div className="flex gap-2">
                    {['tools', 'challenges'].map(type => (
                        <button 
                            key={type}
                            onClick={() => setContentType(type)}
                            className={`px-6 py-2 rounded-xl font-black uppercase text-sm border-2 border-black transition-all ${contentType === type ? 'bg-black text-white' : 'bg-white'}`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
                <div className="grid gap-4">
                    {content.map((item, i) => (
                        <div key={i} className="p-6 bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between group">
                            <div>
                                <h3 className="font-black text-lg">{item.name || item.title}</h3>
                                <p className="text-xs text-gray-400 font-bold uppercase">{contentType}</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 hover:bg-accent-blue hover:text-white rounded-lg border-2 border-transparent hover:border-black transition-all"><Edit2 className="w-4 h-4" /></button>
                                <button className="p-2 hover:bg-red-500 hover:text-white rounded-lg border-2 border-transparent hover:border-black transition-all"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                    ))}
                </div>
             </div>
          )}
        </main>

      </div>
    </div>
  );
}

function AdminSidebarItem({ icon: Icon, label, active, onClick }: any) {
    return (
        <button 
            onClick={onClick}
            className={cn(
                "w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-black uppercase text-sm transition-all text-left border-2 border-transparent",
                active ? "bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "hover:bg-gray-100 text-gray-500"
            )}
        >
            <Icon className="w-5 h-5" />
            {label}
        </button>
    );
}

function StatCard({ label, value, icon: Icon, color }: any) {
    return (
        <div className="p-8 bg-white border-2 border-black rounded-[32px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-l-[12px] border-l-black">
            <div className={`w-12 h-12 ${color} rounded-2xl border-2 border-black flex items-center justify-center mb-6`}>
                <Icon className="w-6 h-6" />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{label}</h4>
            <div className="text-3xl font-black tracking-tighter">{value}</div>
        </div>
    );
}
