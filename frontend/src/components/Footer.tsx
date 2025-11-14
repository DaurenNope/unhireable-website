"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t-4 border-black bg-white px-8 md:px-16 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-sm font-mono">
        <div>
          <motion.div
            className="text-xl font-black mb-3"
            whileHover={{ scale: 1.05 }}
          >
            <Link href="/">UNHIREABLE</Link>
          </motion.div>
          <p className="text-gray-600 leading-relaxed">
            Autonomous job search system. Assessment now, desktop agent next.
          </p>
        </div>
        <div className="space-y-2">
          <div className="font-black mb-2 uppercase tracking-wider">Product</div>
          <Link href="/demo" className="block hover:text-cyan-400 transition-colors">
            Assessment
          </Link>
          <Link href="/results" className="block hover:text-cyan-400 transition-colors">
            Results
          </Link>
          <Link href="/resume" className="block hover:text-cyan-400 transition-colors">
            Resume Lab
          </Link>
          <Link href="/waitlist" className="block hover:text-cyan-400 transition-colors">
            Waitlist
          </Link>
        </div>
        <div className="space-y-2">
          <div className="font-black mb-2 uppercase tracking-wider">Connect</div>
          <a
            href="mailto:hello@unhireable.ai"
            className="block hover:text-cyan-400 transition-colors"
          >
            Contact
          </a>
          <a
            href="https://twitter.com/unhireable"
            target="_blank"
            rel="noopener noreferrer"
            className="block hover:text-cyan-400 transition-colors"
          >
            𝕏 Twitter
          </a>
          <a
            href="https://linkedin.com/company/unhireable"
            target="_blank"
            rel="noopener noreferrer"
            className="block hover:text-cyan-400 transition-colors"
          >
            LinkedIn
          </a>
          <div className="text-gray-500 text-xs mt-4">
            © 2024 Unhireable
          </div>
        </div>
      </div>
    </footer>
  );
}

