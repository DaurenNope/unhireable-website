"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, CalendarDays, Target, Clock, Sparkles, TrendingUp } from "lucide-react";

interface DailyAction {
  day: number;
  date?: string;
  skill: string;
  resource_title?: string;
  focus?: string;
  session_intent?: string;
  hours?: number;
  impact?: number;
}

interface SkillResourceRecommendation {
  skill: string;
  priority: number;
  urgency_score: number;
  estimated_impact?: number;
  dependencies_met?: boolean;
  resources: Array<{
    id: string | number;
    title: string;
    provider?: string;
    type?: string;
    duration_hours?: number;
    cost?: number;
    score?: number;
    difficulty?: string;
    rating?: number;
    url?: string;
    description?: string;
  }>;
}

interface Milestone {
  week: number;
  type: "start" | "checkpoint" | "completion";
  skill: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}

interface SkillTimeline {
  skill: string;
  estimated_hours: number;
  estimated_weeks: number;
  difficulty?: string;
}

interface LearningTimeline {
  total_hours: number;
  total_weeks: number;
  max_concurrent_skills: number;
  learning_strategy: string;
  completion_date?: string;
  skill_timelines?: SkillTimeline[];
}

interface LearningStyle {
  preferences?: string[];
  hours_per_day?: number;
  preferred_pace?: string;
  format_preference?: string;
  budget_conscious?: boolean;
}

export interface PersonalizedLearningPath {
  id: number;
  title: string;
  skill_gaps: string[];
  skills_with_resources: SkillResourceRecommendation[];
  timeline: LearningTimeline;
  milestones: Milestone[];
  learning_style: LearningStyle;
  daily_schedule: DailyAction[];
  estimated_completion_weeks: number;
  total_hours: number;
  learning_strategy: string;
  hours_per_day?: number;
  progress_percentage?: number;
  status?: string;
}

interface PathDetailsDrawerProps {
  path: PersonalizedLearningPath;
  onClose: () => void;
}

export function PathDetailsDrawer({ path, onClose }: PathDetailsDrawerProps) {
  const { timeline, learning_style, skills_with_resources, daily_schedule, milestones } = path;

  return (
    <AnimatePresence>
      {path && (
        <motion.div
          className="fixed inset-0 z-50 flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex-1 bg-black/50" onClick={onClose} />
          <motion.div
            initial={{ x: 480 }}
            animate={{ x: 0 }}
            exit={{ x: 480 }}
            transition={{ type: "spring", stiffness: 140, damping: 22 }}
            className="w-full max-w-2xl bg-white border-l-4 border-black overflow-y-auto"
          >
            <div className="p-6 border-b-4 border-black bg-black text-cyan-400 flex items-center justify-between">
              <div>
                <div className="font-black text-2xl">{path.title}</div>
                <div className="font-mono text-xs text-white/70 uppercase tracking-wide">Hyper-personalized neural syllabus</div>
              </div>
              <button
                onClick={onClose}
                className="flex items-center gap-2 bg-cyan-400 text-black px-3 py-1 font-black border-2 border-black hover:bg-white"
              >
                CLOSE <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <section className="border-4 border-black p-4 bg-white">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 font-black text-lg">
                    <Clock className="w-5 h-5" />
                    {timeline.total_hours} hrs total
                  </div>
                  <div className="flex items-center gap-2 font-black text-lg">
                    <CalendarDays className="w-5 h-5" />
                    {timeline.total_weeks} week sprint
                  </div>
                  <div className="flex items-center gap-2 font-black text-lg">
                    <Sparkles className="w-5 h-5" />
                    {learning_style.preferred_pace?.toUpperCase() || "MODERATE"} pace
                  </div>
                  <div className="font-mono text-xs text-gray-600">
                    {path.learning_strategy.toUpperCase()} // {timeline.max_concurrent_skills} skills in parallel
                  </div>
                </div>
                <div className="mt-3 font-mono text-xs text-gray-600">
                  Daily allocation: {learning_style.hours_per_day || path.hours_per_day || 3} hrs · Format bias: {learning_style.format_preference?.replace("_", " ") || "self paced"}
                </div>
              </section>

              <section className="border-4 border-black p-4 bg-white space-y-4">
                <div className="flex items-center gap-2 text-xl font-black">
                  <Target className="w-5 h-5" /> Skill Offensive
                </div>
                <div className="space-y-3">
                  {skills_with_resources.slice(0, 6).map((skill) => (
                    <div key={skill.skill} className="border-2 border-black p-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-black text-lg">{skill.skill}</div>
                        <div className="font-mono text-xs text-gray-600">
                          Impact {skill.estimated_impact ?? 0}/10 · Urgency {Math.round(skill.urgency_score)}
                        </div>
                      </div>
                      <div className="mt-2 grid gap-2">
                        {skill.resources.slice(0, 2).map((resource) => (
                          <a
                            key={resource.id}
                            href={resource.url}
                            target="_blank"
                            rel="noreferrer"
                            className="border border-black bg-white hover:bg-black hover:text-cyan-400 transition-colors p-3"
                          >
                            <div className="font-black text-sm">{resource.title}</div>
                            <div className="font-mono text-[10px] uppercase text-gray-600">
                              {resource.provider ?? "Independent"} // {resource.type?.toUpperCase() ?? "COURSE"}
                            </div>
                            <div className="font-mono text-[11px] text-gray-600">
                              {resource.duration_hours ?? 0} hrs · Difficulty {resource.difficulty ?? "intermediate"}
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="border-4 border-black p-4 bg-white">
                <div className="flex items-center gap-2 text-xl font-black mb-3">
                  <TrendingUp className="w-5 h-5" /> Daily Actions (first 14 days)
                </div>
                <div className="grid gap-2 max-h-80 overflow-y-auto pr-2">
                  {daily_schedule.slice(0, 14).map((action) => (
                    <div key={action.day} className="border-2 border-black p-3 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="font-black text-sm">DAY {action.day}: {action.skill}</div>
                        <div className="font-mono text-[10px] text-gray-600">{action.hours ?? 2} hrs · impact {action.impact ?? 0}/10</div>
                      </div>
                      <div className="font-mono text-[11px] text-gray-700 mt-1">
                        {action.resource_title}
                      </div>
                      <div className="font-mono text-[11px] text-gray-500 mt-1">
                        {action.focus || action.session_intent}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="border-4 border-black p-4 bg-white">
                <div className="text-xl font-black mb-3">Milestone Map</div>
                <div className="space-y-2">
                  {milestones.slice(0, 10).map((milestone, index) => (
                    <div key={`${milestone.skill}-${index}`} className="border-2 border-black p-3 flex items-center justify-between bg-white">
                      <div>
                        <div className="font-black text-sm">Week {milestone.week} · {milestone.title}</div>
                        <div className="font-mono text-[11px] text-gray-600">{milestone.description}</div>
                      </div>
                      <div className="font-mono text-[10px] uppercase text-gray-500">{milestone.skill}</div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
