"use client";

import { useState } from "react";
import { X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseTitle: string;
  price: string;
}

export function CheckoutModal({ isOpen, onClose, courseTitle, price }: CheckoutModalProps) {
  const [status, setStatus] = useState<"idle" | "processing" | "success">("idle");

  const handlePurchase = () => {
    setStatus("processing");
    // Simulate API call
    setTimeout(() => {
      setStatus("success");
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl border-2 border-black shadow-[8px_8px_0px_0px_#000] w-full max-w-md overflow-hidden relative">
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
        >
            <X className="w-5 h-5" />
        </button>

        <div className="p-8">
            {status === "success" ? (
                <div className="text-center py-8">
                    <motion.div 
                        initial={{ scale: 0 }} 
                        animate={{ scale: 1 }} 
                        className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                        <Check className="w-10 h-10 text-green-600" />
                    </motion.div>
                    <h2 className="text-3xl font-extrabold mb-2">You're In!</h2>
                    <p className="text-gray-600 mb-8">
                        You have successfully enrolled in <br/><span className="font-bold text-black">{courseTitle}</span>.
                    </p>
                    <button 
                        onClick={onClose}
                        className="w-full py-4 bg-black text-white font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-transform"
                    >
                        Start Learning Now
                    </button>
                </div>
            ) : (
                <>
                    <h2 className="text-2xl font-extrabold mb-2">Secure Checkout</h2>
                    <p className="text-gray-500 mb-8">Complete your purchase to unlock this course.</p>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-8">
                        <div className="flex justify-between items-center mb-2">
                             <span className="font-bold">{courseTitle}</span>
                             <span className="font-bold">{price}</span>
                        </div>
                        <div className="h-px bg-gray-200 my-2"></div>
                        <div className="flex justify-between items-center text-sm text-gray-500">
                             <span>Total</span>
                             <span>{price}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                         <input type="text" placeholder="Card Number (Simulation)" className="w-full p-3 border-2 border-gray-200 rounded-lg font-mono focus:border-black outline-none" disabled />
                         <div className="grid grid-cols-2 gap-4">
                             <input type="text" placeholder="MM/YY" className="w-full p-3 border-2 border-gray-200 rounded-lg font-mono focus:border-black outline-none" disabled />
                             <input type="text" placeholder="CVC" className="w-full p-3 border-2 border-gray-200 rounded-lg font-mono focus:border-black outline-none" disabled />
                         </div>
                    </div>

                    <button 
                        onClick={handlePurchase}
                        disabled={status === "processing"}
                        className="w-full mt-8 py-4 bg-accent-yellow border-2 border-black text-black font-bold rounded-xl hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_#000] active:translate-y-[0px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {status === "processing" ? (
                            <>
                                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                Processing...
                            </>
                        ) : (
                            `Pay ${price}`
                        )}
                    </button>
                </>
            )}
        </div>
      </div>
    </div>
  );
}
