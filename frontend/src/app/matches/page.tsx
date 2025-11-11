"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { JobCardStack } from "../../components/matches/JobCardStack";
import { FiltersDrawer, type Filters } from "../../components/matches/FiltersDrawer";
import Guard from "../../components/auth/Guard";

export default function MatchesPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    role: "",
    level: null,
    location: "",
    remote: null,
    tech: [],
  });

  const tech = useMemo(
    () => ["React", "TypeScript", "Next.js", "Tailwind", "Node.js", "Postgres", "AWS", "Go", "Kubernetes"],
    []
  );
  const levels = useMemo(() => ["Junior", "Mid", "Senior", "Lead"], []);

  return (
    <main className="min-h-screen bg-white text-black">
      <Guard />
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-12 pb-16">
        {/* Page Actions */}
        <div className="flex items-center justify-end gap-3 mb-10">
          <button
            className="border-4 border-black px-4 py-2 font-black bg-white text-black hover:bg-black hover:text-cyan-400 transition-colors"
            onClick={() => setDrawerOpen(true)}
          >
            FILTERS
          </button>
          <Link
            href="/"
            className="border-4 border-black px-4 py-2 font-black bg-cyan-400 text-black hover:bg-black hover:text-cyan-400 transition-colors"
          >
            BACK HOME
          </Link>
        </div>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="text-4xl md:text-6xl font-black leading-tight">
            THE JOBS THAT DON’T SUCK
          </div>
          <div className="font-mono text-gray-700 mt-3">
            Swipe with intent. Save the good ones. Quick-apply when it’s right.
          </div>
        </motion.div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: Filters summary */}
          <div className="lg:col-span-1">
            <div className="border-4 border-black bg-white p-5 sticky top-8">
              <div className="text-xl font-black mb-3">Filters</div>
              <div className="font-mono text-sm text-gray-700 space-y-2">
                <div><span className="font-bold">Role:</span> {filters.role || "Any"}</div>
                <div><span className="font-bold">Level:</span> {filters.level || "Any"}</div>
                <div><span className="font-bold">Location:</span> {filters.location || "Any"}</div>
                <div><span className="font-bold">Remote:</span> {filters.remote === null ? "Any" : filters.remote ? "Remote" : "On‑site"}</div>
                <div className="flex flex-wrap gap-2">
                  {filters.tech.length ? filters.tech.map((t) => (
                    <span key={t} className="px-2 py-1 border-2 border-black bg-cyan-400 text-black text-xs font-black">{t}</span>
                  )) : <span>Any Tech</span>}
                </div>
              </div>
              <button
                className="mt-4 w-full border-4 border-black px-4 py-2 font-black bg-black text-cyan-400 hover:bg-white hover:text-black transition-colors"
                onClick={() => setDrawerOpen(true)}
              >
                EDIT FILTERS
              </button>
            </div>
          </div>

          {/* Right: Card Stack */}
          <div className="lg:col-span-2">
            <JobCardStack filters={filters} />
            <div className="flex items-center justify-center gap-3 mt-6 font-mono text-xs text-gray-600">
              <span className="border-2 border-black px-2 py-1">← Pass</span>
              <span className="border-2 border-black px-2 py-1">→ Quick Apply</span>
              <span className="border-2 border-black px-2 py-1">Keyboard OK</span>
            </div>
          </div>
        </div>
      </div>

      <FiltersDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        filters={filters}
        setFilters={setFilters}
        availableTech={tech}
        availableLevels={levels}
      />
    </main>
  );
}
