"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowRight } from "lucide-react";
import { JobCardStack } from "../../components/matches/JobCardStack";
import type { JobMatch } from "../../components/matches/JobCard";
import { FiltersDrawer, type Filters } from "../../components/matches/FiltersDrawer";
import { track } from "../../lib/analytics";

export default function MatchesPage() {
  const { status, data: session } = useSession();
  const isAuthenticated = status === "authenticated";
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    role: "",
    level: null,
    location: "",
    remote: null,
    tech: [],
  });
  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [hiddenGems, setHiddenGems] = useState<JobMatch[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [matchesError, setMatchesError] = useState<string | null>(null);

  const tech = useMemo(
    () => ["React", "TypeScript", "Next.js", "Tailwind", "Node.js", "Postgres", "AWS", "Go", "Kubernetes"],
    []
  );
  const levels = useMemo(() => ["Junior", "Mid", "Senior", "Lead"], []);
  const pathname = usePathname();

  useEffect(() => {
    track({ type: "page_view", path: pathname || "/matches" });
  }, [pathname]);

  useEffect(() => {
    if (status === "loading") return;

    const fetchMatches = async () => {
      try {
        setLoadingMatches(true);
        setMatchesError(null);

        const backendUserId = (session as any)?.backendUserId;
        const userId = backendUserId
          ? String(backendUserId)
          : typeof window !== "undefined"
            ? localStorage.getItem("user_id") || null
            : null;

        // Skip API call if no valid user_id (not authenticated and no stored user_id)
        if (!userId || userId === "demo_user" || isNaN(Number(userId))) {
          // Show empty matches with a message for demo/unauthenticated users
          setMatches([]);
          setMatchesError("Complete an assessment to see personalized job matches.");
          return;
        }

        const response = await fetch(`/api/jobs/matches/${userId}`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          // If assessment not found, show empty matches with a message
          if (response.status === 404) {
            setMatches([]);
            setMatchesError("Complete an assessment to see personalized job matches.");
            return;
          }
          throw new Error(errorData.details || "Unable to load matches");
        }
        const data = await response.json();
        const normalized: JobMatch[] = (data.matches || []).map((match: any) => ({
          ...match,
          id: match.id,
          remote: match.type === "remote",
          required_skills: match.required_skills || [],
          preferred_skills: match.preferred_skills || [],
          match_reasons: match.match_reasons || [],
          skill_gaps: match.skill_gaps || [],
        }));
        setMatches(normalized);
        
        // Store hidden gems separately
        if (data.hidden_gems && data.hidden_gems.length > 0) {
          const normalizedGems: JobMatch[] = data.hidden_gems.map((match: any) => ({
            ...match,
            id: match.id,
            remote: match.type === "remote",
            required_skills: match.required_skills || [],
            preferred_skills: match.preferred_skills || [],
            match_reasons: match.match_reasons || [],
            skill_gaps: match.skill_gaps || [],
            is_hidden_gem: true,
            hidden_gem_score: match.hidden_gem_score,
            hidden_gem_reasons: match.hidden_gem_reasons || [],
            urgency: match.urgency || "medium"
          }));
          setHiddenGems(normalizedGems);
        } else {
          setHiddenGems([]);
        }
        
        // Check if assessment exists
        if (data.has_assessment === false && normalized.length === 0) {
          setMatchesError("Complete an assessment to see personalized job matches.");
        }
      } catch (error) {
        console.error("Failed to load job matches", error);
        setMatches([]);
        setMatchesError(error instanceof Error ? error.message : "Failed to load matches. Try again in a bit.");
      } finally {
        setLoadingMatches(false);
      }
    };

    fetchMatches();
  }, [status, session]);

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-12 pb-16">
        {!isAuthenticated && (
          <div className="border-4 border-black bg-yellow-50 text-black p-4 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="font-black text-sm sm:text-base">
              SIGN IN TO SYNC YOUR MATCHES
            </div>
            <p className="font-mono text-xs sm:text-sm text-gray-700 max-w-2xl">
              You can explore the stack with sample jobs right now. Log in when you want us to save swipes, quick-applies, and hand the data to the agent.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center border-2 border-black bg-black text-cyan-400 px-4 py-2 font-black text-xs tracking-tight hover:bg-white hover:text-black transition-colors"
            >
              LOGIN
            </Link>
          </div>
        )}

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
            {matchesError && (
              <div className="border-4 border-black bg-yellow-50 text-black p-6 mb-6">
                <div className="font-black text-sm mb-2 uppercase tracking-tight">
                  {matchesError.includes("assessment") ? "Complete Assessment to See Matches" : "Unable to Load Matches"}
                </div>
                <p className="font-mono text-xs text-gray-700 mb-4">
                  {matchesError}
                </p>
                {matchesError.includes("assessment") && (
                  <Link
                    href="/demo"
                    className="inline-flex items-center justify-center border-2 border-black bg-black text-cyan-400 px-4 py-2 font-black text-xs tracking-tight hover:bg-white hover:text-black transition-colors gap-2"
                  >
                    Take Free Assessment
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            )}
            <JobCardStack filters={filters} jobs={matches} loading={loadingMatches} />
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
