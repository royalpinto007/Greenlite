import { createClient } from "@supabase/supabase-js";
import { CONFIG, isConfigured } from "./config";

export interface Approval {
  id: string;
  source: string; // which agent produced this (e.g. "resolvd")
  title: string;
  detail: string;
  proposedAction: string;
  reason: string | null;
  createdAt: string;
}

const supabase = isConfigured()
  ? createClient(CONFIG.supabaseUrl, CONFIG.supabaseAnonKey, {
      auth: { persistSession: false },
    })
  : null;

// Pending approvals = escalated tickets across the agent suite. Today that is
// Resolvd's escalations (rv_tickets where status=escalated); the same shape
// extends to other agents as they add escalation rows.
export async function fetchApprovals(): Promise<Approval[]> {
  if (!supabase) return SAMPLE;
  const { data, error } = await supabase
    .from("rv_tickets")
    .select("id, subject, body, proposed_action, reason, created_at")
    .eq("status", "escalated")
    .order("created_at", { ascending: false })
    .limit(50);
  if (error || !data) return [];
  return data.map((t) => ({
    id: t.id as string,
    source: "resolvd",
    title: (t.subject as string) || "Support ticket",
    detail: (t.body as string) ?? "",
    proposedAction: (t.proposed_action as string) ?? "",
    reason: (t.reason as string) ?? null,
    createdAt: t.created_at as string,
  }));
}

// Approve or deny. Routes back to the originating agent's approve endpoint.
export async function decide(
  approval: Approval,
  approve: boolean,
): Promise<boolean> {
  if (!CONFIG.resolvdUrl || !CONFIG.resolvdToken) {
    // Demo mode: pretend it succeeded so the UI is explorable without a backend.
    return true;
  }
  const res = await fetch(`${CONFIG.resolvdUrl}/api/approve`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-resolvd-token": CONFIG.resolvdToken,
    },
    body: JSON.stringify({ id: approval.id, approve }),
  });
  return res.ok;
}

const SAMPLE: Approval[] = [
  {
    id: "sample-1",
    source: "resolvd",
    title: "Refund request",
    detail: "I want a $900 refund now, the order never arrived.",
    proposedAction: "Approve refund of $900",
    reason: "refund $900 exceeds auto-limit $50",
    createdAt: "2026-06-08T09:00:00Z",
  },
  {
    id: "sample-2",
    source: "resolvd",
    title: "Angry customer",
    detail: "This is the worst service ever, I am furious.",
    proposedAction: "Personal apology + offer remedy",
    reason: "negative sentiment at high urgency",
    createdAt: "2026-06-08T08:30:00Z",
  },
];
