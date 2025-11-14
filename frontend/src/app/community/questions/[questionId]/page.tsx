"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  MessageCircle,
  HelpCircle,
  ArrowLeft,
  Loader2,
  AlertCircle,
  ThumbsUp,
  CheckCircle2,
  Tag,
  Eye,
  TrendingUp,
  Sparkles,
  Send,
  User,
} from "lucide-react";
import { track } from "../../../../lib/analytics";

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

interface Answer {
  id: number;
  question_id: number;
  user_id: number;
  content: string;
  is_ai_generated: boolean;
  is_accepted: boolean;
  upvotes_count: number;
  created_at: string;
  updated_at: string;
}

interface QuestionDetail {
  question: Question;
  answers: Answer[];
}

export default function QuestionDetailPage({
  params,
}: {
  params: Promise<{ questionId: string }>;
}) {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const router = useRouter();
  const pathname = usePathname();
  const [questionDetail, setQuestionDetail] = useState<QuestionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newAnswer, setNewAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [questionId, setQuestionId] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setQuestionId(p.questionId));
  }, [params]);

  useEffect(() => {
    if (!questionId) return;
    track({ type: "page_view", path: pathname || `/community/questions/${questionId}` });
  }, [pathname, questionId]);

  useEffect(() => {
    if (!questionId || status === "loading") return;

    const loadQuestion = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/community/questions/${questionId}`);
        if (!response.ok) {
          throw new Error("Failed to load question");
        }

        const data: QuestionDetail = await response.json();
        setQuestionDetail(data);
      } catch (err) {
        console.error("Failed to load question", err);
        setError("Failed to load question. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadQuestion();
  }, [questionId, status]);

  const handleUpvoteQuestion = async () => {
    if (!isAuthenticated) {
      setError("Please log in to upvote");
      return;
    }

    try {
      const backendUserId = (session as any)?.backendUserId;
      const userId = backendUserId
        ? String(backendUserId)
        : typeof window !== "undefined"
          ? localStorage.getItem("user_id") || null
          : null;

      if (!userId || isNaN(Number(userId)) || !questionId) return;

      const response = await fetch(`/api/community/questions/${questionId}/upvote/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to upvote question");
      }

      // Reload question
      const questionResponse = await fetch(`/api/community/questions/${questionId}`);
      if (questionResponse.ok) {
        const questionData: QuestionDetail = await questionResponse.json();
        setQuestionDetail(questionData);
      }

      track({ type: "question_upvoted", userId });
    } catch (err) {
      console.error("Failed to upvote question", err);
      setError(err instanceof Error ? err.message : "Failed to upvote question. Please try again.");
    }
  };

  const handleAddAnswer = async () => {
    if (!newAnswer.trim()) {
      setError("Please enter an answer");
      return;
    }

    if (!isAuthenticated) {
      setError("Please log in to answer");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const backendUserId = (session as any)?.backendUserId;
      const userId = backendUserId
        ? String(backendUserId)
        : typeof window !== "undefined"
          ? localStorage.getItem("user_id") || null
          : null;

      if (!userId || isNaN(Number(userId)) || !questionId) {
        setError("Please log in to answer");
        return;
      }

      const response = await fetch(`/api/community/questions/${questionId}/answers/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newAnswer,
          is_ai_generated: false,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add answer");
      }

      // Reload question
      const questionResponse = await fetch(`/api/community/questions/${questionId}`);
      if (questionResponse.ok) {
        const questionData: QuestionDetail = await questionResponse.json();
        setQuestionDetail(questionData);
      }

      setNewAnswer("");
      track({ type: "answer_added", userId });
    } catch (err) {
      console.error("Failed to add answer", err);
      setError(err instanceof Error ? err.message : "Failed to add answer. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white text-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-cyan-500" />
          <div className="font-mono text-sm text-gray-600">Loading question...</div>
        </div>
      </main>
    );
  }

  if (error && !questionDetail) {
    return (
      <main className="min-h-screen bg-white text-black flex items-center justify-center p-6">
        <div className="border-4 border-black bg-white p-8 text-center max-w-md">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-600" />
          <div className="text-2xl font-black mb-2">Question Not Found</div>
          <div className="font-mono text-sm text-gray-600 mb-4">{error}</div>
          <Link
            href="/community/questions"
            className="inline-block border-2 border-black bg-black text-cyan-400 px-4 py-2 font-black text-xs tracking-tight hover:bg-white hover:text-black transition-colors"
          >
            BACK TO QUESTIONS
          </Link>
        </div>
      </main>
    );
  }

  if (!questionDetail) {
    return null;
  }

  const { question, answers } = questionDetail;

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/community/questions"
            className="inline-flex items-center gap-2 text-sm font-mono text-gray-600 hover:text-black mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> BACK TO QUESTIONS
          </Link>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-black leading-tight">{question.title}</h1>
                {question.ai_answer && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-cyan-400 text-black text-xs font-black">
                    <Sparkles className="w-3 h-3" />
                    AI ANSWERED
                  </div>
                )}
                {question.status === "resolved" && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-green-500 text-white text-xs font-black">
                    <CheckCircle2 className="w-3 h-3" />
                    RESOLVED
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4 text-xs font-mono text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {question.views_count} views
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsUp className="w-4 h-4" />
                  {question.upvotes_count} upvotes
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  {question.answers_count} answers
                </div>
                <div className="flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  {question.category}
                </div>
              </div>
              {question.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {question.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 border-2 border-black bg-gray-100 text-xs font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={handleUpvoteQuestion}
              className="border-4 border-black bg-white text-black px-4 py-2 font-black text-xs uppercase tracking-tight hover:bg-black hover:text-cyan-400 transition-colors flex items-center gap-2"
            >
              <ThumbsUp className="w-4 h-4" />
              UPVOTE
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="border-4 border-red-500 bg-red-50 text-red-700 p-4 mb-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <div className="font-mono text-sm">{error}</div>
            </div>
          </div>
        )}

        {/* Question Content */}
        <div className="border-4 border-black bg-white p-6 mb-8">
          <div className="font-mono text-base text-gray-800 whitespace-pre-wrap leading-relaxed">
            {question.content}
          </div>
        </div>

        {/* AI Answer */}
        {question.ai_answer && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-4 border-cyan-400 bg-cyan-50 p-6 mb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-cyan-500" />
              <div className="font-black text-lg uppercase tracking-tight">AI Answer</div>
              {question.ai_answer_confidence && (
                <div className="ml-auto text-xs font-mono text-gray-600">
                  Confidence: {question.ai_answer_confidence}%
                </div>
              )}
            </div>
            <div className="font-mono text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
              {question.ai_answer}
            </div>
          </motion.div>
        )}

        {/* Answers Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-black uppercase tracking-tight">
              Answers ({answers.length})
            </h2>
          </div>
          <div className="space-y-4">
            {answers.length === 0 ? (
              <div className="border-2 border-dashed border-black p-8 text-center">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <div className="font-mono text-sm text-gray-600">No answers yet. Be the first to answer!</div>
              </div>
            ) : (
              answers.map((answer) => (
                <motion.div
                  key={answer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-4 border-black bg-white p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-gray-400" />
                      <div className="font-mono text-xs text-gray-600">
                        {answer.is_ai_generated ? "AI Generated" : "User Answer"}
                      </div>
                      {answer.is_accepted && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-green-500 text-white text-xs font-black">
                          <CheckCircle2 className="w-3 h-3" />
                          ACCEPTED
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-xs font-mono text-gray-600">
                        <ThumbsUp className="w-4 h-4" />
                        {answer.upvotes_count}
                      </div>
                    </div>
                  </div>
                  <div className="font-mono text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {answer.content}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Add Answer Section */}
        {isAuthenticated && (
          <div className="border-4 border-black bg-white p-6">
            <h3 className="text-xl font-black uppercase tracking-tight mb-4">Add Your Answer</h3>
            <textarea
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              placeholder="Write your answer here..."
              rows={6}
              className="w-full px-4 py-3 border-4 border-black bg-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 mb-4"
            />
            <button
              onClick={handleAddAnswer}
              disabled={submitting || !newAnswer.trim()}
              className="border-4 border-black bg-black text-cyan-400 px-6 py-3 font-black text-sm uppercase tracking-tight hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  SUBMITTING...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  SUBMIT ANSWER
                </>
              )}
            </button>
          </div>
        )}

        {!isAuthenticated && (
          <div className="border-4 border-black bg-yellow-50 p-6 text-center">
            <div className="font-black text-sm mb-2">LOG IN TO ANSWER</div>
            <div className="font-mono text-xs text-gray-600 mb-4">
              Log in to share your answer with the community
            </div>
            <Link
              href="/login"
              className="inline-block border-2 border-black bg-black text-cyan-400 px-4 py-2 font-black text-xs tracking-tight hover:bg-white hover:text-black transition-colors"
            >
              LOGIN
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}


