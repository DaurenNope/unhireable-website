"use client";

import { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Job, JobCard } from "./JobCard";
import type { Filters } from "./FiltersDrawer";
import { JobDetailModal } from "./JobDetailModal";
import { useEffect } from "react";
import { MatchesSkeleton } from "./MatchesSkeleton";
import { track } from "../../lib/analytics";

const MOCK_JOBS: Job[] = [
  {
    id: "1",
    title: "Senior Frontend Engineer",
    company: "Vortex Systems",
    location: "NYC",
    remote: true,
    level: "Senior",
    tech: ["React", "TypeScript", "Next.js", "Tailwind"],
    blurb:
      "Own the front of a high-velocity product team. Ship performative UIs, micro-interactions, and DX that other devs copy.",
  },
  {
    id: "2",
    title: "Product-Focused Full‑Stack",
    company: "Firewatch",
    location: "Remote",
    remote: true,
    level: "Mid",
    tech: ["Node.js", "React", "Postgres", "AWS"],
    blurb:
      "Build end-to-end features with measurable impact. Pragmatic stack, tight feedback loops, zero ceremony.",
  },
  {
    id: "3",
    title: "Platform Engineer",
    company: "Orbital",
    location: "SF",
    remote: false,
    level: "Senior",
    tech: ["Kubernetes", "Terraform", "Go", "CI/CD"],
    blurb:
      "Level-up developer velocity. Golden paths, paved roads, and ruthless reliability in prod.",
  },
];

function applyFilters(jobs: Job[], filters: Filters): Job[] {
  return jobs.filter((j) => {
    if (filters.role) {
      const q = filters.role.toLowerCase();
      if (!j.title.toLowerCase().includes(q)) return false;
    }
    if (filters.level && j.level !== (filters.level as any)) return false;
    if (filters.location) {
      const q = filters.location.toLowerCase();
      if (
        !j.location.toLowerCase().includes(q) &&
        !(q === "remote" && j.remote)
      )
        return false;
    }
    if (filters.remote !== null && j.remote !== filters.remote) return false;
    if (filters.tech.length > 0) {
      const hasAll = filters.tech.every((t) => j.tech.includes(t));
      if (!hasAll) return false;
    }
    return true;
  });
}

export function JobCardStack({ filters }: { filters: Filters }) {
  const [cursor, setCursor] = useState(0);
  const [opened, setOpened] = useState<Job | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [lastAction, setLastAction] = useState<string | null>(null);
  const jobs = useMemo(() => MOCK_JOBS, []);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => applyFilters(jobs, filters), [jobs, filters]);
  const visible = useMemo(() => filtered.slice(cursor, cursor + 3), [filtered, cursor]);

  // Fire impressions when visible changes (and not loading)
  useEffect(() => {
    if (visible.length > 0 && !isLoading) {
      track({ type: "match_impression", jobIds: visible.map((j) => j.id) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible.map((j) => j.id).join(","), isLoading]);

  const handleSwipe = useCallback(
    (dir: "left" | "right") => {
      // optimistic action; wire to backend later
      const top = visible[0];
      if (top) {
        if (dir === "right") {
          setAppliedIds((prev) => {
            const next = new Set(prev);
            next.add(top.id);
            return next;
          });
          setLastAction(`Applied to ${top.title}`);
        } else {
          setDismissedIds((prev) => {
            const next = new Set(prev);
            next.add(top.id);
            return next;
          });
          setLastAction(`Dismissed ${top.title}`);
        }
        // Track swipe/apply events
        track({ type: "match_swipe", direction: dir, jobId: top.id });
        if (dir === "right") {
          track({ type: "match_apply", jobId: top.id });
        }
      }
      setCursor((c) => Math.min(c + 1, jobs.length));
    },
    [jobs.length, visible]
  );

  return (
    <div className="relative h-[560px] flex items-center justify-center">
      {isLoading && <MatchesSkeleton />}
      {!isLoading && (
        <>
          {(savedIds.size || appliedIds.size || dismissedIds.size) > 0 && (
            <div className="absolute -top-16 right-0 flex gap-3 text-xs font-mono text-gray-700">
              {appliedIds.size > 0 && (
                <span className="px-2 py-1 border-2 border-black bg-cyan-400 text-black">
                  Applied: {appliedIds.size}
                </span>
              )}
              {savedIds.size > 0 && (
                <span className="px-2 py-1 border-2 border-black bg-white">
                  Saved: {savedIds.size}
                </span>
              )}
              {dismissedIds.size > 0 && (
                <span className="px-2 py-1 border-2 border-black bg-white">
                  Passed: {dismissedIds.size}
                </span>
              )}
            </div>
          )}
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-4 border-black bg-white p-8 text-center"
            >
              <div className="text-2xl font-black mb-2">No matches yet</div>
              <div className="font-mono text-sm text-gray-600">
                Try adjusting your filters.
              </div>
            </motion.div>
          ) : visible.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-4 border-black bg-white p-8 text-center"
            >
              <div className="text-2xl font-black mb-2">You're all caught up</div>
              <div className="font-mono text-sm text-gray-600">
                New opportunities drop daily. Check back soon.
              </div>
            </motion.div>
          ) : (
            visible.map((job, i) => (
              <JobCard
                key={job.id}
                job={job}
                index={i}
                isTop={i === 0}
                onSwipe={handleSwipe}
                onOpen={(j) => setOpened(j)}
                onSave={(j) => {
                  setSavedIds((prev) => {
                    const next = new Set(prev);
                    next.add(j.id);
                    return next;
                  });
                  setLastAction(`Saved ${j.title}`);
                  track({ type: "match_save", jobId: j.id });
                }}
                isSaved={savedIds.has(job.id)}
                isApplied={appliedIds.has(job.id)}
              />
            ))
          )}
          <JobDetailModal
            job={opened}
            onClose={() => setOpened(null)}
            onSave={(j) => {
              setSavedIds((prev) => new Set(prev).add(j.id));
              setLastAction(`Saved ${j.title}`);
              setOpened(null);
              track({ type: "match_save", jobId: j.id });
            }}
            onApply={(j) => {
              setAppliedIds((prev) => new Set(prev).add(j.id));
              setLastAction(`Applied to ${j.title}`);
              setOpened(null);
              track({ type: "match_apply", jobId: j.id });
            }}
          />
          {lastAction && (
            <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 border-2 border-black bg-white px-4 py-2 font-mono text-xs text-gray-700">
              {lastAction}
            </div>
          )}
        </>
      )}
    </div>
  );
}


