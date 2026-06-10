import { create } from "zustand";
import type {
  Approval,
  ActivityEntry,
  Agent,
  Policy,
  ApprovalStatus,
} from "./types";
import {
  seedApprovals,
  seedActivity,
  seedAgents,
  seedPolicies,
} from "./data/mock";

// Single source of truth for the console. Everything is in-memory mock state
// for now; the action signatures are intentionally close to what a Supabase
// mutation layer would expose so this can be swapped out later.

const OPERATOR = "You";

interface State {
  approvals: Approval[];
  activity: ActivityEntry[];
  agents: Agent[];
  policies: Policy[];
  selectedId: string | null;

  select: (id: string | null) => void;
  resolve: (
    id: string,
    outcome: "approved" | "denied" | "edited",
    note?: string,
  ) => void;
  togglePolicy: (id: string) => void;
  setThreshold: (id: string, value: number) => void;
}

function toActivity(
  a: Approval,
  outcome: "approved" | "denied" | "edited",
  note?: string,
): ActivityEntry {
  const detailByOutcome: Record<string, string> = {
    approved: `Approved by ${OPERATOR}. Action executed.`,
    denied: `Denied by ${OPERATOR}.`,
    edited: `Edited and approved by ${OPERATOR}.`,
  };
  return {
    id: `act_${a.id}`,
    time: Date.now(),
    agent: a.agent,
    action: a.title,
    status: outcome as ApprovalStatus,
    approvedBy: OPERATOR,
    risk: a.risk,
    object: a.object,
    details: note ? `${detailByOutcome[outcome]} ${note}` : detailByOutcome[outcome],
  };
}

export const useStore = create<State>((set) => ({
  approvals: seedApprovals,
  activity: seedActivity,
  agents: seedAgents,
  policies: seedPolicies,
  selectedId: seedApprovals[0]?.id ?? null,

  select: (id) => set({ selectedId: id }),

  resolve: (id, outcome, note) =>
    set((s) => {
      const target = s.approvals.find((a) => a.id === id);
      if (!target) return s;
      const remaining = s.approvals.filter((a) => a.id !== id);
      // Keep a selection so the detail pane never goes blank unexpectedly.
      const nextSelected =
        s.selectedId === id ? (remaining[0]?.id ?? null) : s.selectedId;
      return {
        approvals: remaining,
        activity: [toActivity(target, outcome, note), ...s.activity],
        selectedId: nextSelected,
      };
    }),

  togglePolicy: (id) =>
    set((s) => ({
      policies: s.policies.map((p) =>
        p.id === id
          ? { ...p, enabled: !p.enabled, lastEdited: "just now" }
          : p,
      ),
    })),

  setThreshold: (id, value) =>
    set((s) => ({
      policies: s.policies.map((p) =>
        p.id === id ? { ...p, threshold: value, lastEdited: "just now" } : p,
      ),
    })),
}));

// ---- Derived metrics (computed from current state) ----
export interface Metrics {
  pending: number;
  approvedToday: number;
  autoRunsToday: number;
  deniedToday: number;
  avgApprovalTime: string;
}

const DAY = 24 * 60 * 60 * 1000;

export function useMetrics(): Metrics {
  const approvals = useStore((s) => s.approvals);
  const activity = useStore((s) => s.activity);
  const since = Date.now() - DAY;
  const today = activity.filter((a) => a.time >= since);
  return {
    pending: approvals.length,
    approvedToday: today.filter(
      (a) => a.status === "approved" || a.status === "edited",
    ).length,
    autoRunsToday: today.filter((a) => a.status === "auto-run").length,
    deniedToday: today.filter((a) => a.status === "denied").length,
    avgApprovalTime: "1m 52s",
  };
}

// Per-agent pending counts, derived so Agent cards stay in sync with the queue.
export function pendingForAgent(approvals: Approval[], name: string): number {
  return approvals.filter((a) => a.agent === name).length;
}
