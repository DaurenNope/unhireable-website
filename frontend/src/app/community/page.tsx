"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  MessageCircle,
  Users,
  BookOpen,
  ArrowRight,
  Loader2,
  AlertCircle,
  ThumbsUp,
  Tag,
  Search,
  Plus,
  Sparkles,
  UserPlus,
  Calendar,
  Clock,
  TrendingUp,
  Shield,
  Crown,
  Zap,
  HelpCircle,
} from "lucide-react";
import { track } from "../../lib/analytics";

// Question interfaces
interface Question {
  id: number;
  user_id: number;
  title: string;
  content: string;
  category: string;
  tags: string[];
  status: string;
  views_count: number;
  upvotes_count: number;
  answers_count: number;
  ai_answer: string | null;
  ai_answer_confidence: number | null;
  created_at: string;
  updated_at: string;
}

// Cohort interfaces
interface Cohort {
  id: number;
  name: string;
  description: string | null;
  role_category: string | null;
  skill_level: string | null;
  max_members: number;
  current_members_count: number;
  is_active: boolean;
  is_public: boolean;
  created_by: number;
  created_at: string;
  updated_at: string;
}

// Squad interfaces
interface StudySquad {
  id: number;
  name: string;
  description: string | null;
  learning_path_id: number | null;
  skill_focus: string | null;
  max_members: number;
  current_members_count: number;
  is_active: boolean;
  is_public: boolean;
  created_by: number;
  scheduled_study_time: string | null;
  timezone: string;
  created_at: string;
  updated_at: string;
}

type TabType = "questions" | "cohorts" | "squads";

export default function CommunityPage() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const [activeTab, setActiveTab] = useState<TabType>("questions");
  const pathname = usePathname();

  // Questions state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [questionsError, setQuestionsError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAskModal, setShowAskModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ title: "", content: "", category: "general", tags: [] as string[] });
  const [submittingQuestion, setSubmittingQuestion] = useState(false);

  // Cohorts state
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [cohortsLoading, setCohortsLoading] = useState(true);
  const [cohortsError, setCohortsError] = useState<string | null>(null);
  const [showCreateCohortModal, setShowCreateCohortModal] = useState(false);
  const [newCohort, setNewCohort] = useState({
    name: "",
    description: "",
    role_category: "",
    skill_level: "",
    max_members: 100,
    is_public: true,
  });
  const [submittingCohort, setSubmittingCohort] = useState(false);
  const [joiningCohort, setJoiningCohort] = useState<number | null>(null);

  // Squads state
  const [squads, setSquads] = useState<StudySquad[]>([]);
  const [squadsLoading, setSquadsLoading] = useState(true);
  const [squadsError, setSquadsError] = useState<string | null>(null);
  const [showCreateSquadModal, setShowCreateSquadModal] = useState(false);
  const [newSquad, setNewSquad] = useState({
    name: "",
    description: "",
    skill_focus: "",
    max_members: 5,
    is_public: false,
    scheduled_study_time: "",
  });
  const [submittingSquad, setSubmittingSquad] = useState(false);
  const [joiningSquad, setJoiningSquad] = useState<number | null>(null);

  const categories = ["general", "career", "technical", "interview", "learning", "resume", "job-search"];
  const roleCategories = ["Frontend Developer", "Backend Developer", "Full Stack Developer", "Data Scientist", "DevOps Engineer", "Product Manager", "UI/UX Designer", "Mobile Developer", "QA Engineer", "Other"];
  const skillLevels = ["Entry", "Mid", "Senior", "Expert"];
  const skillFocuses = ["React", "Python", "Node.js", "AWS", "Docker", "Kubernetes", "Machine Learning", "Data Science", "TypeScript", "Vue.js", "Angular", "Go", "Rust", "Java", "Other"];

  useEffect(() => {
    track({ type: "page_view", path: pathname || "/community" });
  }, [pathname]);

  // Load questions
  useEffect(() => {
    if (status === "loading" || activeTab !== "questions") return;

    const loadQuestions = async () => {
      try {
        setQuestionsLoading(true);
        setQuestionsError(null);

        const backendUserId = (session as any)?.backendUserId;
        const userId = backendUserId
          ? String(backendUserId)
          : typeof window !== "undefined"
            ? localStorage.getItem("user_id") || null
            : null;

        const params = new URLSearchParams();
        if (userId && !isNaN(Number(userId))) params.append("user_id", userId);
        if (selectedCategory) params.append("category", selectedCategory);
        params.append("limit", "50");

        const response = await fetch(`/api/community/questions?${params.toString()}`);
        if (!response.ok) throw new Error("Failed to load questions");

        const data = await response.json();
        let filtered = data.questions || [];

        if (searchQuery) {
          filtered = filtered.filter(
            (q: Question) =>
              q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              q.content.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        setQuestions(filtered);
      } catch (err) {
        setQuestionsError(err instanceof Error ? err.message : "Failed to load questions");
      } finally {
        setQuestionsLoading(false);
      }
    };

    loadQuestions();
  }, [status, session, activeTab, selectedCategory, searchQuery]);

  // Load cohorts
  useEffect(() => {
    if (status === "loading" || activeTab !== "cohorts") return;

    const loadCohorts = async () => {
      try {
        setCohortsLoading(true);
        setCohortsError(null);

        const backendUserId = (session as any)?.backendUserId;
        const userId = backendUserId
          ? String(backendUserId)
          : typeof window !== "undefined"
            ? localStorage.getItem("user_id") || null
            : null;

        const params = new URLSearchParams();
        if (userId && !isNaN(Number(userId))) params.append("user_id", userId);
        params.append("limit", "50");

        const response = await fetch(`/api/community/cohorts?${params.toString()}`);
        if (!response.ok) throw new Error("Failed to load cohorts");

        const data = await response.json();
        setCohorts(data.cohorts || []);
      } catch (err) {
        setCohortsError(err instanceof Error ? err.message : "Failed to load cohorts");
      } finally {
        setCohortsLoading(false);
      }
    };

    loadCohorts();
  }, [status, session, activeTab]);

  // Load squads
  useEffect(() => {
    if (status === "loading" || activeTab !== "squads") return;

    const loadSquads = async () => {
      try {
        setSquadsLoading(true);
        setSquadsError(null);

        const backendUserId = (session as any)?.backendUserId;
        const userId = backendUserId
          ? String(backendUserId)
          : typeof window !== "undefined"
            ? localStorage.getItem("user_id") || null
            : null;

        const params = new URLSearchParams();
        if (userId && !isNaN(Number(userId))) params.append("user_id", userId);
        params.append("limit", "50");

        const response = await fetch(`/api/community/squads?${params.toString()}`);
        if (!response.ok) throw new Error("Failed to load squads");

        const data = await response.json();
        setSquads(data.squads || []);
      } catch (err) {
        setSquadsError(err instanceof Error ? err.message : "Failed to load squads");
      } finally {
        setSquadsLoading(false);
      }
    };

    loadSquads();
  }, [status, session, activeTab]);

  const handleAskQuestion = async () => {
    if (!newQuestion.title.trim() || !newQuestion.content.trim()) {
      setQuestionsError("Please fill in all required fields");
      return;
    }

    try {
      setSubmittingQuestion(true);
      setQuestionsError(null);

      const backendUserId = (session as any)?.backendUserId;
      const userId = backendUserId
        ? String(backendUserId)
        : typeof window !== "undefined"
          ? localStorage.getItem("user_id") || null
          : null;

      if (!userId || isNaN(Number(userId))) {
        setQuestionsError("Please log in to ask a question");
        return;
      }

      const response = await fetch(`/api/community/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          title: newQuestion.title,
          content: newQuestion.content,
          category: newQuestion.category,
          tags: newQuestion.tags,
        }),
      });

      if (!response.ok) throw new Error("Failed to ask question");

      const data = await response.json();
      setQuestions([data, ...questions]);
      setNewQuestion({ title: "", content: "", category: "general", tags: [] });
      setShowAskModal(false);
      track({ type: "question_asked" });
    } catch (err) {
      setQuestionsError(err instanceof Error ? err.message : "Failed to ask question");
    } finally {
      setSubmittingQuestion(false);
    }
  };

  const handleCreateCohort = async () => {
    if (!newCohort.name.trim()) {
      setCohortsError("Please provide a cohort name");
      return;
    }

    try {
      setSubmittingCohort(true);
      setCohortsError(null);

      const backendUserId = (session as any)?.backendUserId;
      const userId = backendUserId
        ? String(backendUserId)
        : typeof window !== "undefined"
          ? localStorage.getItem("user_id") || null
          : null;

      if (!userId || isNaN(Number(userId))) {
        setCohortsError("Please log in to create a cohort");
        return;
      }

      const response = await fetch(`/api/community/cohorts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          name: newCohort.name,
          description: newCohort.description || null,
          role_category: newCohort.role_category || null,
          skill_level: newCohort.skill_level || null,
          max_members: newCohort.max_members,
          is_public: newCohort.is_public,
        }),
      });

      if (!response.ok) throw new Error("Failed to create cohort");

      const data = await response.json();
      setCohorts([data, ...cohorts]);
      setNewCohort({ name: "", description: "", role_category: "", skill_level: "", max_members: 100, is_public: true });
      setShowCreateCohortModal(false);
      track({ type: "cohort_created" });
    } catch (err) {
      setCohortsError(err instanceof Error ? err.message : "Failed to create cohort");
    } finally {
      setSubmittingCohort(false);
    }
  };

  const handleCreateSquad = async () => {
    if (!newSquad.name.trim()) {
      setSquadsError("Please provide a squad name");
      return;
    }

    try {
      setSubmittingSquad(true);
      setSquadsError(null);

      const backendUserId = (session as any)?.backendUserId;
      const userId = backendUserId
        ? String(backendUserId)
        : typeof window !== "undefined"
          ? localStorage.getItem("user_id") || null
          : null;

      if (!userId || isNaN(Number(userId))) {
        setSquadsError("Please log in to create a study squad");
        return;
      }

      const response = await fetch(`/api/community/squads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          name: newSquad.name,
          description: newSquad.description || null,
          skill_focus: newSquad.skill_focus || null,
          max_members: newSquad.max_members,
          is_public: newSquad.is_public,
          scheduled_study_time: newSquad.scheduled_study_time || null,
        }),
      });

      if (!response.ok) throw new Error("Failed to create study squad");

      const data = await response.json();
      setSquads([data, ...squads]);
      setNewSquad({ name: "", description: "", skill_focus: "", max_members: 5, is_public: false, scheduled_study_time: "" });
      setShowCreateSquadModal(false);
      track({ type: "squad_created" });
    } catch (err) {
      setSquadsError(err instanceof Error ? err.message : "Failed to create study squad");
    } finally {
      setSubmittingSquad(false);
    }
  };

  const handleJoinCohort = async (cohortId: number) => {
    try {
      setJoiningCohort(cohortId);

      const backendUserId = (session as any)?.backendUserId;
      const userId = backendUserId
        ? String(backendUserId)
        : typeof window !== "undefined"
          ? localStorage.getItem("user_id") || null
          : null;

      if (!userId || isNaN(Number(userId))) {
        setCohortsError("Please log in to join a cohort");
        return;
      }

      const response = await fetch(`/api/community/cohorts/${cohortId}/join/${userId}`, { method: "POST" });
      if (!response.ok) throw new Error("Failed to join cohort");

      setCohorts(cohorts.map((c) => (c.id === cohortId ? { ...c, current_members_count: c.current_members_count + 1 } : c)));
      track({ type: "cohort_joined", cohort_id: cohortId });
    } catch (err) {
      setCohortsError(err instanceof Error ? err.message : "Failed to join cohort");
    } finally {
      setJoiningCohort(null);
    }
  };

  const handleJoinSquad = async (squadId: number) => {
    try {
      setJoiningSquad(squadId);

      const backendUserId = (session as any)?.backendUserId;
      const userId = backendUserId
        ? String(backendUserId)
        : typeof window !== "undefined"
          ? localStorage.getItem("user_id") || null
          : null;

      if (!userId || isNaN(Number(userId))) {
        setSquadsError("Please log in to join a squad");
        return;
      }

      const response = await fetch(`/api/community/squads/${squadId}/join/${userId}`, { method: "POST" });
      if (!response.ok) throw new Error("Failed to join squad");

      setSquads(squads.map((s) => (s.id === squadId ? { ...s, current_members_count: s.current_members_count + 1 } : s)));
      track({ type: "squad_joined", squad_id: squadId });
    } catch (err) {
      setSquadsError(err instanceof Error ? err.message : "Failed to join squad");
    } finally {
      setJoiningSquad(null);
    }
  };

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-mono text-gray-600 hover:text-black mb-4">
            <ArrowRight className="w-4 h-4 rotate-180" /> BACK HOME
          </Link>
          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-2">Community</h1>
          <p className="font-mono text-sm text-gray-600">Ask questions, join cohorts, and form study squads</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b-2 border-black">
          {[
            { id: "questions" as TabType, label: "Q&A", icon: MessageCircle },
            { id: "cohorts" as TabType, label: "Cohorts", icon: Users },
            { id: "squads" as TabType, label: "Squads", icon: BookOpen },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 font-black text-sm uppercase tracking-tight border-b-4 transition-colors ${
                activeTab === tab.id
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:text-black"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Questions Tab */}
        {activeTab === "questions" && (
          <div>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-black bg-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                    className={`px-4 py-2 border-2 font-mono text-xs uppercase tracking-tight transition-colors ${
                      selectedCategory === cat
                        ? "border-black bg-black text-cyan-400"
                        : "border-black bg-white text-black hover:bg-gray-100"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              {isAuthenticated && (
                <button
                  onClick={() => setShowAskModal(true)}
                  className="inline-flex items-center justify-center border-2 border-black bg-black text-cyan-400 px-6 py-3 font-black text-sm uppercase tracking-tight hover:bg-white hover:text-black transition-colors gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Ask Question
                </button>
              )}
            </div>

            {questionsError && (
              <div className="border-2 border-black bg-yellow-50 text-black p-4 mb-6">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-mono text-sm">{questionsError}</span>
                </div>
              </div>
            )}

            {questionsLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
              </div>
            ) : questions.length === 0 ? (
              <div className="border-2 border-dashed border-black p-12 text-center bg-gray-50">
                <HelpCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="font-mono text-sm text-gray-600">No questions found. Be the first to ask!</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {questions.map((question) => (
                  <Link key={question.id} href={`/community/questions/${question.id}`}>
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className="border-2 border-black p-6 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-black flex-1">{question.title}</h3>
                        <div className="flex items-center gap-4 ml-4">
                          <div className="flex items-center gap-1 text-sm font-mono">
                            <ThumbsUp className="w-4 h-4" />
                            {question.upvotes_count}
                          </div>
                          <div className="text-sm font-mono">{question.answers_count} answers</div>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3 line-clamp-2">{question.content}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-3 py-1 bg-black text-cyan-400 text-xs font-mono uppercase">{question.category}</span>
                        {question.tags.map((tag) => (
                          <span key={tag} className="px-3 py-1 border border-black text-xs font-mono">
                            {tag}
                          </span>
                        ))}
                        {question.ai_answer && (
                          <span className="px-3 py-1 bg-cyan-500 text-black text-xs font-mono uppercase flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            AI Answer
                          </span>
                        )}
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Cohorts Tab */}
        {activeTab === "cohorts" && (
          <div>
            <div className="flex justify-end mb-6">
              {isAuthenticated && (
                <button
                  onClick={() => setShowCreateCohortModal(true)}
                  className="inline-flex items-center justify-center border-2 border-black bg-black text-cyan-400 px-6 py-3 font-black text-sm uppercase tracking-tight hover:bg-white hover:text-black transition-colors gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Cohort
                </button>
              )}
            </div>

            {cohortsError && (
              <div className="border-2 border-black bg-yellow-50 text-black p-4 mb-6">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-mono text-sm">{cohortsError}</span>
                </div>
              </div>
            )}

            {cohortsLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
              </div>
            ) : cohorts.length === 0 ? (
              <div className="border-2 border-dashed border-black p-12 text-center bg-gray-50">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="font-mono text-sm text-gray-600">No cohorts found. Create the first one!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {cohorts.map((cohort) => (
                  <motion.div
                    key={cohort.id}
                    whileHover={{ scale: 1.02 }}
                    className="border-2 border-black p-6 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-black flex-1">{cohort.name}</h3>
                      {cohort.is_public ? (
                        <Shield className="w-5 h-5 text-cyan-500" />
                      ) : (
                        <Crown className="w-5 h-5 text-yellow-500" />
                      )}
                    </div>
                    {cohort.description && <p className="text-gray-700 mb-3">{cohort.description}</p>}
                    <div className="flex items-center gap-4 mb-4 flex-wrap">
                      {cohort.role_category && (
                        <span className="px-3 py-1 bg-black text-cyan-400 text-xs font-mono uppercase">{cohort.role_category}</span>
                      )}
                      {cohort.skill_level && (
                        <span className="px-3 py-1 border border-black text-xs font-mono">{cohort.skill_level}</span>
                      )}
                      <span className="text-sm font-mono text-gray-600">
                        {cohort.current_members_count}/{cohort.max_members} members
                      </span>
                    </div>
                    {isAuthenticated && (
                      <button
                        onClick={() => handleJoinCohort(cohort.id)}
                        disabled={joiningCohort === cohort.id}
                        className="w-full inline-flex items-center justify-center border-2 border-black bg-black text-cyan-400 px-4 py-2 font-black text-xs uppercase tracking-tight hover:bg-white hover:text-black transition-colors gap-2 disabled:opacity-50"
                      >
                        {joiningCohort === cohort.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <UserPlus className="w-4 h-4" />
                        )}
                        Join Cohort
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Squads Tab */}
        {activeTab === "squads" && (
          <div>
            <div className="flex justify-end mb-6">
              {isAuthenticated && (
                <button
                  onClick={() => setShowCreateSquadModal(true)}
                  className="inline-flex items-center justify-center border-2 border-black bg-black text-cyan-400 px-6 py-3 font-black text-sm uppercase tracking-tight hover:bg-white hover:text-black transition-colors gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Squad
                </button>
              )}
            </div>

            {squadsError && (
              <div className="border-2 border-black bg-yellow-50 text-black p-4 mb-6">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-mono text-sm">{squadsError}</span>
                </div>
              </div>
            )}

            {squadsLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
              </div>
            ) : squads.length === 0 ? (
              <div className="border-2 border-dashed border-black p-12 text-center bg-gray-50">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="font-mono text-sm text-gray-600">No study squads found. Create the first one!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {squads.map((squad) => (
                  <motion.div
                    key={squad.id}
                    whileHover={{ scale: 1.02 }}
                    className="border-2 border-black p-6 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-black flex-1">{squad.name}</h3>
                      <Zap className="w-5 h-5 text-cyan-500" />
                    </div>
                    {squad.description && <p className="text-gray-700 mb-3">{squad.description}</p>}
                    <div className="flex items-center gap-4 mb-4 flex-wrap">
                      {squad.skill_focus && (
                        <span className="px-3 py-1 bg-black text-cyan-400 text-xs font-mono uppercase">{squad.skill_focus}</span>
                      )}
                      {squad.scheduled_study_time && (
                        <span className="px-3 py-1 border border-black text-xs font-mono flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {squad.scheduled_study_time}
                        </span>
                      )}
                      <span className="text-sm font-mono text-gray-600">
                        {squad.current_members_count}/{squad.max_members} members
                      </span>
                    </div>
                    {isAuthenticated && (
                      <button
                        onClick={() => handleJoinSquad(squad.id)}
                        disabled={joiningSquad === squad.id}
                        className="w-full inline-flex items-center justify-center border-2 border-black bg-black text-cyan-400 px-4 py-2 font-black text-xs uppercase tracking-tight hover:bg-white hover:text-black transition-colors gap-2 disabled:opacity-50"
                      >
                        {joiningSquad === squad.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <UserPlus className="w-4 h-4" />
                        )}
                        Join Squad
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Ask Question Modal */}
        {showAskModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border-4 border-black p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-3xl font-black mb-6">Ask a Question</h2>
              <div className="space-y-4">
                <div>
                  <label className="block font-mono text-sm uppercase mb-2">Title *</label>
                  <input
                    type="text"
                    value={newQuestion.title}
                    onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-black bg-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="What's your question?"
                  />
                </div>
                <div>
                  <label className="block font-mono text-sm uppercase mb-2">Category</label>
                  <select
                    value={newQuestion.category}
                    onChange={(e) => setNewQuestion({ ...newQuestion, category: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-black bg-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-sm uppercase mb-2">Question *</label>
                  <textarea
                    value={newQuestion.content}
                    onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-3 border-2 border-black bg-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Describe your question in detail..."
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setShowAskModal(false)}
                  className="flex-1 border-2 border-black bg-white text-black px-6 py-3 font-black text-sm uppercase tracking-tight hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAskQuestion}
                  disabled={submittingQuestion}
                  className="flex-1 border-2 border-black bg-black text-cyan-400 px-6 py-3 font-black text-sm uppercase tracking-tight hover:bg-white hover:text-black transition-colors disabled:opacity-50"
                >
                  {submittingQuestion ? "Submitting..." : "Ask Question"}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Create Cohort Modal */}
        {showCreateCohortModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border-4 border-black p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-3xl font-black mb-6">Create Cohort</h2>
              <div className="space-y-4">
                <div>
                  <label className="block font-mono text-sm uppercase mb-2">Name *</label>
                  <input
                    type="text"
                    value={newCohort.name}
                    onChange={(e) => setNewCohort({ ...newCohort, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-black bg-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block font-mono text-sm uppercase mb-2">Description</label>
                  <textarea
                    value={newCohort.description}
                    onChange={(e) => setNewCohort({ ...newCohort, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-black bg-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-sm uppercase mb-2">Role Category</label>
                    <select
                      value={newCohort.role_category}
                      onChange={(e) => setNewCohort({ ...newCohort, role_category: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-black bg-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="">Any</option>
                      {roleCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-mono text-sm uppercase mb-2">Skill Level</label>
                    <select
                      value={newCohort.skill_level}
                      onChange={(e) => setNewCohort({ ...newCohort, skill_level: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-black bg-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="">Any</option>
                      {skillLevels.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block font-mono text-sm uppercase mb-2">Max Members</label>
                  <input
                    type="number"
                    value={newCohort.max_members}
                    onChange={(e) => setNewCohort({ ...newCohort, max_members: parseInt(e.target.value) || 100 })}
                    className="w-full px-4 py-3 border-2 border-black bg-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newCohort.is_public}
                    onChange={(e) => setNewCohort({ ...newCohort, is_public: e.target.checked })}
                    className="w-5 h-5 border-2 border-black"
                  />
                  <label className="font-mono text-sm uppercase">Public Cohort</label>
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setShowCreateCohortModal(false)}
                  className="flex-1 border-2 border-black bg-white text-black px-6 py-3 font-black text-sm uppercase tracking-tight hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCohort}
                  disabled={submittingCohort}
                  className="flex-1 border-2 border-black bg-black text-cyan-400 px-6 py-3 font-black text-sm uppercase tracking-tight hover:bg-white hover:text-black transition-colors disabled:opacity-50"
                >
                  {submittingCohort ? "Creating..." : "Create Cohort"}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Create Squad Modal */}
        {showCreateSquadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border-4 border-black p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-3xl font-black mb-6">Create Study Squad</h2>
              <div className="space-y-4">
                <div>
                  <label className="block font-mono text-sm uppercase mb-2">Name *</label>
                  <input
                    type="text"
                    value={newSquad.name}
                    onChange={(e) => setNewSquad({ ...newSquad, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-black bg-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block font-mono text-sm uppercase mb-2">Description</label>
                  <textarea
                    value={newSquad.description}
                    onChange={(e) => setNewSquad({ ...newSquad, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-black bg-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-sm uppercase mb-2">Skill Focus</label>
                    <select
                      value={newSquad.skill_focus}
                      onChange={(e) => setNewSquad({ ...newSquad, skill_focus: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-black bg-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="">Any</option>
                      {skillFocuses.map((skill) => (
                        <option key={skill} value={skill}>
                          {skill}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-mono text-sm uppercase mb-2">Max Members</label>
                    <input
                      type="number"
                      value={newSquad.max_members}
                      onChange={(e) => setNewSquad({ ...newSquad, max_members: parseInt(e.target.value) || 5 })}
                      className="w-full px-4 py-3 border-2 border-black bg-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-mono text-sm uppercase mb-2">Scheduled Study Time</label>
                  <input
                    type="text"
                    value={newSquad.scheduled_study_time}
                    onChange={(e) => setNewSquad({ ...newSquad, scheduled_study_time: e.target.value })}
                    placeholder="e.g., Mon/Wed/Fri 7pm"
                    className="w-full px-4 py-3 border-2 border-black bg-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newSquad.is_public}
                    onChange={(e) => setNewSquad({ ...newSquad, is_public: e.target.checked })}
                    className="w-5 h-5 border-2 border-black"
                  />
                  <label className="font-mono text-sm uppercase">Public Squad</label>
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setShowCreateSquadModal(false)}
                  className="flex-1 border-2 border-black bg-white text-black px-6 py-3 font-black text-sm uppercase tracking-tight hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateSquad}
                  disabled={submittingSquad}
                  className="flex-1 border-2 border-black bg-black text-cyan-400 px-6 py-3 font-black text-sm uppercase tracking-tight hover:bg-white hover:text-black transition-colors disabled:opacity-50"
                >
                  {submittingSquad ? "Creating..." : "Create Squad"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </main>
  );
}

