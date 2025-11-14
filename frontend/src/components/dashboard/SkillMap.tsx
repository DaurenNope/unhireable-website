"use client";

import { motion } from "framer-motion";
import { Zap, Target, TrendingUp } from "lucide-react";

interface SkillMapProps {
  skills: Array<{
    skill: string;
    category: string;
    market_value: number;
    priority: string;
    estimated_learning_hours: number;
    salary_impact: number;
  }>;
  userSkills: string[];
}

export function SkillMap({ skills, userSkills }: SkillMapProps) {
  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);
  
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-black flex items-center gap-2">
        <Target className="w-6 h-6 text-cyan-500" />
        SKILL MAP
      </h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        {Object.entries(skillsByCategory).map(([category, categorySkills], categoryIndex) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
            className="border-4 border-black p-4 bg-white"
          >
            <div className="font-black text-lg mb-3">{category}</div>
            <div className="space-y-2">
              {categorySkills.slice(0, 5).map((skill, index) => {
                const hasSkill = userSkills.includes(skill.skill);
                return (
                  <motion.div
                    key={skill.skill}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (categoryIndex * 0.1) + (index * 0.05) }}
                    className={`flex items-center justify-between p-2 border-2 ${
                      hasSkill 
                        ? "border-cyan-400 bg-cyan-50" 
                        : skill.priority === "high"
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 bg-gray-50"
                    }`}
                  >
                    <div className="flex-1">
                      <div className="font-mono text-sm font-black">{skill.skill}</div>
                      <div className="text-xs font-mono text-gray-600">
                        Market Value: {skill.market_value}/100 | Impact: ${skill.salary_impact.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      {hasSkill ? (
                        <span className="text-cyan-500 font-black text-lg">✓</span>
                      ) : (
                        <span className="text-red-500 font-black text-lg">!</span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}


