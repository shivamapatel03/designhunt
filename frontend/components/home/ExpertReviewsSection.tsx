"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

export function ExpertReviewsSection({ reviews }: { reviews: any[] }) {
  if (!reviews || reviews.length === 0) return null;

  return (
    <section className="py-24 bg-[#E0E7FF] border-y-4 border-black overflow-hidden relative">
      <div className="container mx-auto px-6 md:px-16 lg:px-24 mb-16 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-black mb-6 font-clash uppercase tracking-tight">
          Top Reviews <br className="md:hidden" /> By Experts
        </h2>
        <p className="text-xl font-medium font-clash text-gray-700">
          See what industry leaders are saying about our methods.
        </p>
      </div>

      <div className="relative flex overflow-x-hidden group">
        <div className="flex animate-marquee group-hover:pause space-x-6 px-3">
          {[...reviews, ...reviews, ...reviews].map((review, i) => (
            <div
              key={`${review.id}-${i}`}
              className="w-[350px] sm:w-[400px] shrink-0 bg-white border-4 border-black rounded-[32px] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-300 flex flex-col"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(review.rating)
                        ? "text-[#FFD700] fill-[#FFD700]"
                        : "text-gray-300 fill-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-lg font-bold italic text-black mb-6 flex-grow">
                "{review.content}"
              </p>
              
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-black shrink-0 relative bg-gradient-to-br from-[#93C5FD] to-[#3B82F6]">
                  {review.author_image ? (
                     <img src={review.author_image} alt={review.author_name} className="w-full h-full object-cover" />
                  ) : (
                     <div className="w-full h-full flex items-center justify-center font-black text-white text-xl uppercase">
                         {review.author_name.charAt(0)}
                     </div>
                  )}
                </div>
                <div>
                  <h4 className="font-black text-black uppercase">{review.author_name}</h4>
                  <p className="text-sm font-bold text-gray-500 uppercase">{review.author_title || "Verified Expert"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-[#E0E7FF] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-[#E0E7FF] to-transparent z-10 pointer-events-none"></div>
      </div>
    </section>
  );
}
