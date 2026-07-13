// src/pricing/data/tiers.ts
// Launch tier composition — which modules each tier includes. EDITABLE and
// public (module sets are shown on the page). Prices are NOT here: they
// are derived by the internal engine from the cost model and published in
// published-pricing.ts; the target price bands live in internal/costs.ts.

import type { TierDefinition } from "../types";

export const tiers: TierDefinition[] = [
  {
    key: "hub",
    label: "Hub",
    blurb:
      "One place to see the business. Keep every tool you have — 3Stone One connects them, adds your client portal, documents, and scheduling.",
    includedModules: ["documents", "scheduling"],
  },
  {
    key: "growth",
    label: "Growth",
    blurb:
      "The working core: customers, jobs, invoices, approvals, and reporting join the hub — most replaced tools land here.",
    includedModules: ["documents", "scheduling", "crm", "projects", "payments", "reporting", "approvals"],
  },
  {
    key: "business-os",
    label: "Business OS",
    blurb:
      "The whole operating system: everything in Growth plus AI assistance, automation, and meetings.",
    includedModules: [
      "documents",
      "scheduling",
      "crm",
      "projects",
      "payments",
      "reporting",
      "approvals",
      "ai-assistant",
      "automation",
      "meetings",
    ],
  },
];

export const ENTERPRISE_LABEL = "Enterprise";

export function getTier(key: string): TierDefinition | undefined {
  return tiers.find((t) => t.key === key);
}
