"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  remote: boolean;
  level: "Junior" | "Mid" | "Senior" | "Lead";
  tech: string[];
  blurb: string;
}

interface JobCardProps {
  job: Job;
  index: number;
  onSwipe: (direction: "left" | "right") => void;
  isTop: boolean;
  onOpen: (job: Job) => void;
  onSave: (job: Job) => void;
  isSaved: boolean;
  isApplied: boolean;
}

export function JobCard({
  job,
  index,
  onSwipe,
  isTop,
  onOpen,
  onSave,
  isSaved,
  isApplied,
}: JobCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-12, 0, 12]);
  const opacity = useTransform(x, [-220, 0, 220], [0, 1, 0]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isTop) return;
      if (e.key === "ArrowLeft") onSwipe("left");
      if (e.key === "ArrowRight") onSwipe("right");
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isTop, onSwipe]);

  return (
    <motion.div
      className={cn(
        "absolute inset-0 m-auto h-[520px] w-full max-w-xl",
        "bg-white border-4 border-black shadow-2xl rounded-2xl overflow-hidden",
        "flex flex-col"
      )}
      style={{ x, rotate, opacity, zIndex: 100 - index }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={(_, info) => {
        if (!isTop) return;
        if (info.offset.x > 140) onSwipe("right");
        else if (info.offset.x < -140) onSwipe("left");
        else x.set(0);
      }}
      initial={{ y: index * 8, scale: 1 - index * 0.03 }}
      animate={{ y: index * 8, scale: 1 - index * 0.03 }}
      transition={{ type: "spring", stiffness: 200, damping: 22 }}
      onDoubleClick={() => onOpen(job)}
    >
      {(isSaved || isApplied) && (
        <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
          {isApplied && (
            <span className="px-3 py-1 border-2 border-black bg-cyan-400 text-black text-xs font-black">
              Applied
            </span>
          )}
          {isSaved && !isApplied && (
            <span className="px-3 py-1 border-2 border-black bg-white text-black text-xs font-black">
              Saved
            </span>
          )}
        </div>
      )}
      <div className="bg-black text-cyan-400 p-4 border-b-4 border-cyan-400">
        <div className="flex items-center justify-between">
          <div className="font-black text-xl">{job.title}</div>
          <div className="text-xs font-mono">{job.level}</div>
        </div>
        <div className="text-sm font-mono text-white/70">
          {job.company} • {job.location} {job.remote ? "• Remote" : ""}
        </div>
      </div>

      <div className="p-5 flex-1 overflow-auto">
        <p className="font-mono text-sm text-gray-800 leading-relaxed mb-4">
          {job.blurb}
        </p>
        <div className="flex flex-wrap gap-2">
          {job.tech.map((t) => (
            <span
              key={t}
              className="px-2 py-1 border-2 border-black bg-cyan-400 text-black text-xs font-black"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="p-4 border-t-4 border-black bg-white flex gap-3">
        <button
          onClick={() => onSwipe("left")}
          aria-label="Pass job"
          className="w-1/3 bg-white text-black border-4 border-black px-4 py-2 font-black hover:bg-black hover:text-cyan-400 transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300"
        >
          PASS
        </button>
        <button
          onClick={() => onSave(job)}
          aria-label="Save job"
          className="w-1/3 bg-white text-black border-4 border-black px-4 py-2 font-black hover:bg-cyan-400 hover:text-black transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300"
        >
          SAVE
        </button>
        <button
          onClick={() => onSwipe("right")}
          aria-label="Quick apply to job"
          className="w-1/3 bg-cyan-400 text-black border-4 border-black px-4 py-2 font-black hover:bg-black hover:text-cyan-400 transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300"
        >
          QUICK APPLY
        </button>
      </div>
    </motion.div>
  );
}


