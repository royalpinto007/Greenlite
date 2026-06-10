import { NavLink } from "react-router-dom";
import { Icon } from "./icons";
import { useStore, useMetrics } from "../store";
import { cx } from "../lib/format";

// Persistent left rail. On tablet/mobile it collapses to a slim icon rail.
const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: Icon.dashboard },
  { to: "/approvals", label: "Approvals", icon: Icon.approvals, badge: true },
  { to: "/activity", label: "Activity", icon: Icon.activity },
  { to: "/agents", label: "Agents", icon: Icon.agents },
  { to: "/policies", label: "Policies", icon: Icon.policies },
  { to: "/command", label: "Command", icon: Icon.command },
  { to: "/settings", label: "Settings", icon: Icon.settings },
];

export function Sidebar() {
  const { pending } = useMetrics();
  const agents = useStore((s) => s.agents);
  const activeAgents = agents.filter((a) => a.status === "active").length;

  return (
    <aside className="sticky top-0 z-30 flex h-screen w-[68px] flex-col border-r border-ink-700 bg-ink-900 lg:w-[232px]">
      <div className="flex h-[60px] items-center gap-2.5 border-b border-ink-700 px-3.5 lg:px-5">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[10px] bg-gradient-to-br from-brand to-brand-2 shadow-[0_6px_18px_-6px_rgba(139,92,246,0.7)]">
          <Icon.check size={17} className="text-white" />
        </span>
        <div className="hidden min-w-0 lg:block">
          <div className="text-[15px] font-bold leading-none tracking-tight">
            Greenlite
          </div>
          <div className="mt-1 text-2xs text-txt-faint">Control tower</div>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2.5 py-3 lg:px-3">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cx(
                "group flex items-center gap-3 rounded-lg px-2.5 py-2 text-[13.5px] font-medium transition",
                isActive
                  ? "bg-brand/14 text-txt"
                  : "text-txt-dim hover:bg-ink-800 hover:text-txt",
              )
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={cx(
                    "shrink-0 transition",
                    isActive ? "text-brand-2" : "text-txt-faint group-hover:text-txt-dim",
                  )}
                >
                  <item.icon size={18} />
                </span>
                <span className="hidden flex-1 lg:block">{item.label}</span>
                {item.badge && pending > 0 && (
                  <span className="hidden rounded-full bg-warn/18 px-1.5 py-0.5 text-2xs font-semibold text-warn lg:inline">
                    {pending}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="hidden border-t border-ink-700 px-4 py-3.5 lg:block">
        <div className="flex items-center gap-2 text-2xs text-txt-faint">
          <span className="h-1.5 w-1.5 rounded-full bg-good animate-ping2" />
          {activeAgents} agents active · prod
        </div>
      </div>
    </aside>
  );
}
