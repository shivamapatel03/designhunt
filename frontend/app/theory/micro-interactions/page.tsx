import { InteractionLab } from "@/components/theory/InteractionLab";
import { ArrowLeft, Zap, MessageSquare, Repeat } from "lucide-react";
import Link from "next/link";

export default function MicroInteractionsPage() {
  return (
    <div className="container mx-auto px-4 pt-16 sm:pt-20 pb-12">
        <Link href="/theory" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-black mb-10">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Theory Hub
        </Link>
        <header className="max-w-3xl mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Micro-interactions</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
                The details are not the details. They make the design. Small moments that serve a single purpose.
            </p>
        </header>

         <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 items-start">
            <div className="space-y-16">
                 <section>
                    <h2 className="text-2xl font-bold mb-6">Interaction Lab</h2>
                    <p className="text-lg text-gray-700 mb-6">
                        Experiment with how different feedback mechanisms change the "feel" of a simple button click.
                    </p>
                    <InteractionLab />
                </section>

                <section>
                     <h2 className="text-2xl font-bold mb-6">The 4 Parts</h2>
                     <div className="grid sm:grid-cols-2 gap-6">
                        <Card title="1. Trigger" icon={<Zap className="w-5 h-5" />} body="Initiates the interaction. Can be user-initiated (click) or system-initiated (notification)." />
                        <Card title="2. Rules" icon={<Repeat className="w-5 h-5" />} body="Determines what happens. 'If button is clicked, start loading animation'." />
                        <Card title="3. Feedback" icon={<MessageSquare className="w-5 h-5" />} body="Lets the user know the rule is working. Visual, audio, or haptic." />
                        <Card title="4. Loops & Modes" icon={<Repeat className="w-5 h-5" />} body="What happens next? Does it repeat? Does the state change permanently?" />
                     </div>
                </section>
            </div>

             <aside className="space-y-6 lg:sticky lg:top-24">
                <div className="p-6 border-2 border-black rounded-xl bg-white shadow-[4px_4px_0px_0px_#000]">
                    <h3 className="font-black text-xs uppercase tracking-widest text-gray-400 mb-4 border-b border-gray-100 pb-2">Key Terms</h3>
                    <ul className="space-y-3">
                        <li className="text-[13px] leading-tight">
                            <strong className="block text-black">Trigger</strong> 
                            <span className="text-gray-500">The user or system event that initiates the interaction.</span>
                        </li>
                        <li className="text-[13px] leading-tight">
                            <strong className="block text-black">Rules</strong> 
                            <span className="text-gray-500">The logic that determines what happens during an interaction.</span>
                        </li>
                        <li className="text-[13px] leading-tight">
                            <strong className="block text-black">Feedback</strong> 
                            <span className="text-gray-500">The physical or visual reaction the system provides to the user.</span>
                        </li>
                        <li className="text-[13px] leading-tight">
                            <strong className="block text-black">Loops & Modes</strong> 
                            <span className="text-gray-500">Determining the meta-rules, duration, and if the interaction repeats.</span>
                        </li>
                    </ul>
                </div>

                <div className="p-6 border-2 border-black rounded-xl bg-white shadow-[4px_4px_0px_0px_#000]">
                    <h3 className="font-bold mb-4">Examples</h3>
                    <ul className="space-y-3 text-sm text-gray-600">
                        <li className="flex items-center gap-2"><span>•</span> "Like" button animation</li>
                        <li className="flex items-center gap-2"><span>•</span> Pull to refresh</li>
                        <li className="flex items-center gap-2"><span>•</span> Password strength meter</li>
                        <li className="flex items-center gap-2"><span>•</span> Typing indicator</li>
                    </ul>
                </div>
            </aside>
         </div>
    </div>
  );
}

function Card({title, icon, body}: {title: string, icon: any, body: string}) {
    return (
        <div className="p-6 bg-white border border-gray-200 rounded-xl">
            <div className="flex items-center gap-2 mb-2 font-bold">
                {icon} {title}
            </div>
            <p className="text-sm text-gray-600">{body}</p>
        </div>
    )
}
