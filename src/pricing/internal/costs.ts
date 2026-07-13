// src/pricing/internal/costs.ts
// ── INTERNAL ── our real cost-to-serve model and launch pricing targets.
// EDITABLE. Only the internal engine, the publish script, and the
// env-gated admin dashboard may import this file. It must NEVER be
// imported (directly or transitively) from public pages or the public
// engine — scripts/test-pricing.ts enforces this.
//
// LAUNCH RECALIBRATION (2026-07-12, overrides the earlier model): figures
// are lean launch-scale estimates — shared infrastructure amortized over a
// growing customer base, self-serve onboarding, pooled support. Revisit
// against real invoices monthly; then run `npm run pricing:publish`.

export const internalCosts = {
  /** Fixed cost per customer workspace, per month. */
  perCustomerBase: {
    hosting: 1.5, // Vercel share at launch scale
    database: 2.5, // Supabase share
    storage: 1, // object storage headroom
    monitoring: 0.5, // logging/alerting share
    email: 0.5, // transactional email share
    sms: 0, // not offered yet — raise when SMS ships
    supportHuman: 7, // pooled support time per account (self-serve onboarding)
  },
  /** Marginal cost per employee seat, per month. */
  perSeat: {
    platform: 0.4, // db rows, storage growth, auth, bandwidth
    ai: 0.4, // per-seat AI overhead when the AI Assistant is active
  },
  /** Pooled fair-use AI cost per workspace/month when the AI Assistant
   * module is active (usage caps keep this bounded). */
  aiWorkspacePool: 15,
  /** Marginal infra+support cost per active add-on module, per month. */
  perModule: {
    default: 1,
    overrides: {
      "ai-assistant": 2,
      automation: 1.5,
      payments: 1.5, // webhook infra + payment-support load
    } as Record<string, number>,
  },
  /** Stripe's cut of each subscription payment we collect. */
  billingFees: { pct: 0.029, fixed: 0.3 },
};

/** Padding on top of estimated cost before any price is derived. */
export const SAFETY_BUFFER = 0.2;

/** The gross margin prices are derived toward. */
export const TARGET_GROSS_MARGIN = 0.8;

/** The floor. Anything below is flagged internally (never shown publicly)
 * and the engine routes the configuration to Enterprise instead of
 * quoting an unprofitable price. */
export const MINIMUM_GROSS_MARGIN = 0.75;

/** Launch price bands per tier (targets, not hardcoded prices — the
 * engine derives the published price inside the band from the cost model,
 * or flags if the band can't hold the floor). referenceEmployees is the
 * team size the tier is priced around. */
export const tierBands = {
  hub: { min: 79, max: 99, referenceEmployees: 6 },
  growth: { min: 149, max: 179, referenceEmployees: 12 },
  "business-os": { min: 229, max: 279, referenceEmployees: 15 },
} as const;

/** Discount guardrails for the sales conversation (admin dashboard). */
export const discountPolicy = {
  /** Opening give in a negotiation, if needed at all. */
  suggestedPct: 0.1,
  /** Hard ceiling: no discount may push margin below MINIMUM_GROSS_MARGIN
   * — the engine computes the exact allowable % per configuration. */
};

/** One-time implementation economics (launch-friendly). */
export const implementationRates = {
  baseHours: 12, // guided onboarding, workspace setup, training
  perModuleHours: 3, // configuration per add-on module
  perReplacedToolHours: 3, // data migration out of each replaced tool
  hourlyRate: 95,
  minimumFee: 750,
};

/** Assumptions for the internal dashboard's lifetime-value model. */
export const ltvAssumptions = {
  expectedRetentionMonths: 30,
  implementationGrossMarginPct: 0.45, // after delivery labor
};
