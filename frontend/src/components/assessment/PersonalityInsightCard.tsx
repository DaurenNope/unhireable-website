"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, TrendingUp, Users, Heart, Brain, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface PersonalityInsightCardProps {
  insight: {
    type: "personality" | "work_style" | "culture_fit" | "skill" | "trajectory";
    title: string;
    description: string;
    traits?: Array<{ trait: string; score: number }>;
    icon?: string;
  };
  onDismiss?: () => void;
}

const iconMap = {
  personality: Brain,
  work_style: Zap,
  culture_fit: Heart,
  skill: TrendingUp,
  trajectory: Users,
};

const colorMap = {
  personality: "from-purple-400 to-pink-500",
  work_style: "from-cyan-400 to-blue-500",
  culture_fit: "from-green-400 to-emerald-500",
  skill: "from-yellow-400 to-orange-500",
  trajectory: "from-indigo-400 to-purple-500",
};

export function PersonalityInsightCard({ insight, onDismiss }: PersonalityInsightCardProps) {
  const Icon = iconMap[insight.type] || Sparkles;
  const colors = colorMap[insight.type] || "from-gray-400 to-gray-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "relative border-4 border-black rounded-2xl p-6 mb-4 shadow-2xl overflow-hidden",
        `bg-gradient-to-br ${colors}`
      )}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, black 1px, transparent 0)`,
          backgroundSize: "24px 24px"
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-12 h-12 bg-black rounded-full flex items-center justify-center"
            >
              <Icon className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h3 className="text-xl font-black text-black uppercase tracking-tight">
                {insight.title}
              </h3>
              <p className="text-sm font-mono text-black/70 mt-1">
                {insight.type.replace("_", " ").toUpperCase()}
              </p>
            </div>
          </div>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-black/50 hover:text-black transition-colors font-black text-xl"
            >
              ×
            </button>
          )}
        </div>

        {/* Description */}
        <p className="text-black font-medium leading-relaxed mb-4">
          {insight.description}
        </p>

        {/* Traits */}
        {insight.traits && insight.traits.length > 0 && (
          <div className="space-y-2">
            {insight.traits.slice(0, 3).map((trait, index) => (
              <motion.div
                key={trait.trait}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center justify-between bg-black/20 rounded-lg px-3 py-2"
              >
                <span className="font-mono text-sm text-black font-medium">
                  {trait.trait}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-black/20 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${trait.score * 10}%` }}
                      transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                      className="h-full bg-black rounded-full"
                    />
                  </div>
                  <span className="text-xs font-black text-black w-8 text-right">
                    {trait.score}/10
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Decorative Elements */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute top-0 right-0 w-32 h-32 bg-black/10 rounded-full -mr-16 -mt-16"
      />
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.6 }}
        className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-12 -mb-12"
      />
    </motion.div>
  );
}

