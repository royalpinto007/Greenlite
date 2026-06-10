import { useState, useMemo } from "react";
import { useStore } from "../store";
import { useGlobalSearch } from "../search";
import { ApprovalRow } from "../components/ApprovalRow";
import { ApprovalDetailPane } from "../components/ApprovalDetailPane";
import { PageHeader } from "../components/primitives";
import { cx } from "../lib/format";
import type { Approval } from "../types";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "high", label: "High risk" },
  { key: "refund", label: "Refunds" },
  { key: "reply", label: "Replies" },
  { key: "budget", label: "Budget" },
  { key: "context", label: "Needs context" },
] as const;

const SORTS = [
  { key: "newest", label: "Newest" },
  { key: "risk", label: "Highest risk" },
  { key: "amount", label: "Largest amount" },
] as const;

const RISK_ORDER = { high: 0, medium: 1, low: 2 };

export function Approvals() {
  const approvals = useStore((s) => s.approvals);
  const selectedId = useStore((s) => s.selectedId);
  const select = useStore((s) => s.select);
  const { query } = useGlobalSearch();

  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("all");
  const [sort, setSort] = useState<(typeof SORTS)[number]["key"]>("newest");

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = approvals.filter((a) => {
      if (filter === "high") return a.risk === "high";
      if (filter === "context") return a.needsContext;
      if (filter !== "all") return a.type === filter;
      return true;
    });
    if (q) {
      out = out.filter((a) =>
        [a.agent, a.title, a.object, a.customer, a.policyTrigger]
          .filter(Boolean)
          .some((v) => (v as string).toLowerCase().includes(q)),
      );
    }
    out = [...out].sort((a, b) => {
      if (sort === "risk") return RISK_ORDER[a.risk] - RISK_ORDER[b.risk];
      if (sort === "amount") return (b.amount ?? -1) - (a.amount ?? -1);
      return b.createdAt - a.createdAt;
    });
    return out;
  }, [approvals, filter, sort, query]);

  // Keep a valid selection within the visible list.
  const selected: Approval | null =
    approvals.find((a) => a.id === selectedId) ?? list[0] ?? null;

  return (
    <div className="flex h-[calc(100vh-108px)] flex-col">
      <PageHeader
        title="Approvals"
        subtitle="Review and decide on every action an agent can't safely run alone."
      />

      {/* Filter + sort row */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cx(
                "rounded-lg border px-2.5 py-1.5 text-[12.5px] font-medium transition",
                filter === f.key
                  ? "border-brand/50 bg-brand/14 text-txt"
                  : "border-ink-700 bg-ink-850 text-txt-dim hover:border-brand/30 hover:text-txt",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-[12.5px]">
          <span className="text-txt-faint">Sort</span>
          {SORTS.map((s) => (
            <button
              key={s.key}
              onClick={() => setSort(s.key)}
              className={cx(
                "rounded-md px-2 py-1 font-medium transition",
                sort === s.key
                  ? "bg-ink-700 text-txt"
                  : "text-txt-dim hover:text-txt",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Split pane */}
      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(320px,380px)_1fr]">
        <div className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-ink-700 bg-ink-900">
          <div className="flex items-center justify-between border-b border-ink-700 px-3.5 py-2.5">
            <span className="text-[13px] font-semibold">
              Queue{" "}
              <span className="text-txt-faint">({list.length})</span>
            </span>
          </div>
          <div className="min-h-0 flex-1 divide-y divide-ink-800 overflow-y-auto">
            {list.length === 0 ? (
              <p className="p-6 text-center text-[13px] text-txt-faint">
                Nothing matches these filters.
              </p>
            ) : (
              list.map((a) => (
                <ApprovalRow
                  key={a.id}
                  a={a}
                  selected={selected?.id === a.id}
                  onSelect={() => select(a.id)}
                />
              ))
            )}
          </div>
        </div>

        <div className="min-h-0 overflow-hidden rounded-xl border border-ink-700 bg-ink-900">
          <ApprovalDetailPane approval={selected} />
        </div>
      </div>
    </div>
  );
}
