import type { Approval } from "../types";
import { RiskBadge } from "./Badges";
import { relTime, money, cx } from "../lib/format";
import { Icon } from "./icons";

const TYPE_LABEL: Record<string, string> = {
  refund: "Refund",
  reply: "Reply",
  budget: "Budget",
  account: "Account",
  policy: "Policy",
  status: "Status",
};

// Compact, dense queue row. Used in the Approvals split pane and (read-only
// style) in the Dashboard queue.
export function ApprovalRow({
  a,
  selected,
  onSelect,
}: {
  a: Approval;
  selected?: boolean;
  onSelect?: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={cx(
        "w-full border-l-2 px-3.5 py-3 text-left transition",
        selected
          ? "border-brand bg-brand/8"
          : "border-transparent hover:bg-ink-800",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="rounded bg-ink-700/70 px-1.5 py-0.5 text-2xs font-semibold text-txt-dim">
            {a.agent}
          </span>
          <span className="text-2xs text-txt-faint">
            {TYPE_LABEL[a.type]}
          </span>
        </div>
        <RiskBadge risk={a.risk} sm />
      </div>

      <div className="mt-1.5 flex items-center justify-between gap-2">
        <h3 className="truncate text-[13.5px] font-semibold text-txt">
          {a.title}
        </h3>
        {a.amount != null && (
          <span className="shrink-0 text-[13px] font-semibold tabular-nums text-txt-dim">
            {money(a.amount)}
          </span>
        )}
      </div>

      <p className="mt-1 truncate text-xs text-txt-faint">{a.object}</p>

      <div className="mt-2 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1 truncate text-2xs text-txt-faint">
          <span className="text-brand-2">
            <Icon.policies size={12} />
          </span>
          <span className="truncate">{a.policyTrigger}</span>
        </span>
        <span className="shrink-0 text-2xs text-txt-faint">
          {relTime(a.createdAt)}
        </span>
      </div>
    </button>
  );
}
