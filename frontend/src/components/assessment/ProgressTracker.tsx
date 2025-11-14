"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressTrackerProps {
  currentQuestion: number;
  totalQuestions: number;
  completedSections?: string[];
}

const sections = [
  { id: "personality", label: "Personality", icon: "🧠" },
  { id: "work_style", label: "Work Style", icon: "⚡" },
  { id: "skills", label: "Skills", icon: "💻" },
  { id: "preferences", label: "Preferences", icon: "❤️" },
];

export function ProgressTracker({ currentQuestion, totalQuestions, completedSections = [] }: ProgressTrackerProps) {
  const progress = (currentQuestion / totalQuestions) * 100;

  return (
    <div className="border-4 border-black bg-white p-4 mb-6 rounded-xl">
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-sm font-bold text-black">
            Question {currentQuestion} of {totalQuestions}
          </span>
          <span className="font-mono text-sm font-bold text-cyan-500">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden border-2 border-black">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-cyan-400 to-purple-400"
          />
        </div>
      </div>

      {/* Section Progress */}
      <div className="grid grid-cols-4 gap-2">
        {sections.map((section, index) => {
          const isCompleted = completedSections.includes(section.id);
          const isActive = index === Math.floor((currentQuestion / totalQuestions) * 4);
          
          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition-all",
                isCompleted
                  ? "bg-green-100 border-green-500"
                  : isActive
                  ? "bg-cyan-100 border-cyan-500"
                  : "bg-gray-50 border-gray-300"
              )}
            >
              <div className="text-lg">{section.icon}</div>
              <div className="text-xs font-mono font-bold text-center">
                {section.label}
              </div>
              {isCompleted && (
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

