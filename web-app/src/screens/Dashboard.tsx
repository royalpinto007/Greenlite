import { useNavigate } from "react-router-dom";
import { useStore, useMetrics } from "../store";
import {
  PageHeader,
  MetricCard,
  Button,
  Card,
  CardHeader,
} from "../components/primitives";
import { ApprovalRow } from "../components/ApprovalRow";
import { StatusBadge, AgentStatusDot } from "../components/Badges";
import { Icon } from "../components/icons";
import { relTime } from "../lib/format";

// Control tower landing. Everything important sits above the fold: a compact
// metric row, the live pending queue (main column), and operational health
// (right column).
export function Dashboard() {
  const nav = useNavigate();
  const m = useMetrics();
  const approvals = useStore((s) => s.approvals);
  const activity = useStore((s) => s.activity);
  const agents = useStore((s) => s.agents).filter((a) => a.id !== "agt_future");
  const select = useStore((s) => s.select);

  const open = (id: string) => {
    select(id);
    nav("/approvals");
  };

  // Policy triggers: how many pending items each policy is currently holding.
  const triggers = Object.entries(
    approvals.reduce<Record<string, number>>((acc, a) => {
      acc[a.policyTrigger] = (acc[a.policyTrigger] ?? 0) + 1;
      return acc;
    }, {}),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  return (
    <div>
      <PageHeader
        title="Command Center"
        subtitle="Review risky agent actions before they run."
        actions={
          <>
            <Button variant="primary" onClick={() => nav("/command")}>
              <Icon.command size={16} /> Open command
            </Button>
            <Button onClick={() => nav("/policies")}>
              <Icon.policies size={15} /> Configure policies
            </Button>
          </>
        }
      />

      {/* Compact metric row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        <MetricCard label="Pending approvals" value={m.pending} tone="warn" />
        <MetricCard label="Approved today" value={m.approvedToday} tone="good" />
        <MetricCard label="Auto-runs today" value={m.autoRunsToday} />
        <MetricCard label="Denied today" value={m.deniedToday} tone="bad" />
        <MetricCard
          label="Avg approval time"
          value={m.avgApprovalTime}
          tone="brand"
        />
      </div>

      {/* Main grid: pending queue (focus) + operational health */}
      <div className="mt-4 grid gap-4 xl:grid-cols-[1.55fr_1fr]">
        <Card pad={false} className="overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <div>
              <h2 className="text-[15px] font-semibold tracking-tight">
                Pending approvals
              </h2>
              <p className="mt-0.5 text-xs text-txt-faint">
                {m.pending} action{m.pending === 1 ? "" : "s"} waiting on a human
              </p>
            </div>
            <Button size="sm" variant="subtle" onClick={() => nav("/approvals")}>
              Open queue <Icon.arrow size={14} />
            </Button>
          </div>
          <div className="divide-y divide-ink-800 border-t border-ink-800">
            {approvals.length === 0 ? (
              <p className="p-8 text-center text-[13px] text-txt-faint">
                Queue is clear. Nothing needs you right now.
              </p>
            ) : (
              approvals
                .slice(0, 5)
                .map((a) => (
                  <ApprovalRow key={a.id} a={a} onSelect={() => open(a.id)} />
                ))
            )}
          </div>
        </Card>

        <div className="space-y-4">
          {/* Agent health */}
          <Card>
            <CardHeader title="Agent health" hint="Connected action agents" />
            <div className="space-y-2.5">
              {agents.map((ag) => (
                <button
                  key={ag.id}
                  onClick={() => nav("/agents")}
                  className="flex w-full items-center justify-between rounded-lg border border-ink-700 bg-ink-900/40 px-3 py-2.5 text-left transition hover:border-brand/30 hover:bg-ink-800"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13.5px] font-semibold">
                        {ag.name}
                      </span>
                      <AgentStatusDot status={ag.status} />
                    </div>
                    <div className="mt-0.5 text-2xs text-txt-faint">
                      {ag.actionsToday} actions today ·{" "}
                      {Math.round(ag.autoRunRate * 100)}% auto
                    </div>
                  </div>
                  {approvals.filter((a) => a.agent === ag.name).length > 0 && (
                    <span className="rounded-full bg-warn/15 px-2 py-0.5 text-2xs font-semibold text-warn">
                      {approvals.filter((a) => a.agent === ag.name).length} pending
                    </span>
                  )}
                </button>
              ))}
            </div>
          </Card>

          {/* Policy triggers */}
          <Card>
            <CardHeader title="Policy triggers" hint="What's holding the queue" />
            {triggers.length === 0 ? (
              <p className="text-[13px] text-txt-faint">No active triggers.</p>
            ) : (
              <div className="space-y-2">
                {triggers.map(([name, count]) => (
                  <div
                    key={name}
                    className="flex items-center justify-between gap-3 text-[13px]"
                  >
                    <span className="flex min-w-0 items-center gap-2 text-txt-dim">
                      <span className="text-brand-2">
                        <Icon.policies size={13} />
                      </span>
                      <span className="truncate">{name}</span>
                    </span>
                    <span className="shrink-0 font-semibold tabular-nums text-txt">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Recent activity */}
          <Card>
            <CardHeader title="Recent activity" hint="Latest decisions" />
            <div className="space-y-2.5">
              {activity.slice(0, 4).map((e) => (
                <div key={e.id} className="flex items-start gap-2.5 text-[13px]">
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-txt">{e.action}</div>
                    <div className="mt-0.5 text-2xs text-txt-faint">
                      {e.agent} · {relTime(e.time)}
                    </div>
                  </div>
                  <StatusBadge status={e.status} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
