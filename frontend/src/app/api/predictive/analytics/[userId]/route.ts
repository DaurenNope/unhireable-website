import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const targetRole = searchParams.get("target_role") || undefined;
    const targetRoles = searchParams.get("target_roles") || undefined;

    const url = new URL(`${BACKEND_URL}/api/predictive/analytics/${userId}`);
    if (targetRole) url.searchParams.set("target_role", targetRole);
    if (targetRoles) url.searchParams.set("target_roles", targetRoles);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend predictive analytics error:", errorText);
      return NextResponse.json(
        { error: "Failed to load predictive analytics", details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Predictive analytics route error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

