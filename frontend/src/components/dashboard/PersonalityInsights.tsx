"use client";

import { motion } from "framer-motion";
import { Brain, Users, Briefcase, Zap, Target, TrendingUp } from "lucide-react";

interface PersonalityInsightsProps {
  personalityType: string;
  workStyle: string;
  cultureFit: string;
  topTraits: Array<{ trait: string; score: number }>;
  strengths: string[];
  bestFits: string[];
}

export function PersonalityInsights({
  personalityType,
  workStyle,
  cultureFit,
  topTraits,
  strengths,
  bestFits
}: PersonalityInsightsProps) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Personality Type */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-4 border-black bg-gradient-to-br from-cyan-400 to-blue-500 p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-6 h-6" />
          <h3 className="text-xl font-black">PERSONALITY</h3>
        </div>
        <div className="text-2xl font-black mb-2">{personalityType}</div>
        <div className="text-sm font-mono space-y-1">
          {strengths.map((strength, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-cyan-900">→</span>
              <span>{strength}</span>
            </div>
          ))}
        </div>
      </motion.div>
      
      {/* Work Style */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="border-4 border-black bg-gradient-to-br from-purple-400 to-pink-500 p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="w-6 h-6" />
          <h3 className="text-xl font-black">WORK STYLE</h3>
        </div>
        <div className="text-2xl font-black mb-4">{workStyle}</div>
        <div className="space-y-2">
          {topTraits.slice(0, 3).map((trait, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="font-mono text-sm">{trait.trait}</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-black h-2">
                  <motion.div
                    className="bg-white h-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${trait.score * 10}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                  />
                </div>
                <span className="font-black text-sm">{trait.score}/10</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
      
      {/* Culture Fit */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="border-4 border-black bg-gradient-to-br from-yellow-400 to-orange-500 p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-6 h-6" />
          <h3 className="text-xl font-black">CULTURE FIT</h3>
        </div>
        <div className="text-2xl font-black mb-2">{cultureFit}</div>
        <div className="text-sm font-mono space-y-1">
          {bestFits.map((fit, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-orange-900">→</span>
              <span>{fit}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}


