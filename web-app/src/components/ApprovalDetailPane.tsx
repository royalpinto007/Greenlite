import { useState, useEffect } from "react";
import type { Approval } from "../types";
import { useStore } from "../store";
import { RiskBadge } from "./Badges";
import { Button, Confidence } from "./primitives";
import { Icon } from "./icons";
import { money, relTime, cx } from "../lib/format";

// Right pane of the Approvals split view. Shows everything an operator needs
// to decide, with a sticky action footer. Approve/Edit/Deny push the item to
// Activity via the store.
export function ApprovalDetailPane({ approval }: { approval: Approval | null }) {
  const resolve = useStore((s) => s.resolve);
  const [editing, setEditing] = useState(false);
  const [note, setNote] = useState("");

  // Reset transient edit state whenever the selected approval changes.
  useEffect(() => {
    setEditing(false);
    setNote("");
  }, [approval?.id]);

  if (!approval) {
    return (
      <div className="grid h-full place-items-center p-10 text-center">
        <div>
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-good/12 text-good">
            <Icon.check size={22} />
          </div>
          <p className="mt-3 text-[14px] font-medium">Queue is clear</p>
          <p className="mt-1 text-[13px] text-txt-faint">
            No approvals are waiting on a human right now.
          </p>
        </div>
      </div>
    );
  }

  const act = (outcome: "approved" | "denied" | "edited") => {
    resolve(approval.id, outcome, note.trim() || undefined);
    setEditing(false);
    setNote("");
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-ink-700/70 px-1.5 py-0.5 text-2xs font-semibold text-txt-dim">
                {approval.agent}
              </span>
              <span className="text-2xs text-txt-faint">
                {relTime(approval.createdAt)}
              </span>
            </div>
            <h2 className="mt-2 text-[19px] font-bold leading-snug tracking-tight">
              {approval.title}
            </h2>
          </div>
          <RiskBadge risk={approval.risk} />
        </div>

        {/* Key facts grid */}
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <Fact label="Proposed action" value={approval.title} wide />
          {approval.amount != null && (
            <Fact label="Amount" value={money(approval.amount)} />
          )}
          <Fact label="Affected" value={approval.object} wide />
          <Fact label="Policy triggered" value={approval.policyTrigger} wide />
        </div>

        <div className="mt-4">
          <Confidence value={approval.confidence} />
        </div>

        {/* Context */}
        <Section title="Full context">{approval.context}</Section>

        {approval.customerMessage && (
          <Section title="Customer message">
            <span className="italic text-txt-dim">
              “{approval.customerMessage}”
            </span>
          </Section>
        )}

        {approval.orderDetails && (
          <Section title="Order / account details">
            {approval.orderDetails}
          </Section>
        )}

        {approval.auditNotes && (
          <div className="mt-4 rounded-lg border border-warn/25 bg-warn/8 p-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-warn">
              <Icon.bolt size={13} /> Audit notes
            </div>
            <p className="mt-1 text-[13px] text-txt-dim">{approval.auditNotes}</p>
          </div>
        )}

        {editing && (
          <div className="mt-4 rounded-lg border border-brand/30 bg-brand/8 p-3">
            <label className="text-xs font-semibold text-brand-2">
              Edit note (recorded in the audit log)
            </label>
            <textarea
              autoFocus
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. reduced refund to $500 and added a follow-up task"
              className="mt-2 h-20 w-full resize-none rounded-md border border-ink-700 bg-ink-900 p-2.5 text-[13px] text-txt outline-none focus:border-brand/50"
            />
          </div>
        )}
      </div>

      {/* Sticky action footer */}
      <div className="border-t border-ink-700 bg-ink-900/80 p-4 backdrop-blur">
        <div className="flex gap-2.5">
          <Button
            variant="good"
            className="flex-1"
            onClick={() => act(editing ? "edited" : "approved")}
          >
            <Icon.check size={16} /> {editing ? "Save & approve" : "Approve"}
          </Button>
          <Button
            variant="ghost"
            onClick={() => setEditing((v) => !v)}
            className={cx(editing && "border-brand/45 text-brand-2")}
          >
            <Icon.edit size={15} /> Edit
          </Button>
          <Button variant="bad" onClick={() => act("denied")}>
            <Icon.close size={15} /> Deny
          </Button>
        </div>
        <p className="mt-2 text-center text-2xs text-txt-faint">
          Decisions are logged to Activity and notify the requesting agent.
        </p>
      </div>
    </div>
  );
}

function Fact({
  label,
  value,
  wide,
}: {
  label: string;
  value: string;
  wide?: boolean;
}) {
  return (
    <div
      className={cx(
        "rounded-lg border border-ink-700 bg-ink-900/50 px-3 py-2",
        wide && "col-span-2",
      )}
    >
      <div className="text-2xs text-txt-faint">{label}</div>
      <div className="mt-0.5 text-[13px] font-medium text-txt">{value}</div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-4">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-txt-faint">
        {title}
      </h4>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-txt-dim">
        {children}
      </p>
    </div>
  );
}
