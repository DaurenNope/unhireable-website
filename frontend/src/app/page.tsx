"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from "framer-motion";
import { ArrowRight, Brain, Sparkles, Zap, Target, Users, BarChart3, Shield, Globe, Cpu, Network, Rocket, TrendingUp, AlertTriangle, CheckCircle2, Play, TrendingUp as TrendUp } from "lucide-react";
import Link from "next/link";
import { cn } from "../lib/utils";

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
        {/* Section 1: Hero - Two Column */}
        <section className="relative min-h-screen flex items-center justify-start px-4 sm:px-6 md:px-8 lg:px-16 py-0.5 sm:py-1 md:py-2 lg:py-3 overflow-hidden">
          {/* Top-right corner accent */}
          <motion.div
            className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-400/30 via-purple-400/20 to-transparent rounded-full blur-3xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, delay: 1 }}
          />
          
          {/* Bottom-right corner accent */}
          <motion.div
            className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tr from-purple-400/25 via-cyan-400/15 to-transparent rounded-full blur-3xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, delay: 1.2 }}
          />
          
          <div className="relative max-w-7xl w-full z-10">
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-16 items-center">
              {/* Left Column - Text */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
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
                  Stop fighting ATS algorithms. Start winning with AI that knows who you really are—not what your resume says.
                </motion.p>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.3 }}
                  className="mt-10 sm:mt-12"
                >
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 sm:items-center">
                  <motion.button
                    className="group relative w-full sm:flex-1 sm:max-w-none inline-flex items-center justify-center gap-3 border-4 border-black bg-black px-12 py-6 text-xl font-black uppercase tracking-tight text-white shadow-[8px_8px_0_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:shadow-[12px_12px_0_rgba(0,0,0,1)]"
                    whileHover={{ y: -4, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => (window.location.href = "/demo")}
                  >
                    <Rocket className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                    <span>Start Deep Assessment</span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity"
                    />
                  </motion.button>
                  <motion.a
                    href="/waitlist"
                    className="w-full sm:flex-1 sm:max-w-none inline-flex items-center justify-center gap-2 border-4 border-black bg-white px-12 py-6 font-mono text-sm uppercase tracking-[0.3em] text-black shadow-[6px_6px_0_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:bg-black hover:text-white hover:shadow-[10px_10px_0_rgba(0,0,0,1)]"
                    whileHover={{ y: -4 }}
                  >
                    Join Autopilot Waitlist
                    <ArrowRight className="h-4 w-4" />
                  </motion.a>
                </div>
                <motion.p
                  className="mt-5 text-sm font-mono text-gray-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.8 }}
                >
                  Free assessment. No credit card. Get your results in 10 minutes.
                </motion.p>
                </motion.div>
                </div>
              </motion.div>

              {/* Right Column - Market Protection Cards */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 1.5 }}
              className="hidden lg:block relative h-full min-h-[600px]"
            >
              <div className="relative w-full h-full bg-gradient-to-b from-gray-50 to-white overflow-y-auto overflow-x-hidden p-8 space-y-6">
                {/* Card 1: Market Uncertainty */}
                <motion.div
                  className="bg-white border-l-4 border-red-400 p-5 shadow-sm hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 2 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">Market Reality</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs font-mono text-gray-500 uppercase">Layoffs 2024</span>
                      <span className="text-3xl font-black text-red-500">200K+</span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs font-mono text-gray-500 uppercase">Avg Search</span>
                      <span className="text-2xl font-black text-gray-700">4.5 mo</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-4 leading-relaxed">
                      Markets shift. Industries pivot. One layoff can change everything.
                    </p>
                  </div>
                </motion.div>

                {/* Card 2: Traditional Search */}
                <motion.div
                  className="bg-white border-l-4 border-gray-300 p-5 shadow-sm hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 2.3 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">Traditional Way</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs font-mono text-gray-500 uppercase">Applications</span>
                      <span className="text-3xl font-black text-gray-600">100+</span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs font-mono text-gray-500 uppercase">Response Rate</span>
                      <span className="text-2xl font-black text-gray-700">12%</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-4 leading-relaxed">
                      Manual applications. Low success. Time-consuming.
                    </p>
                  </div>
                </motion.div>

                {/* Card 3: AI Protection - Featured */}
                <motion.div
                  className="bg-gradient-to-br from-cyan-50 to-white border-l-4 border-cyan-400 p-5 shadow-md hover:shadow-lg transition-all relative overflow-hidden"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 2.6 }}
                >
                  {/* Subtle accent */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-400/10 rounded-full -mr-12 -mt-12"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></div>
                      <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">AI Protection</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs font-mono text-gray-500 uppercase">Auto-Apply</span>
                        <span className="text-3xl font-black text-cyan-600">24/7</span>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs font-mono text-gray-500 uppercase">Match Rate</span>
                        <span className="text-2xl font-black text-cyan-600">89%</span>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs font-mono text-gray-500 uppercase">Time to Hire</span>
                        <span className="text-2xl font-black text-cyan-600">21 days</span>
                      </div>
                      <p className="text-xs text-gray-700 font-medium mt-4 leading-relaxed">
                        Always ready. Always applying. Always matching.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Card 4: Market Resilience */}
                <motion.div
                  className="bg-white border-l-4 border-purple-400 p-5 shadow-sm hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 2.9 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">Resilience</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs font-mono text-gray-500 uppercase">Opportunities</span>
                      <span className="text-2xl font-black text-purple-600">Always</span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs font-mono text-gray-500 uppercase">Adaptation</span>
                      <span className="text-2xl font-black text-purple-600">Real-time</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-4 leading-relaxed">
                      Stay ahead of market changes. Your AI adapts instantly.
                    </p>
                  </div>
                </motion.div>

                {/* Card 5: Call to Action */}
                <motion.div
                  className="bg-black text-white p-5 shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 3.2 }}
                >
                  <h3 className="text-sm font-black text-cyan-400 uppercase tracking-wider mb-4">Be Ready. Always.</h3>
                  <p className="text-xs text-gray-300 leading-relaxed mb-4">
                    Layoffs happen. Markets crash. Industries pivot.
                  </p>
                  <p className="text-xs text-white leading-relaxed mb-4">
                    With AI on your side, you're always ready. Your agent works 24/7, applies to opportunities, 
                    and matches you with roles—even when you're sleeping.
                  </p>
                  <div className="flex items-baseline gap-3 pt-3 border-t border-gray-800">
                    <span className="text-4xl font-black text-cyan-400">89%</span>
                    <span className="text-xs font-mono text-gray-400">vs 12% traditional</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
            </div>
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
                  description: "Ten-minute assessment that maps strengths, narratives, and gaps the desktop app will optimize against once you sync.",
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
                    <p className="font-mono text-sm mb-3">Desktop app auto-applies 24/7. Most users get interviews within 21 days.</p>
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

        {/* Desktop App Showcase */}
        <section className="py-24 px-8 md:px-16 bg-white border-t-4 border-black">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-16 items-center">
              {/* Left: Features */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                <div>
                  <motion.h2
                    className="text-5xl md:text-7xl font-black leading-tight mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    YOUR DESKTOP AGENT RUNS <span className="bg-cyan-400 px-3 inline-block">24/7</span>
                  </motion.h2>
                  <motion.p
                    className="font-mono text-base md:text-lg text-gray-700 leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    The Tauri desktop app scrapes LinkedIn, Indeed, and remote boards. Autofills forms, uploads resumes, tracks every outcome—even when you're sleeping.
                  </motion.p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    {
                      title: "Job Scraping Engine",
                      detail: "LinkedIn, Indeed, remote boards, Fortune 500 career pages",
                    },
                    {
                      title: "Browser Automation",
                      detail: "Auto-fill forms, resume upload, CAPTCHA detection, screenshots",
                    },
                    {
                      title: "Application Tracking",
                      detail: "Status tracking, history, reminders, analytics, response rates",
                    },
                    {
                      title: "AI Matching Brain",
                      detail: "Skills analysis, culture fit, salary prediction, success rates",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={item.title}
                      className="border-4 border-black bg-white p-5 shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_rgba(0,0,0,1)] transition-all"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      whileHover={{ scale: 1.02, rotate: 1 }}
                    >
                      <div className="text-xs font-mono uppercase text-gray-500 mb-2">Desktop Module</div>
                      <div className="text-xl font-black mb-2">{item.title}</div>
                      <p className="text-sm font-mono text-gray-700 leading-relaxed">{item.detail}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Right: Console Preview */}
              <motion.div
                className="relative border-4 border-black bg-black text-white p-8 min-h-[400px] flex flex-col justify-between shadow-[12px_12px_0px_rgba(0,0,0,1)]"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div className="mb-6">
                  <div className="text-xs font-mono uppercase tracking-[0.3em] text-gray-400 mb-2">Tauri Agent</div>
                  <div className="text-3xl font-black">AUTOPILOT CONSOLE</div>
                </div>
                <div className="space-y-3 font-mono text-xs">
                  <motion.div
                    className="flex justify-between items-center"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                  >
                    <span className="text-gray-400">[08:03]</span>
                    <span>Scraping LinkedIn search results...</span>
                  </motion.div>
                  <motion.div
                    className="flex justify-between items-center"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                  >
                    <span className="text-gray-400">[08:06]</span>
                    <span>Detected SmartRecruiters ATS form</span>
                  </motion.div>
                  <motion.div
                    className="flex justify-between items-center"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7 }}
                  >
                    <span className="text-gray-400">[08:07]</span>
                    <span>Filling profile with Senior SWE template</span>
                  </motion.div>
                  <motion.div
                    className="flex justify-between items-center"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                  >
                    <span className="text-gray-400">[08:09]</span>
                    <span>Uploading resume.pdf — PASS</span>
                  </motion.div>
                  <motion.div
                    className="flex justify-between items-center text-green-400"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.9 }}
                  >
                    <span className="text-gray-400">[08:12]</span>
                    <span>Application submitted — screenshot saved</span>
                  </motion.div>
                  <motion.div
                    className="flex justify-between items-center text-cyan-400"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1.0 }}
                  >
                    <span className="text-gray-400">[08:12]</span>
                    <span>Syncing to dashboard...</span>
                  </motion.div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-800 text-xs font-mono text-gray-400">
                  Windows · macOS · Linux · Offline ready · Auto-updates
                </div>
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

        {/* How It Works Section */}
        <section className="py-20 px-8 md:px-16 bg-black text-white border-t-4 border-purple-400">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-6xl md:text-8xl font-black leading-none mb-12"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="block">HOW THE SYSTEM</span>
              <span className="block bg-purple-400 text-black px-4 inline-block">RUNS</span>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
              {[
                {
                  step: "01",
                  title: "SCAN",
                  desc: "Ten-minute assessment maps skills, personality, and narratives.",
                },
                {
                  step: "02",
                  title: "SYNC",
                  desc: "Desktop app pulls your profile, resumes, preferences, job targets.",
                },
                {
                  step: "03",
                  title: "AUTOPILOT",
                  desc: "Agent scrapes listings, fills forms, uploads docs, captures proof.",
                },
                {
                  step: "04",
                  title: "TRACK",
                  desc: "Dashboard shows statuses, response rates, reminders, insights.",
                },
              ].map((item, idx) => (
                <motion.div
                  key={item.step}
                  className="border-4 border-white/50 bg-black p-6 hover:border-purple-400 transition-colors"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * idx }}
                  whileHover={{ scale: 1.05, rotate: 1 }}
                >
                  <div className="text-sm font-mono text-gray-400 mb-3 uppercase tracking-wider">{item.step}</div>
                  <div className="text-2xl font-black mb-3">{item.title}</div>
                  <p className="text-sm font-mono text-gray-300 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>

            <motion.p
              className="mt-12 text-center font-mono text-xs text-gray-400"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              Autopilot is in private beta. Join the waitlist below.
            </motion.p>
          </div>
        </section>

        {/* Roadmap Section */}
        <section className="py-24 px-8 md:px-16 bg-white border-t-4 border-black">
          <div className="max-w-7xl w-full mx-auto">
            <motion.div
              className="text-6xl md:text-8xl font-black leading-none mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="block">PUBLIC</span>
              <span className="block bg-black text-white px-4 inline-block">ROADMAP</span>
            </motion.div>

            <motion.p
              className="text-xl font-mono mb-12 max-w-3xl"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              We build in the open. No vaporware. No fluff. Hold us to this.
            </motion.p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Phase 1: Now */}
              <motion.div
                className="bg-black text-white p-8 border-4 border-cyan-400"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.02, rotate: 1 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-4xl font-black text-cyan-400">01</span>
                  <div>
                    <h3 className="text-2xl font-black">NOW</h3>
                    <p className="font-mono text-xs uppercase tracking-[0.3em] text-gray-400">Building</p>
                  </div>
                </div>
                <ul className="space-y-3 font-mono text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">{"\u003e"}</span>
                    <span>Tauri desktop app: Windows, macOS, Linux + auto-updates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">{"\u003e"}</span>
                    <span>Job scraping: LinkedIn, Indeed, remote boards, Fortune 500</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">{"\u003e"}</span>
                    <span>Browser automation: Auto-fill forms, resume upload, CAPTCHA alerts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">{"\u003e"}</span>
                    <span>Application tracking dashboard + reminders</span>
                  </li>
                </ul>
              </motion.div>

              {/* Phase 2: Next */}
              <motion.div
                className="bg-cyan-400 text-black p-8 border-4 border-black"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.02, rotate: -1 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-4xl font-black">02</span>
                  <div>
                    <h3 className="text-2xl font-black">NEXT</h3>
                    <p className="font-mono text-xs uppercase tracking-[0.3em] text-black/70">Queued</p>
                  </div>
                </div>
                <ul className="space-y-3 font-mono text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-black mt-1">{"\u003e"}</span>
                    <span>Adaptive form detection + smart retry logic</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-black mt-1">{"\u003e"}</span>
                    <span>Multi-tab simultaneous applications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-black mt-1">{"\u003e"}</span>
                    <span>Application templates: Cover letters, follow-up</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-black mt-1">{"\u003e"}</span>
                    <span>Bulk apply + success confirmation screenshots</span>
                  </li>
                </ul>
              </motion.div>

              {/* Phase 3: Future */}
              <motion.div
                className="bg-purple-400 text-black p-8 border-4 border-black"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.02, rotate: 1 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-4xl font-black">03</span>
                  <div>
                    <h3 className="text-2xl font-black">FUTURE</h3>
                    <p className="font-mono text-xs uppercase tracking-[0.3em] text-black/70">Vision</p>
                  </div>
                </div>
                <ul className="space-y-3 font-mono text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-black mt-1">{"\u003e"}</span>
                    <span>AI interview prep + salary prediction</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-black mt-1">{"\u003e"}</span>
                    <span>Team collaboration + shared dashboards</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-black mt-1">{"\u003e"}</span>
                    <span>Mobile companion app + browser extension</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-black mt-1">{"\u003e"}</span>
                    <span>Employer portal & ATS integrations</span>
                  </li>
                </ul>
              </motion.div>
            </div>

            <motion.div
              className="mt-12 border-4 border-black bg-black text-white p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
            >
              <p className="font-mono text-sm">
                Build → Measure → Prove → Unlock. No feature pile. Every release deepens the rebellion.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Final CTA - Split into Two Clear Actions */}
        <section className="py-24 px-8 md:px-16 bg-gradient-to-b from-black to-white border-t-4 border-black">
          <motion.div
            className="text-center max-w-5xl mx-auto"
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
              className="text-xl font-mono mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              {"\u003e"} Free assessment now. Desktop app auto-applies 24/7.
            </motion.p>

            {/* Two CTAs Side by Side */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-6">
              {/* Primary CTA: Assessment */}
              <motion.button
                className="group relative overflow-hidden bg-black text-white px-12 py-6 text-2xl font-black border-4 border-black uppercase tracking-tight w-full sm:w-auto shadow-[8px_8px_0_rgba(0,0,0,1)] hover:shadow-[12px_12px_0_rgba(0,0,0,1)] transition-all"
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = "/demo"}
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <span>Start Free Assessment</span>
                  <ArrowRight className="w-6 h-6" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>

              {/* Secondary CTA: Waitlist */}
              <motion.a
                href="/waitlist"
                className="group relative overflow-hidden bg-white text-black px-12 py-6 text-xl font-black border-4 border-black uppercase tracking-tight w-full sm:w-auto hover:bg-black hover:text-white transition-colors shadow-[8px_8px_0_rgba(0,0,0,1)] hover:shadow-[12px_12px_0_rgba(0,0,0,1)]"
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <span>Join Desktop App Waitlist</span>
                  <ArrowRight className="w-5 h-5" />
                </span>
              </motion.a>
            </div>

            <motion.p
              className="text-sm font-mono text-gray-500"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              Limited beta access. Get early access to the desktop app that auto-applies 24/7.
            </motion.p>
          </motion.div>
        </section>
      </main>

    </div>
  );
}
