import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store";
import { PageHeader, Card, Drawer, Button } from "../components/primitives";
import { AgentStatusDot, StatusBadge } from "../components/Badges";
import { Icon } from "../components/icons";
import { cx } from "../lib/format";
import type { Agent } from "../types";

// Grid/list hybrid of connected agents. Clicking a card opens a detail panel.
export function Agents() {
  const nav = useNavigate();
  const agents = useStore((s) => s.agents);
  const approvals = useStore((s) => s.approvals);
  const [open, setOpen] = useState<Agent | null>(null);

  const pendingFor = (name: string) =>
    approvals.filter((a) => a.agent === name).length;

  return (
    <div>
      <PageHeader
        title="Agents"
        subtitle="Every action agent connected to Greenlite, with its live health and approval policy."
      />

      <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
        {agents.map((ag) => {
          const isAdd = ag.id === "agt_future";
          if (isAdd) {
            return (
              <button
                key={ag.id}
                className="flex min-h-[168px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-ink-600 text-txt-faint transition hover:border-brand/40 hover:text-txt-dim"
              >
                <span className="grid h-10 w-10 place-items-center rounded-full border border-ink-600 text-lg">
                  +
                </span>
                <span className="text-[13px] font-medium">{ag.name}</span>
                <span className="text-2xs">{ag.kind}</span>
              </button>
            );
          }
          const pending = pendingFor(ag.name);
          return (
            <Card
              key={ag.id}
              className="cursor-pointer transition hover:border-brand/35"
            >
              <div onClick={() => setOpen(ag)}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-[15px] font-semibold tracking-tight">
                      {ag.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-txt-faint">{ag.kind}</p>
                  </div>
                  <AgentStatusDot status={ag.status} />
                </div>

                <div className="mt-3.5 grid grid-cols-3 gap-2 text-center">
                  <Stat value={ag.actionsToday} label="Actions" />
                  <Stat
                    value={pending}
                    label="Pending"
                    tone={pending ? "warn" : undefined}
                  />
                  <Stat
                    value={`${Math.round(ag.autoRunRate * 100)}%`}
                    label="Auto-run"
                  />
                </div>

                <div className="mt-3.5 flex items-center justify-between border-t border-ink-800 pt-3 text-2xs text-txt-faint">
                  <span className="truncate">{ag.policySummary}</span>
                  <span className="shrink-0">{ag.lastActivity}</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Drawer open={!!open} onClose={() => setOpen(null)} title="Agent detail">
        {open && (
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand to-brand-2 text-sm font-bold text-white">
                  {open.name.slice(0, 2)}
                </span>
                <div>
                  <h3 className="text-[16px] font-bold leading-none">
                    {open.name}
                  </h3>
                  <div className="mt-1.5">
                    <AgentStatusDot status={open.status} />
                  </div>
                </div>
              </div>
            </div>

            <Block title="Risk settings">
              <p className="text-[13.5px] text-txt-dim">{open.riskSetting}</p>
            </Block>

            <Block title="Approval rules">
              <ul className="space-y-1.5">
                {open.approvalRules.map((r) => (
                  <li
                    key={r}
                    className="flex items-start gap-2 text-[13px] text-txt-dim"
                  >
                    <span className="mt-0.5 text-brand-2">
                      <Icon.policies size={13} />
                    </span>
                    {r}
                  </li>
                ))}
              </ul>
            </Block>

            <Block title="Connected systems">
              <div className="flex flex-wrap gap-1.5">
                {open.connectedSystems.map((s) => (
                  <span
                    key={s}
                    className="rounded-md border border-ink-700 bg-ink-850 px-2 py-1 text-2xs text-txt-dim"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </Block>

            <Block title="Recent actions">
              <div className="space-y-2">
                {open.recentActions.map((r, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-2 text-[13px]"
                  >
                    <span className="min-w-0 truncate text-txt-dim">
                      {r.label}
                    </span>
                    <div className="flex shrink-0 items-center gap-2">
                      <StatusBadge status={r.status} />
                      <span className="text-2xs text-txt-faint">{r.when}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Block>

            <Button
              variant="ghost"
              className="w-full"
              onClick={() => {
                setOpen(null);
                nav("/approvals");
              }}
            >
              View this agent's queue <Icon.arrow size={14} />
            </Button>
          </div>
        )}
      </Drawer>
    </div>
  );
}

function Stat({
  value,
  label,
  tone,
}: {
  value: string | number;
  label: string;
  tone?: "warn";
}) {
  return (
    <div className="rounded-lg border border-ink-800 bg-ink-900/40 py-2">
      <div
        className={cx(
          "text-[17px] font-bold tabular-nums",
          tone === "warn" ? "text-warn" : "text-txt",
        )}
      >
        {value}
      </div>
      <div className="text-2xs text-txt-faint">{label}</div>
    </div>
  );
}

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="mb-2 text-2xs font-semibold uppercase tracking-wider text-txt-faint">
        {title}
      </h4>
      {children}
    </div>
  );
}
