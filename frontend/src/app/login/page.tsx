"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

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
        setError("Invalid email or password");
        setLoading(null);
      } else if (result?.ok) {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError("Login failed. Please try again.");
      setLoading(null);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-gray-50 text-black flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 font-black text-2xl tracking-tight">
            <span className="bg-black text-white px-2">UN</span>
            <span className="text-black">HIREABLE</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="p-6">
            <div className="grid gap-3 text-sm">
              <button
                type="button"
                disabled={!!loading}
                onClick={async () => {
                  setLoading("google");
                  await signIn("google", { callbackUrl });
                }}
                className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 31.7 29.3 35 24 35c-7 0-12.8-5.8-12.8-12.8S17 9.5 24 9.5c3.3 0 6.3 1.2 8.6 3.2l5.7-5.7C34.4 3.1 29.5 1 24 1 11.9 1 2 10.9 2 23s9.9 22 22 22 22-9.9 22-22c0-1.7-.2-3.3-.4-4.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 18.9 13.5 24 13.5c3.3 0 6.3 1.2 8.6 3.2l5.7-5.7C34.4 3.1 29.5 1 24 1 15.3 1 7.7 5.6 3.2 12.2l3.1 2.5z"/><path fill="#4CAF50" d="M24 45c5.2 0 10-1.9 13.7-5.1l-6.3-5.2c-2.1 1.4-4.8 2.3-7.5 2.3-5.2 0-9.6-3.3-11.2-7.9l-6.6 5.1C8.8 40.5 15.9 45 24 45z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.7 3.7-5.8 6.5-11.3 6.5-6.2 0-11.5-4.3-12.7-10l-6.6 5.1C8.8 40.5 15.9 45 24 45c12.1 0 22-9.9 22-22 0-1.7-.2-3.3-.4-4.5z"/></svg>
                {loading === "google" ? "Signing in..." : "Continue with Google"}
              </button>
              <button
                type="button"
                disabled={!!loading}
                onClick={async () => {
                  setLoading("github");
                  await signIn("github", { callbackUrl });
                }}
                className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {loading === "github" ? "Signing in..." : "Continue with GitHub"}
              </button>
              
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-gray-500">or use your email</span>
                </div>
              </div>

              <form onSubmit={handleCredentialsLogin} className="space-y-3">
                <div className="grid gap-2">
                  <label className="text-sm text-gray-700">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    required
                    disabled={!!loading}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm text-gray-700">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={!!loading}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50"
                  />
                </div>
                {error && <div className="text-red-600 text-xs">{error}</div>}
                <button
                  type="submit"
                  disabled={!!loading}
                  className="w-full inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-white text-sm font-semibold hover:bg-gray-900 transition-colors disabled:opacity-50"
                >
                  {loading === "credentials" ? "Signing in..." : "Sign in"}
                </button>
              </form>
            </div>
          </div>

          <div className="px-6 py-4 text-center text-xs text-gray-600">
            Don't have an account?{" "}
            <Link className="underline" href="/register">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-br from-white to-gray-50 text-black flex items-center justify-center p-6">
        <div className="text-center">Loading...</div>
      </main>
    }>
      <LoginForm />
    </Suspense>
  );
}


