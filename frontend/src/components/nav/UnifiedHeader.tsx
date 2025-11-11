"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Home, Search, FileText, BookOpen, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function UnifiedHeader() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLoading = status === "loading";
  const isAuthenticated = !!session;

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/matches", label: "Matches", icon: Search },
    { href: "/demo", label: "Assessment", icon: FileText },
    { href: "/learning-paths", label: "Learning", icon: BookOpen },
    { href: "/resume", label: "Resume", icon: FileText },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b-2 border-black">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 border-2 border-black hover:bg-black hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Desktop Navigation Links - Left Side */}
          <nav className="hidden md:flex items-center gap-2 flex-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    px-3 py-2 font-mono text-sm border-2 border-black transition-all
                    flex items-center gap-2
                    ${
                      active
                        ? "bg-black text-white"
                        : "bg-white text-black hover:bg-black hover:text-white"
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logo and Auth - Right Side */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Logo */}
            <Link
              href="/"
              className="font-black tracking-tighter text-right hover:opacity-80 transition-opacity"
            >
              <div className="text-xl md:text-2xl lg:text-3xl">
                <span className="bg-black text-white px-1 md:px-2">UN</span>
                <span className="text-black">HIREABLE</span>
              </div>
              <div className="text-xs font-mono mt-0.5 text-gray-600 hidden sm:block">
                //neural career system
              </div>
            </Link>

            {/* Auth Menu - Desktop */}
            <div className="hidden md:flex items-center gap-2">
              {isLoading ? (
                <div className="px-3 py-1 border-2 border-black bg-white text-black font-mono text-sm">
                  Loading...
                </div>
              ) : isAuthenticated ? (
                <>
                  <div className="px-3 py-1 border-2 border-black bg-white text-black font-mono text-sm">
                    {session.user?.email || session.user?.name}
                  </div>
                  <Link
                    href="/account"
                    className="px-3 py-1 border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-colors font-mono text-sm"
                  >
                    Account
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="px-3 py-1 border-2 border-black bg-black text-white hover:bg-white hover:text-black transition-colors font-mono text-sm"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => signIn("google")}
                    className="px-3 py-1 border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-colors font-mono text-sm hidden lg:inline-block"
                  >
                    Google
                  </button>
                  <button
                    onClick={() => signIn("github")}
                    className="px-3 py-1 border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-colors font-mono text-sm hidden lg:inline-block"
                  >
                    GitHub
                  </button>
                  <Link
                    href="/login"
                    className="px-3 py-1 border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-colors font-mono text-sm"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-3 py-1 border-2 border-black bg-cyan-400 text-black hover:bg-black hover:text-cyan-400 transition-colors font-mono text-sm"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Auth Menu - Mobile (simplified) */}
            <div className="md:hidden">
              {isLoading ? (
                <div className="px-2 py-1 border-2 border-black bg-white text-black font-mono text-xs">
                  ...
                </div>
              ) : isAuthenticated ? (
                <Link
                  href="/account"
                  className="px-2 py-1 border-2 border-black bg-black text-white font-mono text-xs"
                >
                  Account
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="px-2 py-1 border-2 border-black bg-black text-white font-mono text-xs"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t-2 border-black bg-white"
            >
              <nav className="py-4 space-y-2">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`
                        block px-4 py-2 font-mono text-sm border-2 border-black transition-all
                        flex items-center gap-2
                        ${
                          active
                            ? "bg-black text-white"
                            : "bg-white text-black hover:bg-black hover:text-white"
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
                {!isAuthenticated && (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-2 font-mono text-sm border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-all"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-2 font-mono text-sm border-2 border-black bg-cyan-400 text-black hover:bg-black hover:text-cyan-400 transition-all"
                    >
                      Register
                    </Link>
                  </>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

