"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from "framer-motion";
import { ArrowRight, Brain, Sparkles, Zap, Target, Users, BarChart3, Shield, Globe, Cpu, Network, Rocket, TrendingUp, AlertTriangle, CheckCircle2, Play, TrendingUp as TrendUp } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [glitchText, setGlitchText] = useState(false);
  const [matrixRain, setMatrixRain] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [-10, 10]);
  const rotateY = useTransform(scrollYProgress, [0, 1], [-10, 10]);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchText(true);
      setTimeout(() => setGlitchText(false), 200);
    }, 5000);
    
    const matrixInterval = setInterval(() => {
      setMatrixRain(true);
      setTimeout(() => setMatrixRain(false), 3000);
    }, 15000);
    
    return () => {
      clearInterval(glitchInterval);
      clearInterval(matrixInterval);
    };
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-white text-black overflow-x-hidden relative">
      {/* Matrix Rain Effect */}
      <AnimatePresence>
        {matrixRain && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 pointer-events-none"
          >
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-green-400 font-mono text-xs"
                initial={{ y: -100, x: Math.random() * window.innerWidth }}
                animate={{ y: window.innerHeight + 100 }}
                transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
                style={{ left: `${Math.random() * 100}%` }}
              >
                {String.fromCharCode(0x30A0 + Math.random() * 96)}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>


      {/* Animated Background */}
      <motion.div 
        className="fixed inset-0 z-0"
        style={{ y: backgroundY }}
      >
        <div className="absolute top-0 -left-48 w-96 h-96 bg-black rounded-full blur-3xl opacity-20" />
        <div className="absolute top-1/2 -right-48 w-96 h-96 bg-cyan-400 rounded-full blur-3xl opacity-10" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-purple-400 rounded-full blur-3xl opacity-10" />
      </motion.div>




      {/* Main Content - Asymmetric Layout */}
      <main className="relative z-10">
        {/* Section 1: Hero - Asymmetric */}
        <section className="min-h-screen flex items-center justify-start px-4 sm:px-6 md:px-8 lg:px-16 py-0.5 sm:py-1 md:py-2 lg:py-3">
          <div className="max-w-7xl w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
              {/* Left Column - Massive Text */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="lg:col-span-8"
              >
                <div className="space-y-4 sm:space-y-6 md:space-y-8">
                  <motion.div
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl xl:text-9xl font-black leading-tight sm:leading-none relative"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    <motion.span 
                      className="block"
                      animate={glitchText ? {
                        x: [0, -2, 2, -2, 0],
                        skewX: [0, -5, 5, -5, 0],
                        color: ["#000", "#ff0080", "#00ff00", "#0000ff", "#000"]
                      } : {}}
                      transition={{ duration: 0.2 }}
                    >
                      THE SYSTEM
                    </motion.span>
                    <motion.span 
                      className="block bg-black text-white px-4 inline-block"
                      whileHover={{ scale: 1.05 }}
                      
                      
                      animate={glitchText ? {
                        textShadow: ["0 0 #ff0080", "2px 2px #00ff00", "-2px -2px #0000ff", "0 0 #000"],
                        x: [0, -1, 1, -1, 0]
                      } : {}}
                      transition={{ duration: 0.1 }}
                    >
                      THINKS YOU'RE
                    </motion.span>
                    <motion.span 
                      className="block"
                      animate={glitchText ? {
                        scale: [1, 1.1, 0.9, 1.1, 1],
                        rotate: [0, 1, -1, 1, 0]
                      } : {}}
                      transition={{ duration: 0.15 }}
                    >
                      DATA.
                    </motion.span>
                  </motion.div>
                  
                  <motion.div
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl xl:text-9xl font-black leading-tight sm:leading-none text-cyan-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                  >
                    <span className="block">WE KNOW</span>
                    <motion.span 
                      className="block bg-cyan-400 text-white px-2 sm:px-3 md:px-4 inline-block mt-1 sm:mt-0"
                      whileHover={{ scale: 1.05 }}
                    >
                      YOU'RE HUMAN.
                    </motion.span>
                  </motion.div>

                  <motion.p
                    className="text-base sm:text-lg md:text-xl font-mono max-w-2xl leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                  >
                    {"\u003e"} Autonomous agent scouts, applies, and follows up while you sleep
                    <br />
                    {"\u003e"} Free resume + readiness assessment so you hit the ground running
                    <br />
                    {"\u003e"} Join early access to shape the future of AI job hunting
                  </motion.p>
                </div>
              </motion.div>

              {/* Right Column - Enhanced System Visualization */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 1.2 }}
                className="lg:col-span-4 space-y-4 sm:space-y-5 md:space-y-6 mt-8 lg:mt-0"
              >
                {/* Success Rate Card */}
                <motion.div
                  className="bg-black text-white p-4 sm:p-5 md:p-6 rotate-3 border-4 border-cyan-400"
                  whileHover={{ rotate: 0, scale: 1.05 }}
                >
                  <div className="text-lg sm:text-xl md:text-2xl font-mono mb-2 sm:mb-3 flex items-center flex-wrap">
                    <span className="mr-2">{"\u003c/\u003e"}</span>
                    <span className="text-cyan-400">NEURAL_SUCCESS</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black mb-1 sm:mb-2">89%</div>
                  <div className="text-xs sm:text-sm font-mono">SUCCESS RATE</div>
                  <div className="text-[10px] sm:text-xs opacity-70 mt-1 sm:mt-2 font-mono">vs 12% industry avg</div>
                </motion.div>

                {/* Time Efficiency Card */}
                <motion.div
                  className="bg-cyan-400 text-black p-4 sm:p-5 md:p-6 -rotate-2 border-4 border-black"
                  whileHover={{ rotate: 0, scale: 1.05 }}
                >
                  <div className="text-lg sm:text-xl md:text-2xl font-mono mb-2 sm:mb-3 flex items-center flex-wrap">
                    <span className="mr-2">{"{...}"}</span>
                    <span className="text-black">TIME_OPTIMIZED</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black mb-1 sm:mb-2">21 DAYS</div>
                  <div className="text-xs sm:text-sm font-mono">AVERAGE HIRE TIME</div>
                  <div className="text-[10px] sm:text-xs opacity-70 mt-1 sm:mt-2 font-mono">vs 4.5 months traditional</div>
                </motion.div>

                {/* Live System Status */}
                <motion.div
                  className="bg-purple-400 text-black p-4 sm:p-5 md:p-6 rotate-1 border-4 border-black"
                  whileHover={{ rotate: 0, scale: 1.05 }}
                >
                  <div className="text-base sm:text-lg font-mono mb-2 sm:mb-3 flex items-center flex-wrap">
                    <span className="mr-2">{"[LIVE]"}</span>
                    <span className="text-black">SYSTEM_STATUS</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-xs sm:text-sm font-mono">NEURAL NET</span>
                      <span className="text-[10px] sm:text-xs bg-black text-white px-1.5 sm:px-2 py-0.5 sm:py-1 whitespace-nowrap">ACTIVE</span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-xs sm:text-sm font-mono">MATCHING</span>
                      <span className="text-[10px] sm:text-xs bg-black text-white px-1.5 sm:px-2 py-0.5 sm:py-1 whitespace-nowrap">RUNNING</span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-xs sm:text-sm font-mono">LEARNING</span>
                      <span className="text-[10px] sm:text-xs bg-black text-white px-1.5 sm:px-2 py-0.5 sm:py-1 whitespace-nowrap">EVOLVING</span>
                    </div>
                  </div>
                </motion.div>

                {/* Processing Animation */}
                <motion.div
                  className="bg-black text-white p-4 sm:p-5 md:p-6 -rotate-1 border-4 border-cyan-400"
                  whileHover={{ rotate: 0, scale: 1.05 }}
                >
                  <div className="text-base sm:text-lg font-mono mb-2 sm:mb-3 flex items-center flex-wrap">
                    <span className="mr-2">{"<>"}</span>
                    <span className="text-cyan-400">PROCESSING</span>
                  </div>
                  <div className="space-y-1">
                    {[
                      "Analyzing personality patterns...",
                      "Matching to 2,847 companies...",
                      "Generating learning paths...",
                      "Optimizing resume for ATS..."
                    ].map((line, index) => (
                      <motion.div
                        key={index}
                        className="text-[10px] sm:text-xs font-mono break-words"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2, repeat: Infinity, repeatDelay: 4 }}
                      >
                        {line}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* CTA - Enhanced Clear Button */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.5 }}
              className="mt-12 sm:mt-16 md:mt-20 lg:mt-24 ml-0 lg:ml-32"
            >
              {/* Main CTA Button */}
              <motion.div
                className="relative group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Pulsing background effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-lg"
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Main button */}
                <motion.button
                  className="relative overflow-hidden bg-black text-white px-6 py-4 sm:px-10 sm:py-5 md:px-12 md:py-6 lg:px-16 lg:py-8 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black border-4 border-white shadow-2xl w-full sm:w-auto"
                  onClick={() => window.location.href = "/demo"}
                >
                  {/* Background gradient overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  />
                  
                  {/* Button text with outline effect */}
                    <span className="relative z-10 flex items-center justify-center space-x-2 sm:space-x-4 uppercase tracking-tight">
                      <Rocket className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 flex-shrink-0" />
                      <span className="break-words text-center">Join Autopilot Waitlist</span>
                      <Zap className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 flex-shrink-0" />
                    </span>
                  
                  {/* Arrow indicator */}
                  <motion.span
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
                    initial={{ x: -10 }}
                    whileHover={{ x: 0 }}
                  >
                    <ArrowRight className="w-8 h-8" />
                  </motion.span>
                </motion.button>
              </motion.div>
              
              {/* Subtitle/Description */}
              <motion.p
                className="mt-6 text-lg md:text-xl font-mono text-gray-600 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3 }}
              >
                {"<"} 10-minute assessment → 89% success rate → Dream job in 21 days {"/>"}
              </motion.p>
              
              {/* Additional trust indicators */}
              <motion.div
                className="mt-8 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3.5 }}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-mono">✓ Free Assessment</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-mono">✓ Instant Results</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-mono">✓ No Commitment</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Section: Free Toolkit */}
        <section className="py-24 px-8 md:px-16 bg-white">
          <div className="max-w-7xl w-full mx-auto">
            <motion.div
              className="text-4xl md:text-6xl font-black leading-none mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="block">Free Tools While We Launch</span>
              <span className="block bg-black text-white px-4 inline-block mt-4 text-2xl md:text-3xl">Equip yourself before the agent ships</span>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[
                {
                  title: "AI Resume Generator",
                  description: "Upload your resume once and get a clean, recruiter-ready version plus tailored variants.",
                  href: "/resume",
                  cta: "Polish My Resume",
                  accent: "bg-cyan-400",
                },
                {
                  title: "Career Readiness Scan",
                  description: "Ten-minute assessment that maps strengths, narratives, and gaps the agent will optimize against.",
                  href: "/demo",
                  cta: "Take Assessment",
                  accent: "bg-purple-400",
                },
                {
                  title: "Future of Work Briefings",
                  description: "Subscribe for market intel, AI hiring shifts, and first dibs on the autonomous job hunter.",
                  href: "/waitlist",
                  cta: "Join Briefing List",
                  accent: "bg-black text-white",
                },
              ].map((tool, index) => (
                <motion.div
                  key={tool.title}
                  className="relative border-4 border-black bg-white p-8 shadow-[12px_12px_0px_rgba(0,0,0,1)]"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index }}
                  
                  
                >
                  <div className={`absolute -top-4 left-6 px-3 py-1 text-xs font-mono uppercase ${tool.accent}`}>
                    Free
                  </div>
                  <h3 className="text-2xl font-black mb-4">{tool.title}</h3>
                  <p className="font-mono text-sm text-gray-700 mb-6 leading-relaxed">{tool.description}</p>
                  <Link
                    href={tool.href}
                    className="inline-flex items-center font-mono text-sm uppercase tracking-tight border-2 border-black px-4 py-2 hover:bg-black hover:text-white transition-colors"
                    
                    
                  >
                    {tool.cta}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 2: What We Do - Clear Value Proposition */}
        <section className="min-h-screen flex items-center px-8 md:px-16 bg-black text-white">
          <div className="max-w-7xl w-full">
            <motion.div
              className="text-6xl md:text-8xl font-black leading-none mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="block">WHAT WE</span>
              <span className="block bg-cyan-400 text-black px-4 inline-block">ACTUALLY DO</span>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Left: The Process Flow */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div className="space-y-6">
                  {/* ASSESS Step */}
                  <motion.div
                    className="bg-white text-black p-6 border-4 border-black"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ 
                      scale: 1.05, 
                      rotate: 2,
                      boxShadow: "0 0 30px rgba(0, 0, 0, 0.3)"
                    }}
                    
                    
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <Brain className="w-10 h-10 text-black" />
                      <div>
                        <h3 className="text-2xl font-black">ASSESS</h3>
                        <p className="text-xs font-mono opacity-70">STEP 01</p>
                      </div>
                    </div>
                    <p className="font-mono text-sm mb-3">10-minute neural personality scan</p>
                    <div className="bg-black text-white p-2">
                      <p className="text-xs font-mono">AI analyzes: skills + personality + potential</p>
                    </div>
                  </motion.div>

                  {/* MATCH Step */}
                  <motion.div
                    className="bg-cyan-400 text-black p-6 border-4 border-black rotate-2"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ 
                      scale: 1.05, 
                      rotate: 0,
                      boxShadow: "0 0 30px rgba(6, 182, 212, 0.6)"
                    }}
                    
                    
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <Target className="w-10 h-10 text-black" />
                      <div>
                        <h3 className="text-2xl font-black">MATCH</h3>
                        <p className="text-xs font-mono opacity-70">STEP 02</p>
                      </div>
                    </div>
                    <p className="font-mono text-sm mb-3">Neural synthesis with 2,847 companies</p>
                    <div className="bg-black text-white p-2">
                      <p className="text-xs font-mono">89% success rate vs 12% industry avg</p>
                    </div>
                  </motion.div>

                  {/* HIRE Step */}
                  <motion.div
                    className="bg-purple-400 text-black p-6 border-4 border-black -rotate-2"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    whileHover={{ 
                      scale: 1.05, 
                      rotate: 0,
                      boxShadow: "0 0 30px rgba(168, 85, 247, 0.6)"
                    }}
                    
                    
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <Rocket className="w-10 h-10 text-black" />
                      <div>
                        <h3 className="text-2xl font-black">HIRE</h3>
                        <p className="text-xs font-mono opacity-70">STEP 03</p>
                      </div>
                    </div>
                    <p className="font-mono text-sm mb-3">Land dream job in 21 days flat</p>
                    <div className="bg-black text-white p-2">
                      <p className="text-xs font-mono">4.8x faster than traditional process</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Right: The Reality Check */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                {/* Traditional vs Modern */}
                <motion.div
                  className="bg-black text-white p-8 border-4 border-red-500"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ 
                    scale: 1.02,
                    borderColor: "#ff0000"
                  }}
                  
                  
                >
                  <h3 className="text-xl font-black mb-6 text-red-500">TRADITIONAL HIRING</h3>
                  <div className="space-y-3 font-mono text-sm">
                    <div className="flex justify-between">
                      <span>Resume scanning</span>
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                    </div>
                    <div className="flex justify-between">
                      <span>Keyword matching</span>
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                    </div>
                    <div className="flex justify-between">
                      <span>ATS filters</span>
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                    </div>
                    <div className="flex justify-between">
                      <span>Human review</span>
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                    </div>
                    <div className="mt-4 pt-4 border-t border-red-500">
                      <div className="flex justify-between">
                        <span className="font-black">SUCCESS RATE</span>
                        <span className="text-red-400 font-black">12%</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Neural Success */}
                <motion.div
                  className="bg-white text-black p-8 border-4 border-cyan-400"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 0 30px rgba(6, 182, 212, 0.6)"
                  }}
                  
                  
                >
                  <h3 className="text-xl font-black mb-6 text-cyan-400">NEURAL SYNTHESIS</h3>
                  <div className="space-y-3 font-mono text-sm">
                    <div className="flex justify-between">
                      <span>Personality analysis</span>
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    </div>
                    <div className="flex justify-between">
                      <span>Cultural matching</span>
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    </div>
                    <div className="flex justify-between">
                      <span>Skill gap analysis</span>
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    </div>
                    <div className="flex justify-between">
                      <span>AI optimization</span>
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    </div>
                    <div className="mt-4 pt-4 border-t border-cyan-400">
                      <div className="flex justify-between">
                        <span className="font-black">SUCCESS RATE</span>
                        <span className="text-cyan-400 font-black">89%</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* The Bottom Line */}
                <motion.div
                  className="bg-black text-white p-6 border-4 border-cyan-400"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 }}
                  whileHover={{ 
                    scale: 1.05,
                    rotate: 1
                  }}
                  
                  
                >
                  <div className="text-center">
                    <div className="text-2xl font-black mb-2">THE BOTTOM LINE</div>
                    <div className="text-lg font-mono text-cyan-400">
                      21 DAYS ← 4.5 MONTHS
                    </div>
                    <div className="text-sm font-mono opacity-70 mt-2">
                      Stop being data. Start being human.
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Section 3: Problem/Solution - Simplified */}
        <section className="min-h-screen flex items-center px-8 md:px-16 bg-white text-black">
          <div className="max-w-7xl w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Problem Section */}
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <motion.h2
                    className="text-5xl md:text-7xl font-black leading-none"
                    whileHover={{ scale: 1.02 }}
                    
                    
                  >
                    <span className="bg-red-500 text-white px-4">PROBLEM:</span>
                  </motion.h2>
                  
                  <div className="space-y-3 font-mono text-lg">
                    {[
                      "function traditionalHiring() {",
                      "  scanForKeywords(resume);",
                      "  applyBooleanLogic(skills);",
                      "  loseInATS(tracking);",
                      "  rejectCandidate(89%);",
                      "}"
                    ].map((line, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className={index === 0 || index === 5 ? "ml-4" : "ml-8"}
                      >
                        {line}
                      </motion.div>
                    ))}
                  </div>

                  {/* Normie Explanation - Enhanced Design */}
                  <motion.div
                    className="mt-8 relative"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                  >
                    <div className="absolute inset-0 bg-red-500 transform rotate-1"></div>
                    <div className="relative bg-black text-white p-6 border-4 border-red-500 transform -rotate-1">
                      <div className="flex items-start space-x-4">
                        <motion.div
                          className="bg-red-500 text-black p-2 flex-shrink-0"
                          whileHover={{ rotate: 15, scale: 1.1 }}
                        >
                          <AlertTriangle className="w-6 h-6" />
                        </motion.div>
                        <div>
                          <motion.h4 
                            className="font-black text-lg mb-2 text-red-400"
                            whileHover={{ scale: 1.05 }}
                          >
                            // IN PLAIN ENGLISH:
                          </motion.h4>
                          <p className="text-sm text-red-300 leading-relaxed font-mono">
                            {"<"} Traditional hiring treats you like a keyword search.<br/>
                            {"  "} Companies use ATS systems that scan resumes<br/>
                            {"  "} Filter out 89% of qualified candidates<br/>
                            {"  "} You compete against algorithms, not humans<br/>
                            {"/>"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Solution Section */}
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <motion.h2
                    className="text-5xl md:text-7xl font-black leading-none"
                    whileHover={{ scale: 1.02 }}
                    
                    
                  >
                    <span className="bg-cyan-400 text-black px-4">SOLUTION:</span>
                  </motion.h2>
                  
                  <div className="space-y-3 font-mono text-lg">
                    {[
                      "function neuralSynthesis() {",
                      "  analyzePersonality(candidate);",
                      "  understandCulturalFit(company);",
                      "  identifySkillGaps(currentSkills, targetRole);",
                      "  generatePersonalizedPath(user);",
                      "  successRate(89%);",
                      "}"
                    ].map((line, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + 0.5 }}
                        className={index === 0 || index === 6 ? "ml-4 text-cyan-400" : "ml-8"}
                      >
                        {line}
                      </motion.div>
                    ))}
                  </div>

                  {/* Normie Explanation - Enhanced Design */}
                  <motion.div
                    className="mt-8 relative"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                  >
                    <div className="absolute inset-0 bg-green-500 transform rotate-1"></div>
                    <div className="relative bg-black text-white p-6 border-4 border-green-400 transform -rotate-1">
                      <div className="flex items-start space-x-4">
                        <motion.div
                          className="bg-green-400 text-black p-2 flex-shrink-0"
                          whileHover={{ rotate: -15, scale: 1.1 }}
                        >
                          <CheckCircle2 className="w-6 h-6" />
                        </motion.div>
                        <div>
                          <motion.h4 
                            className="font-black text-lg mb-2 text-green-400"
                            whileHover={{ scale: 1.05 }}
                          >
                            // IN PLAIN ENGLISH:
                          </motion.h4>
                          <p className="text-sm text-green-300 leading-relaxed font-mono">
                            {"<"} Our AI understands you as a complete person<br/>
                            {"  "} Your personality + workplace values + skills<br/>
                            {"  "} We match you with companies where you'll thrive<br/>
                            {"  "} Create personalized learning paths for success<br/>
                            {"  "} 89% success rate because we match humans, not resumes<br/>
                            {"/>"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Section 3: System Visualization */}
        <section className="min-h-screen flex items-center px-8 md:px-16 py-24 bg-black text-white">
          <div className="max-w-7xl w-full">
            <motion.div
              className="text-6xl md:text-8xl font-black leading-none mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="block">SYSTEM</span>
              <span className="block bg-cyan-400 text-black px-4 inline-block">VISUALIZATION</span>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Left: System Flow */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="bg-gray-900 border-2 border-cyan-400 p-6">
                  <h3 className="text-xl font-black mb-4 text-cyan-400">NEURAL FLOW</h3>
                  <div className="space-y-3">
                    {[
                      { step: "INPUT", desc: "Personality + Skills + Goals", status: "ACTIVE" },
                      { step: "ANALYSIS", desc: "AI pattern recognition", status: "RUNNING" },
                      { step: "MATCHING", desc: "2,847 companies scanned", status: "COMPLETE" },
                      { step: "OPTIMIZATION", desc: "Resume + Learning paths", status: "RUNNING" },
                      { step: "OUTPUT", desc: "Perfect career match", status: "READY" }
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center justify-between bg-black p-3 border border-cyan-400"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        
                        
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-cyan-400 font-mono">{item.step}</span>
                          <span className="text-sm font-mono">{item.desc}</span>
                        </div>
                        <span className={`text-xs px-2 py-1 font-mono ${
                          item.status === 'ACTIVE' ? 'bg-green-500 text-black' :
                          item.status === 'RUNNING' ? 'bg-yellow-400 text-black' :
                          item.status === 'COMPLETE' ? 'bg-cyan-400 text-black' :
                          'bg-purple-400 text-black'
                        }`}>
                          {item.status}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Right: Real-time Processing */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="bg-gray-900 border-2 border-purple-400 p-6">
                  <h3 className="text-xl font-black mb-4 text-purple-400">REAL-TIME PROCESSING</h3>
                  <div className="space-y-4">
                    <div className="bg-black p-4 border border-purple-400">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-mono text-purple-400">CANDIDATES PROCESSED</span>
                        <span className="text-xs bg-purple-400 text-black px-2 py-1 font-mono">LIVE</span>
                      </div>
                      <div className="text-3xl font-black">1,247</div>
                      <div className="text-xs font-mono opacity-70">+23 in last hour</div>
                    </div>

                    <div className="bg-black p-4 border border-purple-400">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-mono text-purple-400">MATCHES GENERATED</span>
                        <span className="text-xs bg-purple-400 text-black px-2 py-1 font-mono">LIVE</span>
                      </div>
                      <div className="text-3xl font-black">8,923</div>
                      <div className="text-xs font-mono opacity-70">89.3% success rate</div>
                    </div>

                    <div className="bg-black p-4 border border-purple-400">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-mono text-purple-400">LEARNING PATHS</span>
                        <span className="text-xs bg-purple-400 text-black px-2 py-1 font-mono">ACTIVE</span>
                      </div>
                      <div className="text-3xl font-black">342</div>
                      <div className="text-xs font-mono opacity-70">In progress now</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Section 4: Advanced System Representation */}
        <section className="min-h-screen flex items-center px-8 md:px-16 py-24 bg-white">
          <div className="max-w-7xl w-full">
            <motion.div
              className="text-6xl md:text-8xl font-black leading-none mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="block">AI SYSTEM</span>
              <span className="block bg-black text-white px-4 inline-block">IN ACTION</span>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Neural Network Visualization */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-black text-white p-8 border-4 border-cyan-400"
                
                
              >
                <h3 className="text-xl font-black mb-6 text-cyan-400">NEURAL NETWORK</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-mono">LAYERS ACTIVE</span>
                    <span className="text-lg font-black">247</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-mono">NODES PROCESSING</span>
                    <span className="text-lg font-black">8,923</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-mono">ACCURACY</span>
                    <span className="text-lg font-black text-cyan-400">94.7%</span>
                  </div>
                  <div className="mt-6 p-3 bg-gray-900 border border-cyan-400">
                    <div className="text-xs font-mono text-cyan-400 mb-2">REAL-TIME ACTIVITY</div>
                    <div className="space-y-1">
                      {["Pattern matching...", "Learning adaptation...", "Cultural analysis..."].map((activity, i) => (
                        <motion.div
                          key={i}
                          className="text-xs font-mono opacity-70"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0.7, 1, 0.7] }}
                          transition={{ delay: i * 0.3, repeat: Infinity, duration: 2 }}
                        >
                          {activity}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Candidate Journey */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-cyan-400 text-black p-8 border-4 border-black"
                
                
              >
                <h3 className="text-xl font-black mb-6">CANDIDATE JOURNEY</h3>
                <div className="space-y-4">
                  {[
                    { step: "1", title: "ASSESSMENT", status: "COMPLETE", desc: "Personality + Skills" },
                    { step: "2", title: "ANALYSIS", status: "COMPLETE", desc: "AI Pattern Match" },
                    { step: "3", title: "MATCHING", status: "ACTIVE", desc: "2,847 Companies" },
                    { step: "4", title: "OPTIMIZATION", status: "RUNNING", desc: "Resume + Learning" }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="bg-black text-white p-3 border-2"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono bg-cyan-400 text-black px-2 py-1">{item.step}</span>
                          <span className="text-sm font-black">{item.title}</span>
                        </div>
                        <span className={`text-xs px-2 py-1 font-mono ${
                          item.status === 'COMPLETE' ? 'bg-green-400 text-black' :
                          item.status === 'ACTIVE' ? 'bg-yellow-400 text-black' :
                          'bg-gray-400 text-black'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <div className="text-xs font-mono opacity-70">{item.desc}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Live Results */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="bg-purple-400 text-black p-8 border-4 border-black"
                
                
              >
                <h3 className="text-xl font-black mb-6">LIVE RESULTS</h3>
                <div className="space-y-4">
                  <div className="bg-black text-white p-4 border-2">
                    <div className="text-3xl font-black mb-2">89%</div>
                    <div className="text-sm font-mono">SUCCESS RATE</div>
                    <div className="text-xs font-mono opacity-70">vs 12% industry</div>
                  </div>
                  <div className="bg-black text-white p-4 border-2">
                    <div className="text-3xl font-black mb-2">21 Days</div>
                    <div className="text-sm font-mono">HIRE TIME</div>
                    <div className="text-xs font-mono opacity-70">vs 4.5 months</div>
                  </div>
                  <div className="bg-black text-white p-4 border-2">
                    <div className="text-3xl font-black mb-2">4.8x</div>
                    <div className="text-sm font-mono">FASTER PLACEMENT</div>
                    <div className="text-xs font-mono opacity-70">Industry average</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Section 4b: Founder Manifesto */}
        <section className="min-h-[60vh] flex items-center px-8 md:px-16 py-24 bg-gradient-to-br from-white via-cyan-50 to-purple-50 text-black border-t-4 border-black">
          <div className="max-w-6xl mx-auto space-y-12">
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 gap-12"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div>
                <h2 className="text-4xl md:text-5xl font-black leading-tight">
                  Why We&apos;re Building an Autonomous Job Hunter
                </h2>
                <p className="mt-6 font-mono text-sm md:text-base text-gray-700 leading-relaxed">
                  We&apos;ve watched AI flood the hiring stack—ATS filters, algorithmic sourcing, automated rejections.
                  Talented people are getting ghosted because they don&apos;t fit a keyword formula. Unhireable is our
                  answer: a tireless agent that reverse-engineers the system, tells your story, and negotiates on your behalf.
                </p>
              </div>
              <div className="border-4 border-black bg-white p-6 shadow-[10px_10px_0px_rgba(0,0,0,1)]">
                <h3 className="text-2xl font-black mb-4">Market Outlook</h3>
                <ul className="space-y-3 font-mono text-sm text-gray-700">
                  <li>{"\u2022"} 70% of enterprise hiring workflows will be AI-augmented by 2027 (Gartner)</li>
                  <li>{"\u2022"} Applicants spend ~11 hours/week on manual job hunting that automation can absorb</li>
                  <li>{"\u2022"} Our beta agents already automate outreach, follow ups, and resume tailoring across 50+ job boards</li>
                  <li>{"\u2022"} Every person deserves leverage—the agent is how we give it back</li>
                </ul>
              </div>
            </motion.div>

            <motion.div
              className="border-4 border-black bg-black text-white p-8 font-mono text-sm md:text-base leading-relaxed"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p>
                We&apos;re two founders who lived the grind—late-night applications, cold outreach, endless stare downs with
                ATS portals. We&apos;re building Unhireable because we refuse to accept that story for anyone else. Help us
                pressure-test the agent, and in return we&apos;ll ship tools, data, and brutal honesty about the future of work.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Section 5: How Our AI Works - Clear Linear Process */}
        <section className="min-h-screen flex items-center px-4 sm:px-8 md:px-16 py-12 md:py-24 bg-black text-white">
          <div className="max-w-7xl w-full">
            <motion.div
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-none mb-8 md:mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="block">HOW OUR AI</span>
              <span className="block bg-cyan-400 text-black px-4 inline-block">REALLY WORKS</span>
            </motion.div>

            {/* Linear Process Flow */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {/* Step 1 & 2 */}
              <div className="space-y-8">
                <motion.div
                  className="bg-white text-black p-8 border-4 border-cyan-400"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ 
                    scale: 1.02,
                    borderColor: "#06b6d4"
                  }}
                  
                  
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-4xl font-black text-cyan-400">01</div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-black mb-3">WE ANALYZE YOU</h3>
                      <p className="font-mono text-sm mb-4">10-minute personality & skills assessment</p>
                      <div className="bg-black text-white p-3 font-mono text-xs">
                        → Personality patterns<br/>
                        → Technical skills<br/>
                        → Career goals<br/>
                        → Learning preferences
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="bg-cyan-400 text-black p-8 border-4 border-black"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ 
                    scale: 1.02,
                    rotate: 1
                  }}
                  
                  
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-4xl font-black">02</div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-black mb-3">WE SCAN COMPANIES</h3>
                      <p className="font-mono text-sm mb-4">AI analyzes 2,847 companies in real-time</p>
                      <div className="bg-black text-white p-3 font-mono text-xs">
                        → Company culture<br/>
                        → Technical requirements<br/>
                        → Growth opportunities<br/>
                        → Team dynamics
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Step 3 & 4 */}
              <div className="space-y-8">
                <motion.div
                  className="bg-purple-400 text-black p-8 border-4 border-black"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ 
                    scale: 1.02,
                    rotate: -1
                  }}
                  
                  
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-4xl font-black">03</div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-black mb-3">WE FIND MATCHES</h3>
                      <p className="font-mono text-sm mb-4">Neural algorithm finds perfect fits</p>
                      <div className="bg-black text-white p-3 font-mono text-xs">
                        → Skill compatibility<br/>
                        → Cultural alignment<br/>
                        → Growth potential<br/>
                        → Success probability
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="bg-white text-black p-8 border-4 border-purple-400"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 }}
                  whileHover={{ 
                    scale: 1.02,
                    borderColor: "#a855f7"
                  }}
                  
                  
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-4xl font-black text-purple-400">04</div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-black mb-3">WE GET YOU HIRED</h3>
                      <p className="font-mono text-sm mb-4">Auto-apply & optimize your success</p>
                      <div className="bg-black text-white p-3 font-mono text-xs">
                        → Resume optimization<br/>
                        → Auto-applications<br/>
                        → Learning paths<br/>
                        → Interview prep
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* The Result */}
            <motion.div
              className="bg-gradient-to-r from-cyan-400 to-purple-400 text-black p-8 border-4 border-black text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1 }}
              whileHover={{ 
                scale: 1.02,
                rotate: 1
              }}
              
              
            >
              <div className="text-3xl md:text-4xl font-black mb-4">THE RESULT</div>
              <div className="text-xl md:text-2xl font-mono mb-4">89% SUCCESS RATE</div>
              <div className="text-lg font-mono">Get hired in 21 days vs 4.5 months traditional</div>
            </motion.div>
          </div>
        </section>

        {/* Final CTA - Full Width Brutalist */}
        <section className="min-h-screen flex items-center justify-center px-8 md:px-16 bg-gradient-to-b from-black to-white">
          <motion.div
            className="text-center max-w-4xl"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <motion.h2
              className="text-5xl md:text-7xl lg:text-8xl font-black leading-none mb-8"
              whileHover={{ scale: 1.02 }}
              
              
            >
              <span className="block">STOP BEING</span>
              <span className="block bg-cyan-400 text-black px-4 inline-block">UNHIREABLE</span>
              <span className="block">START BEING</span>
              <span className="block bg-purple-400 text-white px-4 inline-block">UNSTOPPABLE</span>
            </motion.h2>

            <motion.p
              className="text-xl font-mono mb-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              {"\u003e"} Join the revolution. 10 minutes. Lifetime impact.
            </motion.p>

            <motion.button
              className="group relative overflow-hidden bg-black text-white px-16 py-8 text-3xl font-black border-4 border-black uppercase tracking-tight"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              
              
              onClick={() => window.location.href = "/demo"}
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                <span>Join Autopilot Waitlist</span>
                <ArrowRight className="w-8 h-8" />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </motion.div>
        </section>
      </main>

    </div>
  );
}
