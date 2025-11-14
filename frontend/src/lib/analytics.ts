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
  | { type: "learning_resource_open"; pathId: string | number; resourceId: string | number }
  | { type: "resume_download"; format?: string }
  | { type: "resume_builder_start" }
  | { type: "resume_section_complete"; section: string }
  | { type: "assessment_start"; userId: string; assessment_id?: string | number }
  | { type: "assessment_complete"; userId: string; assessment_id?: string | number }
  | { type: "question_asked"; questionId?: string | number }
  | { type: "cohort_created"; cohortId?: string | number }
  | { type: "cohort_joined"; cohortId?: string | number; cohort_id?: string | number }
  | { type: "squad_created"; squadId?: string | number }
  | { type: "squad_joined"; squadId?: string | number; squad_id?: string | number }
  | { type: "question_upvoted"; userId?: string | number }
  | { type: "answer_added"; userId?: string | number }
  | { type: "page_view"; path: string }
  | { type: "user_action"; action: string; metadata?: Record<string, any> };

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


