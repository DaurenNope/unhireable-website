"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  TrendingUp,
  Shield,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Clock,
  Target,
  Zap,
  BarChart3,
  ArrowRight,
  Loader2,
  TrendingDown,
  Activity,
  Lightbulb,
  AlertTriangle,
} from "lucide-react";
import { track } from "../../lib/analytics";

interface PredictiveAnalytics {
  user_id: number;
  has_assessment?: boolean;
  promotion: {
    promotion_probability: number;
    base_probability: number;
    role_adjustment: number;
    time_to_promotion: string;
    key_factors: string[];
    blockers: string[];
    recommendations: string[];
    score_breakdown: {
      skill_score: number;
      experience_score: number;
      learning_score: number;
      market_alignment: number;
      performance_score: number;
    };
    target_role: string | null;
    confidence_level: string;
  };
  security: {
    security_score: number;
    automation_risk: number;
    market_demand_score: number;
    obsolescence_risk: number;
    industry_stability: number;
    risk_factors: string[];
    security_strengths: string[];
    recommendations: string[];
    risk_timeline: {
      short_term: string;
      medium_term: string;
      long_term: string;
    };
    security_level: string;
  };
  pivot: {
    overall_readiness: number;
    current_category: string;
    target_roles: string[];
    pivot_analyses: Array<{
      target_role: string;
      readiness_score: number;
      skill_overlap: number;
      matching_skills: string[];
      skill_gaps: string[];
      time_to_pivot: string;
      difficulty: string;
      learning_velocity_score: number;
    }>;
    transferable_skills: string[];
    skill_gaps: Array<{
      skill: string;
      market_value: number;
      priority: string;
    }>;
    time_to_pivot: string;
    pivot_strategy: {
      leverage_transferable_skills: string[];
      focus_areas: string[];
      learning_path: string;
      networking: string;
      timeline: string;
      approach: string;
    };
    readiness_level: string;
  };
}

export default function PredictiveAnalyticsPage() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const [analytics, setAnalytics] = useState<PredictiveAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"promotion" | "security" | "pivot">("promotion");
  const pathname = usePathname();

  useEffect(() => {
    track({ type: "page_view", path: pathname || "/predictive" });
  }, [pathname]);

  useEffect(() => {
    if (status === "loading") return;

    const loadAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);

        const backendUserId = (session as any)?.backendUserId;
        const userId = backendUserId
          ? String(backendUserId)
          : typeof window !== "undefined"
            ? localStorage.getItem("user_id") || null
            : null;

        // Skip API call if no valid user_id (not authenticated and no stored user_id)
        if (!userId || userId === "demo_user" || isNaN(Number(userId))) {
          // Return empty analytics data for demo/unauthenticated users
          setAnalytics({
            user_id: 0,
            has_assessment: false,
            promotion: {
              promotion_probability: 0,
              base_probability: 0,
              role_adjustment: 0,
              time_to_promotion: "N/A",
              key_factors: [],
              blockers: ["Complete an assessment to see promotion probability"],
              recommendations: ["Take the free assessment to get started"],
              score_breakdown: {
                skill_score: 0,
                experience_score: 0,
                learning_score: 0,
                market_alignment: 0,
                performance_score: 0,
              },
              target_role: null,
              confidence_level: "low",
            },
            security: {
              security_score: 0,
              automation_risk: 0,
              market_demand_score: 0,
              obsolescence_risk: 0,
              industry_stability: 0,
              risk_factors: ["Complete an assessment to see job security signals"],
              security_strengths: [],
              recommendations: ["Take the free assessment to get started"],
              risk_timeline: {
                short_term: "N/A",
                medium_term: "N/A",
                long_term: "N/A",
              },
              security_level: "low",
            },
            pivot: {
              overall_readiness: 0,
              current_category: "General",
              target_roles: [],
              pivot_analyses: [],
              transferable_skills: [],
              skill_gaps: [],
              time_to_pivot: "N/A",
              pivot_strategy: {
                leverage_transferable_skills: [],
                focus_areas: [],
                learning_path: "Complete an assessment to see pivot strategy",
                networking: "Complete an assessment to see networking recommendations",
                timeline: "Complete an assessment to see timeline",
                approach: "Complete an assessment to see approach",
              },
              readiness_level: "low",
            },
          });
          return;
        }

        const response = await fetch(`/api/predictive/analytics/${userId}`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.details || "Failed to load predictive analytics");
        }

        const data = await response.json();
        setAnalytics(data);
      } catch (err) {
        console.error("Failed to load predictive analytics", err);
        setError(err instanceof Error ? err.message : "Failed to load predictive analytics. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [status, session]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white text-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-cyan-500" />
          <div className="font-mono text-sm text-gray-600">Loading predictive analytics...</div>
        </div>
      </main>
    );
  }

  if (error || !analytics) {
    return (
      <main className="min-h-screen bg-white text-black flex items-center justify-center p-6">
        <div className="border-4 border-black bg-white p-8 text-center max-w-md">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-600" />
          <div className="text-2xl font-black mb-2">Analytics Unavailable</div>
          <div className="font-mono text-sm text-gray-600 mb-4">
            {error || "Failed to load predictive analytics. Please try again."}
          </div>
          <Link
            href="/demo"
            className="inline-block border-2 border-black bg-black text-cyan-400 px-4 py-2 font-black text-xs tracking-tight hover:bg-white hover:text-black transition-colors mb-2"
          >
            TAKE ASSESSMENT
          </Link>
          {!isAuthenticated && (
            <Link
              href="/login"
              className="inline-block border-2 border-black bg-white text-black px-4 py-2 font-black text-xs tracking-tight hover:bg-black hover:text-white transition-colors"
            >
              LOGIN
            </Link>
          )}
        </div>
      </main>
    );
  }

  const { promotion, security, pivot, has_assessment } = analytics;

  // Show assessment prompt if no assessment exists
  if (has_assessment === false) {
    return (
      <main className="min-h-screen bg-white text-black">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="border-4 border-black bg-yellow-50 p-8 text-center max-w-2xl mx-auto">
            <Target className="w-16 h-16 mx-auto mb-4 text-cyan-500" />
            <h1 className="text-3xl md:text-4xl font-black mb-4">Complete Your Assessment</h1>
            <p className="font-mono text-base text-gray-700 mb-6">
              Take our free 10-minute assessment to see your predictive career analytics.
            </p>
            <Link
              href="/demo"
              className="inline-flex items-center justify-center border-4 border-black bg-black text-cyan-400 px-8 py-4 font-black text-lg uppercase tracking-tight hover:bg-white hover:text-black transition-colors gap-2"
            >
              Take Free Assessment
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-black">
      {!isAuthenticated && (
        <div className="border-4 border-black bg-yellow-50 text-black p-4 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="font-black text-sm sm:text-base">LOG IN TO SYNC YOUR ANALYTICS</div>
          <p className="font-mono text-xs sm:text-sm text-gray-700 max-w-2xl">
            Viewing demo data. Log in to see your personalized predictive career analytics.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center border-2 border-black bg-black text-cyan-400 px-4 py-2 font-black text-xs tracking-tight hover:bg-white hover:text-black transition-colors"
          >
            LOGIN
          </Link>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-mono text-gray-600 hover:text-black mb-4"
          >
            <ArrowRight className="w-4 h-4 rotate-180" /> BACK HOME
          </Link>
          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-2">Predictive Career Analytics</h1>
          <p className="font-mono text-sm text-gray-600">
            AI-powered predictions for promotion probability, job security, and career pivots
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 border-b-4 border-black">
          <button
            onClick={() => setActiveTab("promotion")}
            className={`px-6 py-3 font-black text-sm uppercase tracking-tight border-b-4 transition-colors ${
              activeTab === "promotion"
                ? "border-cyan-400 text-cyan-500 bg-cyan-50"
                : "border-transparent text-gray-600 hover:text-black"
            }`}
          >
            <TrendingUp className="inline w-4 h-4 mr-2" />
            Promotion
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`px-6 py-3 font-black text-sm uppercase tracking-tight border-b-4 transition-colors ${
              activeTab === "security"
                ? "border-cyan-400 text-cyan-500 bg-cyan-50"
                : "border-transparent text-gray-600 hover:text-black"
            }`}
          >
            <Shield className="inline w-4 h-4 mr-2" />
            Job Security
          </button>
          <button
            onClick={() => setActiveTab("pivot")}
            className={`px-6 py-3 font-black text-sm uppercase tracking-tight border-b-4 transition-colors ${
              activeTab === "pivot"
                ? "border-cyan-400 text-cyan-500 bg-cyan-50"
                : "border-transparent text-gray-600 hover:text-black"
            }`}
          >
            <RefreshCw className="inline w-4 h-4 mr-2" />
            Pivot Readiness
          </button>
        </div>

        {/* Promotion Tab */}
        {activeTab === "promotion" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Promotion Probability Card */}
            <div className="border-4 border-black bg-white p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-cyan-500" />
                  <div>
                    <div className="font-black text-xl uppercase tracking-tight">Promotion Probability</div>
                    <div className="font-mono text-xs text-gray-600">
                      Likelihood of promotion based on skills, performance, and market conditions
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-5xl font-black text-cyan-500">{promotion.promotion_probability.toFixed(0)}%</div>
                  <div className="text-xs font-mono text-gray-600">
                    {promotion.confidence_level.toUpperCase()} CONFIDENCE
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-200 h-4 border-2 border-black mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${promotion.promotion_probability}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-cyan-400"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="border-2 border-black p-4 bg-gray-50">
                  <div className="font-mono text-xs text-gray-600 mb-1">Time to Promotion</div>
                  <div className="font-black text-xl">{promotion.time_to_promotion}</div>
                </div>
                <div className="border-2 border-black p-4 bg-gray-50">
                  <div className="font-mono text-xs text-gray-600 mb-1">Base Probability</div>
                  <div className="font-black text-xl">{promotion.base_probability.toFixed(0)}%</div>
                </div>
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="border-4 border-black bg-white p-6">
              <div className="font-black text-lg mb-4 uppercase tracking-tight">Score Breakdown</div>
              <div className="space-y-3">
                {Object.entries(promotion.score_breakdown).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex items-center justify-between text-xs font-mono text-gray-700 mb-1">
                      <span className="uppercase">{key.replace("_", " ")}</span>
                      <span>{value}</span>
                    </div>
                    <div className="h-2 border-2 border-black bg-white">
                      <div
                        className="h-full bg-black"
                        style={{ width: `${Math.min(100, (value / 30) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Factors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-4 border-black bg-white p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <div className="font-black text-lg uppercase tracking-tight">Key Factors</div>
                </div>
                <ul className="space-y-2">
                  {promotion.key_factors.map((factor, idx) => (
                    <li key={idx} className="font-mono text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-4 border-black bg-white p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <div className="font-black text-lg uppercase tracking-tight">Blockers</div>
                </div>
                <ul className="space-y-2">
                  {promotion.blockers.length > 0 ? (
                    promotion.blockers.map((blocker, idx) => (
                      <li key={idx} className="font-mono text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        <span>{blocker}</span>
                      </li>
                    ))
                  ) : (
                    <li className="font-mono text-sm text-gray-500">No major blockers identified</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Recommendations */}
            <div className="border-4 border-black bg-white p-6">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                <div className="font-black text-lg uppercase tracking-tight">Recommendations</div>
              </div>
              <ul className="space-y-3">
                {promotion.recommendations.map((rec, idx) => (
                  <li key={idx} className="font-mono text-sm text-gray-700 flex items-start gap-3">
                    <span className="font-black text-cyan-500">{idx + 1}.</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Security Score Card */}
            <div className="border-4 border-black bg-white p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-green-500" />
                  <div>
                    <div className="font-black text-xl uppercase tracking-tight">Job Security Score</div>
                    <div className="font-mono text-xs text-gray-600">
                      Security signals based on skills, market demand, and industry trends
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-5xl font-black text-green-500">{security.security_score.toFixed(0)}%</div>
                  <div className="text-xs font-mono text-gray-600">
                    {security.security_level.toUpperCase()} SECURITY
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-200 h-4 border-2 border-black mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${security.security_score}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-green-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="border-2 border-black p-3 bg-gray-50">
                  <div className="font-mono text-xs text-gray-600 mb-1">Automation Risk</div>
                  <div className="font-black text-lg text-red-600">{security.automation_risk.toFixed(0)}%</div>
                </div>
                <div className="border-2 border-black p-3 bg-gray-50">
                  <div className="font-mono text-xs text-gray-600 mb-1">Market Demand</div>
                  <div className="font-black text-lg text-green-600">{security.market_demand_score.toFixed(0)}%</div>
                </div>
                <div className="border-2 border-black p-3 bg-gray-50">
                  <div className="font-mono text-xs text-gray-600 mb-1">Obsolescence Risk</div>
                  <div className="font-black text-lg text-orange-600">{security.obsolescence_risk.toFixed(0)}%</div>
                </div>
                <div className="border-2 border-black p-3 bg-gray-50">
                  <div className="font-mono text-xs text-gray-600 mb-1">Industry Stability</div>
                  <div className="font-black text-lg text-blue-600">{security.industry_stability.toFixed(0)}%</div>
                </div>
              </div>
            </div>

            {/* Risk Timeline */}
            <div className="border-4 border-black bg-white p-6">
              <div className="font-black text-lg mb-4 uppercase tracking-tight">Risk Timeline</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border-2 border-black p-4 bg-red-50">
                  <div className="font-mono text-xs text-gray-600 mb-1">Short Term</div>
                  <div className="font-black text-lg">{security.risk_timeline.short_term}</div>
                </div>
                <div className="border-2 border-black p-4 bg-yellow-50">
                  <div className="font-mono text-xs text-gray-600 mb-1">Medium Term</div>
                  <div className="font-black text-lg">{security.risk_timeline.medium_term}</div>
                </div>
                <div className="border-2 border-black p-4 bg-green-50">
                  <div className="font-mono text-xs text-gray-600 mb-1">Long Term</div>
                  <div className="font-black text-lg">{security.risk_timeline.long_term}</div>
                </div>
              </div>
            </div>

            {/* Risk Factors & Strengths */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-4 border-black bg-white p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <div className="font-black text-lg uppercase tracking-tight">Risk Factors</div>
                </div>
                <ul className="space-y-2">
                  {security.risk_factors.length > 0 ? (
                    security.risk_factors.map((factor, idx) => (
                      <li key={idx} className="font-mono text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        <span>{factor}</span>
                      </li>
                    ))
                  ) : (
                    <li className="font-mono text-sm text-gray-500">No major risk factors identified</li>
                  )}
                </ul>
              </div>

              <div className="border-4 border-black bg-white p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <div className="font-black text-lg uppercase tracking-tight">Security Strengths</div>
                </div>
                <ul className="space-y-2">
                  {security.security_strengths.length > 0 ? (
                    security.security_strengths.map((strength, idx) => (
                      <li key={idx} className="font-mono text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span>{strength}</span>
                      </li>
                    ))
                  ) : (
                    <li className="font-mono text-sm text-gray-500">No specific strengths identified</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Recommendations */}
            <div className="border-4 border-black bg-white p-6">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                <div className="font-black text-lg uppercase tracking-tight">Security Recommendations</div>
              </div>
              <ul className="space-y-3">
                {security.recommendations.map((rec, idx) => (
                  <li key={idx} className="font-mono text-sm text-gray-700 flex items-start gap-3">
                    <span className="font-black text-cyan-500">{idx + 1}.</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}

        {/* Pivot Tab */}
        {activeTab === "pivot" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Pivot Readiness Card */}
            <div className="border-4 border-black bg-white p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <RefreshCw className="w-6 h-6 text-purple-500" />
                  <div>
                    <div className="font-black text-xl uppercase tracking-tight">Pivot Readiness</div>
                    <div className="font-mono text-xs text-gray-600">
                      Readiness to transition to new roles or industries
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-5xl font-black text-purple-500">{pivot.overall_readiness.toFixed(0)}%</div>
                  <div className="text-xs font-mono text-gray-600">
                    {pivot.readiness_level.toUpperCase()} READINESS
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-200 h-4 border-2 border-black mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pivot.overall_readiness}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-purple-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-2 border-black p-4 bg-gray-50">
                  <div className="font-mono text-xs text-gray-600 mb-1">Current Category</div>
                  <div className="font-black text-lg">{pivot.current_category}</div>
                </div>
                <div className="border-2 border-black p-4 bg-gray-50">
                  <div className="font-mono text-xs text-gray-600 mb-1">Time to Pivot</div>
                  <div className="font-black text-lg">{pivot.time_to_pivot}</div>
                </div>
              </div>
            </div>

            {/* Pivot Analyses */}
            <div className="border-4 border-black bg-white p-6">
              <div className="font-black text-lg mb-4 uppercase tracking-tight">Top Pivot Opportunities</div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pivot.pivot_analyses.map((analysis, idx) => (
                  <div key={idx} className="border-2 border-black p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-black text-sm">{analysis.target_role}</div>
                      <div className={`px-2 py-1 text-xs font-black ${
                        analysis.difficulty === "easy" ? "bg-green-500 text-white" :
                        analysis.difficulty === "medium" ? "bg-yellow-500 text-black" :
                        "bg-red-500 text-white"
                      }`}>
                        {analysis.difficulty.toUpperCase()}
                      </div>
                    </div>
                    <div className="font-black text-2xl mb-2">{analysis.readiness_score.toFixed(0)}%</div>
                    <div className="font-mono text-xs text-gray-600 mb-2">
                      Skill Overlap: {analysis.skill_overlap.toFixed(0)}%
                    </div>
                    <div className="font-mono text-xs text-gray-600 mb-2">
                      Time: {analysis.time_to_pivot}
                    </div>
                    <div className="mt-2">
                      <div className="font-mono text-xs text-gray-600 mb-1">Matching Skills:</div>
                      <div className="flex flex-wrap gap-1">
                        {analysis.matching_skills.slice(0, 3).map((skill, i) => (
                          <span key={i} className="px-2 py-1 border border-black bg-cyan-400 text-black text-xs font-black">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    {analysis.skill_gaps.length > 0 && (
                      <div className="mt-2">
                        <div className="font-mono text-xs text-gray-600 mb-1">Gaps:</div>
                        <div className="flex flex-wrap gap-1">
                          {analysis.skill_gaps.slice(0, 2).map((gap, i) => (
                            <span key={i} className="px-2 py-1 border border-dashed border-black bg-white text-black text-xs font-black">
                              {gap}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Transferable Skills */}
            <div className="border-4 border-black bg-white p-6">
              <div className="font-black text-lg mb-4 uppercase tracking-tight">Transferable Skills</div>
              <div className="flex flex-wrap gap-2">
                {pivot.transferable_skills.length > 0 ? (
                  pivot.transferable_skills.map((skill, idx) => (
                    <span key={idx} className="px-3 py-2 border-2 border-black bg-green-400 text-black text-sm font-black">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="font-mono text-sm text-gray-500">No transferable skills identified</span>
                )}
              </div>
            </div>

            {/* Pivot Strategy */}
            <div className="border-4 border-black bg-white p-6">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-cyan-500" />
                <div className="font-black text-lg uppercase tracking-tight">Pivot Strategy</div>
              </div>
              <div className="space-y-4">
                <div className="border-2 border-black p-4 bg-gray-50">
                  <div className="font-mono text-xs text-gray-600 mb-1">Approach</div>
                  <div className="font-black text-sm">{pivot.pivot_strategy.approach}</div>
                </div>
                <div className="border-2 border-black p-4 bg-gray-50">
                  <div className="font-mono text-xs text-gray-600 mb-1">Timeline</div>
                  <div className="font-black text-sm">{pivot.pivot_strategy.timeline}</div>
                </div>
                <div className="border-2 border-black p-4 bg-gray-50">
                  <div className="font-mono text-xs text-gray-600 mb-2">Focus Areas</div>
                  <div className="flex flex-wrap gap-2">
                    {pivot.pivot_strategy.focus_areas.map((area, idx) => (
                      <span key={idx} className="px-2 py-1 border border-black bg-yellow-400 text-black text-xs font-black">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="border-2 border-black p-4 bg-gray-50">
                  <div className="font-mono text-xs text-gray-600 mb-1">Learning Path</div>
                  <div className="font-mono text-sm text-gray-700">{pivot.pivot_strategy.learning_path}</div>
                </div>
                <div className="border-2 border-black p-4 bg-gray-50">
                  <div className="font-mono text-xs text-gray-600 mb-1">Networking</div>
                  <div className="font-mono text-sm text-gray-700">{pivot.pivot_strategy.networking}</div>
                </div>
              </div>
            </div>

            {/* Skill Gaps */}
            <div className="border-4 border-black bg-white p-6">
              <div className="font-black text-lg mb-4 uppercase tracking-tight">Skill Gaps for Pivot</div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {pivot.skill_gaps.slice(0, 6).map((gap, idx) => (
                  <div key={idx} className="border-2 border-black p-3 bg-gray-50">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-black text-sm">{gap.skill}</div>
                      <div className={`px-2 py-1 text-xs font-black ${
                        gap.priority === "high" ? "bg-red-500 text-white" :
                        gap.priority === "medium" ? "bg-yellow-500 text-black" :
                        "bg-gray-400 text-white"
                      }`}>
                        {gap.priority.toUpperCase()}
                      </div>
                    </div>
                    <div className="font-mono text-xs text-gray-600">Market Value: {gap.market_value}%</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}

