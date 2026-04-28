"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  Video, 
  Settings, 
  Layout, 
  BarChart, 
  Plus, 
  CheckCircle, 
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
  RefreshCw,
  Lightbulb,
  Bell,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getCourses, updateCoursePrice, Course } from "@/app/actions/courses";
import { getPendingCourses, approveCourse, rejectCourse, getSystemStats } from "@/app/actions/admin";
import { DuelsManager } from "@/components/admin/DuelsManager"; 
import { ToolsManager } from "@/components/admin/ToolsManager"; 
import { IdeasManager } from "@/components/super-admin/IdeasManager";
import { ExpertReviewsManager } from "@/components/super-admin/ExpertReviewsManager";
import NewsletterAdmin from "@/app/superadmin/newsletter/page";

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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  /* 
     Shared Helper Functions 
  */
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

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
        if (activeTab === 'dash') {
            const systemStats = await getSystemStats();
            const ideaRes = await fetch("/api/admin/ideas");
            const ideas = await ideaRes.json();
            setStats({ ...systemStats, ideaCount: Array.isArray(ideas) ? ideas.length : 0 });
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

  /* 
     Effects
  */
  useEffect(() => {
    fetchInitialData();
  }, [activeTab, contentType]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12 relative font-plus-jakarta">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 mb-8 sticky top-0 z-30">
        <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                    <Layout className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h2 className="text-lg font-black tracking-tight leading-none uppercase">Designhunt.</h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Admin Control Center</p>
                </div>
            </div>
            
            <div className="flex items-center gap-4">
                <div className="hidden md:block text-right">
                    <p className="text-sm font-black uppercase tracking-tighter">System Status</p>
                    <p className="text-[10px] font-bold text-green-500 uppercase flex items-center justify-end gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Operational
                    </p>
                </div>
            </div>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-6">

      <div className={cn(
        "grid transition-all duration-300 gap-10",
        isSidebarCollapsed ? "lg:grid-cols-[80px_1fr]" : "lg:grid-cols-[280px_1fr]"
      )}>
        
        {/* Sidebar */}
        <aside className="space-y-1 sticky top-24 self-start h-[calc(100vh-120px)] overflow-y-auto pr-2 scrollbar-hide">
           <div className={cn("px-4 mb-6 flex items-center justify-between", isSidebarCollapsed && "px-2 justify-center")}>
                {!isSidebarCollapsed && <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Management</p>}
                <button 
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
                  title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                >
                  {isSidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
                </button>
           </div>

           <AdminSidebarItem 
            icon={BarChart} 
            label="Overview" 
            active={activeTab === "dash"} 
            collapsed={isSidebarCollapsed}
            onClick={() => setActiveTab("dash")} 
          />
          <AdminSidebarItem 
            icon={Trophy} 
            label="Daily Duels" 
            active={activeTab === "duels"} 
            collapsed={isSidebarCollapsed}
            onClick={() => setActiveTab("duels")} 
          />
          <AdminSidebarItem 
            icon={Hammer} 
            label="Tools Manager" 
            active={activeTab === "tools"} 
            collapsed={isSidebarCollapsed}
            onClick={() => setActiveTab("tools")} 
          />
          <AdminSidebarItem 
            icon={Lightbulb} 
            label="Inquiries" 
            active={activeTab === "ideas"} 
            collapsed={isSidebarCollapsed}
            onClick={() => setActiveTab("ideas")} 
          />
          <AdminSidebarItem 
            icon={Edit2} 
            label="Expert Reviews" 
            active={activeTab === "reviews"} 
            collapsed={isSidebarCollapsed}
            onClick={() => setActiveTab("reviews")} 
          />
          <AdminSidebarItem 
            icon={Globe} 
            label="Newsletter" 
            active={activeTab === "newsletter"} 
            collapsed={isSidebarCollapsed}
            onClick={() => setActiveTab("newsletter")} 
          />

          <div className="pt-8 px-4 mt-8 border-t border-gray-100">
            {!isSidebarCollapsed && <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">System</p>}
            <button 
                onClick={() => window.location.href = '/api/auth/logout'}
                className={cn(
                  "w-full flex items-center gap-3 py-3 rounded-xl font-bold text-sm transition-all text-left text-red-500 hover:bg-red-50",
                  isSidebarCollapsed ? "px-0 justify-center" : "px-4"
                )}
                title="Sign Out"
            >
                <LogOut className="w-4 h-4" />
                {!isSidebarCollapsed && <span>Sign Out</span>}
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="min-w-0">
          <header className="mb-10">
            <h1 className="text-4xl font-black uppercase tracking-tight italic">
                {activeTab === 'dash' ? 'Overview' : 
                 activeTab === 'duels' ? 'Daily Duels' : 
                 activeTab === 'tools' ? 'Tools' : 
                 activeTab === 'ideas' ? 'Inquiries' : 
                 activeTab === 'reviews' ? 'Reviews' : 
                 activeTab === 'newsletter' ? 'Newsletter' : 'Manage'}
            </h1>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">
                {activeTab === 'dash' ? 'Real-time platform metrics and status' : 'Manage your platform content and users'}
            </p>
          </header>

          {activeTab === 'dash' && stats && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                  <StatCard label="Platform Users" value={stats.totalUsers} icon={Monitor} color="bg-blue-500" />
              </div>
          )}

          {activeTab === 'newsletter' && (
              <NewsletterAdmin />
          )}

          {activeTab === 'duels' && (
              <DuelsManager />
          )}

          {activeTab === 'tools' && (
              <ToolsManager />
          )}

          {activeTab === 'ideas' && (
              <IdeasManager isAdmin={true} />
          )}

          {activeTab === 'reviews' && (
              <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                <ExpertReviewsManager isAdmin={true} />
              </div>
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
    </div>
  );
}

function AdminSidebarItem({ icon: Icon, label, active, onClick, collapsed }: any) {
    return (
        <button 
            onClick={onClick}
            title={collapsed ? label : undefined}
            className={cn(
                "w-full flex items-center gap-3 py-3 rounded-xl font-bold transition-all text-left group relative",
                active ? "bg-black text-white" : "hover:bg-white text-gray-400 hover:text-black",
                collapsed ? "px-0 justify-center" : "px-4"
            )}
        >
            <Icon className={cn("w-5 h-5 transition-transform group-hover:scale-110 flex-shrink-0", active ? "text-white" : "text-gray-400 group-hover:text-black")} />
            {!collapsed && <span className="text-sm tracking-tight truncate">{label}</span>}
            {active && (
                <motion.div 
                    layoutId="active-pill"
                    className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full"
                />
            )}
        </button>
    );
}

function StatCard({ label, value, icon: Icon, color, onClick }: any) {
    return (
        <motion.div 
            whileHover={{ y: -4 }}
            onClick={onClick}
            className={cn(
                "p-6 bg-white border border-gray-100 rounded-[28px] shadow-sm flex flex-col gap-4 relative overflow-hidden group",
                onClick && "cursor-pointer"
            )}
        >
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-6", color)}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            
            <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">{label}</p>
                <h4 className="text-3xl font-black tracking-tight">{value}</h4>
            </div>

            <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-full -translate-y-1/2 translate-x-1/2 -z-10 group-hover:scale-110 transition-transform" />
        </motion.div>
    );
}
