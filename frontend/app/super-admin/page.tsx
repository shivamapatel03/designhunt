"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  SecurityCheckIcon, 
  UserCheck01Icon, 
  CancelCircleIcon, 
  Link01Icon, 
  Mail01Icon, 
  Briefcase01Icon,
  Search01Icon,
  Tick01Icon,
  MoreVerticalCircle01Icon,
  ComputerIcon,
  CheckmarkCircle01Icon,
  UserGroupIcon,
  SecurityIcon,
  Delete02Icon,
  Analytics01Icon,
  Dollar01Icon,
  Settings01Icon,
  Add01Icon,
  PlayIcon,
  SaveIcon,
  Edit01Icon,
  Refresh01Icon,
  SecurityWarningIcon,
  Copy01Icon,
  Award01Icon,
  Idea01Icon,
  Notification01Icon
} from "@hugeicons/core-free-icons";
import { IdeasManager } from "@/components/super-admin/IdeasManager";
import { ExpertReviewsManager } from "@/components/super-admin/ExpertReviewsManager";


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
import { useAuth } from "@/components/providers/auth-provider";
import Link from "next/link";

const ALLOWED_EMAILS = ["shivampatel2330@gmail.com", "shivamsenton@gmail.com"];

export default function SuperAdminPage() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'stats' | 'audit' | 'settings' | 'financials' | 'challenges' | 'ideas' | 'reviews' | 'admins'>('stats');
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [financials, setFinancials] = useState<any>({ totalRevenue: 0, mrr: 0, activeSubscriptions: 0, recentTransactions: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
      activeUsers: 0,
      activeAdmins: 0,
      pendingVerifications: 0,
      totalAdmins: 0,
      totalUsers: 0,
      totalTrainers: 0,
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
    if (!loading && (!user || user.role !== 'SUPER_ADMIN' || !ALLOWED_EMAILS.includes(user.email || ''))) {
      window.location.href = '/';
    }
  }, [user, loading]);

  useEffect(() => {
    if (user && ALLOWED_EMAILS.includes(user.email || '')) {
      fetchInitialData();
    }
  }, [activeTab, user]);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
        const ideaRes = await fetch("/api/admin/ideas");
        const ideasData = await ideaRes.json();
        const count = Array.isArray(ideasData) ? ideasData.length : 0;
        setStats(prev => ({ ...prev, ideaCount: count }));

        if (activeTab === 'audit') {
            const res = await fetch("/api/admin/audit-logs");
            const data = await res.json();
            setAuditLogs(Array.isArray(data) ? data : []);
        } else if (activeTab === 'settings') {
            const res = await fetch("/api/admin/settings");
            const data = await res.json();
            setSettings(data);
        } else if (activeTab === 'admins') {
            const res = await fetch("/api/admin/admins");
            const data = await res.json();
            setAdmins(data.admins || []);
        } 
        /* else if (activeTab === 'financials') {
            const res = await fetch("/api/admin/financials");
            const data = await res.json();
            setFinancials(data);
        } */
        
        const systemStats = await getSystemStats();
        setStats(prev => ({ ...prev, ...systemStats }));
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



  const handleInviteAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const res = await fetch("/api/admin/invite-admin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newAdmin),
        });
        const data = await res.json();
        if (res.ok) {
            setNewAdmin({ email: "", name: "" });
            setShowCreateAdmin(false);
            fetchInitialData();
            alert(`Admin record created! Now use the 'Send Activation' button to send them the OTP.`);
        } else {
            alert(data.error || "Failed to create admin");
        }
    } catch (err) {
        alert("Error creating admin");
    }
  };

  const handleDeleteAdmin = async (id: string) => {
      if (!confirm("Are you sure you want to delete this admin account? This action cannot be undone.")) return;
      try {
          const res = await fetch(`/api/admin/admins/${id}`, { method: 'DELETE' });
          if (res.ok) {
              fetchInitialData();
          } else {
              const data = await res.json();
              alert(data.error || "Failed to delete admin");
          }
      } catch (err) {
          alert("Error deleting admin");
      }
  };

  const handleSendActivation = async (email: string) => {
      try {
          const res = await fetch("/api/auth/resend-otp", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, type: 'admin' }),
          });
          if (res.ok) {
              alert("Activation OTP sent to admin email!");
          } else {
              const data = await res.json();
              alert(data.error || "Failed to send OTP");
          }
      } catch (err) {
          alert("Error sending activation");
      }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans selection:bg-black selection:text-white pt-8 pb-12">
      <div className="max-w-5xl mx-auto px-4">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
                <HugeiconsIcon icon={SecurityCheckIcon} className="w-5 h-5 text-black" />
                <h1 className="text-xl font-bold tracking-tight text-black">Master Hub</h1>
            </div>
            <p className="text-[11px] font-bold text-gray-400">Global Platform Administrator</p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-wrap gap-1.5 p-1 bg-gray-100 rounded-xl">
            {[
                // { id: 'financials', label: 'Financials', icon: Dollar01Icon },
                { id: 'audit', label: 'Audit Logs', icon: Copy01Icon },
                { id: 'settings', label: 'Settings', icon: Settings01Icon },
                { id: 'ideas', label: 'Notifications', icon: Notification01Icon },
                { id: 'challenges', label: 'Challenges', icon: Award01Icon },
                { id: 'reviews', label: 'Reviews', icon: Edit01Icon },
                { id: 'admins', label: 'Admins', icon: UserGroupIcon },
                { id: 'stats', label: 'System', icon: Analytics01Icon }
            ].map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-[11px] transition-all ${
                        activeTab === tab.id ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-black hover:bg-white/50'
                    }`}
                >
                    <HugeiconsIcon icon={tab.icon} className="w-3.5 h-3.5" />
                    {tab.label}
                </button>
            ))}
            </div>
            
            <button
                onClick={() => window.location.href = '/api/auth/logout'}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-[11px] transition-all bg-red-50 text-red-600 hover:bg-red-100"
            >
                <HugeiconsIcon icon={CancelCircleIcon} className="w-4 h-4" />
                Logout
            </button>
          </div>
        </div>

        {/* Create Admin Modal/Section */}
        {showCreateAdmin && (
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
                    <h2 className="text-lg font-bold mb-4">Invite New Admin</h2>
                    <form onSubmit={handleInviteAdmin} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase mb-2">Full Name</label>
                            <input 
                                type="text"
                                value={newAdmin.name}
                                onChange={e => setNewAdmin({...newAdmin, name: e.target.value})}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium text-sm focus:outline-none focus:border-gray-300 focus:bg-white transition-all text-black placeholder:text-gray-400"
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
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium text-sm focus:outline-none focus:border-gray-300 focus:bg-white transition-all text-black placeholder:text-gray-400"
                                placeholder="name@company.com"
                                required
                            />
                        </div>
                        <div className="flex gap-4 pt-4">
                            <button type="button" onClick={() => setShowCreateAdmin(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 font-bold text-sm text-gray-600 hover:bg-gray-50 transition-all">
                                Cancel
                            </button>
                            <button type="submit" className="flex-1 py-2.5 rounded-xl bg-black text-white font-bold text-sm hover:bg-gray-900 transition-all">
                                Create
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {/* Created Admin Success */}
        {createdAdminPass && (
             <div className="mb-8 bg-green-50 border border-green-100 text-green-800 p-4 rounded-2xl flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-sm mb-1 text-green-900">Admin Created Successfully</h3>
                    <p className="text-xs font-medium text-green-700">Use this temporary password: <span className="font-mono bg-white px-2 py-1 rounded border border-green-200 select-all">{createdAdminPass}</span></p>
                </div>
                <button onClick={() => setCreatedAdminPass("")} className="p-2 hover:bg-green-200 rounded-lg">
                    <HugeiconsIcon icon={CancelCircleIcon} className="w-5 h-5" />
                </button>
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
                <div className="mb-4">
                    <h2 className="text-lg font-bold text-black">Security Audit Logs</h2>
                    <p className="text-[11px] font-bold text-gray-400 mt-1">Monitor administrator activity across the platform</p>
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="py-3 px-6 text-left font-bold uppercase text-[10px] tracking-wider text-gray-500">Time</th>
                                <th className="py-3 px-6 text-left font-bold uppercase text-[10px] tracking-wider text-gray-500">Admin</th>
                                <th className="py-3 px-6 text-left font-bold uppercase text-[10px] tracking-wider text-gray-500">Action</th>
                                <th className="py-3 px-6 text-left font-bold uppercase text-[10px] tracking-wider text-gray-500">Details</th>
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
                                        <span className={`px-2 py-1 rounded-md text-[9px] font-bold tracking-wide uppercase ${
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
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-red-50 rounded-lg text-red-600 border border-red-100">
                             <HugeiconsIcon icon={SecurityWarningIcon} className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-black">Platform Controls</h2>
                            <p className="text-[10px] font-bold text-gray-400 mt-0.5">Manage system-wide features</p>
                        </div>
                    </div>
                    
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm mb-3">
                            <div>
                                <h3 className="font-bold text-xs text-black">Maintenance Mode</h3>
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
                            <div className="p-4 bg-yellow-50/50 rounded-xl border border-yellow-100 mb-3 ml-4">
                                <label className="block text-[10px] font-bold text-yellow-800 mb-1">Maintenance End Time</label>
                                <input 
                                    type="datetime-local"
                                    value={settings['MAINTENANCE_END_TIME'] || ''}
                                    onChange={(e) => updateSystemSetting('MAINTENANCE_END_TIME', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-yellow-200 bg-white font-medium text-xs text-black focus:outline-none focus:border-yellow-400"
                                />
                            </div>
                        )}
                        
                        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm mb-3">
                            <div>
                                <h3 className="font-bold text-xs text-black">Disable Registrations</h3>
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

                        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm mb-3">
                            <div>
                                <h3 className="font-bold text-xs text-black">Daily Challenges</h3>
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


                        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm mb-3">
                            <div>
                                <h3 className="font-bold text-xs text-black">Course Marketplace</h3>
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

                        <div className="pt-4 border-t border-gray-100">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Navbar Controls</h3>
                            
                            {[
                                { key: 'ENABLE_LIBRARY', label: 'Library Tab', desc: 'Main resource directory' },
                                { key: 'ENABLE_THEORY', label: 'Theory Tab', desc: 'Learning paths & lessons' },
                                { key: 'ENABLE_CRITIQUE', label: 'Critique AI Tab', desc: 'AI design review feature' },
                                { key: 'ENABLE_TOOLS', label: 'Tools Tab', desc: 'Designer utility suite' },
                            ].map((item) => (
                                <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl border border-gray-100 mb-3">
                                    <div>
                                        <h4 className="font-bold text-xs text-black">{item.label}</h4>
                                        <p className="text-[10px] text-gray-500 mt-0.5">{item.desc}</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            checked={settings[item.key] !== 'false'} 
                                            onChange={(e) => updateSystemSetting(item.key, String(e.target.checked))}
                                            className="sr-only peer" 
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600 border border-blue-100">
                             <HugeiconsIcon icon={ComputerIcon} className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-black">System Banner</h2>
                            <p className="text-[10px] font-bold text-gray-400 mt-0.5">Top announcement bar</p>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-700 mb-1">Banner Message</label>
                            <textarea
                                value={settings['BANNER_MESSAGE'] || ''}
                                onChange={(e) => setSettings({...settings, 'BANNER_MESSAGE': e.target.value})}
                                onBlur={(e) => updateSystemSetting('BANNER_MESSAGE', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-sm focus:outline-none focus:border-gray-300 focus:bg-white transition-all min-h-[100px] text-black placeholder:text-gray-400"
                                placeholder="Enter a global announcement..."
                            ></textarea>
                            <p className="text-xs text-gray-400 mt-2 text-right">Auto-saves on blur</p>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm mb-3">
                            <div>
                                <h3 className="font-bold text-xs text-black">Show Banner</h3>
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

        {activeTab === 'reviews' && (
            <ExpertReviewsManager isAdmin={true} />
        )}

        {activeTab === 'admins' && (
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="relative w-full md:w-96">
                        <HugeiconsIcon icon={Search01Icon} className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-bold focus:outline-none focus:border-gray-200 transition-all shadow-sm"
                        />
                    </div>
                    <button 
                        onClick={() => setShowCreateAdmin(true)}
                        className="w-full md:w-auto px-6 py-3 bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        <HugeiconsIcon icon={Add01Icon} className="w-4 h-4" />
                        Invite Admin
                    </button>
                </div>

                <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                    <table className="w-full">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-[10px] font-black uppercase text-gray-400 tracking-widest">Administrator</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black uppercase text-gray-400 tracking-widest">Role</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black uppercase text-gray-400 tracking-widest">Status</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black uppercase text-gray-400 tracking-widest">Created At</th>
                                <th className="px-6 py-4 text-right text-[10px] font-black uppercase text-gray-400 tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {admins
                                .filter(a => a.email.toLowerCase().includes(searchQuery.toLowerCase()) || a.name.toLowerCase().includes(searchQuery.toLowerCase()))
                                .map((admin) => (
                                <tr key={admin.id} className="group hover:bg-gray-50/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-black/5 rounded-full flex items-center justify-center font-bold text-[10px]">
                                                {admin.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-[12px] font-bold text-black">{admin.name}</div>
                                                <div className="text-[10px] font-medium text-gray-400">{admin.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter ${
                                            admin.role === 'SUPER_ADMIN' ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {admin.role.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter ${
                                            admin.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                        }`}>
                                            {admin.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-[11px] font-medium text-gray-400">
                                        {new Date(admin.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            {admin.status === 'PENDING' && (
                                                <button 
                                                    onClick={() => {
                                                        if (confirm(`Send activation link to ${admin.email}?`)) {
                                                            handleSendActivation(admin.email);
                                                        }
                                                    }}
                                                    className="p-2 hover:bg-emerald-50 text-gray-400 hover:text-emerald-600 rounded-lg transition-all"
                                                    title="Send Activation OTP"
                                                >
                                                    <HugeiconsIcon icon={Mail01Icon} className="w-4 h-4" />
                                                </button>
                                            )}
                                            {admin.id !== user?.id && (
                                                <button 
                                                    onClick={() => handleDeleteAdmin(admin.id)}
                                                    className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-all"
                                                    title="Delete Admin"
                                                >
                                                    <HugeiconsIcon icon={Delete02Icon} className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* System Health */}
        {activeTab === 'stats' && (
            <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard label="Active Users" value={stats.activeUsers.toString()} color="border-blue-500" />
                    <StatCard label="Active Admin" value={stats.activeAdmins.toString()} color="border-purple-500" />
                    <StatCard label="Verifications" value={stats.pendingVerifications.toString()} color="border-amber-400" />
                    <StatCard label="Total Admin" value={stats.totalAdmins.toString()} color="border-emerald-500" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* System Tools Card */}
                    <div className="col-span-1 lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-wrap gap-4 items-center justify-between">
                        <div>
                            <h2 className="text-sm font-bold text-black">System Tools</h2>
                            <p className="text-[11px] font-bold text-gray-400 mt-0.5">Critical maintenance operations</p>
                        </div>
                        <div className="flex gap-3">
                            <button 
                                onClick={handleBackup}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl border border-gray-200 font-bold text-xs transition-all"
                            >
                                <HugeiconsIcon icon={SaveIcon} className="w-3.5 h-3.5" />
                                Backup DB
                            </button>
                            <button 
                                onClick={handleClearCache}
                                className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl border border-red-100 font-bold text-xs transition-all"
                            >
                                <HugeiconsIcon icon={Refresh01Icon} className="w-3.5 h-3.5" />
                                Clear Cache
                            </button>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                        <h2 className="text-sm font-bold text-black mb-6">System Health</h2>
                        <div className="space-y-4">
                            <StatRow label="Database" status="ACTIVE" color="text-green-500" bg="bg-green-50" />
                            <StatRow label="Email Service" status="READY" color="text-green-500" bg="bg-green-50" />
                            <StatRow label="Authentication" status="OPERATIONAL" color="text-green-500" bg="bg-green-50" />
                            <StatRow label="CDN Latency" status="14ms" color="text-blue-500" bg="bg-blue-50" />
                        </div>
                    </div>
                    
                    <div className="bg-gray-50/50 p-8 rounded-3xl border border-gray-100">
                        <h2 className="text-sm font-bold text-black mb-6">Role Distribution</h2>
                        <div className="space-y-5">
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
        <div className={`p-6 bg-white border border-gray-100 rounded-2xl shadow-sm relative overflow-hidden`}>
            <div className={`absolute top-0 left-0 w-1 h-full ${color.replace('border-', 'bg-')}`}></div>
            <h4 className="text-[11px] font-bold text-gray-400 mb-1 ml-2">{label}</h4>
            <div className="text-3xl font-bold tracking-tight text-black ml-2">{value}</div>
        </div>
    );
}

function StatRow({ label, status, color, bg = '' }: any) {
    return (
        <div className="flex justify-between items-center py-2.5 border-b border-gray-50 last:border-0">
            <span className="font-bold text-[11px] text-gray-500">{label}</span>
            <span className={`font-bold text-[10px] px-2 py-1 rounded-md ${color} ${bg}`}>{status}</span>
        </div>
    );
}

function ProgressBar({ label, percent }: any) {
    return (
        <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-bold text-gray-600">
                <span>{label}</span>
                <span>{percent}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-black rounded-full" style={{ width: `${percent}%` }}></div>
            </div>
        </div>
    );
}
