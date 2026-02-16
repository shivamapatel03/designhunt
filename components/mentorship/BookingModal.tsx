"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Calendar, Clock, CreditCard, CheckCircle2, User } from "lucide-react";

interface BookingModalProps {
  mentor: any;
  onClose: () => void;
}

export function BookingModal({ mentor, onClose }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBook = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep(3);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[10002] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl border-4 border-black"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="font-black uppercase tracking-wider text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Book Session
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <X className="w-5 h-5" />
            </button>
        </div>

        <div className="p-8">
            {step === 1 && (
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <img src={mentor.image} alt={mentor.name} className="w-16 h-16 rounded-full border-2 border-black object-cover" />
                        <div>
                            <h2 className="text-2xl font-black">{mentor.name}</h2>
                            <p className="text-gray-500 font-bold text-sm">{mentor.role}</p>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4 block">Select Availability</label>
                        <div className="grid grid-cols-2 gap-3">
                            {mentor.availability.map((slot: string) => (
                                <button 
                                    key={slot}
                                    onClick={() => setSelectedSlot(slot)}
                                    className={`p-4 rounded-xl border-2 font-bold text-sm transition-all text-left flex justify-between items-center
                                        ${selectedSlot === slot 
                                            ? 'border-black bg-black text-white' 
                                            : 'border-gray-200 hover:border-black text-gray-600'
                                        }
                                    `}
                                >
                                    {slot}
                                    {selectedSlot === slot && <CheckCircle2 className="w-4 h-4 text-accent-yellow" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                        <div>
                            <div className="text-xs font-bold text-gray-400 uppercase">Total Cost</div>
                            <div className="text-2xl font-black">${mentor.rate} <span className="text-sm font-medium text-gray-400">/ session</span></div>
                        </div>
                        <button 
                            disabled={!selectedSlot}
                            onClick={() => setStep(2)}
                            className="px-8 py-3 bg-accent-blue text-white font-black rounded-xl uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-6 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CreditCard className="w-8 h-8 text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-black">Confirm Payment</h2>
                    <p className="text-gray-500">You are about to book a session with {mentor.name} for <strong>{selectedSlot}</strong>.</p>
                    
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-left space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Session Fee</span>
                            <span className="font-bold">${mentor.rate}.00</span>
                        </div>
                         <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Service Fee</span>
                            <span className="font-bold">$5.00</span>
                        </div>
                        <div className="pt-2 border-t border-gray-200 flex justify-between font-black text-lg">
                            <span>Total</span>
                            <span>${mentor.rate + 5}.00</span>
                        </div>
                    </div>

                    <button 
                        onClick={handleBook}
                        disabled={isProcessing}
                        className="w-full py-4 bg-black text-white font-black rounded-xl uppercase tracking-widest hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                    >
                        {isProcessing ? (
                            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</>
                        ) : (
                            <>Pay & Book Now <ArrowRight className="w-4 h-4" /></>
                        )}
                    </button>
                    <button onClick={() => setStep(1)} className="text-sm font-bold text-gray-400 hover:text-black">Back to Slot Selection</button>
                </div>
            )}

            {step === 3 && (
                <div className="text-center py-8">
                     <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                        <CheckCircle2 className="w-12 h-12 text-green-600" />
                    </motion.div>
                    <h2 className="text-3xl font-black mb-2">Booking Confirmed!</h2>
                    <p className="text-gray-500 max-w-xs mx-auto mb-8">
                        Check your email for the calendar invite and Zoom link. Get your portfolio ready!
                    </p>
                    <button onClick={onClose} className="px-8 py-3 border-2 border-black font-black rounded-xl uppercase tracking-wider hover:bg-black hover:text-white transition-colors">
                        Close
                    </button>
                </div>
            )}
        </div>
      </motion.div>
    </div>
  );
}

function ArrowRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}
