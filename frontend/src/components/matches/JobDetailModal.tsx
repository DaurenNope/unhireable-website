"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { CheckCircle2, AlertTriangle, Sparkles, Target, BarChart3, Briefcase, Lightbulb } from "lucide-react";
import type { JobMatch } from "./JobCard";

interface JobDetailModalProps {
  job: JobMatch | null;
  onClose: () => void;
  onSave?: (job: JobMatch) => void;
  onApply?: (job: JobMatch) => void;
}

export function JobDetailModal({ job, onClose, onSave, onApply }: JobDetailModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const firstFocusableRef = useRef<HTMLButtonElement | null>(null);
  const lastFocusableRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!job) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    firstFocusableRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          (last as HTMLElement).focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          (first as HTMLElement).focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus();
    };
  }, [job, onClose]);

  const scoreBreakdown = job?.score_breakdown;
  const cultureFit = job?.culture_fit;
  const marketIntel = job?.market_intelligence;
  const growth = job?.growth_potential;
  const negotiation = job?.negotiation_plan;

  return (
    <AnimatePresence>
      {job && (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="job-dialog-title"
            initial={{ scale: 0.95, y: 10, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 10, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            className="absolute left-1/2 top-16 -translate-x-1/2 w-[94%] max-w-4xl bg-white border-4 border-black shadow-2xl overflow-hidden focus:outline-none"
          >
            <div className="bg-black text-cyan-400 p-4 border-b-4 border-cyan-400 flex items-center justify-between">
              <div>
                <div id="job-dialog-title" className="font-black text-xl leading-tight">
                {job.title}
                </div>
                <div className="font-mono text-xs text-white/70">
                  {job.company} • {job.location} {job.remote ? "• Remote" : ""}
                </div>
              </div>
              <button
                ref={firstFocusableRef}
                onClick={onClose}
                aria-label="Close job details"
                className="bg-cyan-400 text-black px-3 py-1 font-black border-2 border-black focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300"
              >
                CLOSE
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              <section className="border-2 border-black p-4 bg-gray-50">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="font-mono text-xs uppercase text-gray-600">Topline</div>
                    <div className="font-black text-lg text-gray-900">{job.headline}</div>
                    <div className="font-mono text-xs text-gray-600">Salary band: {job.salary}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-black text-black">{Math.round(job.match_score)}</div>
                    <div className="text-[10px] font-mono text-gray-600 uppercase tracking-wide">match score</div>
                  </div>
                </div>
              </section>

              {scoreBreakdown && (
                <section>
                  <div className="flex items-center gap-2 text-sm font-black mb-3 uppercase text-gray-700">
                    <Sparkles className="w-4 h-4" /> Score breakdown
                  </div>
                  <div className="grid gap-2">
                    {[
                      { label: "Skills", value: scoreBreakdown.skills },
                      { label: "Experience", value: scoreBreakdown.experience },
                      { label: "Culture", value: scoreBreakdown.culture },
                      { label: "Growth", value: scoreBreakdown.growth },
                      { label: "Compensation", value: scoreBreakdown.compensation },
                    ].map((entry) => (
                      <div key={entry.label}>
                        <div className="flex items-center justify-between text-[11px] font-mono text-gray-700">
                          <span>{entry.label}</span>
                          <span>{Math.round(entry.value)}%</span>
                        </div>
                        <div className="h-2 border-2 border-black bg-white">
                          <div className="h-full bg-black" style={{ width: `${Math.min(100, Math.max(0, entry.value))}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <section className="grid gap-4 md:grid-cols-2">
                <div className="border-2 border-black p-4">
                  <div className="flex items-center gap-2 text-sm font-black uppercase text-gray-700 mb-2">
                    <Target className="w-4 h-4" /> Match signals
                  </div>
                  <ul className="list-disc ml-5 space-y-1 text-xs font-mono text-gray-700">
                    {job.match_reasons.map((reason, idx) => (
                      <li key={idx}>{reason}</li>
                    ))}
                    {job.match_reasons.length === 0 && <li>Role lines up with your skill portfolio.</li>}
                  </ul>
                </div>
                <div className="border-2 border-black p-4">
                  <div className="flex items-center gap-2 text-sm font-black uppercase text-gray-700 mb-2">
                    <BarChart3 className="w-4 h-4" /> Skill coverage
                  </div>
                  <div className="font-mono text-[11px] text-gray-700 mb-2">Core stack</div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {job.required_skills.map((skill) => (
                      <span key={skill} className="px-2 py-1 border-2 border-black bg-cyan-400 text-black text-[11px] font-black">
                        {skill}
                      </span>
                    ))}
              </div>
                  {job.skill_gaps.length > 0 && (
              <div>
                      <div className="font-mono text-[11px] text-gray-700 mb-1">Gaps to close</div>
                <div className="flex flex-wrap gap-2">
                        {job.skill_gaps.map((gap) => (
                          <span key={gap} className="px-2 py-1 border-2 border-dashed border-black bg-white text-[11px] font-black">
                            {gap}
                    </span>
                  ))}
                </div>
              </div>
                  )}
                </div>
              </section>

              {cultureFit && (
                <section className="border-2 border-black p-4">
                  <div className="flex items-center gap-2 text-sm font-black uppercase text-gray-700 mb-2">
                    <Lightbulb className="w-4 h-4" /> Culture read ({cultureFit.score}%)
                  </div>
                  <div className="font-mono text-xs text-gray-700">{cultureFit.summary}</div>
                  <div className="mt-3 grid md:grid-cols-2 gap-3 text-xs font-mono">
                    {cultureFit.highlights && cultureFit.highlights.length > 0 && (
                      <div>
                        <div className="font-black text-gray-700">Highlights</div>
                        <ul className="list-disc ml-4 space-y-1 text-gray-600">
                          {cultureFit.highlights.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {cultureFit.watchouts && cultureFit.watchouts.length > 0 && (
                      <div>
                        <div className="font-black text-gray-700">Probe During Calls</div>
                        <ul className="list-disc ml-4 space-y-1 text-gray-600">
                          {cultureFit.watchouts.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {growth && (
                <section className="border-2 border-black p-4">
                  <div className="flex items-center gap-2 text-sm font-black uppercase text-gray-700 mb-2">
                    <Sparkles className="w-4 h-4" /> Growth trajectory ({growth.score}%)
                  </div>
                  <div className="font-mono text-xs text-gray-700 mb-2">{growth.narrative}</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono text-gray-700">
                    <div>
                      <div className="font-black text-gray-800">Revenue</div>
                      <div>{growth.metrics?.revenue_growth_pct ?? "—"}%</div>
                    </div>
                    <div>
                      <div className="font-black text-gray-800">Headcount</div>
                      <div>{growth.metrics?.headcount_growth_pct ?? "—"}%</div>
                    </div>
                    <div>
                      <div className="font-black text-gray-800">Runway</div>
                      <div>{growth.metrics?.runway_months ?? "—"} months</div>
                    </div>
                    <div>
                      <div className="font-black text-gray-800">Momentum</div>
                      <div>{growth.metrics?.momentum}</div>
                    </div>
                  </div>
                </section>
              )}

              {marketIntel && (
                <section className="border-2 border-black p-4">
                  <div className="flex items-center gap-2 text-sm font-black uppercase text-gray-700 mb-2">
                    <Briefcase className="w-4 h-4" /> Market intel
                  </div>
                  <div className="grid md:grid-cols-2 gap-3 text-xs font-mono text-gray-700">
                    <div>
                      <div className="font-black text-gray-800">Salary stance</div>
                      <div>{marketIntel.salary_comparison?.position?.replace("_", " ")}</div>
                      <div>Role max: ${marketIntel.salary_comparison?.job_max?.toLocaleString()}</div>
                      <div>Industry avg: ${marketIntel.salary_comparison?.industry_average?.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="font-black text-gray-800">Trajectory</div>
                      <div>Success odds: {marketIntel.success_probability}%</div>
                      <div>Competition: {marketIntel.competition_level}</div>
                      <div>Time to hire: {marketIntel.time_to_hire}</div>
                    </div>
                  </div>
                </section>
              )}

              {negotiation && (
                <section className="border-2 border-black p-4 bg-gray-50">
                  <div className="flex items-center gap-2 text-sm font-black uppercase text-gray-700 mb-2">
                    <AlertTriangle className="w-4 h-4" /> Negotiation playbook
                  </div>
                  <div className="font-mono text-xs text-gray-700 mb-2">
                    Anchor at <span className="font-black">{negotiation.salary_anchor}</span> with floor <span className="font-black">{negotiation.counter_floor}</span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3 text-xs font-mono text-gray-700">
                    {negotiation.leverage_points && negotiation.leverage_points.length > 0 && (
                      <div>
                        <div className="font-black text-gray-800">Leverage</div>
                        <ul className="list-disc ml-4 space-y-1">
                          {negotiation.leverage_points.map((point, idx) => (
                            <li key={idx}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {negotiation.risk_flags && negotiation.risk_flags.length > 0 && (
                      <div>
                        <div className="font-black text-gray-800">Watchouts</div>
                        <ul className="list-disc ml-4 space-y-1">
                          {negotiation.risk_flags.map((point, idx) => (
                            <li key={idx}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  {negotiation.closing_move && (
                    <div className="mt-3 text-xs font-mono text-gray-700">
                      <CheckCircle2 className="inline w-3 h-3 mr-1" /> {negotiation.closing_move}
                    </div>
                  )}
                </section>
              )}
            </div>

            <div className="p-4 border-t-4 border-black bg-white flex gap-3">
                <button
                  onClick={() => job && onSave?.(job)}
                  aria-label="Save job"
                className="flex-1 bg-white text-black border-4 border-black px-4 py-2 font-black hover:bg-black hover:text-cyan-400 transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300"
                >
                SAVE JOB
                </button>
                <button
                  ref={lastFocusableRef}
                  onClick={() => job && onApply?.(job)}
                  aria-label="Quick apply to job"
                className="flex-1 bg-cyan-400 text-black border-4 border-black px-4 py-2 font-black hover:bg-black hover:text-cyan-400 transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300"
                >
                  QUICK APPLY
                </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


