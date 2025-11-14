"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Clock, Play, ExternalLink, BookOpen, Target, Zap, Calendar, BarChart3, Loader2, Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { track } from "../../lib/analytics";
import { PathDetailsDrawer, PersonalizedLearningPath } from "../../components/learning/PathDetailsDrawer";

type LearningPath = PersonalizedLearningPath & {
  created_at?: string;
};

export default function LearningPathsPage() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'paths' | 'resources'>('paths');
  const [saved, setSaved] = useState<Set<number | string>>(new Set());
  const [generating, setGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    track({ type: "page_view", path: pathname || "/learning-paths" });
  }, [pathname]);

  useEffect(() => {
    if (status === "loading") return;

    const loadLearningPaths = async () => {
      try {
        setLoading(true);
        const backendUserId = (session as any)?.backendUserId;
        const userId = backendUserId ? String(backendUserId) : (typeof window !== "undefined" ? localStorage.getItem("user_id") : null) || "demo_user";

        const response = await fetch(`/api/learning/paths/${userId}`);
        const data = await response.json();

        if (data.paths) {
          const normalized = data.paths.map((path: any) => ({
            ...path,
            learning_style: path.learning_style ?? {},
            skill_gaps: path.skill_gaps ?? [],
            skills_with_resources: path.skills_with_resources ?? [],
            timeline: path.timeline ?? { total_hours: 0, total_weeks: 0, max_concurrent_skills: 1, learning_strategy: "sequential", skill_timelines: [] },
            milestones: path.milestones ?? [],
            daily_schedule: path.daily_schedule ?? [],
            status: path.status ?? "not_started",
            progress_percentage: path.progress_percentage ?? 0,
          }));
          setPaths(normalized);
        } else {
          setPaths([]);
        }
      } catch (error) {
        console.error('Failed to load learning paths:', error);
        setPaths([]);
      } finally {
        setLoading(false);
      }
    };

    loadLearningPaths();
  }, [status, session]);

  const handleGeneratePath = async () => {
    if (generating) return;
    setGenerating(true);
    setGenerationError(null);

    try {
      const backendUserId = (session as any)?.backendUserId;
      const userId = backendUserId ? String(backendUserId) : (typeof window !== "undefined" ? localStorage.getItem("user_id") : null) || "demo_user";

      const response = await fetch(`/api/learning/paths/${userId}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.detail || err?.message || "Failed to generate path");
      }

      const data = await response.json();
      if (data.path) {
        const normalized = {
          ...data.path,
          learning_style: data.path.learning_style ?? {},
          skill_gaps: data.path.skill_gaps ?? [],
          skills_with_resources: data.path.skills_with_resources ?? [],
          timeline: data.path.timeline ?? { total_hours: 0, total_weeks: 0, max_concurrent_skills: 1, learning_strategy: "sequential", skill_timelines: [] },
          milestones: data.path.milestones ?? [],
          daily_schedule: data.path.daily_schedule ?? [],
          status: data.path.status ?? "not_started",
          progress_percentage: data.path.progress_percentage ?? 0,
        } as LearningPath;

        setPaths(prev => {
          const filtered = prev.filter(p => p.id !== normalized.id);
          return [normalized, ...filtered];
        });
        setSelectedPath(normalized);
        track({ type: "learning_path_open", pathId: data.path.id });
      }
    } catch (error) {
      console.error("Generate learning path error", error);
      setGenerationError(error instanceof Error ? error.message : "Could not generate learning path");
    } finally {
      setGenerating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500 text-white";
      case "in_progress": return "bg-cyan-500 text-white";
      case "not_started": return "bg-gray-400 text-white";
      default: return "bg-gray-400 text-white";
    }
  };

  const BrutalistButton = ({ onClick, children, variant = "primary", icon, size = "md" }: any) => {
    const sizeClasses: Record<string, string> = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-3 text-base",
      lg: "px-6 py-4 text-lg"
    };

    return (
      <button
        onClick={onClick}
        className={`font-black border-2 transition-all transform hover:scale-105 ${sizeClasses[size]} ${
          variant === "primary" 
            ? "bg-cyan-400 text-black border-black hover:bg-white" 
            : variant === "secondary"
            ? "bg-black text-cyan-400 border-cyan-400 hover:bg-cyan-400 hover:text-black"
            : "bg-purple-400 text-black border-black hover:bg-white"
        } flex items-center gap-2`}
      >
        {icon && <span className="w-4 h-4">{icon}</span>}
        {children}
      </button>
    );
  };

  const LearningPathCard = ({
    path,
    index,
    onOpen,
    onSave,
    onStart,
  }: {
    path: LearningPath;
    index: number;
    onOpen: (id: number) => void;
    onSave: (id: number) => void;
    onStart: (id: number) => void;
  }) => {
    const progress = path.progress_percentage ?? 0;
    const status = path.status ?? "not_started";
    const topSkills = path.skills_with_resources.slice(0, 3);

    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ scale: 1.02 }}
        className="bg-white border-4 border-black cursor-pointer hover:border-cyan-400 transition-all"
        onClick={() => onOpen(path.id)}
      >
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-black text-xl mb-1">{path.title}</h3>
              <div className="font-mono text-xs text-gray-600 uppercase">{path.learning_strategy} strategy</div>
            </div>
            <div className="text-right">
              <div className={`inline-block px-3 py-1 text-xs font-black ${getStatusColor(status)}`}>
                {status.replace("_", " ").toUpperCase()}
              </div>
              <div className="font-black text-2xl text-cyan-400 mt-2">{progress}%</div>
              <div className="text-xs font-mono">PROGRESS</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="border-2 border-black p-3 text-center bg-gray-50">
              <Clock className="w-4 h-4 mx-auto mb-1 text-gray-600" />
              <div className="font-black text-lg">{path.timeline.total_hours}h</div>
              <div className="text-xs font-mono">TOTAL HOURS</div>
            </div>
            <div className="border-2 border-black p-3 text-center bg-gray-50">
              <Calendar className="w-4 h-4 mx-auto mb-1 text-gray-600" />
              <div className="font-black text-lg">{path.timeline.total_weeks}w</div>
              <div className="text-xs font-mono">DURATION</div>
            </div>
            <div className="border-2 border-black p-3 text-center bg-gray-50">
              <Target className="w-4 h-4 mx-auto mb-1 text-gray-600" />
              <div className="font-black text-lg">{path.skill_gaps.length}</div>
              <div className="text-xs font-mono">SKILL GAPS</div>
            </div>
            <div className="border-2 border-black p-3 text-center bg-gray-50">
              <BarChart3 className="w-4 h-4 mx-auto mb-1 text-gray-600" />
              <div className="font-black text-lg">{path.learning_style.hours_per_day ?? path.hours_per_day ?? 3}h</div>
              <div className="text-xs font-mono">PER DAY</div>
            </div>
          </div>

          <div>
            <div className="font-black text-sm mb-2 flex items-center gap-2">
              <Target className="w-4 h-4" />
              FOCUS STACK
            </div>
            <div className="flex flex-wrap gap-2">
              {topSkills.map((skill) => (
                <span key={skill.skill} className="bg-yellow-100 text-yellow-800 px-2 py-1 text-xs font-mono border border-yellow-600">
                  {skill.skill}
                </span>
              ))}
            </div>
          </div>

          <div className="border-2 border-black p-3 bg-gray-50">
            <div className="font-black text-sm mb-1">Next up</div>
            <div className="font-mono text-xs text-gray-700">
              Day 1 → {path.daily_schedule?.[0]?.skill ?? "--"} · {path.daily_schedule?.[0]?.resource_title ?? "Focus pending"}
            </div>
          </div>

          <div className="flex gap-2">
            <BrutalistButton
              onClick={(e: any) => {
                e.stopPropagation();
                onOpen(path.id);
              }}
              variant="secondary"
              size="sm"
              icon={<ExternalLink className="w-3 h-3" />}
            >
              VIEW PLAN
            </BrutalistButton>
            {status === "not_started" && (
              <BrutalistButton
                onClick={(e: any) => {
                  e.stopPropagation();
                  onStart(path.id);
                }}
                variant="primary"
                size="sm"
                icon={<Play className="w-3 h-3" />}
              >
                START LEARNING
              </BrutalistButton>
            )}
            {status === "in_progress" && (
              <BrutalistButton
                onClick={(e: any) => {
                  e.stopPropagation();
                  onOpen(path.id);
                }}
                variant="primary"
                size="sm"
                icon={<BookOpen className="w-3 h-3" />}
              >
                CONTINUE
              </BrutalistButton>
            )}
            <BrutalistButton
              onClick={(e: any) => {
                e.stopPropagation();
                onSave(path.id);
              }}
              variant="primary"
              size="sm"
              icon={<Sparkles className="w-3 h-3" />}
            >
              SAVE PATH
            </BrutalistButton>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {!isAuthenticated && (
        <div className="border-4 border-black bg-yellow-50 text-black p-5 mb-10 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="font-black text-sm sm:text-base">LOG IN TO PERSONALIZE YOUR LEARNING MAP</div>
          <p className="font-mono text-xs sm:text-sm text-gray-700 max-w-3xl">
            We're showing the demo learning paths right now. Sign in to sync your actual skill gaps and let the agent adapt the plan around your assessment data.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center border-2 border-black bg-black text-cyan-400 px-4 py-2 font-black text-xs tracking-tight hover:bg-white hover:text-black transition-colors"
          >
            LOGIN
          </Link>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center gap-4 mb-10">
          <Link
            href="/"
            className="border-4 border-black px-4 py-2 font-black bg-black text-cyan-400 hover:bg-white hover:text-black transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            BACK
          </Link>
          
          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => setActiveTab('paths')}
              className={`px-4 py-2 font-black border-2 transition-colors ${
                activeTab === 'paths'
                  ? 'bg-cyan-400 text-black border-black'
                  : 'bg-white text-black border-black hover:bg-cyan-400'
              }`}
            >
              PATHS
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`px-4 py-2 font-black border-2 transition-colors ${
                activeTab === 'resources'
                  ? 'bg-cyan-400 text-black border-black'
                  : 'bg-white text-black border-black hover:bg-cyan-400'
              }`}
            >
              RESOURCES
            </button>
          </div>
        </div>

        {activeTab === 'paths' && (
          <div>
            {loading ? (
              <div className="text-center py-12 font-mono">Loading paths...</div>
            ) : paths.length === 0 ? (
              <div className="border-4 border-black bg-white p-8 text-center space-y-4">
                <div className="text-2xl font-black mb-2">No learning paths yet</div>
                <div className="font-mono text-sm text-gray-600">
                  Generate a hyper-personalized path from your assessment signals.
                </div>
                <button
                  onClick={handleGeneratePath}
                  disabled={generating}
                  className="inline-flex items-center justify-center gap-2 border-4 border-black bg-black text-cyan-400 px-5 py-3 font-black text-sm tracking-tight hover:bg-white hover:text-black transition-colors disabled:opacity-60"
                >
                  {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {generating ? "Generating plan..." : "Generate Personalized Path"}
                </button>
                {generationError && (
                  <div className="text-xs font-mono text-red-600">{generationError}</div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {paths.map((path, index) => (
                  <LearningPathCard
                    key={path.id}
                    path={path}
                    index={index}
                    onOpen={(id) => setSelectedPath(paths.find(p => p.id === id) ?? null)}
                    onSave={(id) => {
                      setSaved(prev => new Set(prev).add(id));
                      track({ type: "learning_path_save", pathId: id });
                    }}
                    onStart={(id) => {
                      setPaths(prev => prev.map(p => 
                        p.id === id ? { ...p, status: 'in_progress', progress_percentage: Math.max(p.progress_percentage ?? 0, 5) } : p
                      ));
                      track({ type: "learning_path_start", pathId: id });
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="border-4 border-black bg-white p-6">
            <div className="text-xl font-black mb-4">LEARNING RESOURCES</div>
            <div className="font-mono text-sm text-gray-600">
              Resource browser coming soon. Select a learning path to see recommended resources.
            </div>
          </div>
        )}
      </main>

      {selectedPath && (
        <PathDetailsDrawer
          path={selectedPath}
          onClose={() => setSelectedPath(null)}
        />
      )}
    </div>
  );
}
