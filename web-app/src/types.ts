// Shared data model for the Greenlite console. Mirrors the shape we would
// later read from Supabase, so screens and the store stay backend-agnostic.

export type Risk = "low" | "medium" | "high";

export type ActionType =
  | "refund"
  | "reply"
  | "budget"
  | "account"
  | "policy"
  | "status";

export type ApprovalStatus =
  | "pending"
  | "approved"
  | "denied"
  | "edited"
  | "auto-run"
  | "failed";

export interface Approval {
  id: string;
  agent: string;
  title: string; // short proposed-action title
  type: ActionType;
  risk: Risk;
  policyTrigger: string;
  object: string; // affected customer / order / account / campaign
  customer?: string;
  amount?: number;
  confidence: number; // 0..1
  createdAt: number; // ms epoch (relative to "now")
  needsContext?: boolean;
  // Detail-pane content
  context: string;
  customerMessage?: string;
  orderDetails?: string;
  auditNotes?: string;
}

export interface ActivityEntry {
  id: string;
  time: number; // ms epoch
  agent: string;
  action: string;
  status: ApprovalStatus;
  approvedBy: string; // "Auto" | operator name
  risk: Risk;
  object: string;
  details: string;
}

export type AgentStatus = "active" | "paused" | "degraded";

export interface Agent {
  id: string;
  name: string;
  kind: string;
  status: AgentStatus;
  actionsToday: number;
  autoRunRate: number; // 0..1
  lastActivity: string;
  policySummary: string;
  connectedSystems: string[];
  riskSetting: string;
  approvalRules: string[];
  recentActions: { label: string; status: ApprovalStatus; when: string }[];
}

export type PolicyCategory =
  | "Refunds"
  | "Customer replies"
  | "Budget shifts"
  | "Account changes"
  | "High-risk sentiment";

export interface Policy {
  id: string;
  category: PolicyCategory;
  title: string;
  description: string;
  enabled: boolean;
  threshold?: number;
  thresholdUnit?: "$" | "%" | "min";
  risk: Risk;
  agents: string[];
  lastEdited: string;
}
