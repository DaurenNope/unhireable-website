"use client";

import { AnimatePresence, motion } from "framer-motion";

export interface Resource {
  id: string | number;
  type: "video" | "course" | "article" | "repo" | "tutorial" | "bootcamp" | "certification" | "book";
  title: string;
  url: string;
  duration?: string;
  provider?: string;
}

interface ResourceDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  resources: Resource[];
  onSavePlan?: () => void;
  onStartNow?: () => void;
}

export function ResourceDrawer({
  open,
  onClose,
  title,
  resources,
  onSavePlan,
  onStartNow,
}: ResourceDrawerProps) {
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
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
            className="absolute bottom-0 left-0 right-0 bg-white border-t-4 border-black shadow-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div className="text-2xl font-black">{title}</div>
              <button
                className="bg-cyan-400 text-black px-3 py-1 border-2 border-black font-black"
                onClick={onClose}
              >
                CLOSE
              </button>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              {resources.map((r) => (
                <a
                  key={r.id}
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  className="border-2 border-black p-3 bg-white hover:bg-black hover:text-cyan-400 transition-colors"
                >
                  <div className="text-sm font-mono text-gray-600">{r.type.toUpperCase()}</div>
                  <div className="font-black">{r.title}</div>
                  {r.provider && (
                    <div className="text-xs font-mono text-gray-600">{r.provider}</div>
                  )}
                  {r.duration && (
                    <div className="text-xs font-mono text-gray-600">{r.duration}</div>
                  )}
                </a>
              ))}
            </div>
            <div className="mt-5 flex gap-3">
              <button
                onClick={onSavePlan}
                className="bg-white text-black border-4 border-black px-4 py-2 font-black hover:bg-black hover:text-cyan-400 transition-colors"
              >
                SAVE TO PLAN
              </button>
              <button
                onClick={onStartNow}
                className="bg-cyan-400 text-black border-4 border-black px-4 py-2 font-black hover:bg-black hover:text-cyan-400 transition-colors"
              >
                START NOW
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


