"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const socialLinks = [
  { 
    name: "𝕏", 
    href: "https://twitter.com/unhireable",
    label: "Twitter"
  },
  { 
    name: "in", 
    href: "https://linkedin.com/company/unhireable",
    label: "LinkedIn"
  },
  { 
    name: "📷", 
    href: "https://instagram.com/unhireable",
    label: "Instagram"
  }
];

export function Footer() {
  return (
    <footer className="relative py-8 px-4 sm:px-6 md:px-8 lg:px-16 bg-black text-white border-t-4 border-black">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4">
          {/* Logo */}
          <motion.div
            className="text-xl sm:text-2xl font-black tracking-tighter"
            whileHover={{ scale: 1.05 }}
          >
            <Link href="/">
              <span className="bg-white text-black px-2">UN</span>
              <span className="text-white">HIREABLE</span>
            </Link>
          </motion.div>
          
          {/* Social Media Icons */}
          <div className="flex items-center gap-3">
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white text-black border-2 border-white flex items-center justify-center text-base font-black hover:bg-gray-200 hover:text-black transition-all duration-300"
                whileHover={{ scale: 1.15, rotate: 12 }}
                whileTap={{ scale: 0.95 }}
                title={social.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {social.name}
              </motion.a>
            ))}
          </div>
          
          {/* Copyright */}
          <motion.div
            className="font-mono text-xs sm:text-sm text-white/80"
            whileHover={{ scale: 1.05 }}
          >
            © 2024 // NEURAL CAREER SYNTHESIS
          </motion.div>
        </div>
      </div>
    </footer>
  );
}

