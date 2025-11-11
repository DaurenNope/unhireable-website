"use client";

import { useState } from "react";
import Guard from "../../components/auth/Guard";
import { AnimatePresence, motion } from "framer-motion";
import { ResumeBuilder, ResumeData } from "../../components/resume/ResumeBuilder";
import { ArrowLeft, Sparkles, Target, Rocket, Mail } from "lucide-react";

export default function ResumePage() {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [pendingDownload, setPendingDownload] = useState<null | (() => void)>(null);
  const [pendingResume, setPendingResume] = useState<ResumeData | null>(null);
  const [showShareCard, setShowShareCard] = useState(false);

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  return (
    <div className="min-h-screen bg-white text-black">
      <Guard />

      <main className="max-w-6xl mx-auto p-6 space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center"
        >
          <div className="text-4xl md:text-5xl font-black leading-none mb-4">
            <span className="bg-black text-white px-4">Build a Resume the Agent Can Sell</span>
          </div>
          <p className="text-lg font-mono text-gray-600 max-w-3xl mx-auto">
            Our autonomous agent needs fuel—a sharp story, quantified wins, and proof you can ship. Use this lab to prep the
            assets it will deploy across 2,800+ companies.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { title: "Decode", description: "Follow the prompts—no fluff, just signals hiring teams care about." },
            { title: "Refine", description: "Embed impact metrics the agent will reuse in outbound campaigns." },
            { title: "Deploy", description: "Download now; the autonomous hunter will sync once you’re onboarded." },
          ].map((step, i) => (
            <div key={step.title} className="border-4 border-black bg-white p-6 relative">
              <div className="absolute -top-4 left-6 bg-cyan-400 text-black px-3 py-1 font-mono text-xs">STEP {i + 1}</div>
              <h3 className="text-2xl font-black mb-3">{step.title}</h3>
              <p className="font-mono text-sm text-gray-700">{step.description}</p>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="border-4 border-black bg-white"
        >
          <div className="bg-gradient-to-r from-cyan-400 to-purple-400 text-black p-4 border-b-4 border-black flex items-center justify-between">
            <div className="font-black text-xl flex items-center gap-2 uppercase tracking-tight">
              <Sparkles className="w-6 h-6" />
              Interactive Builder
            </div>
            <div className="flex items-center gap-2 font-mono text-xs md:text-sm">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              <span>Agent-ready format</span>
            </div>
          </div>

          <div className="p-6">
            <ResumeBuilder
              onDownload={({ data, download }) => {
                setPendingResume(data);
                setPendingDownload(() => download);
                setShowEmailModal(true);
              }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="border-4 border-black bg-black text-white p-6">
            <div className="text-xl font-black mb-2 flex items-center gap-2">
              <Target className="w-6 h-6 text-cyan-400" />
              Agent Checklist
            </div>
            <ul className="font-mono text-xs space-y-2 text-gray-200">
              <li>• Lead with impact: metrics, teams, revenue.</li>
              <li>• Mirror the language of the roles you want.</li>
              <li>• Keep bullets punchy—verbs + outcomes.</li>
            </ul>
          </div>
          <div className="border-4 border-black bg-white p-6">
            <div className="text-xl font-black mb-2 flex items-center gap-2 text-purple-500">
              <Rocket className="w-6 h-6" />
              Coming Soon
            </div>
            <p className="font-mono text-sm text-gray-700">
              Autopilot will keep this resume synced, version it per role, and push it across hiring pipelines automatically.
            </p>
          </div>
          <div className="border-4 border-black bg-white p-6">
            <div className="text-xl font-black mb-2 flex items-center gap-2 text-cyan-500">
              <Mail className="w-6 h-6" />
              Stay in the Loop
            </div>
            <p className="font-mono text-sm text-gray-700">
              Every download adds you to our talent briefings—market intel, interview frameworks, and early agent invites.
            </p>
          </div>
        </motion.div>

        {showShareCard && pendingResume && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-4 border-black bg-white p-6"
          >
            <div className="flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
              <div>
                <h3 className="text-2xl font-black mb-2">Resume sent. Next: prep the agent.</h3>
                <p className="font-mono text-sm text-gray-700">
                  We emailed your download link to {email}. Run the readiness scan and you’ll be first in line when the job hunter ships.
                </p>
              </div>
              <div className="flex gap-3">
                <a
                  href="/demo"
                  className="px-5 py-3 border-2 border-black bg-cyan-400 text-black font-black uppercase tracking-tight hover:bg-white transition-colors"
                >
                  Run readiness scan
                </a>
                <a
                  href="/waitlist"
                  className="px-5 py-3 border-2 border-black bg-black text-cyan-400 font-black uppercase tracking-tight hover:bg-white hover:text-black transition-colors"
                >
                  Join waitlist
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      <AnimatePresence>
        {showEmailModal && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-lg bg-white border-4 border-black p-6 relative"
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
            >
              <button
                className="absolute top-2 right-2 border-2 border-black px-2 py-1 font-mono text-xs"
                onClick={() => setShowEmailModal(false)}
              >
                CLOSE
              </button>
              <h3 className="text-2xl font-black mb-2">Send it to your inbox</h3>
              <p className="font-mono text-sm text-gray-700 mb-4">
                Drop an email so we can send the download link, market briefings, and early access to the autonomous agent.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError("");
                  }}
                  placeholder="you@domain.com"
                  className="w-full border-2 border-black px-3 py-3 font-mono text-sm"
                />
                {emailError && <div className="text-red-600 font-mono text-xs">{emailError}</div>}
                <button
                  className="w-full bg-black text-cyan-400 border-4 border-black px-4 py-3 font-black uppercase tracking-tight"
                  onClick={() => {
                    if (!validateEmail(email)) {
                      setEmailError("Please enter a valid email.");
                      return;
                    }
                    setShowEmailModal(false);
                    if (pendingDownload) pendingDownload();
                    setShowShareCard(true);
                  }}
                >
                  Email me the download link
                </button>
                <div className="text-center text-xs font-mono text-gray-500">
                  No spam. Unsubscribe anytime.
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
