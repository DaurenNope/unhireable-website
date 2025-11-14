"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Target, Zap, TrendingUp, ArrowRight, Copy } from "lucide-react";

const DEFAULT_LINKEDIN_SUGGESTIONS = {
  has_assessment: false,
  suggestions: {
    primary_role: "Modern Software Engineer",
    headline_suggestions: [
      "Software Engineer • React & TypeScript • Shipping delightful user experiences",
      "Full-Stack Developer | Next.js • Node.js • Product Strategy",
      "Human-centered Engineer | Turning ideas into shipped products",
    ],
    summary_highlights: {
      headline: "I blend product intuition with technical depth to ship high-impact features.",
      strengths: [
        "⚡ Translating ambiguous ideas into ship-ready plans",
        "🤝 Building trust across engineering, product, and design",
        "📈 Using data to prioritize what actually moves the needle",
      ],
      future_focus: "Today, I'm focused on work that blends technical depth with product intuition.",
    },
    skills_to_feature: [
      "React",
      "TypeScript",
      "Node.js",
      "Product Strategy",
      "Design Systems",
      "Delivery Excellence",
    ],
    profile_checklist: [
      {
        item: "Refresh your headline to show role + differentiator + proof points",
        status: "pending",
      },
      {
        item: "Add a Featured section showcasing 1-2 flagship projects",
        status: "pending",
      },
      {
        item: "Ask for a recommendation that highlights your collaboration style",
        status: "pending",
      },
      {
        item: "Activate Open-To-Work with custom targeting (if actively searching)",
        status: "pending",
      },
    ],
    tone: "Impact-Driven",
    generated_at: new Date().toISOString(),
  },
};

function ResultsPageContent() {
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get("assessment_id");
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<any>(null);
  const [linkedinSuggestions, setLinkedinSuggestions] = useState<any>(null);
  const [linkedinLoading, setLinkedinLoading] = useState(true);

  useEffect(() => {
    const loadResults = async () => {
      try {
        setLoading(true);
        
        // Try to get user_id from session or localStorage
        const userId = typeof window !== "undefined" 
          ? localStorage.getItem("user_id") 
          : null;
        
        if (!userId || userId === "demo_user" || !assessmentId) {
          // Show demo results if no user/assessment
          setResults({
            market_readiness: 75,
            skills: ["React", "TypeScript", "Node.js"],
            recommendations: [
              "Complete your profile to see personalized matches",
              "Take the full assessment to unlock all features",
              "Build your resume to get started"
            ]
          });
          setLoading(false);
          setLinkedinSuggestions(DEFAULT_LINKEDIN_SUGGESTIONS);
          setLinkedinLoading(false);
          return;
        }
        
        // Fetch assessment data from backend
        const assessmentResponse = await fetch(`/api/assessments/${userId}`);
        if (!assessmentResponse.ok) {
          throw new Error('Failed to fetch assessment');
        }
        
        const assessmentData = await assessmentResponse.json();
        
        // Fetch dashboard data to get market readiness score
        const dashboardResponse = await fetch(`/api/dashboard/${userId}`);
        let marketReadiness = 75;
        let skills: string[] = [];
        let recommendations: string[] = [
          "Build your resume to get started",
          "Check out personalized job matches",
          "Explore learning paths for skill gaps"
        ];
        
        if (dashboardResponse.ok) {
          const dashboardData = await dashboardResponse.json();
          marketReadiness = dashboardData.market_readiness_score || dashboardData.market_readiness || 75;
          
          // Extract skills from assessment
          if (assessmentData.career_interests?.technical_skills) {
            const techSkills = assessmentData.career_interests.technical_skills;
            if (typeof techSkills === 'object') {
              skills = Object.keys(techSkills).filter(skill => 
                techSkills[skill] && techSkills[skill] !== "None"
              );
            }
          }
          
          // Add recommendations based on dashboard data
          if (dashboardData.skill_gaps?.critical_gaps > 0) {
            recommendations.unshift(`Focus on ${dashboardData.skill_gaps.critical_gaps} critical skill gaps`);
          }
        }
        
        setResults({
          market_readiness: marketReadiness,
          skills: skills.length > 0 ? skills : ["Complete assessment to see skills"],
          recommendations: recommendations
        });

        // Fetch LinkedIn enhancement suggestions
        try {
          setLinkedinLoading(true);
          const linkedinResponse = await fetch(`/api/linkedin/${userId}`);
          if (linkedinResponse.ok) {
            const linkedinData = await linkedinResponse.json();
            setLinkedinSuggestions(linkedinData);
          } else {
            console.warn("Failed to load LinkedIn suggestions");
            setLinkedinSuggestions(DEFAULT_LINKEDIN_SUGGESTIONS);
          }
        } catch (err) {
          console.error("LinkedIn suggestions error:", err);
          setLinkedinSuggestions(DEFAULT_LINKEDIN_SUGGESTIONS);
        } finally {
          setLinkedinLoading(false);
        }
        
      } catch (error) {
        console.error('Failed to load results:', error);
        // Show fallback results
        setResults({
          market_readiness: 75,
          skills: ["Complete assessment to see skills"],
          recommendations: [
            "Complete your profile to see personalized matches",
            "Take the full assessment to unlock all features",
            "Build your resume to get started"
          ]
        });
        setLinkedinSuggestions(DEFAULT_LINKEDIN_SUGGESTIONS);
      } finally {
        setLoading(false);
        setLinkedinLoading(false);
      }
    };
    
    loadResults();
  }, [assessmentId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white text-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="font-mono text-sm">Loading your results...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-mono text-gray-600 hover:text-black mb-8">
          <ArrowLeft className="w-4 h-4" /> BACK HOME
        </Link>

        <div className="space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">Your Assessment Results</h1>
            <p className="font-mono text-sm text-gray-600">Here's what we found about your career readiness</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-4 border-black p-8 bg-gradient-to-r from-cyan-400 to-purple-400"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-black">Market Readiness Score</h2>
              <div className="text-5xl font-black">{results?.market_readiness || 0}%</div>
            </div>
            <div className="w-full bg-black h-4">
              <motion.div
                className="bg-white h-full"
                initial={{ width: 0 }}
                animate={{ width: `${results?.market_readiness || 0}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="border-4 border-black p-6 bg-white"
            >
              <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-cyan-500" />
                Your Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {results?.skills?.map((skill: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-black text-cyan-400 text-sm font-mono uppercase">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="border-4 border-black p-6 bg-white"
            >
              <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-purple-500" />
                Next Steps
              </h3>
              <ul className="space-y-2">
                {results?.recommendations?.map((rec: string, i: number) => (
                  <li key={i} className="font-mono text-sm flex items-start gap-2">
                    <span className="text-purple-500 mt-1">→</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* LinkedIn Tune-Up */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="border-4 border-black p-6 bg-white"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="text-2xl font-black mb-2 flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-blue-500" />
                  LinkedIn Tune-Up (Beta)
                </h3>
                <p className="font-mono text-xs text-gray-600">
                  Instant headline, summary, and profile upgrades based on your assessment.
                </p>
              </div>
              <div className="text-xs font-mono text-gray-500 uppercase">
                {linkedinSuggestions?.suggestions?.generated_at
                  ? `Generated ${new Date(linkedinSuggestions.suggestions.generated_at).toLocaleString()}`
                  : "Generating..."}
              </div>
            </div>

            {linkedinLoading ? (
              <div className="flex items-center gap-3 text-sm font-mono text-gray-500">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
                Crafting LinkedIn upgrades...
              </div>
            ) : (
              <div className="space-y-6">
                {/* Headline suggestions */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-black">Headline Boosters</h4>
                    <button
                      onClick={() => {
                        const text = (linkedinSuggestions?.suggestions?.headline_suggestions || []).join("\n");
                        if (navigator?.clipboard && text) {
                          navigator.clipboard.writeText(text);
                        }
                      }}
                      className="inline-flex items-center gap-1 border-2 border-black px-3 py-1 text-xs font-black uppercase tracking-tight hover:bg-black hover:text-cyan-400 transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                      Copy All
                    </button>
                  </div>
                  <ul className="space-y-2">
                    {linkedinSuggestions?.suggestions?.headline_suggestions?.map((headline: string, index: number) => (
                      <li
                        key={index}
                        className="border-2 border-dashed border-gray-300 p-3 font-mono text-sm bg-gray-50"
                      >
                        {headline}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Summary highlights */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border-2 border-black bg-black text-white p-4">
                    <div className="text-xs font-mono uppercase text-cyan-400 mb-2">Opening Hook</div>
                    <p className="text-sm leading-relaxed">
                      {linkedinSuggestions?.suggestions?.summary_highlights?.headline}
                    </p>
                  </div>
                  <div className="border-2 border-black bg-white p-4">
                    <div className="text-xs font-mono uppercase text-purple-500 mb-2">Future Focus</div>
                    <p className="text-sm leading-relaxed">
                      {linkedinSuggestions?.suggestions?.summary_highlights?.future_focus}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-mono uppercase text-gray-500 mb-2">Core Strengths</div>
                  <ul className="space-y-2">
                    {linkedinSuggestions?.suggestions?.summary_highlights?.strengths?.map((strength: string, idx: number) => (
                      <li key={idx} className="font-mono text-sm flex items-start gap-2">
                        <span className="text-cyan-500 mt-1">▸</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Skills to feature */}
                <div>
                  <h4 className="text-lg font-black mb-3">Skills to Feature</h4>
                  <div className="flex flex-wrap gap-2">
                    {linkedinSuggestions?.suggestions?.skills_to_feature?.map((skill: string, i: number) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-black text-cyan-400 text-xs font-mono uppercase tracking-tight"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Checklist */}
                <div>
                  <h4 className="text-lg font-black mb-3">Profile Checklist</h4>
                  <ul className="space-y-2">
                    {linkedinSuggestions?.suggestions?.profile_checklist?.map(
                      (item: { item: string; status: string }, index: number) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="mt-1">
                            <input type="checkbox" disabled className="w-4 h-4 border-2 border-black" />
                          </div>
                          <span className="font-mono text-sm text-gray-700">{item.item}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            )}
          </motion.div>

          <div className="flex gap-4">
            <Link
              href="/resume"
              className="flex-1 inline-flex items-center justify-center border-4 border-black bg-black text-cyan-400 px-8 py-4 font-black text-lg uppercase tracking-tight hover:bg-white hover:text-black transition-colors gap-2"
            >
              Build Resume
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/demo"
              className="flex-1 inline-flex items-center justify-center border-4 border-black bg-white text-black px-8 py-4 font-black text-lg uppercase tracking-tight hover:bg-black hover:text-cyan-400 transition-colors gap-2"
            >
              Retake Assessment
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-white text-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="font-mono text-sm">Loading...</p>
        </div>
      </main>
    }>
      <ResultsPageContent />
    </Suspense>
  );
}

