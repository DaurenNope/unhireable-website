"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ResumeBuilder, ResumeData } from "../../components/resume/ResumeBuilder";
import { ArrowLeft, Sparkles, Target, Rocket, Mail, Gauge, AlertTriangle, ClipboardCheck, RefreshCcw } from "lucide-react";
import { track } from "../../lib/analytics";

export default function ResumePage() {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [pendingDownload, setPendingDownload] = useState<null | (() => void)>(null);
  const [pendingResume, setPendingResume] = useState<ResumeData | null>(null);
  const [showShareCard, setShowShareCard] = useState(false);
  const [builderData, setBuilderData] = useState<ResumeData | null>(null);

  const [analysis, setAnalysis] = useState<any>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisSource, setAnalysisSource] = useState<string | null>(null);
  const [analysisTimestamp, setAnalysisTimestamp] = useState<string | null>(null);

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const pathname = usePathname();

  useEffect(() => {
    track({ type: "page_view", path: pathname || "/resume" });
  }, [pathname]);

  const getUserId = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("user_id");
  };

  const runAnalysis = async (useBuilder: boolean = false) => {
    if (useBuilder && !builderData) {
      setAnalysisError("Add resume content before running the ATS scan.");
      return;
    }

    try {
      setAnalysisLoading(true);
      setAnalysisError(null);

      const userId = getUserId() || "0";
      const payload: any = { user_id: userId };

      if (useBuilder && builderData) {
        payload.resume_data = builderData;
      }

      const response = await fetch("/api/resumes/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to analyze resume");
      }

      const data = await response.json();
      setAnalysis(data);
      setAnalysisSource(data.source || null);
      setAnalysisTimestamp(new Date().toISOString());
    } catch (error) {
      console.error("Resume analysis error:", error);
      setAnalysisError(error instanceof Error ? error.message : "Unexpected error running analyzer.");
    } finally {
      setAnalysisLoading(false);
    }
  };

  useEffect(() => {
    runAnalysis(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-white text-black">
      {!isAuthenticated && (
        <div className="border-4 border-black bg-yellow-50 text-black p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="font-black text-sm sm:text-base uppercase tracking-tight">EXPORTS STAY LOCAL UNTIL YOU SIGN IN</div>
          <p className="font-mono text-xs sm:text-sm text-gray-700 max-w-2xl">
            Build and download as much as you want right now. Log in when you're ready for the agent to remember versions, sync updates, and attach the resume to applications.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center border-2 border-black bg-black text-cyan-400 px-4 py-2 font-black text-xs tracking-tight hover:bg-white hover:text-black transition-colors"
          >
            LOGIN
          </Link>
        </div>
      )}

      <main className="max-w-6xl mx-auto p-6 space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center"
        >
          <div className="text-4xl md:text-5xl font-black leading-none mb-4">
            <span className="bg-black text-white px-4">Build a Resume the Agent Can Sell</span>
          </div>
          <p className="text-lg font-mono text-gray-600 max-w-3xl mx-auto">
            Our autonomous agent needs fuel—a sharp story, quantified wins, and proof you can ship. Use this lab to prep the
            assets it will deploy across 2,800+ companies.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { title: "Decode", description: "Follow the prompts—no fluff, just signals hiring teams care about." },
            { title: "Refine", description: "Embed impact metrics the agent will reuse in outbound campaigns." },
            { title: "Deploy", description: "Download now; the autonomous hunter will sync once you’re onboarded." },
          ].map((step, i) => (
            <div key={step.title} className="border-4 border-black bg-white p-6 relative">
              <div className="absolute -top-4 left-6 bg-cyan-400 text-black px-3 py-1 font-mono text-xs">STEP {i + 1}</div>
              <h3 className="text-2xl font-black mb-3">{step.title}</h3>
              <p className="font-mono text-sm text-gray-700">{step.description}</p>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="border-4 border-black bg-white"
        >
          <div className="bg-gradient-to-r from-cyan-400 to-purple-400 text-black p-4 border-b-4 border-black flex items-center justify-between">
            <div className="font-black text-xl flex items-center gap-2 uppercase tracking-tight">
              <Sparkles className="w-6 h-6" />
              Interactive Builder
            </div>
            <div className="flex items-center gap-2 font-mono text-xs md:text-sm">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              <span>Agent-ready format</span>
            </div>
          </div>

          <div className="p-6">
            <ResumeBuilder
              onChange={(data) => setBuilderData(data)}
              onDownload={({ data, download }) => {
                setPendingResume(data);
                setPendingDownload(() => download);
                setShowEmailModal(true);
                track({ type: "resume_download", format: "pdf" });
              }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="border-4 border-black bg-white"
        >
          <div className="p-6 space-y-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xl font-black uppercase tracking-tight">
                  <Gauge className="w-5 h-5 text-purple-500" />
                  ATS Readiness Scan
                </div>
                <p className="font-mono text-xs text-gray-600 mt-1">
                  Checks structure, keywords, and impact based on what applicant tracking systems prize.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => runAnalysis(true)}
                  disabled={analysisLoading}
                  className="inline-flex items-center gap-2 border-2 border-black bg-black text-cyan-400 px-4 py-2 font-black text-xs uppercase tracking-tight hover:bg-white hover:text-black transition-colors disabled:opacity-60"
                >
                  <ClipboardCheck className="w-4 h-4" />
                  Scan current edits
                </button>
                <button
                  onClick={() => runAnalysis(false)}
                  disabled={analysisLoading}
                  className="inline-flex items-center gap-2 border-2 border-black bg-white text-black px-4 py-2 font-black text-xs uppercase tracking-tight hover:bg-black hover:text-cyan-400 transition-colors disabled:opacity-60"
                >
                  <RefreshCcw className="w-4 h-4" />
                  Refresh saved data
                </button>
              </div>
            </div>

            {analysisLoading && (
              <div className="flex items-center gap-3 font-mono text-sm text-gray-600">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black" />
                Running deep scan...
              </div>
            )}

            {analysisError && !analysisLoading && (
              <div className="border-2 border-red-400 bg-red-50 text-red-700 font-mono text-sm p-3 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{analysisError}</span>
              </div>
            )}

            {!analysisLoading && !analysisError && analysis && (
              <>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="border-2 border-black bg-black text-cyan-400 p-4 space-y-2">
                    <div className="text-xs font-mono uppercase text-gray-300">ATS Score</div>
                    <div className="text-4xl font-black">{analysis?.analysis?.ats_readiness_score ?? 0}%</div>
                    <div className="text-[11px] font-mono text-gray-300">
                      Structure + keywords + impact weighting.
                    </div>
                  </div>
                  <div className="border-2 border-black bg-white p-4 space-y-2">
                    <div className="text-xs font-mono uppercase text-gray-500">Keyword Coverage</div>
                    <div className="text-3xl font-black">
                      {analysis?.analysis?.keyword_analysis?.coverage_score ?? 0}%
                    </div>
                    <div className="text-[11px] font-mono text-gray-500">
                      Matched {analysis?.analysis?.keyword_analysis?.matched_keywords?.length ?? 0} /{" "}
                      {analysis?.analysis?.keyword_analysis?.target_keywords?.length ?? 0} role keywords.
                    </div>
                  </div>
                  <div className="border-2 border-black bg-white p-4 space-y-2">
                    <div className="text-xs font-mono uppercase text-gray-500">Impact Bullets</div>
                    <div className="text-3xl font-black">
                      {(() => {
                        const total = analysis?.analysis?.impact_review?.total_bullets ?? 0;
                        const withMetrics = analysis?.analysis?.impact_review?.bullets_with_metrics ?? 0;
                        if (!total) return "0%";
                        return `${Math.round((withMetrics / total) * 100)}%`;
                      })()}
                    </div>
                    <div className="text-[11px] font-mono text-gray-500">
                      Bullets containing metrics.
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="text-sm font-black uppercase tracking-tight text-gray-600">Section Health</h4>
                    <div className="space-y-2">
                      {analysis?.analysis?.section_checks?.map((check: any, idx: number) => {
                        const status = check.status;
                        const statusStyles =
                          status === "pass"
                            ? "border-green-500 bg-green-50 text-green-700"
                            : status === "warn"
                            ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                            : "border-red-500 bg-red-50 text-red-700";
                        return (
                          <div
                            key={idx}
                            className={`border-2 p-3 font-mono text-xs ${statusStyles}`}
                          >
                            <div className="font-black uppercase">{check.name}</div>
                            <div className="mt-1">{check.details}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-black uppercase tracking-tight text-gray-600">
                      Keyword Coverage
                    </h4>
                    <div className="border-2 border-black p-3">
                      <div className="text-xs font-mono uppercase text-gray-500 mb-2">Matched</div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {analysis?.analysis?.keyword_analysis?.matched_keywords?.length ? (
                          analysis.analysis.keyword_analysis.matched_keywords.map((kw: string, i: number) => (
                            <span key={i} className="px-2 py-1 bg-cyan-400 text-black text-xs font-mono border border-black">
                              {kw}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs font-mono text-gray-500">No strong keyword matches yet.</span>
                        )}
                      </div>
                      <div className="text-xs font-mono uppercase text-gray-500 mb-2">Add Next</div>
                      <div className="flex flex-wrap gap-2">
                        {analysis?.analysis?.keyword_analysis?.missing_keywords?.length ? (
                          analysis.analysis.keyword_analysis.missing_keywords.map((kw: string, i: number) => (
                            <span key={i} className="px-2 py-1 bg-black text-cyan-400 text-xs font-mono border border-black">
                              {kw}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs font-mono text-gray-500">Keywords look solid.</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border-2 border-black p-4 space-y-2">
                    <div className="text-xs font-mono uppercase text-gray-500">Impact Review</div>
                    <ul className="space-y-2">
                      {(analysis?.analysis?.impact_review?.recommendations || []).map((rec: string, idx: number) => (
                        <li key={idx} className="font-mono text-xs text-gray-700 flex items-start gap-2">
                          <span className="text-purple-500 mt-0.5">▸</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                      {(!analysis?.analysis?.impact_review?.recommendations ||
                        analysis.analysis.impact_review.recommendations.length === 0) && (
                        <li className="font-mono text-xs text-gray-500">Impact bullets look strong.</li>
                      )}
                    </ul>
                  </div>
                  <div className="border-2 border-black p-4 space-y-2">
                    <div className="text-xs font-mono uppercase text-gray-500 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      Next Actions
                    </div>
                    <ul className="space-y-2">
                      {(analysis?.analysis?.next_actions || []).length > 0 ? (
                        analysis.analysis.next_actions.map((action: string, idx: number) => (
                          <li key={idx} className="font-mono text-xs text-gray-700 flex items-start gap-2">
                            <span className="text-yellow-500 mt-0.5">→</span>
                            <span>{action}</span>
                          </li>
                        ))
                      ) : (
                        <li className="font-mono text-xs text-gray-500">No urgent fixes flagged.</li>
                      )}
                    </ul>
                  </div>
                </div>

                {(analysis?.analysis?.gaps || []).length > 0 && (
                  <div className="border-2 border-red-400 bg-red-50 text-red-700 font-mono text-xs p-3 space-y-1">
                    {(analysis.analysis.gaps || []).map((gap: string, idx: number) => (
                      <div key={idx}>• {gap}</div>
                    ))}
                  </div>
                )}

                <div className="text-[11px] font-mono text-gray-500 flex flex-wrap gap-4">
                  {analysisTimestamp && (
                    <span>Last scanned {new Date(analysisTimestamp).toLocaleString()}</span>
                  )}
                  {analysisSource && (
                    <span>Source: {analysisSource === "provided" ? "Current builder edits" : "Stored resume"}</span>
                  )}
                </div>
              </>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="border-4 border-black bg-black text-white p-6">
            <div className="text-xl font-black mb-2 flex items-center gap-2">
              <Target className="w-6 h-6 text-cyan-400" />
              Agent Checklist
            </div>
            <ul className="font-mono text-xs space-y-2 text-gray-200">
              <li>• Lead with impact: metrics, teams, revenue.</li>
              <li>• Mirror the language of the roles you want.</li>
              <li>• Keep bullets punchy—verbs + outcomes.</li>
            </ul>
          </div>
          <div className="border-4 border-black bg-white p-6">
            <div className="text-xl font-black mb-2 flex items-center gap-2 text-purple-500">
              <Rocket className="w-6 h-6" />
              Coming Soon
            </div>
            <p className="font-mono text-sm text-gray-700">
              Autopilot will keep this resume synced, version it per role, and push it across hiring pipelines automatically.
            </p>
          </div>
          <div className="border-4 border-black bg-white p-6">
            <div className="text-xl font-black mb-2 flex items-center gap-2 text-cyan-500">
              <Mail className="w-6 h-6" />
              Stay in the Loop
            </div>
            <p className="font-mono text-sm text-gray-700">
              Every download adds you to our talent briefings—market intel, interview frameworks, and early agent invites.
            </p>
          </div>
        </motion.div>

        {showShareCard && pendingResume && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-4 border-black bg-white p-6"
          >
            <div className="flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
              <div>
                <h3 className="text-2xl font-black mb-2">Resume sent. Next: prep the agent.</h3>
                <p className="font-mono text-sm text-gray-700">
                  We emailed your download link to {email}. Run the readiness scan and you’ll be first in line when the job hunter ships.
                </p>
              </div>
              <div className="flex gap-3">
                <a
                  href="/demo"
                  className="px-5 py-3 border-2 border-black bg-cyan-400 text-black font-black uppercase tracking-tight hover:bg-white transition-colors"
                >
                  Run readiness scan
                </a>
                <a
                  href="/waitlist"
                  className="px-5 py-3 border-2 border-black bg-black text-cyan-400 font-black uppercase tracking-tight hover:bg-white hover:text-black transition-colors"
                >
                  Join waitlist
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      <AnimatePresence>
        {showEmailModal && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-lg bg-white border-4 border-black p-6 relative"
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
            >
              <button
                className="absolute top-2 right-2 border-2 border-black px-2 py-1 font-mono text-xs"
                onClick={() => setShowEmailModal(false)}
              >
                CLOSE
              </button>
              <h3 className="text-2xl font-black mb-2">Send it to your inbox</h3>
              <p className="font-mono text-sm text-gray-700 mb-4">
                Drop an email so we can send the download link, market briefings, and early access to the autonomous agent.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError("");
                  }}
                  placeholder="you@domain.com"
                  className="w-full border-2 border-black px-3 py-3 font-mono text-sm"
                />
                {emailError && <div className="text-red-600 font-mono text-xs">{emailError}</div>}
                <button
                  className="w-full bg-black text-cyan-400 border-4 border-black px-4 py-3 font-black uppercase tracking-tight"
                  onClick={() => {
                    if (!validateEmail(email)) {
                      setEmailError("Please enter a valid email.");
                      return;
                    }
                    setShowEmailModal(false);
                    if (pendingDownload) {
                      pendingDownload();
                      track({ type: "resume_download", format: "pdf" });
                    }
                    setShowShareCard(true);
                  }}
                >
                  Email me the download link
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
