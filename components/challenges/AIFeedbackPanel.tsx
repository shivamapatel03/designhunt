import { CheckCircle2, AlertTriangle, XCircle, Zap } from "lucide-react";

interface FeedbackItem {
    name: string;
    status: 'pass' | 'warning' | 'fail';
    score: number;
    comment: string;
}

interface FeedbackData {
    score: number;
    summary: string;
    criteria: FeedbackItem[];
}

interface AIFeedbackPanelProps {
    isAnalyzing: boolean;
    feedback: FeedbackData | null;
}

export function AIFeedbackPanel({ isAnalyzing, feedback }: AIFeedbackPanelProps) {
    if (isAnalyzing) {
        return (
            <div className="h-full min-h-[400px] bg-black text-white rounded-xl p-8 flex flex-col items-center justify-center text-center border-4 border-accent-blue relative overflow-hidden">
                {/* Simulated scanning effect */}
                <div className="absolute top-0 left-0 w-full h-1 bg-accent-blue shadow-[0_0_20px_5px_rgba(0,123,255,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
                
                <Zap className="w-16 h-16 text-accent-yellow mb-6 animate-pulse" />
                <h3 className="text-2xl font-bold mb-2">AI Agent is Analyzing...</h3>
                <p className="text-gray-400 max-w-xs">Checking contrast, layout structure, typography hierarchy, and accessibility guidelines.</p>
                
                <div className="mt-8 flex gap-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-0"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200"></div>
                </div>

                <style jsx>{`
                    @keyframes scan {
                        0% { top: 0%; opacity: 0; }
                        10% { opacity: 1; }
                        90% { opacity: 1; }
                        100% { top: 100%; opacity: 0; }
                    }
                `}</style>
            </div>
        )
    }

    if (!feedback) {
        return (
            <div className="h-full min-h-[300px] bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-center p-8">
                 <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                    <Zap className="w-8 h-8 text-gray-300" />
                 </div>
                 <h3 className="font-bold text-gray-400">No Analysis Yet</h3>
                 <p className="text-sm text-gray-400 mt-2">Upload a design to get instant AI feedback.</p>
            </div>
        )
    }

    return (
        <div className="bg-white border-2 border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_#000] animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-start justify-between mb-8 border-b pb-6">
                <div>
                   <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-5 h-5 text-accent-blue" />
                        <span className="font-bold text-accent-blue uppercase tracking-wider text-xs">AI Critique Report</span>
                   </div>
                   <h2 className="text-3xl font-extrabold mb-2">Design Score</h2>
                   <p className="text-gray-600 text-sm max-w-md">{feedback.summary}</p>
                </div>
                <div className="text-center">
                    <div className="text-5xl font-black text-black mb-1">{feedback.score}</div>
                    <div className="text-xs font-bold text-gray-400 uppercase">out of 100</div>
                </div>
            </div>

            <div className="space-y-4">
                {feedback.criteria.map((item, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                {item.status === 'pass' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                                {item.status === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-500" />}
                                {item.status === 'fail' && <XCircle className="w-5 h-5 text-red-500" />}
                                <span className="font-bold">{item.name}</span>
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded ${
                                item.status === 'pass' ? 'bg-green-100 text-green-700' : 
                                item.status === 'warning' ? 'bg-yellow-100 text-yellow-700' : 
                                'bg-red-100 text-red-700'
                            }`}>
                                {item.score}/100
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 pl-8">{item.comment}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
