"use client";

import { motion } from 'framer-motion';
import { 
  Plus, 
  BookOpen, 
  Users, 
  TrendingUp, 
  Clock, 
  MoreVertical,
  ChevronRight,
  Star,
  ArrowLeft,
  Globe,
  DollarSign
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getTutorDashboardData } from '@/app/actions/tutor';
import { DashboardToggle } from '@/components/layout/DashboardToggle';

export default function TutorDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const res = await getTutorDashboardData();
      if (!res.error) {
        setData(res);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
        <div className="container mx-auto px-4 pt-32 text-center">
            <div className="text-2xl font-black animate-pulse">LOADING YOUR DASHBOARD...</div>
        </div>
    );
  }

  const { stats, courses } = data || { stats: { totalStudents: 0, activeCourses: 0, rating: 0, revenue: '$0' }, courses: [] };

  return (
    <div className="container mx-auto px-4 pt-32 pb-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation & Header */}
        <div className="mb-8 flex justify-between items-center">
          <DashboardToggle />
        </div>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-2">Instructor Hub</h1>
            <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">Manage your content and track student success</p>
          </div>
          
          <Link href="/tutor-dashboard/courses/new" className="px-8 py-4 bg-black text-white border-2 border-black rounded-xl font-black flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
            <Plus className="w-5 h-5" /> CREATE NEW COURSE
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <StatCard label="Total Students" value={stats.totalStudents.toString()} icon={<Users className="w-6 h-6" />} color="bg-accent-blue" />
          <StatCard label="Active Courses" value={stats.activeCourses.toString()} icon={<BookOpen className="w-6 h-6" />} color="bg-accent-yellow" />
          <StatCard label="Course Rating" value={stats.rating.toString()} icon={<Star className="w-6 h-6" />} color="bg-accent-pink" />
          <StatCard label="Total Revenue" value={stats.revenue} icon={<DollarSign className="w-6 h-6" />} color="bg-green-100" />
        </div>

        {/* Recent Activity & Courses */}
        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* Main Content: Courses */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black uppercase tracking-tight">Active Courses</h2>
              <Link href="/tutor-dashboard/courses" className="text-sm font-black uppercase text-accent-blue hover:underline">View All</Link>
            </div>

            <div className="grid gap-6">
              {courses.length > 0 ? courses.map((course: any) => (
                <CourseManagementCard 
                  key={course.id}
                  id={course.id}
                  title={course.title}
                  students={course.student_count || 0} 
                  status={course.status} 
                  progress={0} 
                  thumbnail={course.thumbnail || "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&q=80"} 
                />
              )) : (
                <div className="p-12 border-4 border-dashed border-gray-100 rounded-[32px] text-center">
                    <p className="font-bold text-gray-400">No courses yet. Start by creating one!</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar: Notifications/Activity */}
          <div className="space-y-8">
            <h2 className="text-2xl font-black uppercase tracking-tight">Recent Activity</h2>
            <div className="bg-white border-2 border-black rounded-[32px] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] divide-y-2 divide-gray-50">
                <ActivityItem label="Tips" desc="Welcome to the new Cloud Dashboard!" time="Just now" />
                <ActivityItem label="Status" desc="Your account is fully migrated." time="1h ago" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string, value: string, icon: any, color: string }) {
  return (
    <div className="bg-white border-2 border-black rounded-3xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4">
      <div className={`w-12 h-12 ${color} rounded-xl border-2 border-black flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{label}</h4>
        <div className="text-2xl font-black tracking-tighter">{value}</div>
      </div>
    </div>
  );
}

function CourseManagementCard({ id, title, students, status, progress, thumbnail }: any) {
  return (
    <div className="group bg-white border-2 border-black rounded-[32px] overflow-hidden flex flex-col md:flex-row shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] transition-all">
      <div className="w-full md:w-48 aspect-video md:aspect-square bg-gray-100 relative">
        <img src={thumbnail} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
        <div className={`absolute top-4 left-4 px-3 py-1 text-[10px] font-black uppercase rounded-full border-2 border-black ${status === 'APPROVED' ? 'bg-green-400' : 'bg-accent-yellow'}`}>
          {status}
        </div>
      </div>
      
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-black tracking-tight">{title}</h3>
            <div className="flex gap-2">
                <Link href={`/courses/${id}`} target="_blank" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Globe className="w-5 h-5" />
                </Link>
                <button className="p-2 hover:bg-gray-100 rounded-lg"><MoreVertical className="w-5 h-5" /></button>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {students} Students</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 12h Content</span>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
           <div className="flex-1 h-3 bg-gray-100 border-2 border-black rounded-full overflow-hidden">
              <div className="h-full bg-accent-blue" style={{ width: `${progress}%` }}></div>
           </div>
           <span className="text-xs font-black">{progress}% Complete</span>
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ label, desc, time }: any) {
  return (
    <div className="py-4 first:pt-0 last:pb-0">
      <p className="text-[10px] font-black uppercase text-accent-blue mb-1">{label}</p>
      <p className="text-sm font-bold leading-tight mb-1">{desc}</p>
      <span className="text-[10px] text-gray-400 font-bold uppercase">{time}</span>
    </div>
  );
}
