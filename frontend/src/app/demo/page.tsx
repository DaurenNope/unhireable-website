"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Target, Brain, Heart, Code, Rocket, CheckCircle2, Clock, Users, TrendingUp } from "lucide-react";
import { cn } from "../../lib/utils";
import { ChatbotContainer } from "../../components/assessment/ChatbotContainer";
import Link from "next/link";

export default function DemoPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showAssessment, setShowAssessment] = useState(false);
  const [answers, setAnswers] = useState<any | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  function validateEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "PERSONALITY ANALYSIS",
      description: "41 deep psychological questions that reveal who you really are, not just what you can code",
      color: "from-cyan-400 to-blue-500"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "VIBE MATCHING",
      description: "Find companies that match your work style, culture preferences, and personality",
      color: "from-purple-400 to-pink-500"
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: "SKILL INTELLIGENCE",
      description: "Real-time insights about your technical skills, gaps, and market value",
      color: "from-yellow-400 to-orange-500"
    }
  ];

  return (
    <div className="min-h-screen bg-white text-black overflow-x-hidden relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 -left-40 w-80 h-80 bg-cyan-400 rounded-full blur-3xl opacity-20"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 -right-40 w-96 h-96 bg-purple-400 rounded-full blur-3xl opacity-20"
          animate={{
            x: [0, -80, 0],
            y: [0, -60, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 left-1/3 w-72 h-72 bg-yellow-400 rounded-full blur-3xl opacity-15"
          animate={{
            x: [0, 60, 0],
            y: [0, -40, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section - Redesigned */}
        <section className="min-h-screen flex items-center justify-center px-6 md:px-12 py-20">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: Hero Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 bg-black text-cyan-400 px-4 py-2 border-4 border-cyan-400 font-mono text-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>DEEP PSYCHOLOGICAL ASSESSMENT</span>
                </motion.div>

                {/* Main Headline */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight"
                >
                  <span className="block">STOP</span>
                  <span className="block bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    GUESSING
                  </span>
                  <span className="block">WHO YOU ARE</span>
                </motion.h1>

                {/* Subheadline */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl md:text-2xl font-mono text-gray-700 leading-relaxed max-w-2xl"
                >
                  This isn't a skills quiz. We ask <span className="font-black text-black">41 deep questions</span> about your personality, vibes, preferences, and work style. So we can find you jobs that actually match <span className="font-black text-black">who you are</span>, not just what you can code.
                </motion.p>

                {/* Key Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-3 gap-4 pt-4"
                >
                  <div className="border-4 border-black bg-white p-4 text-center">
                    <div className="text-3xl font-black text-cyan-500">41</div>
                    <div className="text-xs font-mono mt-1">QUESTIONS</div>
                  </div>
                  <div className="border-4 border-black bg-white p-4 text-center">
                    <div className="text-3xl font-black text-purple-500">15-20</div>
                    <div className="text-xs font-mono mt-1">MINUTES</div>
                  </div>
                  <div className="border-4 border-black bg-white p-4 text-center">
                    <div className="text-3xl font-black text-yellow-500">100%</div>
                    <div className="text-xs font-mono mt-1">FREE</div>
                  </div>
                </motion.div>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col sm:flex-row gap-4 pt-4"
                >
                  <motion.button
                    onClick={() => setShowAssessment(true)}
                    className="group relative bg-black text-white px-8 py-5 text-lg font-black border-4 border-cyan-400 overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      <Rocket className="w-5 h-5" />
                      START DEEP ASSESSMENT
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                    <span className="relative z-10 flex items-center gap-3 text-black">
                      <Rocket className="w-5 h-5" />
                      START DEEP ASSESSMENT
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </motion.button>
                  
                  <Link
                    href="/dashboard"
                    className="border-4 border-black bg-white text-black px-8 py-5 text-lg font-black hover:bg-black hover:text-cyan-400 transition-colors flex items-center justify-center gap-3"
                  >
                    VIEW SAMPLE RESULTS
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </motion.div>

                {/* Trust Indicators */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="flex flex-wrap items-center gap-6 pt-4 text-sm font-mono"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>No credit card</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-500" />
                    <span>Instant results</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-500" />
                    <span>100% free</span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Right: Interactive Feature Showcase */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                {/* Rotating Feature Cards */}
                <div className="relative h-[500px]">
                  <AnimatePresence mode="wait">
                    {features.map((feature, index) => (
                      activeFeature === index && (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
                          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                          exit={{ opacity: 0, scale: 0.9, rotateY: 15 }}
                          transition={{ duration: 0.5 }}
                          className={cn(
                            "absolute inset-0 border-4 border-black p-8 bg-gradient-to-br",
                            feature.color,
                            "text-black"
                          )}
                        >
                          <div className="h-full flex flex-col justify-between">
                            <div>
                              <div className="mb-6">{feature.icon}</div>
                              <h3 className="text-3xl font-black mb-4">{feature.title}</h3>
                              <p className="text-lg font-mono leading-relaxed">{feature.description}</p>
                            </div>
                            <div className="flex gap-2">
                              {features.map((_, i) => (
                                <div
                                  key={i}
                                  className={cn(
                                    "h-2 flex-1 border-2 border-black",
                                    i === activeFeature ? "bg-black" : "bg-white"
                                  )}
                                />
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* What Makes This Different Section */}
        <section className="py-24 px-6 md:px-12 bg-black text-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-6xl font-black mb-4">
                WHY THIS IS{" "}
                <span className="bg-cyan-400 text-black px-4">DIFFERENT</span>
              </h2>
              <p className="text-xl font-mono text-gray-300 max-w-3xl mx-auto">
                Most assessments ask about skills. We ask about <span className="text-cyan-400 font-black">who you are</span>.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  number: "01",
                  title: "PERSONALITY FIRST",
                  description: "We analyze your energy source, decision-making style, conflict handling, and stress response",
                  icon: <Brain className="w-6 h-6" />
                },
                {
                  number: "02",
                  title: "VIBE CHECK",
                  description: "Understand your work style, team preferences, and culture fit before matching you",
                  icon: <Heart className="w-6 h-6" />
                },
                {
                  number: "03",
                  title: "REAL SCENARIOS",
                  description: "We ask how you'd handle code reviews, deadlines, and legacy code - real situations",
                  icon: <Code className="w-6 h-6" />
                },
                {
                  number: "04",
                  title: "DEEP REFLECTION",
                  description: "Career fears, ideal workday, deal breakers - we get to the core of what matters",
                  icon: <Target className="w-6 h-6" />
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="border-4 border-cyan-400 bg-black p-6 hover:bg-cyan-400 hover:text-black transition-all duration-300 group"
                >
                  <div className="text-6xl font-black text-cyan-400 group-hover:text-black mb-4 opacity-50">
                    {item.number}
                  </div>
                  <div className="mb-4 text-cyan-400 group-hover:text-black">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-black mb-3">{item.title}</h3>
                  <p className="font-mono text-sm text-gray-300 group-hover:text-black">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Assessment Preview Section */}
        <section className="py-24 px-6 md:px-12 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-6xl font-black mb-4">
                SEE IT IN{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  ACTION
                </span>
              </h2>
              <p className="text-xl font-mono text-gray-600 max-w-3xl mx-auto">
                Start the assessment right here. No signup required. Just honest answers.
              </p>
            </motion.div>

            {/* Assessment Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="border-4 border-black bg-white shadow-2xl"
            >
              {!showAssessment ? (
                <div className="p-8 md:p-12">
                  {/* Preview Header */}
                  <div className="flex items-center justify-between mb-8 pb-6 border-b-4 border-black">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-400 rounded-full flex items-center justify-center text-2xl font-black border-4 border-black">
                        🤖
                      </div>
                      <div>
                        <div className="text-2xl font-black">DEEP ASSESSMENT</div>
                        <div className="font-mono text-sm text-gray-600">Ready to discover yourself</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="font-mono text-sm">LIVE</span>
                    </div>
                  </div>

                  {/* Preview Content */}
                  <div className="space-y-6 mb-8">
                    {/* Bot Message Preview */}
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-cyan-400 rounded-full flex items-center justify-center text-xl font-black border-2 border-black flex-shrink-0">
                        🤖
                      </div>
                      <div className="flex-1 border-4 border-black bg-white p-6">
                        <div className="font-black text-lg mb-2">
                          This isn't your typical assessment. We're going deep.
                        </div>
                        <div className="font-mono text-sm text-gray-700">
                          I'm going to ask you questions about your personality, your vibes, your preferences - not just what skills you have. Be honest. No one's judging.
                        </div>
                      </div>
                    </div>

                    {/* Sample Questions Preview */}
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        "Where do you get your energy from?",
                        "When making a big decision, you:",
                        "Someone ships broken code. You:"
                      ].map((question, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          className="border-2 border-gray-300 bg-gray-50 p-4 font-mono text-sm"
                        >
                          <div className="text-xs text-gray-500 mb-1">Question {index + 1}</div>
                          {question}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Start Button */}
                  <motion.button
                    onClick={() => setShowAssessment(true)}
                    className="w-full bg-gradient-to-r from-cyan-400 to-purple-400 text-black px-8 py-6 text-xl font-black border-4 border-black hover:scale-105 transition-transform flex items-center justify-center gap-3"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Zap className="w-6 h-6" />
                    START ASSESSMENT NOW
                    <ArrowRight className="w-6 h-6" />
                  </motion.button>
                  
                  <div className="text-center mt-4 font-mono text-sm text-gray-500">
                    15-20 minutes • 41 questions • 100% free
                  </div>
                </div>
              ) : (
                <div className="h-[700px] max-h-[90vh] relative">
                  <motion.button
                    className="absolute top-4 left-4 z-50 bg-white text-black px-4 py-2 border-4 border-black font-black text-sm hover:bg-black hover:text-cyan-400 transition-colors"
                    onClick={() => setShowAssessment(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ← BACK
                  </motion.button>
                  
                  <ChatbotContainer
                    userId="demo-user-123"
                    onAssessmentComplete={(a) => {
                      setAnswers(a);
                      setShowEmailModal(true);
                    }}
                  />
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 px-6 md:px-12 bg-gradient-to-br from-cyan-50 to-purple-50">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <TrendingUp className="w-8 h-8" />,
                  number: "89%",
                  label: "SUCCESS RATE",
                  description: "vs 12% industry average",
                  color: "cyan"
                },
                {
                  icon: <Clock className="w-8 h-8" />,
                  number: "21 DAYS",
                  label: "AVERAGE HIRE TIME",
                  description: "vs 4.5 months traditional",
                  color: "purple"
                },
                {
                  icon: <Users className="w-8 h-8" />,
                  number: "2,847",
                  label: "COMPANIES",
                  description: "Ready to hire you",
                  color: "yellow"
                }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "border-4 border-black p-8 bg-white text-center",
                    stat.color === "cyan" && "border-cyan-400",
                    stat.color === "purple" && "border-purple-400",
                    stat.color === "yellow" && "border-yellow-400"
                  )}
                >
                  <div className={cn(
                    "mb-4 inline-flex p-3 border-4 border-black",
                    stat.color === "cyan" && "bg-cyan-400",
                    stat.color === "purple" && "bg-purple-400",
                    stat.color === "yellow" && "bg-yellow-400"
                  )}>
                    {stat.icon}
                  </div>
                  <div className="text-5xl font-black mb-2">{stat.number}</div>
                  <div className="text-lg font-black mb-2">{stat.label}</div>
                  <div className="font-mono text-sm text-gray-600">{stat.description}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-6 md:px-12 bg-black text-white">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-4xl md:text-6xl font-black">
                READY TO FIND OUT{" "}
                <span className="bg-cyan-400 text-black px-4">WHO YOU ARE</span>?
              </h2>
              <p className="text-xl font-mono text-gray-300">
                Take the deep assessment. Get matched with jobs that actually fit. No bullshit.
              </p>
              <motion.button
                onClick={() => setShowAssessment(true)}
                className="bg-cyan-400 text-black px-12 py-6 text-2xl font-black border-4 border-white hover:bg-white transition-colors inline-flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                START NOW
                <Rocket className="w-6 h-6" />
              </motion.button>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Email Capture Modal */}
      <AnimatePresence>
        {showEmailModal && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowEmailModal(false)}
          >
            <motion.div
              className="w-full max-w-lg bg-white border-4 border-black p-8 relative"
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 border-4 border-black px-3 py-1 font-black text-sm hover:bg-black hover:text-cyan-400 transition-colors"
                onClick={() => setShowEmailModal(false)}
              >
                ✕
              </button>
              <div className="text-4xl mb-4">🎉</div>
              <h3 className="text-3xl font-black mb-2">Assessment Complete!</h3>
              <p className="font-mono text-gray-700 mb-6">
                Enter your email to get your full personality profile and job matches sent to you.
              </p>
              <div className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError("");
                  }}
                  placeholder="you@domain.com"
                  className="w-full border-4 border-black px-4 py-3 font-mono text-lg focus:outline-none focus:border-cyan-400"
                />
                {emailError && (
                  <div className="text-red-600 font-mono text-sm">{emailError}</div>
                )}
                <button
                  className="w-full bg-black text-cyan-400 border-4 border-black px-6 py-4 text-lg font-black hover:bg-cyan-400 hover:text-black transition-colors"
                  onClick={() => {
                    if (!validateEmail(email)) {
                      setEmailError("Please enter a valid email.");
                      return;
                    }
                    setShowEmailModal(false);
                    window.location.href = `/results?assessment_id=${answers?.assessment_id || 'demo'}`;
                  }}
                >
                  GET MY RESULTS →
                </button>
                <div className="text-center text-xs font-mono text-gray-500">
                  No spam. Unsubscribe anytime.
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
