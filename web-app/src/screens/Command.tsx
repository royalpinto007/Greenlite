import { useState } from "react";
import { useStore } from "../store";
import { COMMAND_SUGGESTIONS } from "../data/mock";
import { PageHeader, Card, Button } from "../components/primitives";
import { Icon } from "../components/icons";
import { money, relTime } from "../lib/format";

interface Result {
  title: string;
  lines: string[];
  tone?: "good" | "warn";
}

// Operator console. Commands run locally against the live store so results are
// instant and reflect real state. "Pause auto-approvals for refunds" actually
// mutates the matching policy.
export function Command() {
  const store = useStore();
  const [input, setInput] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [recent, setRecent] = useState<string[]>([]);

  function run(raw: string) {
    const cmd = raw.trim();
    if (!cmd) return;
    setRecent((r) => [cmd, ...r.filter((x) => x !== cmd)].slice(0, 6));
    setResult(execute(cmd, store));
    setInput("");
  }

  return (
    <div>
      <PageHeader
        title="Command"
        subtitle="Ask Greenlite to inspect, summarize, or trigger an agent action."
      />

      <div className="grid gap-4 xl:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          {/* Command input */}
          <Card>
            <div className="flex items-center gap-2.5">
              <span className="text-brand-2">
                <Icon.command size={18} />
              </span>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && run(input)}
                placeholder="Ask Greenlite to inspect, summarize, or trigger an agent…"
                className="min-w-0 flex-1 bg-transparent text-[15px] text-txt placeholder:text-txt-faint outline-none"
              />
              <Button variant="primary" size="sm" onClick={() => run(input)}>
                Run
              </Button>
            </div>
          </Card>

          {/* Suggested commands */}
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-txt-faint">
              Suggested commands
            </h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {COMMAND_SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setInput(s);
                    run(s);
                  }}
                  className="flex items-center gap-2.5 rounded-lg border border-ink-700 bg-ink-850 px-3.5 py-3 text-left text-[13px] text-txt-dim transition hover:border-brand/40 hover:bg-ink-800 hover:text-txt"
                >
                  <span className="text-brand-2">
                    <Icon.spark size={15} />
                  </span>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Output */}
          {result && (
            <Card className="animate-fade-in">
              <div className="flex items-center gap-2">
                <span className="grid h-6 w-6 place-items-center rounded-md bg-gradient-to-br from-brand to-brand-2 text-2xs font-bold text-white">
                  G
                </span>
                <h3 className="text-[14px] font-semibold">{result.title}</h3>
              </div>
              <div className="mt-3 space-y-1.5">
                {result.lines.map((l, i) => (
                  <p
                    key={i}
                    className="flex gap-2 text-[13.5px] leading-relaxed text-txt-dim"
                  >
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-2" />
                    {l}
                  </p>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Recent commands */}
        <Card>
          <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-txt-faint">
            Recent commands
          </h3>
          {recent.length === 0 ? (
            <p className="text-[13px] text-txt-faint">
              Your recent commands will appear here.
            </p>
          ) : (
            <div className="space-y-1">
              {recent.map((c, i) => (
                <button
                  key={i}
                  onClick={() => run(c)}
                  className="block w-full truncate rounded-md px-2 py-1.5 text-left text-[13px] text-txt-dim transition hover:bg-ink-800 hover:text-txt"
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

// Local command interpreter over the current store state.
function execute(cmd: string, store: ReturnType<typeof useStore.getState>): Result {
  const c = cmd.toLowerCase();
  const { approvals, activity, agents } = store;

  if (c.includes("risky") || c.includes("summarize")) {
    const high = approvals.filter((a) => a.risk === "high");
    return {
      title: "Today's risky approvals",
      lines: [
        `${high.length} high-risk action${high.length === 1 ? "" : "s"} are waiting on a human.`,
        ...high.map(
          (a) =>
            `${a.agent}: ${a.title}${a.amount ? ` (${money(a.amount)})` : ""} — ${a.policyTrigger}.`,
        ),
        "Recommend reviewing the two refund decisions first; both affect high-LTV accounts.",
      ],
    };
  }

  if (c.includes("denied")) {
    const denied = activity.filter(
      (a) => a.status === "denied" && (!c.includes("resolvd") || a.agent === "Resolvd"),
    );
    return {
      title: "Denied actions",
      lines: denied.length
        ? denied.map((a) => `${a.agent}: ${a.action} — ${a.details}`)
        : ["No denied actions match that query."],
    };
  }

  if (c.includes("pause") && c.includes("refund")) {
    const pol = store.policies.find((p) => p.id === "pol_1");
    if (pol?.enabled) store.togglePolicy("pol_1");
    return {
      title: "Auto-approvals paused",
      tone: "warn",
      lines: [
        "Disabled policy: 'Auto-approve small refunds'.",
        "All refunds now require human approval until re-enabled in Policies.",
      ],
    };
  }

  if (c.includes("angry") || c.includes("waiting")) {
    const angry = approvals.filter((a) => a.type === "reply" && a.risk === "high");
    return {
      title: "Angry customers awaiting approval",
      lines: angry.length
        ? angry.map(
            (a) =>
              `${a.customer ?? a.object} — open ${relTime(a.createdAt)}. ${a.title}.`,
          )
        : ["No high-risk customer replies are currently waiting."],
    };
  }

  if (c.includes("pennyrush") || c.includes("budget")) {
    const pr = [...approvals, ...activity.map((a) => ({ agent: a.agent, title: a.action, status: (a as any).status }))]
      .filter((x) => x.agent === "PennyRush");
    return {
      title: "PennyRush budget audit",
      lines: pr.length
        ? pr.map((x) => `${x.title}`)
        : ["No PennyRush actions found."],
    };
  }

  if (c.includes("degraded") || c.includes("status")) {
    const deg = agents.filter((a) => a.status === "degraded");
    return {
      title: "Agent status",
      lines: deg.length
        ? deg.map((a) => `${a.name} is degraded — last activity ${a.lastActivity}.`)
        : ["All connected agents are healthy."],
    };
  }

  return {
    title: "Greenlite",
    lines: [
      `I parsed: "${cmd}".`,
      "Try one of the suggested commands, or ask me to summarize risky approvals, audit an agent, or pause a policy.",
    ],
  };
}
