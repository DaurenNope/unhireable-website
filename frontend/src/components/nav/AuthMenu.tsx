"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthMenu() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const isAuthenticated = !!session;

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 text-sm font-mono">
        <span className="px-3 py-1 border-2 border-black bg-white">Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-3 text-sm font-mono">
        <button
          onClick={() => signIn("google")}
          className="border-2 border-black px-3 py-1 bg-white hover:bg-black hover:text-white transition-colors"
        >
          Sign in with Google
        </button>
        <button
          onClick={() => signIn("github")}
          className="border-2 border-black px-3 py-1 bg-white hover:bg-black hover:text-white transition-colors"
        >
          GitHub
        </button>
        <button
          onClick={() => signIn("linkedin")}
          className="border-2 border-black px-3 py-1 bg-white hover:bg-black hover:text-white transition-colors"
        >
          LinkedIn
        </button>
        <Link className="border-2 border-black px-3 py-1 hover:bg-black hover:text-white transition-colors" href="/login">
          Login
        </Link>
        <Link className="border-2 border-black px-3 py-1 bg-cyan-400 text-black hover:bg-black hover:text-cyan-400 transition-colors" href="/register">
          Register
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 text-sm font-mono">
      <span className="px-2 py-1 border-2 border-black bg-white">{session.user?.email || session.user?.name}</span>
      <Link href="/account" className="border-2 border-black px-3 py-1 hover:bg-black hover:text-white transition-colors">
        Account
      </Link>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="border-2 border-black px-3 py-1 hover:bg-black hover:text-cyan-400 transition-colors"
      >
        Logout
      </button>
    </div>
  );
}


