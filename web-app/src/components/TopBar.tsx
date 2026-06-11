import { useState } from "react";
import { useStore, useMetrics } from "../store";
import { Icon } from "./icons";
import { useGlobalSearch } from "../search";
import { relTime } from "../lib/format";

// Compact top bar: global search, notifications, environment indicator, user.
export function TopBar() {
  const { query, setQuery } = useGlobalSearch();
  const { pending } = useMetrics();
  const approvals = useStore((s) => s.approvals);
  const [open, setOpen] = useState<"notifications" | "operator" | null>(null);

  return (
    <header className="sticky top-0 z-20 flex h-[60px] items-center gap-3 border-b border-ink-700 bg-ink-950/85 px-4 backdrop-blur-md md:px-6">
      <div className="relative flex-1 max-w-xl">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-txt-faint">
          <Icon.search size={16} />
        </span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search approvals, agents, customers…"
          className="w-full rounded-lg border border-ink-700 bg-ink-850 py-2 pl-9 pr-3 text-[13.5px] text-txt placeholder:text-txt-faint outline-none transition focus:border-brand/50 focus:bg-ink-800"
        />
      </div>

      <div className="ml-auto flex items-center gap-2.5">
        <span className="hidden items-center gap-1.5 rounded-md border border-ink-700 bg-ink-850 px-2.5 py-1.5 text-2xs font-medium text-txt-dim sm:inline-flex">
          <span className="h-1.5 w-1.5 rounded-full bg-good" />
          Production
        </span>

        <button
          onClick={() =>
            setOpen((value) => (value === "notifications" ? null : "notifications"))
          }
          className="relative grid h-9 w-9 place-items-center rounded-lg border border-ink-700 bg-ink-850 text-txt-dim transition hover:border-brand/40 hover:text-txt"
          aria-label="Notifications"
          aria-expanded={open === "notifications"}
        >
          <Icon.bell size={17} />
          {pending > 0 && (
            <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-warn px-1 text-[10px] font-bold text-ink-950">
              {pending}
            </span>
          )}
        </button>
        {open === "notifications" && (
          <div className="absolute right-16 top-12 w-[min(92vw,360px)] rounded-2xl border border-ink-700 bg-ink-900 p-3 shadow-pop">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[13px] font-semibold text-txt">
                  Approval alerts
                </div>
                <div className="mt-0.5 text-2xs text-txt-faint">
                  {pending} item{pending === 1 ? "" : "s"} need a human decision
                </div>
              </div>
              <a
                href="/app/approvals"
                className="rounded-md bg-brand/14 px-2 py-1 text-2xs font-semibold text-brand-2 transition hover:bg-brand/24"
              >
                Open queue
              </a>
            </div>
            <div className="mt-3 space-y-2">
              {approvals.slice(0, 4).map((approval) => (
                <a
                  key={approval.id}
                  href="/app/approvals"
                  className="block rounded-xl border border-ink-700 bg-ink-850 px-3 py-2.5 transition hover:border-brand/35 hover:bg-ink-800"
                >
                  <div className="flex items-center justify-between gap-3 text-2xs">
                    <span className="font-semibold uppercase tracking-wide text-brand-2">
                      {approval.agent}
                    </span>
                    <span className="text-txt-faint">{relTime(approval.createdAt)}</span>
                  </div>
                  <div className="mt-1 truncate text-[13px] font-medium text-txt">
                    {approval.title}
                  </div>
                  <div className="mt-0.5 truncate text-2xs text-txt-faint">
                    {approval.policyTrigger}
                  </div>
                </a>
              ))}
              {approvals.length === 0 && (
                <div className="rounded-xl border border-ink-700 bg-ink-850 px-3 py-4 text-center text-[13px] text-txt-faint">
                  Queue is clear. No alerts right now.
                </div>
              )}
            </div>
          </div>
        )}

        <button
          onClick={() => setOpen((value) => (value === "operator" ? null : "operator"))}
          className="flex items-center gap-2 rounded-lg border border-ink-700 bg-ink-850 py-1 pl-1 pr-2.5 transition hover:border-brand/40"
          aria-label="Open operator menu"
          aria-expanded={open === "operator"}
        >
          <span className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-brand to-brand-2 text-xs font-bold text-white">
            OP
          </span>
          <span className="hidden text-[13px] font-medium text-txt-dim sm:block">
            Operator
          </span>
        </button>
        {open === "operator" && (
          <div className="absolute right-4 top-12 w-[min(92vw,280px)] rounded-2xl border border-ink-700 bg-ink-900 p-3 shadow-pop">
            <div className="flex items-center gap-3 border-b border-ink-700 pb-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand to-brand-2 text-sm font-bold text-white">
                OP
              </span>
              <div>
                <div className="text-[13px] font-semibold text-txt">
                  Operator
                </div>
                <div className="text-2xs text-txt-faint">Demo production console</div>
              </div>
            </div>
            <div className="mt-2 grid gap-1 text-[13px]">
              <a
                href="/"
                className="rounded-lg px-3 py-2 text-txt-dim transition hover:bg-ink-800 hover:text-txt"
              >
                Back to Greenlite home
              </a>
              <a
                href="/mobile/"
                className="rounded-lg px-3 py-2 text-txt-dim transition hover:bg-ink-800 hover:text-txt"
              >
                Preview mobile app
              </a>
              <a
                href="/app/settings"
                className="rounded-lg px-3 py-2 text-txt-dim transition hover:bg-ink-800 hover:text-txt"
              >
                Workspace settings
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export { useStore };
