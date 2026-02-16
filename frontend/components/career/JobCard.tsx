
import { ArrowUpRight, Building2, MapPin, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface JobProps {
  company: string;
  role: string;
  location: string;
  type: string;
  salary: string;
  logo: string;
  tags: string[];
}

export function JobCard({ job, index }: { job: JobProps; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6 bg-white border-2 border-black rounded-2xl hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
    >
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-gray-50 border-2 border-black rounded-xl flex items-center justify-center text-2xl font-black overflow-hidden relative">
             <span className="z-10">{job.logo}</span>
             <div className={`absolute inset-0 opacity-20 ${index % 2 === 0 ? 'bg-accent-blue' : 'bg-accent-pink'}`} />
        </div>
        <div>
          <h3 className="text-xl font-black mb-1 group-hover:underline decoration-2 underline-offset-4">{job.role}</h3>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-bold text-gray-500 mb-2">
            <span className="flex items-center gap-1"><Building2 className="w-4 h-4" /> {job.company}</span>
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {job.type}</span>
          </div>
           <div className="flex gap-2">
            {job.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 bg-gray-100 rounded-md text-[10px] uppercase font-bold tracking-wider text-gray-600">
                    {tag}
                </span>
            ))}
         </div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2 w-full md:w-auto">
         <div className="text-lg font-black">{job.salary}</div>
         <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Posted 2d ago</div>
         <button className="w-full md:w-auto px-6 py-3 bg-black text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-accent-blue hover:text-black transition-colors flex items-center justify-center gap-2">
            Apply Now <ArrowUpRight className="w-4 h-4" />
         </button>
      </div>
    </motion.div>
  );
}
