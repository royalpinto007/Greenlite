import type { ReactNode } from "react";
import { Icon } from "./icons";
import { cx } from "../lib/format";

// ---- Card ----
export function Card({
  children,
  className,
  pad = true,
}: {
  children: ReactNode;
  className?: string;
  pad?: boolean;
}) {
  return (
    <div
      className={cx(
        "rounded-xl border border-ink-700 bg-gradient-to-b from-ink-800 to-ink-850 shadow-card",
        pad && "p-4",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <div>
        <h2 className="text-[15px] font-semibold tracking-tight">{title}</h2>
        {hint && <p className="mt-0.5 text-xs text-txt-faint">{hint}</p>}
      </div>
      {action}
    </div>
  );
}

// ---- Page header ----
export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-[28px] font-bold leading-tight tracking-[-0.02em] lg:text-[32px]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1.5 text-[14px] text-txt-dim">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-2.5">{actions}</div>}
    </div>
  );
}

// ---- Button ----
type BtnProps = {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "good" | "bad" | "subtle";
  size?: "sm" | "md";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
};
export function Button({
  children,
  onClick,
  variant = "ghost",
  size = "md",
  className,
  type = "button",
  disabled,
}: BtnProps) {
  const variants: Record<string, string> = {
    primary:
      "bg-gradient-to-br from-brand to-brand-2 text-white shadow-[0_10px_26px_-12px_rgba(139,92,246,0.9)] hover:brightness-110",
    ghost:
      "border border-ink-700 bg-ink-850 text-txt hover:border-brand/45 hover:bg-ink-800",
    subtle: "text-txt-dim hover:bg-ink-800 hover:text-txt",
    good: "bg-good/15 text-good border border-good/30 hover:bg-good/22",
    bad: "bg-bad/12 text-bad border border-bad/30 hover:bg-bad/20",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition disabled:opacity-50",
        size === "sm" ? "px-3 py-1.5 text-[13px]" : "px-4 py-2 text-[13.5px]",
        variants[variant],
        className,
      )}
    >
      {children}
    </button>
  );
}

// ---- Metric card (compact KPI tile) ----
export function MetricCard({
  label,
  value,
  delta,
  tone = "default",
}: {
  label: string;
  value: string | number;
  delta?: string;
  tone?: "default" | "good" | "warn" | "bad" | "brand";
}) {
  const accents: Record<string, string> = {
    default: "text-txt",
    good: "text-good",
    warn: "text-warn",
    bad: "text-bad",
    brand: "text-brand-2",
  };
  return (
    <div className="rounded-xl border border-ink-700 bg-gradient-to-b from-ink-800 to-ink-850 p-3.5 shadow-card transition hover:border-ink-600">
      <div className="text-xs font-medium text-txt-faint">{label}</div>
      <div className="mt-1.5 flex items-end gap-2">
        <span
          className={cx(
            "text-[26px] font-bold leading-none tracking-tight tabular-nums",
            accents[tone],
          )}
        >
          {value}
        </span>
        {delta && <span className="mb-0.5 text-2xs text-txt-faint">{delta}</span>}
      </div>
    </div>
  );
}

// ---- Drawer (right-side panel for audit detail) ----
export function Drawer({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="absolute right-0 top-0 flex h-full w-[min(92vw,440px)] animate-slide-in flex-col border-l border-ink-700 bg-ink-900 shadow-pop">
        <div className="flex items-center justify-between border-b border-ink-700 px-5 py-4">
          <h3 className="text-[15px] font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-txt-dim hover:bg-ink-800 hover:text-txt"
          >
            <Icon.close size={17} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}

// ---- Confidence meter ----
export function Confidence({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const tone = pct >= 80 ? "bg-good" : pct >= 65 ? "bg-warn" : "bg-bad";
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-txt-faint">Agent confidence</span>
        <span className="font-semibold tabular-nums text-txt-dim">{pct}%</span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink-700">
        <div className={cx("h-full rounded-full", tone)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
