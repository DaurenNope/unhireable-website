"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { JobMatch, JobCard } from "./JobCard";
import type { Filters } from "./FiltersDrawer";
import { JobDetailModal } from "./JobDetailModal";
import { MatchesSkeleton } from "./MatchesSkeleton";
import { track } from "../../lib/analytics";

type JobCardStackProps = {
  filters: Filters;
  jobs: JobMatch[];
  loading: boolean;
};

function applyFilters(jobs: JobMatch[], filters: Filters): JobMatch[] {
  return jobs.filter((job) => {
    if (filters.role) {
      const query = filters.role.toLowerCase();
      if (!job.title.toLowerCase().includes(query)) return false;
    }
    if (filters.level) {
      const level = filters.level.toLowerCase();
      if (job.difficulty !== level) return false;
    }
    if (filters.location) {
      const search = filters.location.toLowerCase();
      const location = job.location.toLowerCase();
      const matchesLocation = location.includes(search);
      const matchesRemote = search === "remote" && (job.remote || job.type === "remote");
      if (!matchesLocation && !matchesRemote) return false;
    }
    if (filters.remote !== null) {
      const isRemote = job.remote ?? job.type === "remote";
      if (isRemote !== filters.remote) return false;
    }
    if (filters.tech.length > 0) {
      const stack = job.required_skills || [];
      if (!filters.tech.every((skill) => stack.map((s) => s.toLowerCase()).includes(skill.toLowerCase()))) {
        return false;
      }
    }
    return true;
  });
}

export function JobCardStack({ filters, jobs, loading }: JobCardStackProps) {
  const [cursor, setCursor] = useState(0);
  const [opened, setOpened] = useState<JobMatch | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string | number>>(new Set());
  const [appliedIds, setAppliedIds] = useState<Set<string | number>>(new Set());
  const [dismissedIds, setDismissedIds] = useState<Set<string | number>>(new Set());
  const [lastAction, setLastAction] = useState<string | null>(null);

  useEffect(() => {
    setCursor(0);
  }, [jobs]);

  const filtered = useMemo(() => applyFilters(jobs, filters), [jobs, filters]);
  const visible = useMemo(() => filtered.slice(cursor, cursor + 3), [filtered, cursor]);

  useEffect(() => {
    if (visible.length > 0 && !loading) {
      track({ type: "match_impression", jobIds: visible.map((job) => String(job.id)) });
    }
  }, [visible, loading]);

  const handleSwipe = useCallback(
    (dir: "left" | "right") => {
      const top = visible[0];
      if (top) {
        if (dir === "right") {
          setAppliedIds((prev) => new Set(prev).add(top.id));
          setLastAction(`Applied to ${top.title}`);
        } else {
          setDismissedIds((prev) => new Set(prev).add(top.id));
          setLastAction(`Dismissed ${top.title}`);
        }
        track({ type: "match_swipe", direction: dir, jobId: String(top.id) });
        if (dir === "right") {
          track({ type: "match_apply", jobId: String(top.id) });
        }
      }
      setCursor((current) => Math.min(current + 1, filtered.length));
    },
    [visible, filtered.length]
  );

  return (
    <div className="relative h-[560px] flex items-center justify-center">
      {loading && <MatchesSkeleton />}
      {!loading && jobs.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-4 border-black bg-white p-8 text-center"
        >
          <div className="text-2xl font-black mb-2">No matches yet</div>
          <div className="font-mono text-sm text-gray-600">Take the assessment or refresh filters to unlock tailored roles.</div>
        </motion.div>
      )}
      {!loading && jobs.length > 0 && (
        <>
          {(savedIds.size || appliedIds.size || dismissedIds.size) > 0 && (
            <div className="absolute -top-16 right-0 flex gap-3 text-xs font-mono text-gray-700">
              {appliedIds.size > 0 && (
                <span className="px-2 py-1 border-2 border-black bg-cyan-400 text-black">
                  Applied: {appliedIds.size}
                </span>
              )}
              {savedIds.size > 0 && (
                <span className="px-2 py-1 border-2 border-black bg-white">Saved: {savedIds.size}</span>
              )}
              {dismissedIds.size > 0 && (
                <span className="px-2 py-1 border-2 border-black bg-white">Passed: {dismissedIds.size}</span>
              )}
            </div>
          )}

          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-4 border-black bg-white p-8 text-center"
            >
              <div className="text-2xl font-black mb-2">Too specific?</div>
              <div className="font-mono text-sm text-gray-600">Adjust your filters and refresh.</div>
            </motion.div>
          ) : visible.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-4 border-black bg-white p-8 text-center"
            >
              <div className="text-2xl font-black mb-2">You're all caught up</div>
              <div className="font-mono text-sm text-gray-600">Fresh roles drop daily. Come back soon.</div>
            </motion.div>
          ) : (
            visible.map((job, i) => (
              <JobCard
                key={job.id}
                job={{ ...job, remote: job.remote ?? job.type === "remote" }}
                index={i}
                isTop={i === 0}
                onSwipe={handleSwipe}
                onOpen={(data) => setOpened(data)}
                onSave={(data) => {
                  setSavedIds((prev) => new Set(prev).add(data.id));
                  setLastAction(`Saved ${data.title}`);
                  track({ type: "match_save", jobId: String(data.id) });
                }}
                isSaved={savedIds.has(job.id)}
                isApplied={appliedIds.has(job.id)}
              />
            ))
          )}

          <JobDetailModal
            job={opened}
            onClose={() => setOpened(null)}
            onSave={(data) => {
              setSavedIds((prev) => new Set(prev).add(data.id));
              setLastAction(`Saved ${data.title}`);
              setOpened(null);
              track({ type: "match_save", jobId: String(data.id) });
            }}
            onApply={(data) => {
              setAppliedIds((prev) => new Set(prev).add(data.id));
              setLastAction(`Applied to ${data.title}`);
              setOpened(null);
              track({ type: "match_apply", jobId: String(data.id) });
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


