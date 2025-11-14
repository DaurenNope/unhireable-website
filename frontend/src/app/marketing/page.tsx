"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FeatureHighlights } from "../../components/marketing/FeatureHighlights";
import { SocialProof } from "../../components/marketing/SocialProof";
import { CTASection } from "../../components/marketing/CTA";
import { ArrowRight, Rocket, Zap, CheckCircle2 } from "lucide-react";

export default function MarketingPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-16 bg-gradient-to-br from-white via-cyan-50 to-purple-50 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 -left-48 w-96 h-96 bg-black rounded-full blur-3xl opacity-5" />
          <div className="absolute bottom-0 -right-48 w-96 h-96 bg-cyan-400 rounded-full blur-3xl opacity-5" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-6">
              <span className="block">The System Thinks</span>
              <span className="block bg-black text-white px-4 inline-block mt-2">
                You're Data.
              </span>
              <span className="block text-cyan-400 mt-4">We Know You're</span>
              <span className="block bg-cyan-400 text-white px-4 inline-block mt-2">
                Human.
              </span>
            </h1>
            
            <p className="font-mono text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
              89% success rate vs 12% industry average. Get hired in 21 days vs 4.5 months traditional.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Link
                href="/demo"
                className="inline-flex items-center justify-center bg-black text-white px-8 py-4 text-lg font-black uppercase tracking-tight border-4 border-black hover:bg-cyan-400 hover:text-black transition-colors gap-2"
              >
                <Rocket className="w-5 h-5" />
                Take Free Assessment
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/matches"
                className="inline-flex items-center justify-center bg-white text-black px-8 py-4 text-lg font-black uppercase tracking-tight border-4 border-black hover:bg-black hover:text-white transition-colors gap-2"
              >
                Find Your Match
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="font-mono text-sm">Free Assessment</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-cyan-500" />
                <span className="font-mono text-sm">Instant Results</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-purple-500" />
                <span className="font-mono text-sm">No Commitment</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Highlights */}
      <FeatureHighlights />

      {/* Social Proof */}
      <SocialProof />

      {/* CTA Section */}
      <CTASection
        title="Stop Being Unhireable. Start Being Unstoppable."
        description="Join the revolution. 10 minutes. Lifetime impact."
        primaryCTA={{
          text: "Join Autopilot Waitlist",
          href: "/demo",
          icon: <Rocket className="w-5 h-5" />,
        }}
        secondaryCTA={{
          text: "Learn More",
          href: "/",
          icon: <Zap className="w-5 h-5" />,
        }}
        trustIndicators={[
          "Free Assessment",
          "Instant Results",
          "No Commitment",
          "89% Success Rate",
        ]}
        variant="dark"
      />
    </main>
  );
}

