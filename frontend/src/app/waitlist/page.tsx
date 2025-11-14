"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Rocket, CheckCircle2, Mail, Monitor, Zap, Target } from "lucide-react";

export default function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (value: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.ok) {
        setSubmitted(true);
        setEmail("");
      } else {
        setError(data.error === "invalid_email" ? "Please enter a valid email address" : "Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <div className="border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-black text-lg hover:opacity-70 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>BACK</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.h1
            className="text-5xl md:text-7xl font-black leading-none mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="block">JOIN THE</span>
            <span className="block bg-cyan-400 text-black px-4 inline-block mt-2">AUTOPILOT</span>
            <span className="block">WAITLIST</span>
          </motion.h1>
          <motion.p
            className="text-xl font-mono text-gray-700 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Get early access to the desktop app that auto-applies 24/7. Limited beta invites.
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: <Monitor className="w-6 h-6" />,
              title: "Desktop App",
              description: "Tauri-based app for Windows, macOS, Linux",
            },
            {
              icon: <Zap className="w-6 h-6" />,
              title: "Auto-Apply",
              description: "Browser automation fills forms, uploads resumes",
            },
            {
              icon: <Target className="w-6 h-6" />,
              title: "Job Scraping",
              description: "LinkedIn, Indeed, remote boards, Fortune 500",
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_rgba(0,0,0,1)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <div className="text-cyan-400 mb-3">{feature.icon}</div>
              <h3 className="text-xl font-black mb-2">{feature.title}</h3>
              <p className="font-mono text-sm text-gray-700">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Form */}
        {!submitted ? (
          <motion.div
            className="border-4 border-black bg-white p-8 md:p-12 shadow-[12px_12px_0px_rgba(0,0,0,1)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-black uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border-4 border-black font-mono text-lg focus:outline-none focus:ring-4 focus:ring-cyan-400"
                  required
                />
                {error && (
                  <p className="mt-2 text-sm font-mono text-red-500">{error}</p>
                )}
              </div>
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white px-8 py-4 text-xl font-black uppercase tracking-tight border-4 border-black shadow-[8px_8px_0_rgba(0,0,0,1)] hover:shadow-[12px_12px_0_rgba(0,0,0,1)] transition-all hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? (
                  "Submitting..."
                ) : (
                  <>
                    <span>Join Waitlist</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            className="border-4 border-black bg-cyan-400 text-black p-8 md:p-12 shadow-[12px_12px_0px_rgba(0,0,0,1)] text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <CheckCircle2 className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-3xl font-black mb-4">YOU'RE IN!</h2>
            <p className="font-mono text-lg mb-6">
              We'll send you an invite when the desktop app launches.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-black uppercase tracking-tight border-4 border-black bg-black text-white px-6 py-3 hover:bg-white hover:text-black transition-colors"
            >
              <span>Back to Home</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}

        {/* Additional Info */}
        <motion.div
          className="mt-12 text-center space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="font-mono text-sm text-gray-600">
            The desktop app is currently in private beta. Early access is limited.
          </p>
          <p className="font-mono text-xs text-gray-500">
            In the meantime, try our{" "}
            <Link href="/demo" className="text-black font-black underline hover:text-cyan-400">
              free assessment
            </Link>{" "}
            to get personalized career insights.
          </p>
        </motion.div>
      </main>
    </div>
  );
}

