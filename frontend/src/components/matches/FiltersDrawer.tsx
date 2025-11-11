"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type Filters = {
  role: string;
  level: string | null;
  location: string;
  remote: boolean | null;
  tech: string[];
};

interface FiltersDrawerProps {
  open: boolean;
  onClose: () => void;
  filters: Filters;
  setFilters: (next: Filters) => void;
  availableTech: string[];
  availableLevels: string[];
}

export function FiltersDrawer({
  open,
  onClose,
  filters,
  setFilters,
  availableTech,
  availableLevels,
}: FiltersDrawerProps) {
  const toggleTech = (t: string) => {
    const exists = filters.tech.includes(t);
    setFilters({
      ...filters,
      tech: exists ? filters.tech.filter((x) => x !== t) : [...filters.tech, t],
    });
  };

  const isDirty = useMemo(() => {
    return (
      filters.role !== "" ||
      !!filters.level ||
      filters.location !== "" ||
      filters.remote !== null ||
      filters.tech.length > 0
    );
  }, [filters]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 24 }}
            className="absolute top-0 left-0 h-full w-full max-w-md bg-white border-r-4 border-black shadow-2xl"
          >
            <div className="p-5 border-b-4 border-black bg-black text-cyan-400 flex items-center justify-between">
              <div className="text-xl font-black">Filters</div>
              <button
                className="bg-cyan-400 text-black border-2 border-black px-3 py-1 font-black"
                onClick={onClose}
              >
                CLOSE
              </button>
            </div>

            <div className="p-5 space-y-5">
              <div>
                <div className="font-black mb-2">Role</div>
                <input
                  value={filters.role}
                  onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                  placeholder="frontend, full‑stack, platform…"
                  className="w-full border-2 border-black px-3 py-2 font-mono text-sm"
                />
              </div>

              <div>
                <div className="font-black mb-2">Level</div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFilters({ ...filters, level: null })}
                    className={`px-3 py-1 border-2 border-black font-mono text-xs ${
                      !filters.level ? "bg-black text-cyan-400" : "bg-white text-black"
                    }`}
                  >
                    Any
                  </button>
                  {availableLevels.map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setFilters({ ...filters, level: lvl })}
                      className={`px-3 py-1 border-2 border-black font-mono text-xs ${
                        filters.level === lvl ? "bg-black text-cyan-400" : "bg-white text-black"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-black mb-2">Location</div>
                <input
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  placeholder="SF, NYC, Remote…"
                  className="w-full border-2 border-black px-3 py-2 font-mono text-sm"
                />
              </div>

              <div>
                <div className="font-black mb-2">Remote</div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilters({ ...filters, remote: null })}
                    className={`px-3 py-1 border-2 border-black font-mono text-xs ${
                      filters.remote === null ? "bg-black text-cyan-400" : "bg-white text-black"
                    }`}
                  >
                    Any
                  </button>
                  <button
                    onClick={() => setFilters({ ...filters, remote: true })}
                    className={`px-3 py-1 border-2 border-black font-mono text-xs ${
                      filters.remote === true ? "bg-black text-cyan-400" : "bg-white text-black"
                    }`}
                  >
                    Remote
                  </button>
                  <button
                    onClick={() => setFilters({ ...filters, remote: false })}
                    className={`px-3 py-1 border-2 border-black font-mono text-xs ${
                      filters.remote === false ? "bg-black text-cyan-400" : "bg-white text-black"
                    }`}
                  >
                    On‑site
                  </button>
                </div>
              </div>

              <div>
                <div className="font-black mb-2">Tech</div>
                <div className="flex flex-wrap gap-2">
                  {availableTech.map((t) => (
                    <button
                      key={t}
                      onClick={() => toggleTech(t)}
                      className={`px-3 py-1 border-2 border-black font-mono text-xs ${
                        filters.tech.includes(t)
                          ? "bg-cyan-400 text-black"
                          : "bg-white text-black"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {isDirty && (
                <div className="pt-3">
                  <button
                    onClick={() =>
                      setFilters({ role: "", level: null, location: "", remote: null, tech: [] })
                    }
                    className="w-full bg-white text-black border-4 border-black px-4 py-3 font-black hover:bg-black hover:text-cyan-400 transition-colors"
                  >
                    RESET FILTERS
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


