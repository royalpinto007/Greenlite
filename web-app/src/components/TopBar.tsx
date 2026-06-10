import { useStore, useMetrics } from "../store";
import { Icon } from "./icons";
import { useGlobalSearch } from "../search";

// Compact top bar: global search, notifications, environment indicator, user.
export function TopBar() {
  const { query, setQuery } = useGlobalSearch();
  const { pending } = useMetrics();

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
          className="relative grid h-9 w-9 place-items-center rounded-lg border border-ink-700 bg-ink-850 text-txt-dim transition hover:border-brand/40 hover:text-txt"
          aria-label="Notifications"
        >
          <Icon.bell size={17} />
          {pending > 0 && (
            <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-warn px-1 text-[10px] font-bold text-ink-950">
              {pending}
            </span>
          )}
        </button>

        <button className="flex items-center gap-2 rounded-lg border border-ink-700 bg-ink-850 py-1 pl-1 pr-2.5 transition hover:border-brand/40">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-brand to-brand-2 text-xs font-bold text-white">
            OP
          </span>
          <span className="hidden text-[13px] font-medium text-txt-dim sm:block">
            Operator
          </span>
        </button>
      </div>
    </header>
  );
}

export { useStore };
