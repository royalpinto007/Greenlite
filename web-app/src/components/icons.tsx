// Lightweight inline icon set (stroke-based, currentColor) so the console
// ships no icon-font dependency.
type P = { className?: string; size?: number };
const base = (size = 18) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export const Icon = {
  dashboard: (p: P) => (
    <svg {...base(p.size)} className={p.className}>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  ),
  approvals: (p: P) => (
    <svg {...base(p.size)} className={p.className}>
      <path d="M4 12l5 5L20 6" />
    </svg>
  ),
  activity: (p: P) => (
    <svg {...base(p.size)} className={p.className}>
      <path d="M3 12h4l2 6 4-14 2 8h6" />
    </svg>
  ),
  agents: (p: P) => (
    <svg {...base(p.size)} className={p.className}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
    </svg>
  ),
  policies: (p: P) => (
    <svg {...base(p.size)} className={p.className}>
      <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  command: (p: P) => (
    <svg {...base(p.size)} className={p.className}>
      <path d="M9 7H7a3 3 0 1 0 3 3V7Zm0 0h6m0 0v3a3 3 0 1 0 3-3h-3Zm0 0V7m0 10h-2a3 3 0 1 1 3-3v3Zm0 0h-0m6-3a3 3 0 1 1-3 3v-3h3Z" />
    </svg>
  ),
  settings: (p: P) => (
    <svg {...base(p.size)} className={p.className}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.2A1.6 1.6 0 0 0 6.7 19l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 3 13.6H3a2 2 0 1 1 0-4h.2A1.6 1.6 0 0 0 4.6 7L4.5 7a2 2 0 1 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 10 3.6V3a2 2 0 1 1 4 0v.2a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0 1.1 2.7H21a2 2 0 1 1 0 4h-.2a1.6 1.6 0 0 0-1.4 1Z" />
    </svg>
  ),
  search: (p: P) => (
    <svg {...base(p.size)} className={p.className}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3-3" />
    </svg>
  ),
  bell: (p: P) => (
    <svg {...base(p.size)} className={p.className}>
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </svg>
  ),
  arrow: (p: P) => (
    <svg {...base(p.size)} className={p.className}>
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  ),
  close: (p: P) => (
    <svg {...base(p.size)} className={p.className}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  ),
  check: (p: P) => (
    <svg {...base(p.size)} className={p.className}>
      <path d="M4 12l5 5L20 6" />
    </svg>
  ),
  edit: (p: P) => (
    <svg {...base(p.size)} className={p.className}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  ),
  spark: (p: P) => (
    <svg {...base(p.size)} className={p.className}>
      <path d="M12 3v4m0 10v4M3 12h4m10 0h4M6 6l2 2m8 8 2 2m0-14-2 2M8 16l-2 2" />
    </svg>
  ),
  bolt: (p: P) => (
    <svg {...base(p.size)} className={p.className}>
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
    </svg>
  ),
};
