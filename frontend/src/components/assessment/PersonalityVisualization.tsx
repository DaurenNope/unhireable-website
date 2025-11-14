"use client";

import { motion } from "framer-motion";
import { Brain, Briefcase, Users, Zap, Target, TrendingUp } from "lucide-react";

interface PersonalityProfile {
  type: string;
  top_traits: Array<{ trait: string; score: number }>;
  strengths: string[];
}

interface WorkStyleProfile {
  type: string;
  top_styles: Array<{ style: string; score: number }>;
  preferences: string[];
}

interface CultureFitProfile {
  type: string;
  top_cultures: Array<{ culture: string; score: number }>;
  best_fits: string[];
}

interface PersonalityVisualizationProps {
  personality: PersonalityProfile;
  workStyle: WorkStyleProfile;
  cultureFit: CultureFitProfile;
}

export function PersonalityVisualization({
  personality,
  workStyle,
  cultureFit
}: PersonalityVisualizationProps) {
  return (
    <div className="space-y-6 p-6 bg-white border-4 border-black">
      {/* Personality Type */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-4 border-cyan-400 p-4 bg-black text-white"
      >
        <div className="flex items-center gap-2 mb-2">
          <Brain className="w-6 h-6 text-cyan-400" />
          <h3 className="text-xl font-black">PERSONALITY TYPE</h3>
        </div>
        <div className="text-2xl font-black text-cyan-400">{personality.type}</div>
        <div className="text-sm font-mono mt-2">
          Top Traits: {personality.strengths.join(", ")}
        </div>
      </motion.div>

      {/* Personality Traits Visualization */}
      <div className="grid grid-cols-2 gap-4">
        {personality.top_traits.map((trait, index) => (
          <motion.div
            key={trait.trait}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="border-2 border-black p-3"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-mono text-sm uppercase">{trait.trait}</span>
              <span className="font-black text-lg">{trait.score}/10</span>
            </div>
            <div className="w-full bg-gray-200 h-3 border border-black">
              <motion.div
                className="bg-cyan-400 h-full"
                initial={{ width: 0 }}
                animate={{ width: `${trait.score * 10}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Work Style */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="border-4 border-purple-400 p-4 bg-white text-black"
      >
        <div className="flex items-center gap-2 mb-2">
          <Briefcase className="w-6 h-6 text-purple-500" />
          <h3 className="text-xl font-black">WORK STYLE</h3>
        </div>
        <div className="text-2xl font-black text-purple-500">{workStyle.type}</div>
        <div className="text-sm font-mono mt-2">
          Preferences: {workStyle.preferences.join(", ")}
        </div>
      </motion.div>

      {/* Culture Fit */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="border-4 border-black p-4 bg-gradient-to-r from-cyan-400 to-purple-400 text-black"
      >
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-6 h-6" />
          <h3 className="text-xl font-black">CULTURE FIT</h3>
        </div>
        <div className="text-2xl font-black">{cultureFit.type}</div>
        <div className="text-sm font-mono mt-2">
          Best Fits: {cultureFit.best_fits.join(", ")}
        </div>
      </motion.div>
    </div>
  );
}


