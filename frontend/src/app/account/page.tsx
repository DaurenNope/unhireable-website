"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login?next=/account");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-white text-black px-6 md:px-10 py-20">
        <div className="max-w-4xl mx-auto border-4 border-black bg-white p-6">
          <div className="font-mono text-sm">Loading...</div>
        </div>
      </main>
    );
  }

  if (!session) return null;

  return (
    <main className="min-h-screen bg-white text-black px-6 md:px-10 py-20">
      <div className="max-w-4xl mx-auto border-4 border-black bg-white p-6 space-y-6">
        <div>
          <h1 className="font-black text-3xl">Account</h1>
          <p className="font-mono text-sm text-gray-600">
            Manage your credentials and preferences.
          </p>
        </div>
        <div className="border-2 border-black p-4">
          <div className="font-black text-lg">Email</div>
          <div className="font-mono text-sm text-gray-700">{session.user?.email || "N/A"}</div>
        </div>
        {session.user?.name && (
          <div className="border-2 border-black p-4">
            <div className="font-black text-lg">Name</div>
            <div className="font-mono text-sm text-gray-700">{session.user.name}</div>
          </div>
        )}
        <button
          onClick={() => {
            signOut({ callbackUrl: "/" });
          }}
          className="border-4 border-black px-4 py-2 font-black bg-white hover:bg-black hover:text-cyan-400 transition-colors"
        >
          Logout
        </button>
      </div>
    </main>
  );
}


