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
  Copy,
  Trophy,
  Lightbulb,
  Bell
} from "lucide-react";
import { IdeasManager } from "@/components/super-admin/IdeasManager";

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
import { ChallengesManager } from "@/components/super-admin/ChallengesManager";

export default function SuperAdminPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'stats' | 'audit' | 'settings' | 'financials' | 'challenges' | 'ideas'>('users');
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [financials, setFinancials] = useState<any>({ totalRevenue: 0, mrr: 0, activeSubscriptions: 0, recentTransactions: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
      activeUsers: 0,
      totalTrainers: 0,
      pendingVerifications: 0,
      ideaCount: 0
  });

  const handleBackup = async () => {
      if (!confirm("Create a database backup?")) return;
      try {
          const res = await fetch("/api/admin/backup", { method: "POST" });
          const data = await res.json();
          if (res.ok) alert(`Backup created: ${data.filename}`);
          else alert("Backup failed");
      } catch (err) {
          alert("Backup error");
      }
  };

  const handleClearCache = async () => {
      if (!confirm("Clear all frontend cache? This may verify slow down the next page loads.")) return;
      try {
          const res = await fetch("/api/revalidate", { method: "POST" });
          if (res.ok) alert("Cache cleared");
          else alert("Failed to clear cache");
      } catch (err) {
          alert("Cache error");
      }
  };

  // Create Admin State
  const [newAdmin, setNewAdmin] = useState({ email: "", name: "" });
  const [createdAdminPass, setCreatedAdminPass] = useState("");
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, [activeTab]);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
        const ideaRes = await fetch("/api/admin/ideas");
        const ideasData = await ideaRes.json();
        const count = Array.isArray(ideasData) ? ideasData.length : 0;
        setStats(prev => ({ ...prev, ideaCount: count }));

        if (activeTab === 'users') {
            const res = await fetch("/api/admin/users");
            const data = await res.json();
            setAllUsers(data);
        } else if (activeTab === 'audit') {
            const res = await fetch("/api/admin/audit-logs");
            const data = await res.json();
            setAuditLogs(Array.isArray(data) ? data : []);
        } else if (activeTab === 'settings') {
            const res = await fetch("/api/admin/settings");
            const data = await res.json();
            setSettings(data);
        } 
        /* else if (activeTab === 'financials') {
            const res = await fetch("/api/admin/financials");
            const data = await res.json();
            setFinancials(data);
        } */
        
        const systemStats = await getSystemStats();
        setStats({ ...systemStats, ideaCount: count });
    } catch (err) {
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  };

  const updateSystemSetting = async (key: string, value: string) => {
      try {
          const res = await fetch("/api/admin/settings", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ key, value }),
          });
          if (res.ok) {
              setSettings(prev => ({ ...prev, [key]: value }));
          } else {
            alert("Failed to update setting");
          }
      } catch (err) {
          alert("Error updating setting");
      }
  };

  const handleRoleUpdate = async (userId: string, newRole: string) => {
      const res = await updateUserRole(userId, newRole);
      if (res.success) {
          setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      }
  };

  const handleDeleteUser = async (id: string) => {
      if(!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
      
      try {
        const res = await fetch("/api/admin/delete-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });
        if (res.ok) {
            setAllUsers(prev => prev.filter(u => u.id !== id));
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
        const res = await fetch("/api/admin/create-admin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newAdmin),
        });
        const data = await res.json();
        if (res.ok) {
            setCreatedAdminPass(data.password);
            setNewAdmin({ email: "", name: "" });
            setShowCreateAdmin(false);
            alert(`Admin Created! Temporary Password: ${data.password}`);
            fetchInitialData(); // Refresh list
        } else {
            alert(data.error || "Failed to create admin");
        }
    } catch (err) {
        alert("Error creating admin");
    }
  };

  return (
    <div className="container mx-auto px-4 pt-6 pb-12">
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
                { id: 'users', label: 'Users', icon: Users },
                // { id: 'financials', label: 'Financials', icon: DollarSign },
                { id: 'audit', label: 'Audit Logs', icon: Copy },
                { id: 'settings', label: 'Settings', icon: Settings },
                { id: 'ideas', label: 'Notifications', icon: Bell },
                { id: 'challenges', label: 'Challenges', icon: Trophy },
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

        {/* Create Admin Modal/Section */}
        {showCreateAdmin && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-md w-full">
                    <h2 className="text-2xl font-black uppercase mb-6">Create New Admin</h2>
                    <form onSubmit={handleCreateAdmin} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase mb-2">Full Name</label>
                            <input 
                                type="text"
                                value={newAdmin.name}
                                onChange={e => setNewAdmin({...newAdmin, name: e.target.value})}
                                className="w-full px-4 py-3 rounded-xl border-2 border-black font-medium text-sm focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                                placeholder="e.g. John Doe"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase mb-2">Email Address</label>
                            <input 
                                type="email"
                                value={newAdmin.email}
                                onChange={e => setNewAdmin({...newAdmin, email: e.target.value})}
                                className="w-full px-4 py-3 rounded-xl border-2 border-black font-medium text-sm focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                                placeholder="name@company.com"
                                required
                            />
                        </div>
                        <div className="flex gap-4 pt-4">
                            <button type="button" onClick={() => setShowCreateAdmin(false)} className="flex-1 px-6 py-3 rounded-xl border-2 border-black font-bold uppercase hover:bg-gray-100 transition-all">
                                Cancel
                            </button>
                            <button type="submit" className="flex-1 px-6 py-3 rounded-xl bg-black text-white border-2 border-black font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                                Create
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {/* Created Admin Success */}
        {createdAdminPass && (
             <div className="mb-8 bg-green-100 border-2 border-green-500 text-green-800 p-6 rounded-2xl flex items-center justify-between">
                <div>
                    <h3 className="font-black uppercase mb-1">Admin Created Successfully</h3>
                    <p className="text-sm font-medium">Use this temporary password: <span className="font-mono bg-white px-2 py-1 rounded border border-green-300 select-all">{createdAdminPass}</span></p>
                </div>
                <button onClick={() => setCreatedAdminPass("")} className="p-2 hover:bg-green-200 rounded-lg">
                    <XCircle className="w-5 h-5" />
                </button>
             </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
            <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black uppercase italic">User Management</h2>
                    <button 
                        onClick={() => setShowCreateAdmin(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-accent-blue text-white rounded-xl border-2 border-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        Create Admin
                    </button>
                </div>

                <div className="bg-white border-4 border-black rounded-[32px] overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <table className="w-full">
                        <thead className="bg-black text-white">
                            <tr>
                                <th className="py-4 px-6 text-left font-black uppercase text-xs tracking-wider">User</th>
                                <th className="py-4 px-6 text-left font-black uppercase text-xs tracking-wider">Role</th>
                                <th className="py-4 px-6 text-left font-black uppercase text-xs tracking-wider">Email</th>
                                <th className="py-4 px-6 text-right font-black uppercase text-xs tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {allUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-black overflow-hidden">
                                                <img src={user.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.name} alt={user.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm">{user.name}</div>
                                                <div className="text-xs text-gray-500 font-mono">ID: {user.id.slice(0,8)}...</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <select 
                                            value={user.role}
                                            onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
                                            className="px-3 py-1 bg-gray-100 border-2 border-transparent hover:border-black rounded-lg text-xs font-bold uppercase cursor-pointer"
                                            disabled={user.role === 'SUPER_ADMIN'}
                                        >
                                            <option value="USER">User</option>
                                            <option value="ADMIN">Admin</option>
                                            <option value="TUTOR">Tutor</option>
                                            <option value="SUPER_ADMIN" disabled>Super Admin</option>
                                        </select>
                                    </td>
                                    <td className="py-4 px-6 font-mono text-sm">{user.email}</td>
                                    <td className="py-4 px-6 text-right">
                                        {user.role !== 'SUPER_ADMIN' && (
                                            <button 
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete User"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* Financials Tab - Temporarily Disabled
        {activeTab === 'financials' && (
            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard label="Total Revenue (All Time)" value={`$${financials.totalRevenue.toFixed(2)}`} color="border-green-500" />
                    <StatCard label="Monthly Recurring Revenue (30d)" value={`$${financials.mrr.toFixed(2)}`} color="border-blue-500" />
                    <StatCard label="Active Subscriptions" value={financials.activeSubscriptions} color="border-purple-500" />
                </div>

                <div className="bg-white border-4 border-black rounded-[32px] overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <div className="p-6 border-b-2 border-gray-100 flex justify-between items-center">
                        <h2 className="text-xl font-black uppercase italic">Recent Transactions</h2>
                        <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">Live Data</div>
                    </div>
                    <table className="w-full">
                        <thead className="bg-gray-50 text-gray-500">
                            <tr>
                                <th className="py-4 px-6 text-left font-bold uppercase text-xs tracking-wider">Date</th>
                                <th className="py-4 px-6 text-left font-bold uppercase text-xs tracking-wider">User</th>
                                <th className="py-4 px-6 text-left font-bold uppercase text-xs tracking-wider">Description</th>
                                <th className="py-4 px-6 text-right font-bold uppercase text-xs tracking-wider">Amount</th>
                                <th className="py-4 px-6 text-right font-bold uppercase text-xs tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {financials.recentTransactions.map((tx: any) => (
                                <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6 font-mono text-xs text-gray-500">
                                        {new Date(tx.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="font-bold text-sm">{tx.user_name || 'Unknown'}</div>
                                        <div className="text-xs text-gray-400 font-mono">{tx.user_email}</div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="text-sm font-medium">{tx.description}</div>
                                        <div className="text-xs text-gray-400 uppercase">{tx.type}</div>
                                    </td>
                                    <td className="py-4 px-6 text-right font-black text-sm">
                                        ${tx.amount.toFixed(2)}
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-black uppercase">
                                            {tx.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {financials.recentTransactions.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-gray-400 font-medium italic">No transactions found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )}
        */}
        
        {/* Audit Tab */}
        {activeTab === 'audit' && (
            <div className="space-y-6">
                <h2 className="text-2xl font-black uppercase italic mb-6">Security Audit Logs</h2>
                <div className="bg-white border-4 border-black rounded-[32px] overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <table className="w-full">
                        <thead className="bg-black text-white">
                            <tr>
                                <th className="py-4 px-6 text-left font-black uppercase text-xs tracking-wider">Time</th>
                                <th className="py-4 px-6 text-left font-black uppercase text-xs tracking-wider">Admin</th>
                                <th className="py-4 px-6 text-left font-black uppercase text-xs tracking-wider">Action</th>
                                <th className="py-4 px-6 text-left font-black uppercase text-xs tracking-wider">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {auditLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6 font-mono text-xs text-gray-500">
                                        {new Date(log.created_at).toLocaleString()}
                                    </td>
                                    <td className="py-4 px-6 font-bold text-sm">
                                        {log.admin_name || log.admin_email || 'Unknown'}
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`px-2 py-1 rounded-lg text-xs font-black uppercase ${
                                            log.action.includes('DELETE') ? 'bg-red-100 text-red-700' : 
                                            log.action.includes('CREATE') ? 'bg-green-100 text-green-700' : 
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-xs text-gray-600 font-mono">
                                        {log.details ? JSON.stringify(JSON.parse(log.details)) : '-'}
                                    </td>
                                </tr>
                            ))}
                            {auditLogs.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-8 text-center text-gray-400 font-medium italic">No logs found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[32px] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-red-100 rounded-xl border-2 border-black">
                             <ShieldAlert className="w-6 h-6 text-red-600" />
                        </div>
                        <h2 className="text-xl font-black uppercase">Platform Controls</h2>
                    </div>
                    
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-100">
                            <div>
                                <h3 className="font-bold uppercase text-sm">Maintenance Mode</h3>
                                <p className="text-xs text-gray-500 mt-1">Suspend all user access temporarily</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={settings['MAINTENANCE_MODE'] === 'true'} 
                                    onChange={(e) => updateSystemSetting('MAINTENANCE_MODE', String(e.target.checked))}
                                    className="sr-only peer" 
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                            </label>
                        </div>
                        
                        {settings['MAINTENANCE_MODE'] === 'true' && (
                            <div className="p-4 bg-yellow-50 rounded-xl border-2 border-yellow-200">
                                <label className="block text-xs font-bold uppercase mb-2 text-yellow-800">Maintenance End Time</label>
                                <input 
                                    type="datetime-local"
                                    value={settings['MAINTENANCE_END_TIME'] || ''}
                                    onChange={(e) => updateSystemSetting('MAINTENANCE_END_TIME', e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border-2 border-yellow-300 bg-white font-mono text-sm"
                                />
                            </div>
                        )}
                        
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-100">
                            <div>
                                <h3 className="font-bold uppercase text-sm">Disable Registrations</h3>
                                <p className="text-xs text-gray-500 mt-1">Stop new users from signing up</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={settings['DISABLE_REGISTRATIONS'] === 'true'} 
                                    onChange={(e) => updateSystemSetting('DISABLE_REGISTRATIONS', String(e.target.checked))}
                                    className="sr-only peer" 
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-100">
                            <div>
                                <h3 className="font-bold uppercase text-sm">Daily Challenges</h3>
                                <p className="text-xs text-gray-500 mt-1">Enable daily design challenges on Home</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={settings['ENABLE_CHALLENGES'] === '1'} 
                                    onChange={(e) => updateSystemSetting('ENABLE_CHALLENGES', e.target.checked ? '1' : '0')}
                                    className="sr-only peer" 
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                            </label>
                        </div>


                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-100">
                            <div>
                                <h3 className="font-bold uppercase text-sm">Course Marketplace</h3>
                                <p className="text-xs text-gray-500 mt-1">Enable public course catalog</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={settings['ENABLE_MARKETPLACE'] === 'true'} 
                                    onChange={(e) => updateSystemSetting('ENABLE_MARKETPLACE', String(e.target.checked))}
                                    className="sr-only peer" 
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[32px] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-blue-100 rounded-xl border-2 border-black">
                             <Monitor className="w-6 h-6 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-black uppercase">System Banner</h2>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase mb-2">Banner Message</label>
                            <textarea
                                value={settings['BANNER_MESSAGE'] || ''}
                                onChange={(e) => setSettings({...settings, 'BANNER_MESSAGE': e.target.value})}
                                onBlur={(e) => updateSystemSetting('BANNER_MESSAGE', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border-2 border-black font-medium text-sm focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all min-h-[100px]"
                                placeholder="Enter a global announcement..."
                            ></textarea>
                            <p className="text-xs text-gray-400 mt-2 text-right">Auto-saves on blur</p>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-100">
                            <div>
                                <h3 className="font-bold uppercase text-sm">Show Banner</h3>
                                <p className="text-xs text-gray-500 mt-1">Display this message on all pages</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={settings['SHOW_BANNER'] === 'true'} 
                                    onChange={(e) => updateSystemSetting('SHOW_BANNER', String(e.target.checked))}
                                    className="sr-only peer" 
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        )}
        
        {/* Challenges Tab */}
        {activeTab === 'challenges' && (
            <ChallengesManager />
        )}

        {activeTab === 'ideas' && (
            <IdeasManager isAdmin={false} />
        )}

        {/* System Health */}
        {activeTab === 'stats' && (
            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard label="Active Users" value={stats.activeUsers.toString()} color="border-accent-blue" />
                    <StatCard label="Instructors" value={stats.totalTrainers.toString()} color="border-accent-pink" />
                    <StatCard label="Verifications" value={stats.pendingVerifications.toString()} color="border-accent-yellow" />
                    <div className="cursor-pointer" onClick={() => setActiveTab('ideas')}>
                        <StatCard label="Idea Submissions" value={stats.ideaCount.toString()} color="border-accent-yellow" />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* System Tools Card */}
                    <div className="col-span-1 lg:col-span-2 bg-white p-8 rounded-[32px] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-wrap gap-4 items-center justify-between">
                        <div>
                            <h2 className="text-xl font-black uppercase">System Tools</h2>
                            <p className="text-sm text-gray-500 font-medium">Critical maintenance operations</p>
                        </div>
                        <div className="flex gap-4">
                            <button 
                                onClick={handleBackup}
                                className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-black rounded-xl border-2 border-black font-bold uppercase transition-all"
                            >
                                <Save className="w-4 h-4" />
                                Backup Database
                            </button>
                            <button 
                                onClick={handleClearCache}
                                className="flex items-center gap-2 px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl border-2 border-red-200 font-bold uppercase transition-all"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Clear Cache
                            </button>
                        </div>
                    </div>

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
