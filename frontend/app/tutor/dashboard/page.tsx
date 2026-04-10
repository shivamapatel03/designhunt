"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Video, 
    BarChart3, 
    DollarSign, 
    Users, 
    Plus, 
    LayoutDashboard, 
    Settings, 
    Bell, 
    Search,
    ChevronRight,
    ArrowUpRight,
    TrendingUp,
    MoreVertical,
    Calendar,
    Zap,
    BookOpen,
    Loader2,
    Globe
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PremiumTutorDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
        try {
            const statsRes = await fetch('/api/tutor/stats');
            if (statsRes.status === 401) {
                router.push('/tutor/login');
                return;
            }
            const statsData = await statsRes.json();
            setStats(statsData);

            const coursesRes = await fetch('/api/tutor/courses');
            const coursesData = await coursesRes.json();
            setCourses(coursesData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    fetchData();
  }, [router]);

  if (loading) {
      return (
          <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="w-12 h-12 text-indigo-600 fill-indigo-600" />
              </motion.div>
          </div>
      )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Sidebar - Desktop Only */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col z-50">
          <div className="p-8">
              <Link href="/" className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                      <Zap className="w-6 h-6 text-white fill-white" />
                  </div>
                  <span className="font-black text-2xl tracking-tighter uppercase">DesignHunt</span>
              </Link>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-1">
              <SidebarItem 
                icon={LayoutDashboard} 
                label="Overview" 
                active={activeTab === 'overview'} 
                onClick={() => setActiveTab('overview')} 
              />
              <SidebarItem 
                icon={Video} 
                label="My Courses" 
                active={activeTab === 'courses'} 
                onClick={() => setActiveTab('courses')} 
              />
              <SidebarItem 
                icon={BarChart3} 
                label="Analytics" 
                active={activeTab === 'analytics'} 
                onClick={() => setActiveTab('analytics')} 
              />
              <SidebarItem 
                icon={DollarSign} 
                label="Earnings" 
                active={activeTab === 'earnings'} 
                onClick={() => setActiveTab('earnings')} 
              />
              <SidebarItem 
                icon={Users} 
                label="Mentorship" 
                active={activeTab === 'mentorship'} 
                onClick={() => setActiveTab('mentorship')} 
              />
          </nav>

          <div className="p-4 mt-auto">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Pro Faculty</p>
                  <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full border border-indigo-200" />
                      <div>
                          <p className="text-sm font-bold truncate w-32">Master Tutor</p>
                          <p className="text-[10px] text-slate-500 font-medium">Verify Status</p>
                      </div>
                  </div>
              </div>
          </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen pb-20">
          
          {/* Top Bar */}
          <header className="h-20 bg-white/80 backdrop-blur-md sticky top-0 border-b border-slate-200 flex items-center justify-between px-8 z-40">
              <div className="flex items-center gap-6 flex-1 max-w-xl">
                  <div className="relative w-full">
                      <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text" 
                        placeholder="Search student or course..." 
                        className="w-full pl-11 pr-4 py-2.5 bg-slate-100 border-transparent rounded-full text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                      />
                  </div>
              </div>

              <div className="flex items-center gap-4">
                  <button className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                      <Bell className="w-5 h-5" />
                      <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
                  </button>
                  <div className="h-8 w-[1px] bg-slate-200 mx-2" />
                  <Link href="/tutor/courses/create" className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-100">
                      <Plus className="w-4 h-4" /> Create Course
                  </Link>
              </div>
          </header>

          <div className="p-8 max-w-7xl mx-auto">
              
              {/* Welcome Header */}
              <div className="mb-10">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                        <h1 className="text-3xl font-black text-slate-900 mb-1">Welcome back, Mentor! 👋</h1>
                        <p className="text-slate-500 font-medium">Here's what's happening with your courses today.</p>
                  </motion.div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                  <PremiumStatCard 
                    label="Total Students" 
                    value={stats?.totalStudents || 0} 
                    icon={Users} 
                    color="text-indigo-600"
                    bg="bg-indigo-50"
                  />
                  <PremiumStatCard 
                    label="Revenue" 
                    value={stats?.totalEarnings || "$0.00"} 
                    icon={DollarSign} 
                    color="text-emerald-600"
                    bg="bg-emerald-50"
                  />
                  <PremiumStatCard 
                    label="Avg. Session" 
                    value="42m" 
                    icon={Zap} 
                    color="text-amber-600"
                    bg="bg-amber-50"
                  />
                  <PremiumStatCard 
                    label="Course Views" 
                    value={stats?.courseViews || "0"} 
                    icon={TrendingUp} 
                    color="text-rose-600"
                    bg="bg-rose-50"
                  />
              </div>

              {/* Main Content Sections */}
              <div className="grid lg:grid-cols-3 gap-8">
                  
                  {/* Left Column: Courses & Chart */}
                  <div className="lg:col-span-2 space-y-8">
                      
                      {/* Revenue Chart - SVG Visual */}
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm overflow-hidden relative"
                      >
                          <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h2 className="text-xl font-black text-slate-900">Revenue Metrics</h2>
                                    <p className="text-sm font-medium text-slate-400">Monthly overview</p>
                                </div>
                                <select className="bg-slate-50 border-none outline-none text-xs font-bold uppercase tracking-wider p-2 rounded-lg">
                                    <option>Last 30 Days</option>
                                    <option>Last 6 Months</option>
                                </select>
                          </div>
                          
                          {/* Simplified SVG Chart */}
                          <div className="h-48 w-full relative group">
                                <svg viewBox="0 0 100 40" className="w-full h-full stroke-indigo-600 stroke-[0.5] fill-indigo-50/50">
                                    <path 
                                        d="M0,40 L0,30 Q10,15 20,25 T40,10 T60,20 T80,5 T100,20 L100,40 Z" 
                                        className="transition-all hover:fill-indigo-100/50"
                                    />
                                    <path 
                                        d="M0,30 Q10,15 20,25 T40,10 T60,20 T80,5 T100,20" 
                                        fill="none" 
                                        className="stroke-indigo-600 path-draw"
                                    />
                                </svg>
                                {/* Chart Tooltip Mock */}
                                <div className="absolute top-4 right-1/4 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                    $4,250 Peak
                                </div>
                          </div>

                          <div className="flex justify-between mt-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
                                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                          </div>
                      </motion.div>

                      {/* Active Courses List */}
                      <div>
                          <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-black text-slate-900">Active Courses</h2>
                                <Link href="/tutor/courses" className="text-sm font-bold text-indigo-600 hover:underline">View All</Link>
                          </div>
                          
                          <div className="grid gap-4">
                              <AnimatePresence>
                              {courses.length === 0 ? (
                                  <div className="p-12 bg-indigo-50/50 border-2 border-dashed border-indigo-200 rounded-[32px] text-center">
                                      <BookOpen className="w-12 h-12 text-indigo-200 mx-auto mb-4" />
                                      <p className="font-bold text-indigo-400 mb-4">No published courses yet.</p>
                                      <Link href="/tutor/courses/create" className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-full">
                                          Create First Course
                                      </Link>
                                  </div>
                              ) : (
                                  courses.map((course, idx) => (
                                      <CourseRowItem key={course.id} course={course} index={idx} />
                                  ))
                              )}
                              </AnimatePresence>
                          </div>
                      </div>
                  </div>

                  {/* Right Column: Activity & Mentorship */}
                  <div className="space-y-8">
                      {/* Recent Activity */}
                      <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
                          <h2 className="text-xl font-black text-slate-900 mb-6">Recent Activity</h2>
                          <div className="space-y-6">
                                <ActivityItem student="John Doe" action="enrolled in" target="UI Design Mastery" time="2h ago" />
                                <ActivityItem student="Sarah Smith" action="left a review on" target="Advanced Typography" time="5h ago" />
                                <ActivityItem student="Portfolio Feedback" action="requested by" target="Alex Rivera" time="8h ago" />
                                <ActivityItem student="Payment" action="received for" target="May Payout" time="1d ago" highlight />
                          </div>
                          <button className="w-full py-3 mt-8 border-2 border-slate-100 rounded-2xl text-slate-400 font-bold text-sm hover:bg-slate-50 hover:border-slate-200 transition-all uppercase tracking-wider">
                              Full Report
                          </button>
                      </div>

                      {/* Quick Actions */}
                      <div className="bg-indigo-900 p-8 rounded-[32px] text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
                          <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500 rounded-full blur-2xl opacity-50 group-hover:scale-150 transition-transform duration-700" />
                          <div className="relative z-10">
                              <h3 className="text-xl font-black mb-2 leading-tight">Need help building your course?</h3>
                              <p className="text-indigo-200 text-sm font-medium mb-6">Access our exclusive creator toolkit and templates.</p>
                              <button className="flex items-center gap-2 bg-white text-indigo-900 px-6 py-3 rounded-2xl font-black text-sm hover:bg-indigo-50 transition-all">
                                  OPEN TOOLKIT <ChevronRight className="w-4 h-4" />
                              </button>
                          </div>
                      </div>
                  </div>

              </div>
          </div>
      </main>

      <style jsx global>{`
          .path-draw {
              stroke-dasharray: 200;
              stroke-dashoffset: 200;
              animation: draw 2s ease-out forwards;
          }
          @keyframes draw {
              to { stroke-dashoffset: 0; }
          }
      `}</style>
    </div>
  );
}

function SidebarItem({ icon: Icon, label, active, onClick }: any) {
    return (
        <button 
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 relative group ${
                active 
                ? "bg-indigo-50 text-indigo-600" 
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            }`}
        >
            {active && <motion.div layoutId="active-pill" className="absolute left-0 w-1 h-6 bg-indigo-600 rounded-full" />}
            <Icon className={`w-5 h-5 ${active ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-900"}`} />
            <span className="font-bold text-sm">{label}</span>
        </button>
    )
}

function PremiumStatCard({ label, value, icon: Icon, color, bg }: any) {
    return (
        <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm flex flex-col justify-between"
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${bg}`}>
                    <Icon className={`w-6 h-6 ${color}`} />
                </div>
            </div>
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{value}</h3>
            </div>
        </motion.div>
    )
}

function CourseRowItem({ course, index }: any) {
    return (
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group flex flex-col md:flex-row items-center gap-6 p-5 bg-white border border-slate-200 rounded-[24px] hover:border-indigo-600 hover:shadow-xl hover:shadow-indigo-50/50 transition-all cursor-pointer"
        >
            <div className="w-full md:w-32 h-20 bg-slate-100 rounded-2xl overflow-hidden border border-slate-100 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={course.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            
            <div className="flex-1 w-full md:w-auto">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-wider">{course.category}</span>
                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider">{course.status}</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight mb-1">{course.title}</h3>
                <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                    <div className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {course.studentCount || 0} Students</div>
                    <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> 4 weeks</div>
                </div>
            </div>

            <div className="flex items-center gap-8 w-full md:w-auto justify-between border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Total revenue</p>
                    <p className="text-lg font-black text-slate-900">{course.price}</p>
                </div>
                <button className="p-3 bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white rounded-xl transition-all">
                    <MoreVertical className="w-5 h-5" />
                </button>
            </div>
        </motion.div>
    )
}

function ActivityItem({ student, action, target, time, highlight }: any) {
    return (
        <div className="flex gap-4 items-start group">
            <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${highlight ? "bg-indigo-600" : "bg-slate-200 group-hover:bg-slate-400 transition-colors"}`} />
            <div className="flex-1">
                <p className="text-sm font-medium text-slate-600 leading-tight">
                    <span className="font-black text-slate-900 underline decoration-slate-200 underline-offset-2">{student}</span> {action} <span className="font-bold text-slate-900">{target}</span>
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{time}</p>
            </div>
        </div>
    )
}
