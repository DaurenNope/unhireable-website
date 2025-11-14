"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";

export interface JobMatch {
  id: string | number;
  title: string;
  company: string;
  location: string;
  salary: string;
  headline: string;
  type: string;
  difficulty: string;
  match_score: number;
  required_skills: string[];
  preferred_skills: string[];
  match_reasons: string[];
  skill_gaps: string[];
  culture_fit?: {
    score: number;
    summary: string;
    highlights?: string[];
    watchouts?: string[];
  };
  market_intelligence?: {
    salary_comparison?: {
      position: string;
      industry_average: number;
      job_max: number;
    };
    competition_level?: string;
    success_probability?: number;
    time_to_hire?: string;
  };
  growth_potential?: {
    score: number;
    narrative: string;
    metrics?: Record<string, any>;
  };
  negotiation_plan?: {
    salary_anchor: string;
    counter_floor: string;
    leverage_points?: string[];
    risk_flags?: string[];
    closing_move?: string;
  };
  score_breakdown?: {
    skills: number;
    experience: number;
    culture: number;
    growth: number;
    compensation: number;
    total: number;
  };
  culture_analysis?: Record<string, string>;
  location_alignment?: boolean;
  interest_alignment?: boolean;
  remote?: boolean;
}

interface JobCardProps {
  job: JobMatch;
  index: number;
  onSwipe: (direction: "left" | "right") => void;
  isTop: boolean;
  onOpen: (job: JobMatch) => void;
  onSave: (job: JobMatch) => void;
  isSaved: boolean;
  isApplied: boolean;
}

export function JobCard({
  job,
  index,
  onSwipe,
  isTop,
  onOpen,
  onSave,
  isSaved,
  isApplied,
}: JobCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-12, 0, 12]);
  const opacity = useTransform(x, [-220, 0, 220], [0, 1, 0]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isTop) return;
      if (e.key === "ArrowLeft") onSwipe("left");
      if (e.key === "ArrowRight") onSwipe("right");
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isTop, onSwipe]);

  const scoreBreakdown = job.score_breakdown ?? {
    skills: job.match_score,
    experience: 70,
    culture: 65,
    growth: 60,
    compensation: 60,
    total: job.match_score,
  };

  const breakdownEntries = useMemo(
    () => [
      { label: "Skills", value: scoreBreakdown.skills },
      { label: "Experience", value: scoreBreakdown.experience },
      { label: "Culture", value: scoreBreakdown.culture },
      { label: "Growth", value: scoreBreakdown.growth },
      { label: "Comp", value: scoreBreakdown.compensation },
    ],
    [scoreBreakdown]
  );

  const topReasons = job.match_reasons.slice(0, 2);
  const topSkills = job.required_skills.slice(0, 6);

  return (
    <motion.div
      className={cn(
        "absolute inset-0 m-auto h-[520px] w-full max-w-xl",
        "bg-white border-4 border-black shadow-2xl rounded-2xl overflow-hidden",
        "flex flex-col"
      )}
      style={{ x, rotate, opacity, zIndex: 100 - index }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={(_, info) => {
        if (!isTop) return;
        if (info.offset.x > 140) onSwipe("right");
        else if (info.offset.x < -140) onSwipe("left");
        else x.set(0);
      }}
      initial={{ y: index * 8, scale: 1 - index * 0.03 }}
      animate={{ y: index * 8, scale: 1 - index * 0.03 }}
      transition={{ type: "spring", stiffness: 200, damping: 22 }}
      onDoubleClick={() => onOpen(job)}
    >
      {(isSaved || isApplied) && (
        <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
          {isApplied && (
            <span className="px-3 py-1 border-2 border-black bg-cyan-400 text-black text-xs font-black">
              Applied
            </span>
          )}
          {isSaved && !isApplied && (
            <span className="px-3 py-1 border-2 border-black bg-white text-black text-xs font-black">
              Saved
            </span>
          )}
        </div>
      )}
      <div className="bg-black text-cyan-400 p-4 border-b-4 border-cyan-400">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="font-black text-xl leading-tight">{job.title}</div>
            <div className="text-sm font-mono text-white/70">
              {job.company} • {job.location} {job.remote ? "• Remote" : ""}
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black text-white">{Math.round(job.match_score)}</div>
            <div className="text-[10px] font-mono text-white/60 uppercase tracking-wide">
              match score
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 flex-1 overflow-auto space-y-4">
        <p className="font-mono text-sm text-gray-900 leading-relaxed">
          {job.headline}
        </p>

        <div className="border-2 border-black p-3 bg-gray-50">
          <div className="font-black text-xs uppercase text-gray-600 mb-2">Why this could work</div>
          <ul className="list-disc ml-5 space-y-1 text-xs font-mono text-gray-700">
            {topReasons.map((reason, idx) => (
              <li key={idx}>{reason}</li>
            ))}
            {topReasons.length === 0 && (
              <li>Experience and skillset align with the role.</li>
            )}
          </ul>
        </div>

        <div>
          <div className="font-black text-xs uppercase text-gray-600 mb-2">Core stack</div>
          <div className="flex flex-wrap gap-2">
            {topSkills.map((skill) => (
              <span
                key={skill}
                className="px-2 py-1 border-2 border-black bg-cyan-400 text-black text-[11px] font-black"
              >
                {skill}
              </span>
            ))}
            {job.skill_gaps.slice(0, 2).map((gap) => (
              <span
                key={`gap-${gap}`}
                className="px-2 py-1 border-2 border-dashed border-black bg-white text-black text-[11px] font-black"
              >
                Gap: {gap}
              </span>
            ))}
          </div>
        </div>

        <div>
          <div className="font-black text-xs uppercase text-gray-600 mb-2">Signal mix</div>
          <div className="space-y-2">
            {breakdownEntries.map((entry) => (
              <div key={entry.label}>
                <div className="flex items-center justify-between text-[11px] font-mono text-gray-700">
                  <span>{entry.label}</span>
                  <span>{Math.round(entry.value)}%</span>
                </div>
                <div className="h-2 border-2 border-black bg-white">
                  <div
                    className="h-full bg-black"
                    style={{ width: `${Math.min(100, Math.max(0, entry.value))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {job.culture_fit && (
          <div className="border-2 border-black p-3">
            <div className="font-black text-xs uppercase text-gray-600">Culture fit · {job.culture_fit.score}%</div>
            <div className="font-mono text-xs text-gray-700 mt-1">{job.culture_fit.summary}</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {(job.culture_fit.highlights ?? []).slice(0, 2).map((highlight, idx) => (
                <span key={idx} className="px-2 py-1 border-2 border-black bg-white text-[11px] font-mono">
                  {highlight}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t-4 border-black bg-white flex gap-3">
        <button
          onClick={() => onSwipe("left")}
          aria-label="Pass job"
          className="w-1/3 bg-white text-black border-4 border-black px-4 py-2 font-black hover:bg-black hover:text-cyan-400 transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300"
        >
          PASS
        </button>
        <button
          onClick={() => onSave(job)}
          aria-label="Save job"
          className="w-1/3 bg-white text-black border-4 border-black px-4 py-2 font-black hover:bg-cyan-400 hover:text-black transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300"
        >
          SAVE
        </button>
        <button
          onClick={() => onSwipe("right")}
          aria-label="Quick apply to job"
          className="w-1/3 bg-cyan-400 text-black border-4 border-black px-4 py-2 font-black hover:bg-black hover:text-cyan-400 transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300"
        >
          QUICK APPLY
        </button>
      </div>
    </motion.div>
  );
}


