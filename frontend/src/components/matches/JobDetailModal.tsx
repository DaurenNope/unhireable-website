"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { Job } from "./JobCard";

interface JobDetailModalProps {
  job: Job | null;
  onClose: () => void;
  onSave?: (job: Job) => void;
  onApply?: (job: Job) => void;
}

export function JobDetailModal({ job, onClose, onSave, onApply }: JobDetailModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const firstFocusableRef = useRef<HTMLButtonElement | null>(null);
  const lastFocusableRef = useRef<HTMLButtonElement | null>(null);

  // Focus trap + Escape to close
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

  return (
    <AnimatePresence>
      {job && (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-hidden={false}
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="job-dialog-title"
            aria-describedby="job-dialog-desc"
            initial={{ scale: 0.95, y: 10, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 10, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            className="absolute left-1/2 top-16 -translate-x-1/2 w-[92%] max-w-3xl bg-white border-4 border-black shadow-2xl focus:outline-none"
          >
            <div className="bg-black text-cyan-400 p-4 border-b-4 border-cyan-400 flex items-center justify-between">
              <div id="job-dialog-title" className="font-black text-xl">
                {job.title}
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
            <div className="p-5 space-y-4">
              <div id="job-dialog-desc" className="font-mono text-sm text-gray-700">
                {job.company} • {job.location} {job.remote ? "• Remote" : ""}
              </div>
              <p className="font-mono text-sm leading-relaxed">{job.blurb}</p>
              <div>
                <div className="font-black mb-2">Tech</div>
                <div className="flex flex-wrap gap-2">
                  {job.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-1 border-2 border-black bg-cyan-400 text-black text-xs font-black"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-3">
                <button
                  onClick={() => job && onSave?.(job)}
                  aria-label="Save job"
                  className="bg-white text-black border-4 border-black px-4 py-2 font-black hover:bg-black hover:text-cyan-400 transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300"
                >
                  SAVE
                </button>
                <button
                  ref={lastFocusableRef}
                  onClick={() => job && onApply?.(job)}
                  aria-label="Quick apply to job"
                  className="bg-cyan-400 text-black border-4 border-black px-4 py-2 font-black hover:bg-black hover:text-cyan-400 transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300"
                >
                  QUICK APPLY
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


