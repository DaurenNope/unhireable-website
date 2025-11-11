"use client";

import { motion } from "framer-motion";

export interface LearningPath {
  id: string;
  title: string;
  focus: string;
  effort: "Low" | "Medium" | "High";
  payoff: "Quick" | "Near-term" | "Long-term";
  progress: number; // 0-100
  summary: string;
}

interface LearningPathCardProps {
  path: LearningPath;
  onOpen: (id: string) => void;
  onSave: (id: string) => void;
  onStart: (id: string) => void;
}

export function LearningPathCard({ path, onOpen, onSave, onStart }: LearningPathCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-4 border-black bg-white p-5 flex flex-col"
    >
      <div className="flex items-center justify-between">
        <div className="font-black text-xl">{path.title}</div>
        <div className="text-xs font-mono text-gray-600">{path.focus}</div>
      </div>
      <div className="mt-2 font-mono text-sm text-gray-700">{path.summary}</div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs font-mono">
        <div className="border-2 border-black p-2 text-center">
          Effort: <span className="font-black">{path.effort}</span>
        </div>
        <div className="border-2 border-black p-2 text-center">
          Payoff: <span className="font-black">{path.payoff}</span>
        </div>
        <div className="border-2 border-black p-2 text-center">
          Progress: <span className="font-black">{path.progress}%</span>
        </div>
      </div>
      <div className="mt-3 h-2 w-full border-2 border-black">
        <div
          className="h-full bg-cyan-400"
          style={{ width: `${path.progress}%` }}
        />
      </div>
      <div className="mt-4 flex gap-3">
        <button
          onClick={() => onOpen(path.id)}
          className="flex-1 bg-white text-black border-4 border-black px-4 py-2 font-black hover:bg-black hover:text-cyan-400 transition-colors"
        >
          VIEW RESOURCES
        </button>
        <button
          onClick={() => onSave(path.id)}
          className="bg-white text-black border-4 border-black px-4 py-2 font-black hover:bg-cyan-400 hover:text-black transition-colors"
        >
          SAVE
        </button>
        <button
          onClick={() => onStart(path.id)}
          className="bg-cyan-400 text-black border-4 border-black px-4 py-2 font-black hover:bg-black hover:text-cyan-400 transition-colors"
        >
          START
        </button>
      </div>
    </motion.div>
  );
}


