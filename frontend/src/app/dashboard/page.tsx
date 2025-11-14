"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  TrendingUp,
  Target,
  Zap,
  BarChart3,
  Clock,
  DollarSign,
  Award,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Loader2,
  TrendingDown,
  Activity,
  BookOpen,
  Briefcase,
  Shield,
  RefreshCw,
} from "lucide-react";
import { track } from "../../lib/analytics";

interface DashboardData {
  user_id: number;
  has_assessment?: boolean;
  market_readiness_score: number;
  skill_gaps: {
    total_gaps: number;
    critical_gaps: number;
    total_learning_hours: number;
    gaps: Array<{
      skill: string;
      category: string;
      market_value: number;
      priority: string;
      estimated_learning_hours: number;
      salary_impact: number;
    }>;
    categories_with_gaps: string[];
    skills_covered: number;
    skills_required: number;
  };
  market_pulse: {
    trending_skills: Array<{
      skill: string;
      growth: number;
      demand: number;
      salary_premium: number;
    }>;
    opportunities: Array<{
      skill: string;
      growth: number;
      demand: number;
      salary_premium: number;
    }>;
    market_alignment_score: number;
    current_salary_premium: number;
    potential_salary_premium: number;
    salary_benchmark: {
      min: number;
      avg: number;
      max: number;
    };
    experience_level: string;
    demand_signals: {
      high_demand_skills_count: number;
      growing_skills_count: number;
      market_opportunities: number;
    };
  };
  progress_velocity: {
    paths_completed: number;
    paths_in_progress: number;
    paths_total: number;
    average_completion_rate: number;
    skills_acquired_last_30_days: number;
    learning_velocity: number;
    hours_learned_last_30_days: number;
    total_hours_completed: number;
    total_hours_planned: number;
    projected_completion_date: string | null;
  };
  benchmarks: {
    experience_level: string;
    user_metrics: {
      skills_count: number;
      avg_match_score: number;
      learning_paths_count: number;
      avg_completion_rate: number;
    };
    industry_benchmarks: {
      avg_skills: number;
      avg_match_score: number;
      avg_learning_paths: number;
      avg_completion_rate: number;
    };
    percentile_rankings: {
      skills: number;
      match_score: number;
      learning_paths: number;
      completion_rate: number;
      overall: number;
    };
    comparison: {
      skills_vs_peers: string;
      match_score_vs_peers: string;
      learning_paths_vs_peers: string;
      completion_rate_vs_peers: string;
    };
  };
  skill_trajectories: Record<string, any>;
  predictive_summary?: {
    promotion_probability: number;
    time_to_promotion: string;
    security_score: number;
    automation_risk: number;
    pivot_readiness: number;
    time_to_pivot: string;
  };
  last_updated: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    track({ type: "page_view", path: pathname || "/dashboard" });
  }, [pathname]);

  useEffect(() => {
    if (status === "loading") return;

    const loadDashboard = async () => {
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
          // Return empty dashboard data for demo/unauthenticated users
          setDashboardData({
            user_id: 0,
            has_assessment: false,
            market_readiness_score: 0,
            skill_gaps: {
              total_gaps: 0,
              critical_gaps: 0,
              total_learning_hours: 0,
              gaps: [],
              categories_with_gaps: [],
              skills_covered: 0,
              skills_required: 0,
            },
            market_pulse: {
              trending_skills: [],
              opportunities: [],
              market_alignment_score: 0,
              current_salary_premium: 0,
              potential_salary_premium: 0,
              salary_benchmark: { min: 0, avg: 0, max: 0 },
              experience_level: "Entry Level (0-2 years)",
              demand_signals: {
                high_demand_skills_count: 0,
                growing_skills_count: 0,
                market_opportunities: 0,
              },
            },
            progress_velocity: {
              paths_completed: 0,
              paths_in_progress: 0,
              paths_total: 0,
              average_completion_rate: 0,
              skills_acquired_last_30_days: 0,
              learning_velocity: 0,
              hours_learned_last_30_days: 0,
              total_hours_completed: 0,
              total_hours_planned: 0,
              projected_completion_date: null,
            },
            benchmarks: {
              experience_level: "Entry Level (0-2 years)",
              user_metrics: {
                skills_count: 0,
                avg_match_score: 0,
                learning_paths_count: 0,
                avg_completion_rate: 0,
              },
              industry_benchmarks: {
                avg_skills: 5,
                avg_match_score: 65,
                avg_learning_paths: 2,
                avg_completion_rate: 45,
              },
              percentile_rankings: {
                skills: 0,
                match_score: 0,
                learning_paths: 0,
                completion_rate: 0,
                overall: 0,
              },
              comparison: {
                skills_vs_peers: "below",
                match_score_vs_peers: "below",
                learning_paths_vs_peers: "below",
                completion_rate_vs_peers: "below",
              },
            },
            skill_trajectories: {},
            predictive_summary: {
              promotion_probability: 0,
              time_to_promotion: "N/A",
              security_score: 0,
              automation_risk: 0,
              pivot_readiness: 0,
              time_to_pivot: "N/A",
            },
            last_updated: new Date().toISOString(),
          });
          return;
        }

        const response = await fetch(`/api/dashboard/${userId}`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.details || "Failed to load dashboard");
        }

        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        console.error("Failed to load dashboard", err);
        setError(err instanceof Error ? err.message : "Failed to load dashboard. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [status, session]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white text-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-cyan-500" />
          <div className="font-mono text-sm text-gray-600">Loading dashboard...</div>
        </div>
      </main>
    );
  }

  if (error || !dashboardData) {
    return (
      <main className="min-h-screen bg-white text-black flex items-center justify-center p-6">
        <div className="border-4 border-black bg-white p-8 text-center max-w-md">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-600" />
          <div className="text-2xl font-black mb-2">Dashboard unavailable</div>
          <div className="font-mono text-sm text-gray-600 mb-4">
            {error || "Failed to load dashboard. Please try again."}
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

  const { skill_gaps, market_pulse, progress_velocity, benchmarks, market_readiness_score, predictive_summary, has_assessment } = dashboardData;

  // Show assessment prompt if no assessment exists
  if (has_assessment === false) {
    return (
      <main className="min-h-screen bg-white text-black">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="mb-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-mono text-gray-600 hover:text-black mb-4"
            >
              <ArrowRight className="w-4 h-4 rotate-180" /> BACK HOME
            </Link>
            <h1 className="text-4xl md:text-5xl font-black leading-tight mb-2">Career Intelligence Dashboard</h1>
            <p className="font-mono text-sm text-gray-600">
              Real-time insights into your market readiness, skill gaps, and career trajectory
            </p>
          </div>
          <div className="border-4 border-black bg-yellow-50 p-8 text-center max-w-2xl mx-auto">
            <Target className="w-16 h-16 mx-auto mb-4 text-cyan-500" />
            <h2 className="text-3xl md:text-4xl font-black mb-4">Complete Your Assessment</h2>
            <p className="font-mono text-base text-gray-700 mb-6">
              Take our free 10-minute assessment to see your personalized career intelligence dashboard.
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

  // Ensure all data exists (handle undefined/null gracefully)
  const safeSkillGaps = skill_gaps || { total_gaps: 0, critical_gaps: 0, gaps: [], skills_covered: 0 };
  const safeMarketPulse = market_pulse || { market_alignment_score: 0, demand_signals: { high_demand_skills_count: 0 } };
  const safeProgressVelocity = progress_velocity || { learning_velocity: 0, skills_acquired_last_30_days: 0 };
  const safeBenchmarks = benchmarks || { percentile_rankings: { overall: 0 }, experience_level: "Entry Level (0-2 years)" };
  const safePredictiveSummary = predictive_summary || { promotion_probability: 0, security_score: 0, pivot_readiness: 0, time_to_promotion: "N/A", automation_risk: 0, time_to_pivot: "N/A" };
  const safeMarketReadinessScore = market_readiness_score || 0;

  return (
    <main className="min-h-screen bg-white text-black">
      {!isAuthenticated && (
        <div className="border-4 border-black bg-yellow-50 text-black p-4 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="font-black text-sm sm:text-base">LOG IN TO SYNC YOUR DASHBOARD</div>
          <p className="font-mono text-xs sm:text-sm text-gray-700 max-w-2xl">
            Viewing demo data. Log in to see your personalized career intelligence dashboard.
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
          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-2">Career Intelligence Dashboard</h1>
          <p className="font-mono text-sm text-gray-600">
            Real-time insights into your market readiness, skill gaps, and career trajectory
          </p>
        </div>

        {/* Market Readiness Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-4 border-black bg-white p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-cyan-500" />
              <div>
                <div className="font-black text-lg uppercase tracking-tight">Market Readiness</div>
                <div className="font-mono text-xs text-gray-600">Your overall career readiness score</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-5xl font-black text-cyan-500">{safeMarketReadinessScore}</div>
              <div className="text-xs font-mono text-gray-600">out of 100</div>
            </div>
          </div>
          <div className="w-full bg-gray-200 h-4 border-2 border-black">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${safeMarketReadinessScore}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-cyan-400"
            />
          </div>
        </motion.div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            icon={<Target className="w-5 h-5" />}
            label="Skill Gaps"
            value={safeSkillGaps.critical_gaps}
            subtitle={`${safeSkillGaps.total_gaps} total`}
            color="cyan"
          />
          <MetricCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="Market Alignment"
            value={`${safeMarketPulse.market_alignment_score}%`}
            subtitle={`${safeMarketPulse.demand_signals.high_demand_skills_count} high-demand skills`}
            color="green"
          />
          <MetricCard
            icon={<Activity className="w-5 h-5" />}
            label="Learning Velocity"
            value={`${safeProgressVelocity.learning_velocity.toFixed(1)}`}
            subtitle={`${safeProgressVelocity.skills_acquired_last_30_days} skills (30d)`}
            color="purple"
          />
          <MetricCard
            icon={<BarChart3 className="w-5 h-5" />}
            label="Percentile Rank"
            value={`${safeBenchmarks.percentile_rankings.overall.toFixed(0)}th`}
            subtitle={`vs ${safeBenchmarks.experience_level}`}
            color="yellow"
          />
        </div>

        {/* Skill Gaps Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="border-4 border-black bg-white p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6 text-cyan-500" />
              <div>
                <div className="font-black text-xl uppercase tracking-tight">Skill Gaps</div>
                <div className="font-mono text-xs text-gray-600">
                  {safeSkillGaps.skills_covered} skills covered • {safeSkillGaps.total_gaps} gaps identified
                </div>
              </div>
            </div>
            <Link
              href="/learning-paths"
              className="border-2 border-black bg-black text-cyan-400 px-4 py-2 font-black text-xs tracking-tight hover:bg-white hover:text-black transition-colors"
            >
              VIEW PATHS
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {safeSkillGaps.gaps && safeSkillGaps.gaps.length > 0 ? (
              safeSkillGaps.gaps.slice(0, 6).map((gap, idx) => (
                <div key={idx} className="border-2 border-black p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-black text-sm">{gap.skill}</div>
                    <div className={`px-2 py-1 text-xs font-black ${
                      gap.priority === "high" ? "bg-red-500 text-white" :
                      gap.priority === "medium" ? "bg-yellow-500 text-black" :
                      "bg-gray-400 text-white"
                    }`}>
                      {gap.priority.toUpperCase()}
                    </div>
                  </div>
                  <div className="font-mono text-xs text-gray-600 mb-2">{gap.category}</div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span>Market: {gap.market_value}%</span>
                    <span className="text-green-600">+${gap.salary_impact.toLocaleString()}</span>
                  </div>
                  <div className="mt-2 text-xs font-mono text-gray-500">
                    {gap.estimated_learning_hours}h to learn
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full border-2 border-dashed border-black p-8 bg-gray-50 text-center">
                <div className="font-mono text-sm text-gray-600">
                  No skill gaps identified. Complete an assessment to see personalized skill gap analysis.
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Market Pulse Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="border-4 border-black bg-white p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-green-500" />
              <div>
                <div className="font-black text-xl uppercase tracking-tight">Market Pulse</div>
                <div className="font-mono text-xs text-gray-600">
                  Trending skills and salary insights
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="font-black text-sm mb-3 uppercase tracking-tight">Salary Benchmarks</div>
              <div className="border-2 border-black p-4 bg-gray-50 mb-4">
                <div className="font-mono text-xs text-gray-600 mb-2">
                  {safeMarketPulse.experience_level || "Entry Level (0-2 years)"}
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs">Min:</span>
                  <span className="font-black">${(safeMarketPulse.salary_benchmark?.min || 0).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs">Avg:</span>
                  <span className="font-black text-cyan-500">${(safeMarketPulse.salary_benchmark?.avg || 0).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs">Max:</span>
                  <span className="font-black">${(safeMarketPulse.salary_benchmark?.max || 0).toLocaleString()}</span>
                </div>
              </div>
              <div className="border-2 border-black p-4 bg-gray-50">
                <div className="font-mono text-xs text-gray-600 mb-2">Current Premium</div>
                <div className="font-black text-2xl text-green-600">
                  +${(safeMarketPulse.current_salary_premium || 0).toLocaleString()}
                </div>
                <div className="font-mono text-xs text-gray-600 mt-2">Potential Premium</div>
                <div className="font-black text-lg text-cyan-500">
                  +${(safeMarketPulse.potential_salary_premium || 0).toLocaleString()}
                </div>
              </div>
            </div>
            <div>
              <div className="font-black text-sm mb-3 uppercase tracking-tight">Top Opportunities</div>
              <div className="space-y-2">
                {safeMarketPulse.opportunities && safeMarketPulse.opportunities.length > 0 ? (
                  safeMarketPulse.opportunities.slice(0, 5).map((opp, idx) => (
                    <div key={idx} className="border-2 border-black p-3 bg-white">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-black text-sm">{opp.skill}</div>
                        <div className="text-xs font-mono text-green-600">
                          +${opp.salary_premium.toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs font-mono text-gray-600">
                        <span>Demand: {opp.demand}%</span>
                        <span>Growth: {(opp.growth * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="border-2 border-dashed border-black p-6 bg-gray-50 text-center">
                    <div className="font-mono text-sm text-gray-600">
                      Complete an assessment to see market opportunities.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Progress Velocity Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="border-4 border-black bg-white p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Activity className="w-6 h-6 text-purple-500" />
              <div>
                <div className="font-black text-xl uppercase tracking-tight">Progress Velocity</div>
                <div className="font-mono text-xs text-gray-600">
                  Learning path completion and skill acquisition
                </div>
              </div>
            </div>
            <Link
              href="/learning-paths"
              className="border-2 border-black bg-black text-cyan-400 px-4 py-2 font-black text-xs tracking-tight hover:bg-white hover:text-black transition-colors"
            >
              VIEW PATHS
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="border-2 border-black p-4 bg-gray-50">
              <div className="font-mono text-xs text-gray-600 mb-1">Paths Completed</div>
              <div className="font-black text-2xl">{safeProgressVelocity.paths_completed || 0}</div>
              <div className="font-mono text-xs text-gray-500 mt-1">
                of {safeProgressVelocity.paths_total || 0} total
              </div>
            </div>
            <div className="border-2 border-black p-4 bg-gray-50">
              <div className="font-mono text-xs text-gray-600 mb-1">Completion Rate</div>
              <div className="font-black text-2xl">{(safeProgressVelocity.average_completion_rate || 0).toFixed(0)}%</div>
              <div className="font-mono text-xs text-gray-500 mt-1">average</div>
            </div>
            <div className="border-2 border-black p-4 bg-gray-50">
              <div className="font-mono text-xs text-gray-600 mb-1">Hours Learned</div>
              <div className="font-black text-2xl">{(safeProgressVelocity.hours_learned_last_30_days || 0).toFixed(0)}</div>
              <div className="font-mono text-xs text-gray-500 mt-1">last 30 days</div>
            </div>
            <div className="border-2 border-black p-4 bg-gray-50">
              <div className="font-mono text-xs text-gray-600 mb-1">Skills Acquired</div>
              <div className="font-black text-2xl">{safeProgressVelocity.skills_acquired_last_30_days || 0}</div>
              <div className="font-mono text-xs text-gray-500 mt-1">last 30 days</div>
            </div>
          </div>
        </motion.div>

        {/* Benchmarks Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="border-4 border-black bg-white p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-yellow-500" />
              <div>
                <div className="font-black text-xl uppercase tracking-tight">Benchmarks</div>
                <div className="font-mono text-xs text-gray-600">
                  How you compare to {safeBenchmarks.experience_level || "Entry Level (0-2 years)"} peers
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <BenchmarkCard
              label="Skills"
              userValue={safeBenchmarks.user_metrics?.skills_count || 0}
              industryValue={safeBenchmarks.industry_benchmarks?.avg_skills || 5}
              percentile={safeBenchmarks.percentile_rankings?.skills || 0}
              comparison={safeBenchmarks.comparison?.skills_vs_peers || "below"}
            />
            <BenchmarkCard
              label="Match Score"
              userValue={(safeBenchmarks.user_metrics?.avg_match_score || 0).toFixed(1)}
              industryValue={(safeBenchmarks.industry_benchmarks?.avg_match_score || 65).toFixed(1)}
              percentile={safeBenchmarks.percentile_rankings?.match_score || 0}
              comparison={safeBenchmarks.comparison?.match_score_vs_peers || "below"}
            />
            <BenchmarkCard
              label="Learning Paths"
              userValue={safeBenchmarks.user_metrics?.learning_paths_count || 0}
              industryValue={safeBenchmarks.industry_benchmarks?.avg_learning_paths || 2}
              percentile={safeBenchmarks.percentile_rankings?.learning_paths || 0}
              comparison={safeBenchmarks.comparison?.learning_paths_vs_peers || "below"}
            />
            <BenchmarkCard
              label="Completion Rate"
              userValue={`${(safeBenchmarks.user_metrics?.avg_completion_rate || 0).toFixed(0)}%`}
              industryValue={`${(safeBenchmarks.industry_benchmarks?.avg_completion_rate || 45).toFixed(0)}%`}
              percentile={safeBenchmarks.percentile_rankings?.completion_rate || 0}
              comparison={safeBenchmarks.comparison?.completion_rate_vs_peers || "below"}
            />
          </div>
        </motion.div>

        {/* Predictive Analytics Summary */}
        {safePredictiveSummary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="border-4 border-black bg-white p-6 mt-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Zap className="w-6 h-6 text-purple-500" />
                <div>
                  <div className="font-black text-xl uppercase tracking-tight">Predictive Analytics</div>
                  <div className="font-mono text-xs text-gray-600">
                    AI-powered predictions for your career trajectory
                  </div>
                </div>
              </div>
              <Link
                href="/predictive"
                className="border-2 border-black bg-black text-cyan-400 px-4 py-2 font-black text-xs tracking-tight hover:bg-white hover:text-black transition-colors"
              >
                VIEW FULL ANALYTICS
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border-2 border-black p-4 bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-cyan-500" />
                  <div className="font-black text-sm uppercase tracking-tight">Promotion</div>
                </div>
                <div className="font-black text-3xl mb-1">
                  {(safePredictiveSummary.promotion_probability || 0).toFixed(0)}%
                </div>
                <div className="font-mono text-xs text-gray-600">
                  {safePredictiveSummary.time_to_promotion || "N/A"}
                </div>
              </div>
              <div className="border-2 border-black p-4 bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-green-500" />
                  <div className="font-black text-sm uppercase tracking-tight">Security</div>
                </div>
                <div className="font-black text-3xl mb-1">
                  {(safePredictiveSummary.security_score || 0).toFixed(0)}%
                </div>
                <div className="font-mono text-xs text-gray-600">
                  Risk: {(safePredictiveSummary.automation_risk || 0).toFixed(0)}%
                </div>
              </div>
              <div className="border-2 border-black p-4 bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <RefreshCw className="w-5 h-5 text-purple-500" />
                  <div className="font-black text-sm uppercase tracking-tight">Pivot</div>
                </div>
                <div className="font-black text-3xl mb-1">
                  {(safePredictiveSummary.pivot_readiness || 0).toFixed(0)}%
                </div>
                <div className="font-mono text-xs text-gray-600">
                  {safePredictiveSummary.time_to_pivot || "N/A"}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}

function MetricCard({
  icon,
  label,
  value,
  subtitle,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtitle: string;
  color: "cyan" | "green" | "purple" | "yellow";
}) {
  const colorClasses = {
    cyan: "bg-cyan-400 text-black",
    green: "bg-green-400 text-black",
    purple: "bg-purple-400 text-black",
    yellow: "bg-yellow-400 text-black",
  };

  return (
    <div className="border-4 border-black bg-white p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className={colorClasses[color]}>{icon}</div>
        <div className="font-black text-xs uppercase tracking-tight">{label}</div>
      </div>
      <div className="font-black text-3xl mb-1">{value}</div>
      <div className="font-mono text-xs text-gray-600">{subtitle}</div>
    </div>
  );
}

function BenchmarkCard({
  label,
  userValue,
  industryValue,
  percentile,
  comparison,
}: {
  label: string;
  userValue: string | number;
  industryValue: string | number;
  percentile: number;
  comparison: string;
}) {
  const isAbove = comparison === "above";
  const isBelow = comparison === "below";

  return (
    <div className="border-2 border-black p-4 bg-gray-50">
      <div className="font-black text-sm mb-3 uppercase tracking-tight">{label}</div>
      <div className="flex items-center justify-between mb-2">
        <div className="font-mono text-xs text-gray-600">You:</div>
        <div className="font-black text-lg">{userValue}</div>
      </div>
      <div className="flex items-center justify-between mb-3">
        <div className="font-mono text-xs text-gray-600">Industry:</div>
        <div className="font-mono text-sm">{industryValue}</div>
      </div>
      <div className="flex items-center justify-between">
        <div className="font-mono text-xs text-gray-600">Percentile:</div>
        <div className={`font-black text-sm ${
          isAbove ? "text-green-600" : isBelow ? "text-red-600" : "text-gray-600"
        }`}>
          {percentile.toFixed(0)}th
        </div>
      </div>
      <div className="mt-2 text-xs font-mono text-gray-500">
        {isAbove && <TrendingUp className="inline w-3 h-3 mr-1" />}
        {isBelow && <TrendingDown className="inline w-3 h-3 mr-1" />}
        {comparison === "above" ? "Above average" : comparison === "below" ? "Below average" : "Average"}
      </div>
    </div>
  );
}

