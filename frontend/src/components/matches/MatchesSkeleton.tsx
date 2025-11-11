"use client";

import { motion } from "framer-motion";

export function MatchesSkeleton() {
  return (
    <div className="relative h-[560px] flex items-center justify-center">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 m-auto h-[520px] w-full max-w-xl bg-white border-4 border-black rounded-2xl overflow-hidden shadow-2xl"
          initial={{ y: i * 8, scale: 1 - i * 0.03, opacity: 0 }}
          animate={{ y: i * 8, scale: 1 - i * 0.03, opacity: 1 }}
          transition={{ delay: i * 0.05 }}
        >
          <div className="bg-black p-4 border-b-4 border-cyan-400">
            <div className="h-6 w-48 bg-cyan-400/60 animate-pulse" />
            <div className="mt-2 h-3 w-64 bg-white/30 animate-pulse" />
          </div>
          <div className="p-5 space-y-3">
            <div className="h-3 bg-gray-200 animate-pulse" />
            <div className="h-3 bg-gray-200 animate-pulse w-11/12" />
            <div className="h-3 bg-gray-200 animate-pulse w-10/12" />
            <div className="flex gap-2 pt-2">
              <div className="h-6 w-16 bg-cyan-200 border-2 border-black animate-pulse" />
              <div className="h-6 w-16 bg-cyan-200 border-2 border-black animate-pulse" />
              <div className="h-6 w-16 bg-cyan-200 border-2 border-black animate-pulse" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t-4 border-black bg-white flex gap-3">
            <div className="h-10 flex-1 bg-gray-200 animate-pulse border-2 border-black" />
            <div className="h-10 flex-1 bg-gray-200 animate-pulse border-2 border-black" />
            <div className="h-10 flex-1 bg-cyan-200 animate-pulse border-2 border-black" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}


