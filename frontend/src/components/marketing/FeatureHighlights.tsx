"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Brain,
  Target,
  TrendingUp,
  Shield,
  RefreshCw,
  FileText,
  BarChart3,
  Zap,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  cta: string;
  stats?: {
    value: string;
    label: string;
    comparison?: string;
  };
  benefits: string[];
}

const features: Feature[] = [
  {
    title: "Neural Career Assessment",
    description: "10-minute personality & skills scan that analyzes your complete profile",
    icon: <Brain className="w-8 h-8" />,
    href: "/demo",
    cta: "Take Free Assessment",
    stats: {
      value: "10 min",
      label: "Assessment Time",
      comparison: "vs hours of resume writing",
    },
    benefits: [
      "Personality pattern analysis",
      "Technical skills assessment",
      "Career goals mapping",
      "Learning preferences",
    ],
  },
  {
    title: "Advanced Job Matching",
    description: "AI-powered matching with 89% success rate vs 12% industry average",
    icon: <Target className="w-8 h-8" />,
    href: "/matches",
    cta: "Find Your Match",
    stats: {
      value: "89%",
      label: "Success Rate",
      comparison: "vs 12% industry average",
    },
    benefits: [
      "Cultural fit analysis",
      "Growth potential scoring",
      "Salary negotiation intelligence",
      "2,847 companies scanned",
    ],
  },
  {
    title: "Hyper-Personalized Learning Paths",
    description: "Adaptive learning plans based on your skill gaps and career goals",
    icon: <TrendingUp className="w-8 h-8" />,
    href: "/learning-paths",
    cta: "View Learning Paths",
    stats: {
      value: "342",
      label: "Active Paths",
      comparison: "personalized for each user",
    },
    benefits: [
      "Daily micro-learning sessions",
      "Progress tracking",
      "Skill gap analysis",
      "Milestone achievements",
    ],
  },
  {
    title: "Predictive Career Analytics",
    description: "AI-powered predictions for promotion, job security, and career pivots",
    icon: <Shield className="w-8 h-8" />,
    href: "/predictive",
    cta: "View Analytics",
    stats: {
      value: "21 days",
      label: "Average Hire Time",
      comparison: "vs 4.5 months traditional",
    },
    benefits: [
      "Promotion probability",
      "Job security signals",
      "Pivot readiness analysis",
      "Risk timeline assessment",
    ],
  },
  {
    title: "Career Intelligence Dashboard",
    description: "Real-time insights into your market readiness and career trajectory",
    icon: <BarChart3 className="w-8 h-8" />,
    href: "/dashboard",
    cta: "View Dashboard",
    stats: {
      value: "4.8x",
      label: "Faster Placement",
      comparison: "than industry average",
    },
    benefits: [
      "Market readiness score",
      "Skill gap analysis",
      "Progress velocity tracking",
      "Industry benchmarks",
    ],
  },
  {
    title: "AI Resume Builder",
    description: "ATS-optimized resume generation with multiple format options",
    icon: <FileText className="w-8 h-8" />,
    href: "/resume",
    cta: "Build Resume",
    stats: {
      value: "Instant",
      label: "Resume Generation",
      comparison: "vs hours of formatting",
    },
    benefits: [
      "ATS-optimized format",
      "Multiple template options",
      "Instant download",
      "Customizable content",
    ],
  },
];

export function FeatureHighlights() {
  return (
    <section className="py-24 px-4 sm:px-6 md:px-8 lg:px-16 bg-white text-black">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-black leading-tight mb-4">
            Everything You Need to
            <span className="block bg-black text-white px-4 inline-block mt-2">
              Succeed
            </span>
          </h2>
          <p className="font-mono text-lg text-gray-600 max-w-2xl mx-auto">
            A complete career intelligence system powered by AI
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="border-4 border-black bg-white p-6 hover:shadow-[12px_12px_0px_rgba(0,0,0,1)] transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, rotate: 1 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-black text-white p-2">{feature.icon}</div>
                <h3 className="text-xl font-black uppercase tracking-tight">
                  {feature.title}
                </h3>
              </div>

              <p className="font-mono text-sm text-gray-700 mb-4 leading-relaxed">
                {feature.description}
              </p>

              {feature.stats && (
                <div className="border-2 border-black bg-gray-50 p-3 mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-2xl font-black">{feature.stats.value}</div>
                    <div className="text-xs font-mono text-gray-600">
                      {feature.stats.label}
                    </div>
                  </div>
                  {feature.stats.comparison && (
                    <div className="text-xs font-mono text-gray-500">
                      {feature.stats.comparison}
                    </div>
                  )}
                </div>
              )}

              <ul className="space-y-2 mb-6">
                {feature.benefits.map((benefit, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-sm font-mono text-gray-700"
                  >
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={feature.href}
                className="inline-flex items-center justify-center w-full border-2 border-black bg-black text-white px-4 py-3 font-black text-sm uppercase tracking-tight hover:bg-white hover:text-black transition-colors gap-2"
              >
                {feature.cta}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


