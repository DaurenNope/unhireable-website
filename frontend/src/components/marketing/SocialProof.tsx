"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, Target, Zap, CheckCircle2 } from "lucide-react";

interface Stat {
  value: string;
  label: string;
  comparison?: string;
  icon: React.ReactNode;
}

const stats: Stat[] = [
  {
    value: "89%",
    label: "Success Rate",
    comparison: "vs 12% industry average",
    icon: <TrendingUp className="w-6 h-6" />,
  },
  {
    value: "21 Days",
    label: "Average Hire Time",
    comparison: "vs 4.5 months traditional",
    icon: <Zap className="w-6 h-6" />,
  },
  {
    value: "1,247",
    label: "Candidates Processed",
    comparison: "and counting",
    icon: <Users className="w-6 h-6" />,
  },
  {
    value: "8,923",
    label: "Matches Generated",
    comparison: "89% success rate",
    icon: <Target className="w-6 h-6" />,
  },
  {
    value: "2,847",
    label: "Companies Scanned",
    comparison: "real-time matching",
    icon: <CheckCircle2 className="w-6 h-6" />,
  },
  {
    value: "342",
    label: "Learning Paths Active",
    comparison: "personalized for each user",
    icon: <TrendingUp className="w-6 h-6" />,
  },
];

export function SocialProof() {
  return (
    <section className="py-24 px-4 sm:px-6 md:px-8 lg:px-16 bg-black text-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-black leading-tight mb-4">
            Join 1,247 Candidates
            <span className="block bg-cyan-400 text-black px-4 inline-block mt-2">
              Who Got Hired Faster
            </span>
          </h2>
          <p className="font-mono text-lg text-gray-300 max-w-2xl mx-auto">
            Real results from real people using the neural career system
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="border-4 border-cyan-400 bg-black p-6 hover:shadow-[12px_12px_0px_rgba(6,182,212,0.5)] transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, rotate: 1 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-cyan-400 text-black p-2">{stat.icon}</div>
                <div className="text-3xl font-black text-cyan-400">{stat.value}</div>
              </div>
              <div className="font-black text-lg uppercase tracking-tight mb-2">
                {stat.label}
              </div>
              {stat.comparison && (
                <div className="font-mono text-sm text-gray-300">
                  {stat.comparison}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Testimonials Section */}
        <motion.div
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          {[
            {
              quote: "I got hired in 18 days. The system understood me better than I understood myself.",
              author: "Sarah",
              role: "Software Engineer",
              company: "FAANG",
            },
            {
              quote: "The learning paths were spot-on. I landed my dream job at a top tech company.",
              author: "John",
              role: "Data Scientist",
              company: "Tech Startup",
            },
            {
              quote: "Finally, a system that sees the human behind the resume.",
              author: "Maria",
              role: "Product Manager",
              company: "Fortune 500",
            },
          ].map((testimonial, index) => (
            <motion.div
              key={index}
              className="border-2 border-cyan-400 bg-gray-900 p-6"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 + index * 0.1 }}
            >
              <div className="text-cyan-400 text-4xl mb-4">"</div>
              <p className="font-mono text-sm text-gray-300 mb-4 leading-relaxed">
                {testimonial.quote}
              </p>
              <div className="border-t border-cyan-400 pt-4">
                <div className="font-black text-white">{testimonial.author}</div>
                <div className="font-mono text-xs text-gray-400">
                  {testimonial.role} at {testimonial.company}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}


