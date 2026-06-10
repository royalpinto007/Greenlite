import { useState, useMemo } from "react";
import { useStore } from "../store";
import { useGlobalSearch } from "../search";
import { PageHeader, Drawer } from "../components/primitives";
import { StatusBadge, RiskBadge } from "../components/Badges";
import { clockTime, relTime, cx } from "../lib/format";
import type { ActivityEntry } from "../types";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "auto-run", label: "Auto-run" },
  { key: "approved", label: "Human-approved" },
  { key: "edited", label: "Edited" },
  { key: "denied", label: "Denied" },
  { key: "failed", label: "Failed" },
] as const;

// Audit log, table-first. Each row opens a side drawer with the full record.
export function Activity() {
  const activity = useStore((s) => s.activity);
  const { query } = useGlobalSearch();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("all");
  const [drawer, setDrawer] = useState<ActivityEntry | null>(null);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return activity
      .filter((e) => (filter === "all" ? true : e.status === filter))
      .filter((e) =>
        q
          ? [e.agent, e.action, e.object, e.details]
              .join(" ")
              .toLowerCase()
              .includes(q)
          : true,
      );
  }, [activity, filter, query]);

  return (
    <div>
      <PageHeader
        title="Activity"
        subtitle="A full audit trail of every agent action: what ran, who approved it, and why."
      />

      <div className="mb-3 flex flex-wrap gap-1.5">
        {FILTERS.map((f) => {
          const count =
            f.key === "all"
              ? activity.length
              : activity.filter((e) => e.status === f.key).length;
          return (
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
              {f.label}{" "}
              <span className="text-txt-faint">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-xl border border-ink-700 bg-ink-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-ink-700 text-2xs uppercase tracking-wider text-txt-faint">
                <th className="px-4 py-2.5 font-medium">Time</th>
                <th className="px-4 py-2.5 font-medium">Agent</th>
                <th className="px-4 py-2.5 font-medium">Action</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 font-medium">Approved by</th>
                <th className="px-4 py-2.5 font-medium">Risk</th>
                <th className="px-4 py-2.5 font-medium">Object</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-800">
              {rows.map((e) => (
                <tr
                  key={e.id}
                  onClick={() => setDrawer(e)}
                  className="cursor-pointer transition hover:bg-ink-800"
                >
                  <td className="whitespace-nowrap px-4 py-3 text-txt-dim">
                    {clockTime(e.time)}
                    <span className="ml-1.5 text-2xs text-txt-faint">
                      {relTime(e.time)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className="rounded bg-ink-700/70 px-1.5 py-0.5 text-2xs font-semibold text-txt-dim">
                      {e.agent}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-txt">{e.action}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={e.status} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-txt-dim">
                    {e.approvedBy}
                  </td>
                  <td className="px-4 py-3">
                    <RiskBadge risk={e.risk} sm />
                  </td>
                  <td className="max-w-[180px] truncate px-4 py-3 text-txt-faint">
                    {e.object}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-txt-faint"
                  >
                    No activity matches these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Drawer
        open={!!drawer}
        onClose={() => setDrawer(null)}
        title="Audit record"
      >
        {drawer && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-ink-700/70 px-1.5 py-0.5 text-2xs font-semibold text-txt-dim">
                  {drawer.agent}
                </span>
                <StatusBadge status={drawer.status} />
                <RiskBadge risk={drawer.risk} sm />
              </div>
              <h3 className="mt-2.5 text-[17px] font-bold leading-snug">
                {drawer.action}
              </h3>
            </div>
            <DrawerRow label="Object" value={drawer.object} />
            <DrawerRow label="Approved by" value={drawer.approvedBy} />
            <DrawerRow
              label="Time"
              value={`${clockTime(drawer.time)} · ${relTime(drawer.time)}`}
            />
            <div>
              <div className="text-2xs uppercase tracking-wider text-txt-faint">
                Details
              </div>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-txt-dim">
                {drawer.details}
              </p>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}

function DrawerRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-ink-800 pb-2.5 text-[13px]">
      <span className="text-txt-faint">{label}</span>
      <span className="text-right font-medium text-txt">{value}</span>
    </div>
  );
}
