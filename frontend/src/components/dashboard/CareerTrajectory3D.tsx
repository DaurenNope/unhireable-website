"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { useState, useEffect } from "react";
import { TrendingUp, Target, Zap, ArrowRight } from "lucide-react";

interface CareerTrajectory3DProps {
  currentLevel: string;
  targetLevel: string;
  trajectoryScore: number;
  timeToTarget: string;
  milestones: Array<{
    title: string;
    date: string;
    status: "completed" | "current" | "upcoming";
  }>;
}

export function CareerTrajectory3D({
  currentLevel,
  targetLevel,
  trajectoryScore,
  timeToTarget,
  milestones
}: CareerTrajectory3DProps) {
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);
  
  return (
    <motion.div
      className="border-4 border-black bg-gradient-to-br from-cyan-400 to-purple-400 p-8 relative overflow-hidden"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        mouseX.set(x);
        mouseY.set(y);
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        perspective: 1000,
        transformStyle: "preserve-3d"
      }}
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-black">CAREER TRAJECTORY</h3>
          <div className="text-4xl font-black">{trajectoryScore}/100</div>
        </div>
        
        {/* 3D Trajectory Path */}
        <motion.div
          className="relative h-32 mb-6"
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d"
          }}
        >
          {/* Start Point */}
          <motion.div
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-16 h-16 bg-black border-4 border-white rounded-full flex items-center justify-center">
              <span className="text-white font-black text-xs text-center">{currentLevel}</span>
            </div>
          </motion.div>
          
          {/* Trajectory Line */}
          <motion.svg
            className="absolute inset-0 w-full h-full"
            style={{ zIndex: 10 }}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: trajectoryScore / 100 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          >
            <motion.path
              d="M 40 64 Q 200 32, 360 64"
              stroke="black"
              strokeWidth="4"
              fill="none"
              strokeDasharray="8 4"
            />
          </motion.svg>
          
          {/* Target Point */}
          <motion.div
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="w-16 h-16 bg-purple-500 border-4 border-black rounded-full flex items-center justify-center">
              <span className="text-white font-black text-xs text-center">{targetLevel}</span>
            </div>
          </motion.div>
          
          {/* Progress Indicator */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2"
            style={{
              left: `${trajectoryScore}%`,
              transform: "translate(-50%, -50%)",
              zIndex: 30
            }}
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="w-8 h-8 bg-cyan-400 border-4 border-black rounded-full flex items-center justify-center">
              <Zap className="w-4 h-4 text-black" />
            </div>
          </motion.div>
        </motion.div>
        
        {/* Milestones */}
        <div className="space-y-2">
          {milestones.map((milestone, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className={`flex items-center gap-3 p-2 border-2 ${
                milestone.status === "completed" 
                  ? "border-black bg-black text-white" 
                  : milestone.status === "current"
                  ? "border-cyan-400 bg-cyan-400 text-black"
                  : "border-gray-300 bg-white text-gray-600"
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-current" />
              <div className="flex-1">
                <div className="font-mono text-sm">{milestone.title}</div>
                <div className="font-mono text-xs opacity-70">{milestone.date}</div>
              </div>
              {milestone.status === "current" && (
                <ArrowRight className="w-4 h-4" />
              )}
            </motion.div>
          ))}
        </div>
        
        {/* Time to Target */}
        <div className="mt-6 pt-6 border-t-4 border-black">
          <div className="font-mono text-sm text-center">
            Estimated time to {targetLevel}: <span className="font-black">{timeToTarget}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}


