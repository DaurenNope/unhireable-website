import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!BACKEND_URL) {
      return NextResponse.json(
        { error: "Backend URL not configured" },
        { status: 500 }
      );
    }
    
    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    
    const data = await res.json().catch(() => ({ error: "Failed to parse response" }));
    
    if (!res.ok) {
      console.error("Backend login error:", res.status, data);
    }
    
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Login route error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}


