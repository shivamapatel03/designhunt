"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  UserCheck, 
  XCircle, 
  ExternalLink, 
  Mail, 
  Briefcase,
  Search,
  Check,
  MoreVertical,
  Globe,
  Monitor,
  CheckCircle2,
  Users,
  Shield,
  Trash2,
  BarChart,
  Video,
  DollarSign,
  Settings,
  Plus,
  Play,
  Save,
  Edit2
} from "lucide-react";

import { 
  approveTutorRequest, 
  declineTutorRequest, 
  getSystemStats, 
  updateTutorStage, 
  updateUserRole,
  getPendingCourses,
  approveCourse,
  rejectCourse
} from "@/app/actions/admin";
import { getCourses, updateCoursePrice, Course } from "@/app/actions/courses";

export default function SuperAdminPage() {
  const [activeTab, setActiveTab] = useState<'verifications' | 'users' | 'moderation' | 'pricing' | 'library' | 'stats'>('verifications');
  const [approvedTutor, setApprovedTutor] = useState<{ email: string, tempPassword: string } | null>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [pendingCourses, setPendingCourses] = useState<any[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [content, setContent] = useState<any[]>([]);
  const [contentType, setContentType] = useState('tools');
  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
      totalUsers: 0,
      activeUsers: 0,
      totalTrainers: 0,
      pendingVerifications: 0
  });

  useEffect(() => {
    fetchInitialData();
  }, [activeTab, contentType]);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
        if (activeTab === 'verifications') {
            const res = await fetch("/api/tutor/requests");
            const data = await res.json();
            setRequests(Array.isArray(data) ? data.filter((r: any) => r.status === 'PENDING') : []);
        } else if (activeTab === 'users') {
            const res = await fetch("/api/admin/users");
            const data = await res.json();
            setAllUsers(data);
        } else if (activeTab === 'moderation') {
            const data = await getPendingCourses();
            setPendingCourses(data);
        } else if (activeTab === 'pricing') {
            const data = await getCourses();
            setAllCourses(data);
        } else if (activeTab === 'library') {
            const res = await fetch(`/api/admin/content?type=${contentType}`);
            const data = await res.json();
            setContent(data);
        }
        
        const systemStats = await getSystemStats();
        setStats(systemStats);
    } catch (err) {
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  };

  const handleApproveRequest = async (id: string) => {
    const res = (await approveTutorRequest(id)) as any;
    if (res.success) {
        setRequests(prev => prev.filter(r => r.id !== id));
        if (res.tempPassword) {
            setApprovedTutor({ email: res.email, tempPassword: res.tempPassword });
        }
    }
  };

  const handleDeclineRequest = async (id: string) => {
    const res = await declineTutorRequest(id);
    if (res.success) {
        setRequests(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleUpdateStage = async (id: string, stage: string) => {
    const res = await updateTutorStage(id, stage);
    if (res.success) {
        setRequests(prev => prev.map(r => r.id === id ? { ...r, stage } : r));
    }
  };

  const handleRoleUpdate = async (userId: string, newRole: string) => {
      const res = await updateUserRole(userId, newRole);
      if (res.success) {
          setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      }
  };

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

  return (
    <div className="container mx-auto px-4 pt-32 md:pt-40 pb-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-8 h-8 text-accent-blue" />
                <h1 className="text-4xl font-black uppercase tracking-tighter">Master Hub</h1>
            </div>
            <p className="text-gray-500 font-bold uppercase text-sm tracking-widest italic">Global Platform Administrator</p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-wrap gap-2">
            {[
                { id: 'verifications', label: 'Vetting', icon: Shield },
                { id: 'users', label: 'Users', icon: Users },
                { id: 'moderation', label: 'Moderation', icon: Video },
                { id: 'pricing', label: 'Pricing', icon: DollarSign },
                { id: 'library', label: 'Library', icon: Settings },
                { id: 'stats', label: 'System', icon: BarChart }
            ].map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-6 py-2 rounded-xl font-black text-xs uppercase transition-all border-2 border-black ${
                        activeTab === tab.id ? 'bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-white text-black hover:bg-gray-50'
                    }`}
                >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                </button>
            ))}
            </div>
            
            <button
                onClick={() => window.location.href = '/api/auth/logout'}
                className="flex items-center gap-2 px-6 py-2 rounded-xl font-black text-xs uppercase transition-all bg-red-50 text-red-600 hover:bg-red-100 border-2 border-transparent hover:border-red-200 ml-2"
            >
                <XCircle className="w-4 h-4" />
                Logout
            </button>
          </div>
        </div>

        {/* Governance: Vetting */}
        {activeTab === 'verifications' && (
            <div className="space-y-12">
                {approvedTutor && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-accent-yellow border-4 border-black p-6 rounded-[24px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:row items-center justify-between gap-6"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                                <Check className="text-white w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-black text-xl uppercase tracking-tighter">Tutor Approved Successfully!</h3>
                                <p className="font-bold text-sm">Credentials reset and mailed to <span className="underline italic">{approvedTutor.email}</span></p>
                            </div>
                        </div>
                        <div className="bg-white border-2 border-black p-4 rounded-xl flex items-center gap-4">
                            <div className="text-xs font-black uppercase text-gray-400">Temp Password</div>
                            <div className="font-mono font-black text-lg select-all bg-gray-50 px-3 py-1 rounded-lg border-2 border-black/5">{approvedTutor.tempPassword}</div>
                            <button onClick={() => setApprovedTutor(null)} className="p-2 hover:bg-gray-100 rounded-lg"><XCircle className="w-5 h-5 text-gray-400" /></button>
                        </div>
                    </motion.div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard label="Pending Vetting" value={stats.pendingVerifications.toString()} color="border-accent-blue" />
                    <StatCard label="Total Staff" value={stats.totalTrainers.toString()} color="border-accent-yellow" />
                    <StatCard label="Active Students" value={stats.totalUsers.toString()} color="border-accent-pink" />
                </div>

                {/* Pending Requests */}
                <div className="bg-white border-2 border-black rounded-[32px] overflow-hidden shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                    <div className="p-8 border-b-2 border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h2 className="text-xl font-black uppercase tracking-tighter">Verification Queue</h2>
                    </div>

                    <div className="divide-y-2 divide-gray-50">
                        <AnimatePresence mode="popLayout">
                            {requests.length > 0 ? (
                                requests.map((request) => (
                                    <motion.div 
                                        key={request.id}
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0, x: 100 }}
                                        className="p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex-1 space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-black rounded-xl border-2 border-black flex items-center justify-center text-white font-black text-xl italic uppercase">
                                                    {request.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-2xl tracking-tighter">{request.name}</h3>
                                                    <p className="text-sm font-bold text-accent-blue uppercase tracking-widest">{request.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-4 text-xs font-black uppercase text-gray-400">
                                                <span className="flex items-center gap-1 border border-gray-100 px-2 py-1 rounded-md"><Globe className="w-3 h-3" /> {request.portfolio}</span>
                                                <span className="flex items-center gap-1 border border-gray-100 px-2 py-1 rounded-md"><Shield className="w-3 h-3" /> EXPERTISE: {request.expertise}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-3 w-full lg:w-auto">
                                            <div className="flex bg-gray-100 p-1 rounded-xl border-2 border-black">
                                                {['REVIEW', 'VETTING', 'ONBOARDING'].map((s) => (
                                                    <button
                                                        key={s}
                                                        onClick={() => handleUpdateStage(request.id, s)}
                                                        className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${
                                                            request.stage === s ? 'bg-black text-white' : 'text-gray-400'
                                                        }`}
                                                    >
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleApproveRequest(request.id)} className="flex-1 lg:w-32 py-3 bg-green-500 text-white border-2 border-black rounded-xl font-black text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">APPROVE</button>
                                                <button onClick={() => handleDeclineRequest(request.id)} className="flex-1 lg:w-32 py-3 bg-white text-red-500 border-2 border-red-500 rounded-xl font-black text-xs">DECLINE</button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="p-20 text-center italic text-gray-300 font-black text-xl">QUEUE IS EMPTY</div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        )}

        {/* Governance: Users */}
        {activeTab === 'users' && (
            <div className="bg-white border-2 border-black rounded-[32px] overflow-hidden shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                <div className="p-8 border-b-2 border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h2 className="text-xl font-black uppercase tracking-tighter">User Library</h2>
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input className="pl-10 pr-4 py-2 border-2 border-black rounded-xl text-sm font-bold w-64" placeholder="Filter users..." />
                    </div>
                </div>

                <div className="divide-y-2 divide-gray-50">
                    {allUsers.map((user) => (
                        <div key={user.id} className="p-8 flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-100 rounded-full border-2 border-black flex items-center justify-center font-black">
                                    {user.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-black text-lg">{user.name}</h3>
                                    <p className="text-xs font-bold text-gray-400 uppercase">{user.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <select 
                                    value={user.role} 
                                    onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
                                    className="px-4 py-2 border-2 border-black rounded-xl text-xs font-black uppercase appearance-none bg-white cursor-pointer"
                                >
                                    <option value="STUDENT">Student</option>
                                    <option value="TUTOR">Tutor</option>
                                    <option value="ADMIN">Admin</option>
                                    <option value="SUPER_ADMIN">Super Admin</option>
                                </select>
                                <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-5 h-5" /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Moderation: Course Queue */}
        {activeTab === 'moderation' && (
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
                                    <img src={course.thumbnail} alt="" className="w-full h-full object-cover opacity-80" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Play className="w-10 h-10 text-white" />
                                    </div>
                                </div>

                                <div className="flex-1 space-y-2">
                                    <h3 className="text-2xl font-black tracking-tighter">{course.title}</h3>
                                    <p className="text-gray-500 text-sm font-medium line-clamp-2">{course.description}</p>
                                    <div className="pt-2 flex items-center gap-4">
                                        <span className="text-xs font-black uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full border border-black/5">{course.instructor_name}</span>
                                        <a href={course.video_url} target="_blank" className="text-xs font-black text-accent-blue underline flex items-center gap-1 uppercase tracking-tighter">
                                            Watch Video
                                        </a>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 w-full lg:w-auto">
                                    <button 
                                        onClick={() => handleApproveCourse(course.id)}
                                        className="w-full lg:w-40 py-3 bg-green-500 text-white border-2 border-black rounded-xl font-black text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                                    >
                                        APPROVE
                                    </button>
                                    <button 
                                        onClick={() => handleRejectCourse(course.id)}
                                        className="w-full lg:w-40 py-3 bg-white text-red-500 border-2 border-red-500 rounded-xl font-black text-sm"
                                    >
                                        REJECT
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="p-20 text-center border-4 border-dashed border-gray-100 rounded-[32px]">
                            <h3 className="text-2xl font-black tracking-tighter italic text-gray-300 uppercase">Queue Clear</h3>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        )}

        {/* Moderation: Pricing */}
        {activeTab === 'pricing' && (
            <div className="bg-white border-2 border-black rounded-[32px] overflow-hidden shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b-2 border-gray-100">
                            <tr>
                                <th className="p-6 font-black uppercase text-xs tracking-widest text-gray-400">Course</th>
                                <th className="p-6 font-black uppercase text-xs tracking-widest text-gray-400 text-center">Price</th>
                                <th className="p-6 font-black uppercase text-xs tracking-widest text-gray-400 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {allCourses.map((course) => (
                                <tr key={course.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="p-6">
                                        <h3 className="font-bold text-base">{course.title}</h3>
                                        <span className="text-xs text-gray-400 font-mono italic">{course.instructor_name}</span>
                                    </td>
                                    <td className="p-6 text-center">
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
                                            <button onClick={() => handleEditPrice(course.id, course.price)} className="px-4 py-2 hover:bg-black hover:text-white rounded-lg font-bold text-xs border-2 border-black">EDIT</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* Moderation: Library */}
        {activeTab === 'library' && (
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
                        <div key={i} className="p-6 bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between">
                            <div>
                                <h3 className="font-black text-lg uppercase tracking-tight">{item.name || item.title}</h3>
                                <p className="text-xs text-accent-blue font-bold uppercase">{contentType}</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 hover:bg-black hover:text-white rounded-lg border-2 border-black transition-all"><Edit2 className="w-4 h-4" /></button>
                                <button className="p-2 hover:bg-red-500 hover:text-white rounded-lg border-2 border-black transition-all"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* System Health */}
        {activeTab === 'stats' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-black text-white p-12 rounded-[48px] border-4 border-black shadow-[12px_12px_0px_0px_rgba(255,255,255,0.1)]">
                    <h2 className="text-2xl font-black uppercase italic mb-8">System Health</h2>
                    <div className="space-y-6">
                        <StatRow label="Database Connection" status="ACTIVE" color="text-green-400" />
                        <StatRow label="Email Service" status="READY" color="text-green-400" />
                        <StatRow label="OTP Infrastructure" status="OPERATIONAL" color="text-green-400" />
                        <StatRow label="Cdn Latency" status="14ms" color="text-accent-blue" />
                    </div>
                </div>
                
                <div className="bg-accent-yellow p-12 rounded-[48px] border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                    <h2 className="text-2xl font-black uppercase mb-8">Role Distribution</h2>
                    <div className="space-y-4">
                        <ProgressBar label="Students" percent={82} />
                        <ProgressBar label="Tutors" percent={12} />
                        <ProgressBar label="Staff" percent={6} />
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string, value: string, color: string }) {
    return (
        <div className={`p-8 bg-white border-2 border-black rounded-[32px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-l-[16px] ${color}`}>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">{label}</h4>
            <div className="text-5xl font-black tracking-tighter italic">{value}</div>
        </div>
    );
}

function StatRow({ label, status, color }: any) {
    return (
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <span className="font-bold text-sm uppercase tracking-widest text-gray-400">{label}</span>
            <span className={`font-black text-sm uppercase ${color}`}>{status}</span>
        </div>
    );
}

function ProgressBar({ label, percent }: any) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-xs font-black uppercase">
                <span>{label}</span>
                <span>{percent}%</span>
            </div>
            <div className="h-4 bg-white border-2 border-black rounded-full overflow-hidden">
                <div className="h-full bg-black" style={{ width: `${percent}%` }}></div>
            </div>
        </div>
    );
}
