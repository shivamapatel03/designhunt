import { CheckCircle2, XCircle, Keyboard, Zap } from "lucide-react";

export default function ToolPage({ params }: { params: { slug: string } }) {
  // Mock data
  const slug = params.slug || 'figma';
  const toolName = slug.charAt(0).toUpperCase() + slug.slice(1);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
       {/* Header */}
       <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-5xl font-extrabold mb-4">{toolName} Mastery</h1>
            <p className="text-xl text-muted-foreground">The industry standard for interface design and prototyping.</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right">
                <p className="text-sm font-bold text-gray-500">Your Mastery</p>
                <p className="text-3xl font-extrabold text-accent-blue">42%</p>
             </div>
             <div className="w-16 h-16 rounded-full border-4 border-gray-200 flex items-center justify-center relative">
                 <svg className="w-full h-full transform -rotate-90">
                     <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-100" />
                     <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="175.93" strokeDashoffset="102" className="text-accent-blue" />
                 </svg>
             </div>
          </div>
       </header>

       <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
             {/* Progress Section */}
            <section>
                <h2 className="text-2xl font-bold mb-6">Learning Modules</h2>
                <div className="space-y-4">
                    <ModuleItem title="Interface Basics" progress={100} />
                    <ModuleItem title="Pen Tool Mastery" progress={60} />
                    <ModuleItem title="Auto Layout Deep Dive" progress={30} isCurrent />
                    <ModuleItem title="Component Properties" progress={0} />
                    <ModuleItem title="Prototyping Variables" progress={0} />
                </div>
            </section>

            {/* Shortcuts */}
            <section className="bg-black text-white p-8 rounded-2xl shadow-[8px_8px_0px_0px_#007BFF]">
                 <div className="flex items-center gap-3 mb-6">
                    <Keyboard className="w-6 h-6 text-accent-yellow" />
                    <h2 className="text-2xl font-bold">Essential Shortcuts</h2>
                 </div>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <ShortcutKey keys={['A']} description="Artboard / Frame" />
                    <ShortcutKey keys={['T']} description="Text Tool" />
                    <ShortcutKey keys={['R']} description="Rectangle" />
                    <ShortcutKey keys={['Shift', 'A']} description="Add Auto Layout" />
                    <ShortcutKey keys={['Cmd', 'Option', 'K']} description="Create Component" />
                    <ShortcutKey keys={['Cmd', '/']} description="Quick Actions" />
                 </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
             <div className="p-6 border-2 border-black rounded-xl bg-white shadow-[4px_4px_0px_0px_#000]">
                <h3 className="font-bold mb-4">When to use {toolName}?</h3>
                <ul className="space-y-3">
                   <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                      <span>Ui Design & Prototyping</span>
                   </li>
                   <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                      <span>Design Systems</span>
                   </li>
                   <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                      <span>Developer Handoff</span>
                   </li>
                </ul>
                
                <div className="my-4 border-t border-gray-200"></div>

                 <h3 className="font-bold mb-4">When NOT to use?</h3>
                <ul className="space-y-3">
                   <li className="flex items-start gap-2 text-sm">
                      <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                      <span>Advanced Photo Editing (Use PS)</span>
                   </li>
                   <li className="flex items-start gap-2 text-sm">
                      <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                      <span>3D Modeling (Use Blender)</span>
                   </li>
                </ul>
             </div>

             <div className="p-6 bg-accent-pink text-white rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_#000]">
                <Zap className="w-8 h-8 mb-4 text-black" />
                <h3 className="font-bold text-lg mb-2">Pro Tip</h3>
                <p className="text-sm">Mastering Auto Layout is the single biggest productivity booster in Figma. Don't skip it!</p>
             </div>
          </aside>
       </div>
    </div>
  );
}

function ModuleItem({ title, progress, isCurrent = false }: { title: string, progress: number, isCurrent?: boolean }) {
    return (
        <div className={`p-4 border-2 rounded-lg flex items-center justify-between transition-all ${isCurrent ? 'border-accent-blue bg-blue-50' : 'border-gray-200 hover:border-black'}`}>
            <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${progress === 100 ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
                    {progress === 100 && <CheckCircle2 className="w-4 h-4" />}
                </div>
                <span className={`font-medium ${isCurrent ? 'text-accent-blue font-bold' : ''}`}>{title}</span>
            </div>
            <div className="flex items-center gap-3 w-1/3">
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-black transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>
                <span className="text-xs font-bold w-8 text-right">{progress}%</span>
            </div>
        </div>
    )
}

function ShortcutKey({ keys, description }: { keys: string[], description: string }) {
    return (
        <div>
            <div className="flex items-center gap-1 mb-2">
                {keys.map(k => (
                    <span key={k} className="px-2 py-1 bg-white/20 border border-white/30 rounded text-xs font-mono font-bold">{k}</span>
                ))}
            </div>
            <p className="text-xs text-gray-300">{description}</p>
        </div>
    )
}
