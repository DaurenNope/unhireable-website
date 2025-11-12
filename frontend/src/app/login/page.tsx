"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Lock, AlertCircle } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || searchParams.get("next") || "/";
  const [loading, setLoading] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading("credentials");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        console.error("Login error:", result.error);
        setError(result.error === "CredentialsSignin" ? "Invalid email or password" : result.error);
        setLoading(null);
      } else if (result?.ok) {
        router.push(callbackUrl);
        router.refresh();
      } else {
        console.error("Login failed: No error or success", result);
        setError("Login failed. Please try again.");
        setLoading(null);
      }
    } catch (err) {
      setError("Login failed. Please try again.");
      setLoading(null);
    }
  };

  const handleOAuthLogin = async (provider: string) => {
    setError("");
    setLoading(provider);
    try {
      await signIn(provider, { callbackUrl });
    } catch (err) {
      setError(`Failed to sign in with ${provider}`);
      setLoading(null);
    }
  };

  return (
    <main className="min-h-screen bg-white text-black flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 -left-48 w-96 h-96 bg-black rounded-full blur-3xl opacity-5" />
        <div className="absolute bottom-0 -right-48 w-96 h-96 bg-cyan-400 rounded-full blur-3xl opacity-5" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center"
        >
          <Link href="/" className="inline-block">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 font-black text-3xl sm:text-4xl tracking-tighter"
            >
              <span className="bg-black text-white px-2 sm:px-3">UN</span>
              <span className="text-black">HIREABLE</span>
            </motion.div>
            <div className="text-[8px] sm:text-[9px] font-mono mt-1 text-gray-500">
              //neural career system
            </div>
          </Link>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="border-4 border-black bg-white relative"
        >
          {/* Top accent */}
          <div className="h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
          
          <div className="p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-black mb-2">SIGN IN</h1>
            <p className="font-mono text-xs sm:text-sm text-gray-600 mb-6">
              {"\u003e"} Access your career dashboard
            </p>

            {/* OAuth Buttons */}
            <div className="grid gap-3 mb-6">
              <motion.button
                type="button"
                disabled={!!loading}
                onClick={() => handleOAuthLogin("google")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full border-2 border-black bg-white text-black px-4 py-3 font-black text-xs sm:text-sm uppercase tracking-tight hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading === "google" ? (
                  <>LOADING...</>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 31.7 29.3 35 24 35c-7 0-12.8-5.8-12.8-12.8S17 9.5 24 9.5c3.3 0 6.3 1.2 8.6 3.2l5.7-5.7C34.4 3.1 29.5 1 24 1 11.9 1 2 10.9 2 23s9.9 22 22 22 22-9.9 22-22c0-1.7-.2-3.3-.4-4.5z"/>
                      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 18.9 13.5 24 13.5c3.3 0 6.3 1.2 8.6 3.2l5.7-5.7C34.4 3.1 29.5 1 24 1 15.3 1 7.7 5.6 3.2 12.2l3.1 2.5z"/>
                      <path fill="#4CAF50" d="M24 45c5.2 0 10-1.9 13.7-5.1l-6.3-5.2c-2.1 1.4-4.8 2.3-7.5 2.3-5.2 0-9.6-3.3-11.2-7.9l-6.6 5.1C8.8 40.5 15.9 45 24 45z"/>
                      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.7 3.7-5.8 6.5-11.3 6.5-6.2 0-11.5-4.3-12.7-10l-6.6 5.1C8.8 40.5 15.9 45 24 45c12.1 0 22-9.9 22-22 0-1.7-.2-3.3-.4-4.5z"/>
                    </svg>
                    CONTINUE WITH GOOGLE
                  </>
                )}
              </motion.button>

              <motion.button
                type="button"
                disabled={!!loading}
                onClick={() => handleOAuthLogin("github")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full border-2 border-black bg-white text-black px-4 py-3 font-black text-xs sm:text-sm uppercase tracking-tight hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading === "github" ? "LOADING..." : "CONTINUE WITH GITHUB"}
              </motion.button>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-black" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 font-mono text-xs text-gray-500">OR</span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleCredentialsLogin} className="space-y-4">
              <div>
                <label className="block font-mono text-xs font-black mb-2 uppercase tracking-tight">
                  EMAIL
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    required
                    disabled={!!loading}
                    className="w-full border-2 border-black bg-white px-10 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs font-black mb-2 uppercase tracking-tight">
                  PASSWORD
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={!!loading}
                    className="w-full border-2 border-black bg-white px-10 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 disabled:opacity-50"
                  />
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-2 border-red-500 bg-red-50 p-3 flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="font-mono text-xs text-red-600">{error}</span>
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={!!loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="w-full border-4 border-black bg-cyan-400 text-black px-4 py-3 font-black text-sm uppercase tracking-tight hover:bg-black hover:text-cyan-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading === "credentials" ? (
                  "SIGNING IN..."
                ) : (
                  <>
                    SIGN IN
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>

        {/* Register Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 text-center"
        >
          <p className="font-mono text-xs text-gray-600">
            Don't have an account?{" "}
            <Link href="/register" className="font-black text-black underline hover:text-cyan-400">
              SIGN UP
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-white text-black flex items-center justify-center">
        <div className="font-mono text-sm">Loading...</div>
      </main>
    }>
      <LoginForm />
    </Suspense>
  );
}
