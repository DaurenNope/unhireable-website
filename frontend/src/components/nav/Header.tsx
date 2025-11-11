"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/matches", label: "MATCHES" },
    { href: "/demo", label: "TEST" },
    { href: "/learning-paths", label: "LEARN" },
    { href: "/resume", label: "RESUME" },
  ];

  const socialLinks = [
    { name: "𝕏", href: "https://twitter.com/unhireable", label: "Twitter" },
    { name: "in", href: "https://linkedin.com/company/unhireable", label: "LinkedIn" },
    { name: "📷", href: "https://instagram.com/unhireable", label: "Instagram" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-40 bg-transparent border-b border-black/10">
      <div className="relative w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2.5 md:py-3.5">
            
            {/* LEFT: Logo (mobile) + Auth + Nav + Social (desktop) */}
            <div className="flex items-center gap-2 sm:gap-3 flex-1">
              
              {/* Mobile Logo - Left side */}
              <Link 
                href="/" 
                className="md:hidden text-right group"
              >
                <div className="font-black tracking-tighter">
                  <div className="text-lg sm:text-xl leading-none">
                    <span className="bg-black text-white px-1">UN</span>
                    <span className="text-black">HIREABLE</span>
                  </div>
                  <div className="text-[8px] font-mono mt-0.5 text-gray-500">
                    //neural career system
                  </div>
                </div>
              </Link>

              {/* Desktop Auth Button - First */}
              {session ? (
                <motion.button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  whileHover={{ scale: 1.05, rotate: -1 }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden md:block px-3 py-1.5 text-[10px] sm:text-xs font-black uppercase tracking-wider border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-colors shadow-[3px_3px_0_0_rgba(0,0,0,1)] hover:shadow-[1px_1px_0_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]"
                >
                  OUT
                </motion.button>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 1 }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden md:block"
                >
                  <Link
                    href="/login"
                    className="px-3 py-1.5 text-[10px] sm:text-xs font-black uppercase tracking-wider border-2 border-cyan-400 bg-cyan-400 text-black hover:bg-black hover:text-cyan-400 transition-colors shadow-[3px_3px_0_0_rgba(6,182,212,0.8)] hover:shadow-[1px_1px_0_0_rgba(6,182,212,0.8)] hover:translate-x-[2px] hover:translate-y-[2px]"
                  >
                    LOGIN
                  </Link>
                </motion.div>
              )}

              {/* Vertical divider - subtle */}
              <div className="hidden md:block w-[1px] h-6 bg-gray-300 mx-1" />

              {/* Desktop Navigation - Staggered, rotated buttons */}
              <div className="hidden md:flex items-center gap-1.5">
                {navLinks.map((link, index) => {
                  const active = isActive(link.href);
                  const rotations = ["rotate-1", "-rotate-1", "rotate-0.5", "-rotate-0.5"];
                  const rotation = rotations[index % rotations.length];
                  const offsets = [0, -1, 1, -0.5];
                  const offset = offsets[index % offsets.length];
                  
                  return (
                    <motion.div
                      key={link.href}
                      whileHover={{ scale: 1.08, rotate: 0, zIndex: 10 }}
                      whileTap={{ scale: 0.95 }}
                      style={{ transform: `rotate(${active ? 0 : rotation}) translateY(${offset}px)` }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <Link
                        href={link.href}
                        className={`relative px-2.5 py-1.5 text-[9px] sm:text-[10px] font-black uppercase tracking-tight border-2 border-black transition-all duration-200 ${
                          active
                            ? "bg-cyan-400 text-black shadow-[3px_3px_0_0_rgba(0,0,0,1)]"
                            : "bg-white text-black hover:bg-cyan-400 shadow-[2px_2px_0_0_rgba(0,0,0,0.9)] hover:shadow-[3px_3px_0_0_rgba(0,0,0,0.9)]"
                        }`}
                      >
                        {link.label}
                        {active && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 border border-black rounded-full"
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Desktop Social Icons - Minimal squares */}
              <div className="hidden lg:flex items-center gap-1.5 ml-3 pl-3 border-l-2 border-black/10">
                {socialLinks.map((social, idx) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.15, rotate: 12 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-6 h-6 border-2 border-black bg-white text-black flex items-center justify-center text-[9px] font-black hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0_0_rgba(0,0,0,0.8)]"
                    title={social.label}
                  >
                    {social.name}
                  </motion.a>
                ))}
              </div>

              {/* Mobile Menu Button - Only on mobile */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden ml-auto p-2 border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-all"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-4 h-4" />
                ) : (
                  <Menu className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* RIGHT: Desktop Logo - Professional, clean, bold */}
            <div className="hidden md:flex items-center ml-4">
              <Link 
                href="/" 
                className="text-right group"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="font-black tracking-tighter"
                >
                  <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-none">
                    <span className="bg-black text-white px-1.5 sm:px-2">UN</span>
                    <span className="text-black">HIREABLE</span>
                  </div>
                  <div className="text-[8px] sm:text-[9px] md:text-[10px] font-mono mt-0.5 sm:mt-1 text-gray-500 group-hover:text-gray-700 transition-colors">
                    //neural career system
                  </div>
                </motion.div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Clean dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden bg-white border-t-2 border-black"
          >
            <div className="px-4 py-4 space-y-2">
              {/* Auth Button in Mobile Menu */}
              {session ? (
                <button
                  onClick={() => {
                    signOut({ callbackUrl: "/" });
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full px-4 py-3 text-sm font-black uppercase border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-all shadow-[2px_2px_0_0_rgba(0,0,0,0.8)] text-left"
                >
                  LOGOUT
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full px-4 py-3 text-sm font-black uppercase border-2 border-cyan-400 bg-cyan-400 text-black hover:bg-black hover:text-cyan-400 transition-all shadow-[2px_2px_0_0_rgba(6,182,212,0.8)] text-left"
                >
                  LOGIN
                </Link>
              )}

              {/* Navigation Links */}
              {navLinks.map((link, index) => {
                const active = isActive(link.href);
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block px-4 py-3 text-sm font-black uppercase border-2 border-black transition-all ${
                        active
                          ? "bg-cyan-400 text-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
                          : "bg-white text-black hover:bg-cyan-400 shadow-[2px_2px_0_0_rgba(0,0,0,0.8)]"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}

              {/* Mobile Social */}
              <div className="pt-3 mt-3 border-t-2 border-black">
                <div className="flex items-center gap-2 px-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-9 h-9 border-2 border-black bg-white text-black flex items-center justify-center text-sm font-black hover:bg-black hover:text-white transition-all"
                      title={social.label}
                    >
                      {social.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
