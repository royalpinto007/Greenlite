import type { Risk, ApprovalStatus, AgentStatus } from "../types";
import { cx } from "../lib/format";

// Risk badge: green safe / amber caution / red high-risk.
export function RiskBadge({ risk, sm }: { risk: Risk; sm?: boolean }) {
  const map: Record<Risk, string> = {
    low: "text-good bg-good/12 border-good/25",
    medium: "text-warn bg-warn/12 border-warn/25",
    high: "text-bad bg-bad/12 border-bad/25",
  };
  const label: Record<Risk, string> = {
    low: "Low risk",
    medium: "Medium",
    high: "High risk",
  };
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-md border font-medium",
        sm ? "px-1.5 py-0.5 text-2xs" : "px-2 py-0.5 text-xs",
        map[risk],
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label[risk]}
    </span>
  );
}

const STATUS_STYLE: Record<string, { cls: string; label: string }> = {
  pending: { cls: "text-warn bg-warn/12 border-warn/25", label: "Pending" },
  approved: {
    cls: "text-good bg-good/12 border-good/25",
    label: "Human-approved",
  },
  edited: { cls: "text-brand-2 bg-brand/12 border-brand/30", label: "Edited" },
  denied: { cls: "text-bad bg-bad/12 border-bad/25", label: "Denied" },
  "auto-run": {
    cls: "text-txt-dim bg-ink-700/60 border-ink-600",
    label: "Auto-run",
  },
  failed: { cls: "text-bad bg-bad/10 border-bad/20", label: "Failed" },
};

export function StatusBadge({ status }: { status: ApprovalStatus }) {
  const s = STATUS_STYLE[status] ?? STATUS_STYLE.pending;
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium",
        s.cls,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {s.label}
    </span>
  );
}

export function AgentStatusDot({ status }: { status: AgentStatus }) {
  const map: Record<AgentStatus, string> = {
    active: "bg-good",
    paused: "bg-txt-faint",
    degraded: "bg-warn",
  };
  const label: Record<AgentStatus, string> = {
    active: "Active",
    paused: "Paused",
    degraded: "Degraded",
  };
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-txt-dim">
      <span
        className={cx(
          "h-2 w-2 rounded-full",
          map[status],
          status === "active" && "animate-ping2",
        )}
      />
      {label[status]}
    </span>
  );
}
