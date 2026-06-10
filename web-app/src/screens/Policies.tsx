import { useState } from "react";
import { useStore } from "../store";
import { PageHeader } from "../components/primitives";
import { RiskBadge } from "../components/Badges";
import { cx } from "../lib/format";
import type { PolicyCategory, Policy } from "../types";

const CATEGORIES: PolicyCategory[] = [
  "Refunds",
  "Customer replies",
  "Budget shifts",
  "Account changes",
  "High-risk sentiment",
];

// Admin policy editor: category rail on the left, editable policy cards on the
// right. Toggles and thresholds write straight to the store.
export function Policies() {
  const policies = useStore((s) => s.policies);
  const [cat, setCat] = useState<PolicyCategory | "all">("all");

  const shown =
    cat === "all" ? policies : policies.filter((p) => p.category === cat);
  const enabledCount = policies.filter((p) => p.enabled).length;

  return (
    <div>
      <PageHeader
        title="Policies"
        subtitle="Define what agents may do on their own, and what always needs a human."
        actions={
          <span className="self-center rounded-lg border border-ink-700 bg-ink-850 px-3 py-2 text-[13px] text-txt-dim">
            <span className="font-semibold text-txt">{enabledCount}</span> of{" "}
            {policies.length} active
          </span>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[200px_1fr]">
        {/* Category rail */}
        <aside className="flex flex-row flex-wrap gap-1.5 lg:flex-col">
          <CatButton
            active={cat === "all"}
            onClick={() => setCat("all")}
            label="All policies"
            count={policies.length}
          />
          {CATEGORIES.map((c) => (
            <CatButton
              key={c}
              active={cat === c}
              onClick={() => setCat(c)}
              label={c}
              count={policies.filter((p) => p.category === c).length}
            />
          ))}
        </aside>

        {/* Editor cards */}
        <div className="grid gap-3 sm:grid-cols-2">
          {shown.map((p) => (
            <PolicyCard key={p.id} policy={p} />
          ))}
          {shown.length === 0 && (
            <p className="text-[13px] text-txt-faint">
              No policies in this category yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function CatButton({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={cx(
        "flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-[13px] font-medium transition lg:w-full",
        active
          ? "border-brand/50 bg-brand/14 text-txt"
          : "border-ink-700 bg-ink-850 text-txt-dim hover:border-brand/30 hover:text-txt lg:border-transparent lg:bg-transparent",
      )}
    >
      <span>{label}</span>
      <span className="text-2xs text-txt-faint">{count}</span>
    </button>
  );
}

function PolicyCard({ policy: p }: { policy: Policy }) {
  const toggle = useStore((s) => s.togglePolicy);
  const setThreshold = useStore((s) => s.setThreshold);

  return (
    <div
      className={cx(
        "flex flex-col rounded-xl border bg-gradient-to-b from-ink-800 to-ink-850 p-4 shadow-card transition",
        p.enabled ? "border-ink-700" : "border-ink-800 opacity-75",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-[14.5px] font-semibold tracking-tight">
              {p.title}
            </h3>
          </div>
          <p className="mt-1 text-[13px] leading-relaxed text-txt-dim">
            {p.description}
          </p>
        </div>
        <Toggle on={p.enabled} onClick={() => toggle(p.id)} />
      </div>

      {p.threshold != null && (
        <div className="mt-3.5 rounded-lg border border-ink-700 bg-ink-900/50 p-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-txt-faint">Threshold</span>
            <span className="font-semibold tabular-nums text-txt">
              {p.thresholdUnit === "$" ? "$" : ""}
              {p.threshold}
              {p.thresholdUnit === "%"
                ? "%"
                : p.thresholdUnit === "min"
                  ? " min"
                  : ""}
            </span>
          </div>
          <input
            type="range"
            min={p.thresholdUnit === "$" ? 0 : 0}
            max={p.thresholdUnit === "$" ? 1000 : 100}
            step={p.thresholdUnit === "$" ? 10 : 5}
            value={p.threshold}
            onChange={(e) => setThreshold(p.id, Number(e.target.value))}
            disabled={!p.enabled}
            className="mt-2 w-full accent-brand"
          />
        </div>
      )}

      <div className="mt-auto flex items-center justify-between gap-2 pt-3.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <RiskBadge risk={p.risk} sm />
          {p.agents.map((a) => (
            <span
              key={a}
              className="rounded bg-ink-700/70 px-1.5 py-0.5 text-2xs font-medium text-txt-dim"
            >
              {a}
            </span>
          ))}
        </div>
        <span className="shrink-0 text-2xs text-txt-faint">
          edited {p.lastEdited}
        </span>
      </div>
    </div>
  );
}

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      role="switch"
      aria-checked={on}
      className={cx(
        "relative h-6 w-11 shrink-0 rounded-full border transition",
        on ? "border-brand bg-brand/80" : "border-ink-600 bg-ink-700",
      )}
    >
      <span
        className={cx(
          "absolute top-0.5 h-4.5 w-4.5 rounded-full bg-white transition-all",
          on ? "left-[22px]" : "left-0.5",
        )}
        style={{ height: 18, width: 18 }}
      />
    </button>
  );
}
