"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Guard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      const next = encodeURIComponent(window.location.pathname);
      router.replace(`/login?next=${next}`);
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center">
        <div className="font-mono text-sm">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return null;
}


