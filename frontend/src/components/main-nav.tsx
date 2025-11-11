"use client";

import Link from "next/link";
import {
  Home,
  FileText,
  Settings,
  User,
  Bell,
  Search,
  Menu,
} from "lucide-react";
import { motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";

export function MainNav() {
  const { data: session } = useSession();

  return (
    <header className="bg-black/90 backdrop-blur-sm border-b border-neutral-800 sticky top-0 z-50 px-4 py-3">
      <div className="container mx-auto flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500 rounded-full w-2 h-2 flex items-center justify-center">
              <span className="text-white font-bold text-xs">UN</span>
            </div>
            <div className="bg-white rounded-full p-1">
              <span className="text-black font-bold text-xs">HIREABLE</span>
            </div>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center space-x-6">
          <Link
            href="/"
            className="text-white/90 hover:text-white transition-colors flex items-center px-3 py-2 rounded-lg border border-neutral-700 hover:bg-neutral-800 hover:border-white motion-safe-hover:scale-105"
          >
            <Home className="mr-2 h-4" />
            Dashboard
          </Link>
          
          <Link
            href="/matches"
            className="text-white/90 hover:text-white transition-colors flex items-center px-3 py-2 rounded-lg border border-neutral-700 hover:bg-neutral-800 hover:border-white motion-safe-hover:scale-105"
          >
            <Search className="mr-2 h-4" />
            Matches
          </Link>
          
          <Link
            href="/demo"
            className="text-white/90 hover:text-white transition-colors flex items-center px-3 py-2 rounded-lg border border-neutral-700 hover:bg-neutral-800 hover:border-white motion-safe-hover:scale-105"
          >
            <FileText className="mr-2 h-4" />
            Assessment
          </Link>
          
          <Link
            href="/learning-paths"
            className="text-white/90 hover:text-white transition-colors flex items-center px-3 py-2 rounded-lg border border-neutral-700 hover:bg-neutral-800 hover:border-white motion-safe-hover:scale-105"
          >
            <FileText className="mr-2 h-4" />
            Learning
          </Link>
          
          <Link
            href="/resume"
            className="text-white/90 hover:text-white transition-colors flex items-center px-3 py-2 rounded-lg border border-neutral-700 hover:bg-neutral-800 hover:border-white motion-safe-hover:scale-105"
          >
            <FileText className="mr-2 h-4" />
            Resume
          </Link>
        </nav>

        {/* User Menu */}
        <div className="flex items-center space-x-4">
          {session?.user ? (
            <div className="flex items-center space-x-3">
              <span className="text-white/90 text-sm">
                {session.user.email || session.user.name}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-white/90 hover:text-white transition-colors px-3 py-2 rounded-lg border border-neutral-700 hover:bg-neutral-800"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-cyan-400 hover:text-cyan-300 transition-colors px-4 py-2 rounded-lg border border-cyan-400 hover:bg-cyan-400 hover:text-black font-medium"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default MainNav;
