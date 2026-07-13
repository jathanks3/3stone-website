// src/pricing/internal/costs.ts
// ── INTERNAL ── our real cost-to-serve model. EDITABLE. This file is only
// imported by the internal engine, the publish script, and the env-gated
// admin dashboard. It must NEVER be imported (directly or transitively)
// from src/pages/pricing.astro or the public engine — that would ship our
// margins to every visitor. scripts/test-pricing.ts enforces this.
//
// All figures are our estimated monthly USD cost per customer workspace.
// Update them as real invoices come in; then run `npm run pricing:publish`
// to regenerate the public rates.

export const internalCosts = {
  /** Fixed cost per customer workspace, per month. */
  perCustomerBase: {
    hosting: 8, // Vercel share
    database: 12, // Supabase share
    storage: 2.5, // ~50 GB object storage headroom
    monitoring: 4, // logging/alerting share
    email: 3, // Resend share (transactional volume)
    sms: 0, // not offered yet — raise when SMS ships
    supportHuman: 45, // amortized founder/support time per account
  },
  /** Marginal cost per employee seat, per month. */
  perSeat: {
    platform: 1.25, // db rows, storage growth, auth, bandwidth
    ai: 6, // model usage when the AI Assistant module is active
  },
  /** Marginal infra+support cost per active add-on module, per month. */
  perModule: {
    default: 2.5,
    overrides: {
      "ai-assistant": 4,
      automation: 4,
      payments: 3.5, // webhook infra + payment-support load
    } as Record<string, number>,
  },
  /** Stripe's cut of each subscription payment we collect. */
  billingFees: { pct: 0.029, fixed: 0.3 },
};

/** Padding on top of estimated cost before any price is derived. */
export const SAFETY_BUFFER = 0.2;

/** The gross margin prices are derived to hit. */
export const TARGET_GROSS_MARGIN = 0.7;

/** Hard floor — the engine refuses to publish any rate whose margin,
 * after billing fees, falls below this. Enforced in code, not policy. */
export const MINIMUM_GROSS_MARGIN = 0.6;

/** One-time implementation economics. */
export const implementationRates = {
  baseHours: 24, // onboarding, workspace setup, training
  perModuleHours: 6, // configuration per add-on module
  perReplacedToolHours: 4, // data migration out of each replaced tool
  hourlyRate: 95,
  minimumFee: 1500,
};

/** Assumptions for the internal dashboard's lifetime-value model. */
export const ltvAssumptions = {
  expectedRetentionMonths: 30,
  implementationGrossMarginPct: 0.45, // after delivery labor
};
