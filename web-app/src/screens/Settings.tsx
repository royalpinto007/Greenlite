import { useState } from "react";
import { PageHeader, Card, CardHeader, Button } from "../components/primitives";
import { cx } from "../lib/format";

// Workspace administration. Local UI state only; wired to demonstrate the
// shape an operator settings surface would take.
export function Settings() {
  return (
    <div className="max-w-4xl">
      <PageHeader
        title="Settings"
        subtitle="Workspace, notifications, connected systems, and access control."
      />

      <div className="space-y-4">
        <Card>
          <CardHeader title="Workspace" hint="Organisation-level configuration" />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Workspace name" value="Acme Operations" />
            <Field label="Environment" value="Production" />
            <Field label="Region" value="us-east" />
            <Field label="Timezone" value="UTC-5 (Eastern)" />
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Notifications"
            hint="Demo preferences for when operators should be alerted"
          />
          <ToggleRow
            label="Push for new high-risk approvals"
            desc="Notify immediately when a high-risk action is queued."
            initial
          />
          <ToggleRow
            label="Push for all pending approvals"
            desc="Notify for every action that needs a human."
          />
          <ToggleRow
            label="Daily audit digest"
            desc="A morning summary of yesterday's agent activity."
            initial
          />
        </Card>

        <Card>
          <CardHeader
            title="Connected systems"
            hint="Sources agents act against"
          />
          <div className="grid gap-2.5 sm:grid-cols-2">
            {[
              ["Stripe", "Refunds & billing", true],
              ["Zendesk", "Support tickets", true],
              ["Shopify", "Orders", true],
              ["Meta Ads", "Ad budgets", true],
              ["Google Ads", "Ad budgets", true],
              ["Slack", "Operator alerts", false],
            ].map(([name, desc, connected]) => (
              <div
                key={name as string}
                className="flex items-center justify-between rounded-lg border border-ink-700 bg-ink-900/40 px-3 py-2.5"
              >
                <div>
                  <div className="text-[13.5px] font-medium">{name}</div>
                  <div className="text-2xs text-txt-faint">{desc}</div>
                </div>
                <span
                  className={cx(
                    "rounded-md px-2 py-0.5 text-2xs font-medium",
                    connected
                      ? "bg-good/12 text-good"
                      : "bg-ink-700 text-txt-faint",
                  )}
                >
                  {connected ? "Connected" : "Connect"}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader title="User roles" hint="Who can do what" />
            <div className="space-y-2">
              {[
                ["Owner", "Full access", "1"],
                ["Operator", "Review & approve", "4"],
                ["Viewer", "Read-only audit", "9"],
              ].map(([role, desc, n]) => (
                <div
                  key={role as string}
                  className="flex items-center justify-between text-[13px]"
                >
                  <div>
                    <span className="font-medium">{role}</span>
                    <span className="ml-2 text-txt-faint">{desc}</span>
                  </div>
                  <span className="text-txt-dim tabular-nums">{n}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Approval permissions" hint="Decision limits" />
            <div className="space-y-2 text-[13px] text-txt-dim">
              <PermRow label="Operators can approve up to" value="$1,000" />
              <PermRow label="Above limit requires" value="Owner" />
              <PermRow label="Two-person rule above" value="$5,000" />
            </div>
          </Card>
        </div>

        <Card>
          <CardHeader
            title="API & webhooks"
            hint="How agents reach Greenlite"
            action={<Button size="sm">Generate key</Button>}
          />
          <div className="rounded-lg border border-ink-700 bg-ink-900 p-3 font-mono text-[12.5px] text-txt-dim">
            POST https://greenlite.app/api/approvals
          </div>
          <div className="mt-2.5 flex items-center gap-2 rounded-lg border border-ink-700 bg-ink-900 p-3 font-mono text-[12.5px]">
            <span className="text-txt-faint">key</span>
            <span className="text-txt-dim">gl_live_••••••••••••••••</span>
          </div>
          <p className="mt-2 text-2xs text-txt-faint">
            Demo endpoint shown for product context. In production, agents POST
            proposed actions here and approved decisions are sent back to the
            agent's callback URL.
          </p>
        </Card>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="text-2xs text-txt-faint">{label}</span>
      <input
        defaultValue={value}
        className="mt-1 w-full rounded-lg border border-ink-700 bg-ink-900 px-3 py-2 text-[13.5px] text-txt outline-none focus:border-brand/50"
      />
    </label>
  );
}

function PermRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-ink-800 pb-2 last:border-0">
      <span className="text-txt-faint">{label}</span>
      <span className="font-medium text-txt">{value}</span>
    </div>
  );
}

function ToggleRow({
  label,
  desc,
  initial,
}: {
  label: string;
  desc: string;
  initial?: boolean;
}) {
  const [on, setOn] = useState(!!initial);
  return (
    <div className="flex items-center justify-between gap-4 border-b border-ink-800 py-2.5 last:border-0">
      <div>
        <div className="text-[13.5px] font-medium">{label}</div>
        <div className="text-2xs text-txt-faint">{desc}</div>
      </div>
      <button
        onClick={() => setOn((v) => !v)}
        role="switch"
        aria-checked={on}
        className={cx(
          "relative h-6 w-11 shrink-0 rounded-full border transition",
          on ? "border-brand bg-brand/80" : "border-ink-600 bg-ink-700",
        )}
      >
        <span
          className="absolute top-0.5 rounded-full bg-white transition-all"
          style={{ height: 18, width: 18, left: on ? 22 : 2 }}
        />
      </button>
    </div>
  );
}
