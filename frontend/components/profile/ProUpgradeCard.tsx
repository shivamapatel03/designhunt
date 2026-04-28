"use client";

import { useState } from "react";
import { CheckCircle2, Zap, Loader2, Star } from "lucide-react";
import { loadRazorpayScript } from "@/lib/razorpay";

interface ProUpgradeCardProps {
  isPro: boolean;
  userEmail?: string;
  userName?: string;
  onUpgrade: () => void;
}

export function ProUpgradeCard({ isPro, userEmail, userName, onUpgrade }: ProUpgradeCardProps) {
  const [loadingAmount, setLoadingAmount] = useState<number | null>(null);

  const handleUpgrade = async (amount: number) => {
    setLoadingAmount(amount);
    try {
      const res = await loadRazorpayScript();
      if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        return;
      }

      // Create Order on Backend
      const orderResponse = await fetch(`/api/payments/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const orderData = await orderResponse.json();

      if (!orderResponse.ok) throw new Error(orderData.error);

      // Open Razorpay Checkout
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Designhunt.",
        description: "Unlock Pro Features",
        order_id: orderData.orderId,
        handler: async function (response: any) {
          // Verify Payment
          const verifyResponse = await fetch(`/api/payments/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: amount
            }),
          });
          
          if (verifyResponse.ok) {
            alert("Payment successful! You are now a PRO member.");
            onUpgrade();
          } else {
            const verifyData = await verifyResponse.json();
            alert("Payment verification failed: " + verifyData.error);
          }
        },
        prefill: {
          name: userName,
          email: userEmail,
        },
        theme: {
          color: "#000000",
        },
      };

      const rzp1 = new (window as any).Razorpay(options);
      rzp1.open();
    } catch (error: any) {
      console.error(error);
      alert("Payment failed: " + error.message);
    } finally {
      setLoadingAmount(null);
    }
  };

  if (isPro) {
    return (
      <div className="bg-black text-white p-8 rounded-[32px] border-4 border-black relative overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)]">
        <div className="absolute top-0 right-0 p-8 opacity-20">
          <Star className="w-32 h-32 text-yellow-500 fill-yellow-500" />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500 text-black text-xs font-black uppercase tracking-widest mb-4">
            <Star className="w-3 h-3 fill-black" /> Pro Member
          </div>
          <h3 className="text-3xl font-black mb-2">You are a Pro!</h3>
          <p className="text-gray-400 font-medium max-w-sm">
            Thank you for supporting Designhunt.. You have fully unlocked access to all premium tools and content.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black text-white p-8 rounded-[40px] border-4 border-black relative overflow-hidden shadow-[12px_12px_0px_0px_rgba(0,0,0,0.5)]">
       {/* Decorative Elements */}
       <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
       <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-pink/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10">
        <div className="mb-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-yellow text-black text-xs font-black uppercase tracking-widest mb-4">
             <Zap className="w-3 h-3 fill-black" /> Pro Tiers
          </div>
          <h3 className="text-4xl font-black mb-2">Power up your Design Agent</h3>
          <p className="text-gray-400 font-medium">Choose a plan to get instant AI teardowns of your work.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "Single", scans: "1 Scan", price: 10, color: "accent-blue" },
            { name: "Starter", scans: "10 Scans", price: 199, color: "accent-blue" },
            { name: "Popular", scans: "20 Scans", price: 599, color: "accent-yellow" },
            { name: "Unlimited", scans: "45 Scans", price: 999, color: "accent-pink" }
          ].map((tier) => (
            <div key={tier.name} className="bg-white/5 border border-white/10 p-4 rounded-[24px] hover:bg-white/10 transition-all flex flex-col justify-between group h-full">
              <div>
                <div className={`text-${tier.color} font-black uppercase text-[10px] tracking-widest mb-1`}>{tier.name}</div>
                <div className="text-xl font-black mb-1 leading-tight">{tier.scans}</div>
                <div className="text-sm font-bold text-gray-500 mb-4 font-mono">₹{tier.price}</div>
              </div>
              
              <button
                onClick={() => handleUpgrade(tier.price)}
                disabled={loadingAmount !== null}
                className={`w-full py-2 ${tier.name === 'Popular' ? 'bg-accent-yellow text-black' : 'bg-white/10 text-white hover:bg-white/20'} font-black rounded-lg transition-all flex items-center justify-center gap-2 text-xs`}
              >
                {loadingAmount === tier.price ? <Loader2 className="w-3 h-3 animate-spin" /> : "Buy"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
