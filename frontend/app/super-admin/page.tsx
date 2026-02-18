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
  Edit2,
  RefreshCw,
  ShieldAlert,
  Copy
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
import { cn } from "@/lib/utils";

export default function SuperAdminPage() {
  const [activeTab, setActiveTab] = useState<'verifications' | 'users' | 'moderation' | 'pricing' | 'library' | 'stats' | 'master'>('verifications');
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
        } else if (activeTab === 'master') {
            await fetchAdminCode();
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

  // Create Admin State
  const [newAdmin, setNewAdmin] = useState({ email: "", name: "", avatar: "" });
  const [createdAdminPass, setCreatedAdminPass] = useState("");
  const [adminCode, setAdminCode] = useState<string | null>(null);
  const [resetLoading, setResetLoading] = useState(false);
  const [rotateLoading, setRotateLoading] = useState(false);

  const fetchAdminCode = async () => {
    try {
        const res = await fetch("http://localhost:5000/api/admin/code");
        const data = await res.json();
        setAdminCode(data.code);
    } catch (err) {
        console.error("Failed to fetch admin code");
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

  const handleResetAdminCode = async () => {
    if (!confirm("Are you sure you want to RESET the Admin Access Code to default?")) return;
    setResetLoading(true);
    try {
        const res = await fetch("http://localhost:5000/api/admin/reset-access-code", { method: "POST" });
        const data = await res.json();
        if (data.success) {
            setAdminCode(data.code);
            alert("Admin Access Code reset to default and notification sent.");
        }
    } catch (err) {
        alert("Failed to reset code");
    } finally {
        setResetLoading(false);
    }
  };

  const handleRotateAdminCode = async () => {
    if (!confirm("Are you sure you want to ROTATE the Admin Access Code?")) return;
    setRotateLoading(true);
    try {
        const res = await fetch("http://localhost:5000/api/admin/rotate-access-code", { method: "POST" });
        const data = await res.json();
        if (data.success) {
            setAdminCode(data.code);
            alert("Admin Access Code rotated and notification sent.");
        }
    } catch (err) {
        alert("Failed to rotate code");
    } finally {
        setRotateLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
      if(!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
      
      try {
        const res = await fetch("http://localhost:5000/api/admin/delete-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });
        if (res.ok) {
            setAllUsers(prev => prev.filter(u => u.id !== id));
            alert("User deleted successfully");
        } else {
            alert("Failed to delete user");
        }
      } catch (err) {
        alert("Error deleting user");
      }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const res = await fetch("http://localhost:5000/api/admin/create-admin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newAdmin),
        });
        const data = await res.json();
        if (res.ok) {
            setCreatedAdminPass(data.password);
            setNewAdmin({ email: "", name: "", avatar: "" });
            alert(`Admin Created! Password: ${data.password}`);
            fetchInitialData(); // Refresh list
        } else {
            alert(data.error || "Failed to create admin");
        }
    } catch (err) {
        alert("Error creating admin");
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setNewAdmin(prev => ({ ...prev, avatar: reader.result as string }));
        };
        reader.readAsDataURL(file);
    }
  };

  /* 
  const handleClearAllUsers = async () => { ... } // Removed per request
  */

  // Access Code Rotation State
  const [newAccessCode, setNewAccessCode] = useState<string | null>(null);
  const [codeTimer, setCodeTimer] = useState(600); // 10 minutes in seconds

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (newAccessCode && codeTimer > 0) {
        interval = setInterval(() => {
            setCodeTimer((prev) => prev - 1);
        }, 1000);
    } else if (codeTimer === 0) {
        setNewAccessCode(null);
    }
    return () => clearInterval(interval);
  }, [newAccessCode, codeTimer]);

  const handleRotateCode = async () => {
    if(!confirm("Warning: This will INVALIDATE the previous Access Code immediately. Ensure you save the new one. Continue?")) return;

    try {
        const res = await fetch("http://localhost:5000/api/admin/rotate-access-code", {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        });
        const data = await res.json();
        if (res.ok) {
            setNewAccessCode(data.code);
            setCodeTimer(600); // Reset timer to 10 mins
        } else {
            alert("Failed to rotate code");
        }
    } catch (err) {
        alert("Error rotating code");
    }
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
            {/* Access Code Rotation */}
             <button
                onClick={handleRotateCode}
                className="flex items-center gap-2 px-6 py-2 rounded-xl font-black text-xs uppercase transition-all bg-yellow-400 text-black hover:bg-yellow-500 border-2 border-black ml-2"
            >
                <Shield className="w-4 h-4" />
                Rotate Access Code
            </button>

            <div className="flex flex-wrap gap-2">
            {[
                { id: 'verifications', label: 'Vetting', icon: Shield },
                { id: 'users', label: 'Users', icon: Users },
                { id: 'master', label: 'Master Access', icon: ShieldCheck },
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

        {/* New Access Code Display */}
        <AnimatePresence>
            {newAccessCode && (
                <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mb-12 bg-red-600 text-white p-6 rounded-[24px] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-black/20 rounded-full">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black uppercase tracking-tighter">New Master Access Code</h3>
                                <p className="text-xs font-bold uppercase opacity-80">This code will disappear in {Math.floor(codeTimer / 60)}:{(codeTimer % 60).toString().padStart(2, '0')} minutes. Save it securely!</p>
                            </div>
                        </div>
                        <div className="text-4xl font-mono font-black tracking-widest bg-black/20 px-6 py-2 rounded-xl border-2 border-white/20 select-all">
                            {newAccessCode}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

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
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setActiveTab('create-admin' as any)}
                            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl font-black text-xs uppercase"
                        >
                            <Plus className="w-4 h-4" /> Add Admin
                        </button>
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input className="pl-10 pr-4 py-2 border-2 border-black rounded-xl text-sm font-bold w-64" placeholder="Filter users..." />
                        </div>
                    </div>
                </div>

                <div className="divide-y-2 divide-gray-50">
                    {allUsers.map((user) => (
                        <div key={user.id} className="p-8 flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-100 rounded-full border-2 border-black flex items-center justify-center font-black overflow-hidden">
                                    {user.avatar ? (
                                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        user.name.charAt(0)
                                    )}
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
                                <button onClick={() => handleDeleteUser(user.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-5 h-5" /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Create Admin View */}
        {activeTab === ('create-admin' as any) && (
            <div className="bg-white border-2 border-black rounded-[32px] overflow-hidden shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                <div className="p-8 border-b-2 border-gray-100 flex items-center gap-4 bg-gray-50/50">
                    <button onClick={() => setActiveTab('users')} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <XCircle className="w-6 h-6" />
                    </button>
                    <h2 className="text-xl font-black uppercase tracking-tighter">Create New Administrator</h2>
                </div>
                
                <div className="p-12">
                    <div className="max-w-xl mx-auto">
                        <form onSubmit={handleCreateAdmin} className="space-y-8">
                             <div className="flex justify-center mb-8">
                                <div className="relative group cursor-pointer w-32 h-32">
                                    <div className="w-32 h-32 bg-gray-100 rounded-full border-4 border-black overflow-hidden flex items-center justify-center">
                                        {newAdmin.avatar ? (
                                            <img src={newAdmin.avatar} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <UserCheck className="w-12 h-12 text-gray-300" />
                                        )}
                                    </div>
                                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="text-white text-xs font-black uppercase">Upload</div>
                                    </div>
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                </div>
                             </div>

                             <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-black uppercase text-gray-500 mb-2 block">Email Address</label>
                                    <input 
                                        type="email" 
                                        required 
                                        value={newAdmin.email}
                                        onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                                        className="w-full p-4 border-2 border-black rounded-xl font-bold text-lg outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                                        placeholder="admin@designhunt.com"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-black uppercase text-gray-500 mb-2 block">Full Name</label>
                                    <input 
                                        type="text" 
                                        value={newAdmin.name}
                                        onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
                                        className="w-full p-4 border-2 border-black rounded-xl font-bold text-lg outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                                        placeholder="Jane Doe"
                                    />
                                </div>
                             </div>

                             <button className="w-full py-5 bg-black text-white font-black uppercase text-xl rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]">
                                Generate Access Credentials
                             </button>
                        </form>

                        {createdAdminPass && (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-8 p-8 bg-green-100 border-4 border-green-500 rounded-[32px] text-center"
                            >
                                <p className="text-sm font-black text-green-700 uppercase tracking-widest mb-4">Admin Created Successfully</p>
                                <div className="font-mono text-4xl font-black mb-4 select-all bg-white inline-block px-6 py-2 rounded-xl border-2 border-green-200">
                                    {createdAdminPass}
                                </div>
                                <p className="text-xs text-green-800 font-bold uppercase">Please copy and share this password immediately.</p>
                            </motion.div>
                        )}
                    </div>
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

        {/* Governance: Master Access */}
        {activeTab === 'master' && (
            <div className="max-w-2xl mx-auto space-y-8">
                <div className="bg-black text-white p-12 rounded-[48px] border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,0.1)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <ShieldAlert className="w-32 h-32" />
                    </div>
                    
                    <div className="relative z-10">
                        <h2 className="text-3xl font-black uppercase italic mb-2 tracking-tighter">Admin Access Authority</h2>
                        <p className="text-gray-400 font-bold uppercase text-xs mb-8 tracking-widest">Global Dashboard Control Center</p>
                        
                        <div className="space-y-12">
                            <div>
                                <label className="text-[10px] font-black uppercase text-gray-500 mb-4 block tracking-[0.2em]">Current Shared Access Code</label>
                                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border-2 border-white/10 group hover:border-accent-yellow/50 transition-all">
                                    <code className="text-5xl font-mono font-black tracking-[0.3em] text-accent-yellow select-all">
                                        {adminCode || "••••••••"}
                                    </code>
                                    <button 
                                        onClick={() => {
                                            if(adminCode) {
                                                navigator.clipboard.writeText(adminCode);
                                                alert("Copied to clipboard!");
                                            }
                                        }}
                                        className="p-4 hover:bg-white/10 rounded-xl transition-colors ml-auto"
                                    >
                                        <Copy className="w-6 h-6 text-gray-400" />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button 
                                    onClick={handleRotateAdminCode}
                                    disabled={rotateLoading}
                                    className="flex items-center justify-center gap-3 py-5 bg-accent-yellow text-black font-black uppercase text-sm rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)] disabled:opacity-50"
                                >
                                    <RefreshCw className={cn("w-5 h-5", rotateLoading && "animate-spin")} />
                                    Rotate Code (Alert Email)
                                </button>
                                
                                <button 
                                    onClick={handleResetAdminCode}
                                    disabled={resetLoading}
                                    className="flex items-center justify-center gap-3 py-5 bg-red-600 text-white font-black uppercase text-sm rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] disabled:opacity-50"
                                >
                                    <ShieldAlert className={cn("w-5 h-5", resetLoading && "animate-spin")} />
                                    Emergency Reset
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white border-2 border-black p-8 rounded-[32px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <h3 className="text-sm font-black uppercase mb-4 flex items-center gap-2">
                         <Mail className="w-4 h-4" /> Safety Protocols
                    </h3>
                    <ul className="space-y-4 text-xs font-bold text-gray-500 uppercase leading-relaxed">
                        <li className="flex gap-3">
                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span>Rotating the code will immediately invalidate the previous code.</span>
                        </li>
                        <li className="flex gap-3">
                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span>An automated email alert is sent to <strong>shivampatel2330@gmail.com</strong> on every change.</span>
                        </li>
                        <li className="flex gap-3">
                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span>Use "Emergency Reset" if the dynamic system fails or codes are lost.</span>
                        </li>
                    </ul>
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
