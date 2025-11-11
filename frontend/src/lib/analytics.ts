"use client";

export type AnalyticsEvent =
  | { type: "match_impression"; jobIds: string[] }
  | { type: "match_swipe"; direction: "left" | "right"; jobId: string }
  | { type: "match_save"; jobId: string }
  | { type: "match_apply"; jobId: string }
  | { type: "modal_open"; jobId: string }
  | { type: "learning_path_open"; pathId: string | number }
  | { type: "learning_path_start"; pathId: string | number }
  | { type: "learning_path_save"; pathId: string | number }
  | { type: "learning_resource_open"; pathId: string | number; resourceId: string | number };

export async function track(event: AnalyticsEvent) {
  try {
    await fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event,
        ts: Date.now(),
      }),
      keepalive: true,
    });
  } catch {
    // No-op for now
  }
}


