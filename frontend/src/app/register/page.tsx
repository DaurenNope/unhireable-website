"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading("credentials");

    try {
      // Use NextAuth credentials provider with full_name for registration
      const result = await signIn("credentials", {
        email,
        password,
        full_name: fullName,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error === "CredentialsSignin" ? "Registration failed. Email may already exist." : result.error);
        setLoading(null);
      } else if (result?.ok) {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
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
          <p className="text-sm text-gray-600 mt-2">Create your account</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="p-6">
            <div className="grid gap-3">
              <button
                type="button"
                onClick={() => signIn("google")}
                className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
              >
                Continue with Google
              </button>
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-gray-500">or use your email</span>
                </div>
              </div>

              <form onSubmit={handleRegister} className="space-y-3">
                <div className="grid gap-2">
                  <label className="text-sm text-gray-700">Full name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full Name"
                    required
                    disabled={!!loading}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50"
                  />
                </div>
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
                    minLength={6}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50"
                  />
                </div>
                {error && <div className="text-red-600 text-xs">{error}</div>}
                <button
                  type="submit"
                  disabled={!!loading}
                  className="w-full inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-white text-sm font-semibold hover:bg-gray-900 transition-colors disabled:opacity-50"
                >
                  {loading === "credentials" ? "Creating..." : "Create Account"}
                </button>
              </form>
            </div>
          </div>
          <div className="px-6 py-4 text-center text-xs text-gray-600">
            Already have an account?{" "}
            <Link className="underline" href="/login">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}


