// src/proposals/proposal.ts
// ── Proposal preparation — data contract only, no generation yet. ──
//
// The customer journey this codebase serves, end to end:
//
//   Marketing Website → Demo → Build Your Stack → Discovery Call →
//   Proposal → Agreement → Payment → Onboarding → Go Live → 3Stone Care
//
// The public pricing experience (Build Your Stack) ends by carrying the
// visitor's configuration into the discovery call, and the call's outcome
// is a written Proposal. This module fixes the Proposal's shape now so
// proposal generation can be built later without reworking the pricing
// experience. Everything here composes PUBLIC pricing outputs only — it
// must never import src/pricing/internal/*, and it performs no pricing
// math of its own beyond restating the page's presentation figures
// (monthly implementation payment = the engine's estimate ÷ 12).

import { buildMigrationPlan, previewId } from "../pricing/engine";
import { getIndustry } from "../pricing/data/industries";
import { getTool } from "../pricing/data/software";
import type {
  CurrentSpend,
  RoiOutcomeKind,
  RoiOutcome,
  StackSelection,
  TierQuote,
} from "../pricing/types";

/** Every stage a customer moves through, in order. */
export const customerJourneyStages = [
  "marketing-website",
  "demo",
  "build-your-stack",
  "discovery-call",
  "proposal",
  "agreement",
  "payment",
  "onboarding",
  "go-live",
  "care",
] as const;

export type CustomerJourneyStage = (typeof customerJourneyStages)[number];

/** How implementation is paid — mirrors the public page's Implementation
 * Payment Plan. Vocabulary is deliberate: this is a payment plan, never
 * described as financing, a loan, or credit. */
export type ImplementationPaymentChoice = "upfront" | "monthly";

/** 3Stone Care levels. The recommendation is a manual discovery decision —
 * there is intentionally no function here that picks one. */
export type CareTier = "starter" | "professional" | "enterprise";

export interface ProposalBusinessInfo {
  businessName: string;
  industryKey: string | null;
  industryLabel: string | null;
  employees: number;
  locations: number;
}

/** Estimated figures as shown on the pricing page. Null price = Enterprise:
 * custom pricing scoped during discovery. */
export interface ProposalPricingSummary {
  tierKey: TierQuote["tierKey"];
  tierLabel: string;
  estimatedMonthlySubscription: number | null;
  estimatedFirstYearInvestment: number | null;
}

export interface ProposalImplementationPlan {
  /** The engine's implementation estimate; null = scoped on the call. */
  estimatedInvestmentOneTime: number | null;
  paymentChoice: ImplementationPaymentChoice;
  /** Estimated monthly implementation payment (estimate ÷ spreadMonths)
   * when the Monthly Implementation Option is chosen; null otherwise. */
  estimatedMonthlyPayment: number | null;
  /** 12 for the Monthly Implementation Option; null when paid upfront. */
  spreadMonths: number | null;
  implementationWeeks: string;
  trainingHours: string;
}

/** Tool keys grouped by the visitor's Keep / Replace choice (tools left
 * untouched are not part of a proposal). */
export interface ProposalSoftwareSelection {
  keepKeys: string[];
  keepNames: string[];
  replaceKeys: string[];
  replaceNames: string[];
}

export interface ProposalRoiSummary {
  kind: RoiOutcomeKind;
  monthlyDelta: number;
  annualDelta: number;
}

/** The full data contract a generated proposal document will render from.
 * A draft is assembled from the pricing page's state the moment a visitor
 * books discovery; discovery then fills in what is deliberately manual
 * (Care tier, notes, final scope). */
export interface Proposal {
  /** Deterministic configuration id — matches the workspace preview and
   * the Calendly handoff, so a salesperson can rebuild the exact setup. */
  previewId: string;
  createdAt: string;
  /** Where this customer is in the journey; a fresh draft sits at
   * "discovery-call" because the proposal is written after that call. */
  stage: CustomerJourneyStage;
  business: ProposalBusinessInfo;
  pricing: ProposalPricingSummary;
  implementation: ProposalImplementationPlan;
  /** Chosen manually during discovery — never auto-recommended. */
  recommendedCareTier: CareTier | null;
  software: ProposalSoftwareSelection;
  /** Tool keys the customer keeps AND connects to 3Stone One. */
  integrationKeys: string[];
  /** Recommended 3Stone One module keys (from the public engine). */
  moduleKeys: string[];
  currentSpend: { estimatedMonthly: number; estimatedAnnual: number };
  estimatedRoi: ProposalRoiSummary | null;
  /** Placeholder until discovery: filled in by the salesperson. */
  discoveryNotes: string;
}

/** Assemble a Proposal draft from the exact objects the pricing page
 * already computes. Pure composition — no new pricing math. */
export function prepareProposalDraft(
  selection: StackSelection,
  spend: CurrentSpend,
  quote: TierQuote,
  roi: RoiOutcome | null,
  options: {
    implementationPaymentChoice: ImplementationPaymentChoice;
    recommendedCareTier?: CareTier | null;
    discoveryNotes?: string;
    now?: Date;
  }
): Proposal {
  const migration = buildMigrationPlan(selection);
  const industry = selection.industryKey ? getIndustry(selection.industryKey) : undefined;

  const chosen = (choice: "keep" | "replace") =>
    Object.entries(selection.tools)
      .filter(([, c]) => c === choice)
      .map(([key]) => key);
  const keepKeys = chosen("keep");
  const replaceKeys = chosen("replace");
  const names = (keys: string[]) => keys.map((key) => getTool(key)?.name ?? key);

  const monthly =
    options.implementationPaymentChoice === "monthly" && quote.implementationOneTime !== null;

  return {
    previewId: previewId(selection),
    createdAt: (options.now ?? new Date()).toISOString(),
    stage: "discovery-call",
    business: {
      businessName: selection.businessName,
      industryKey: selection.industryKey,
      industryLabel: industry?.label ?? null,
      employees: selection.employees,
      locations: selection.locations,
    },
    pricing: {
      tierKey: quote.tierKey,
      tierLabel: quote.tierLabel,
      estimatedMonthlySubscription: quote.monthlySubscription,
      estimatedFirstYearInvestment: quote.firstYearInvestment,
    },
    implementation: {
      estimatedInvestmentOneTime: quote.implementationOneTime,
      paymentChoice: options.implementationPaymentChoice,
      estimatedMonthlyPayment: monthly ? quote.implementationOneTime! / 12 : null,
      spreadMonths: monthly ? 12 : null,
      implementationWeeks: migration.implementationWeeks,
      trainingHours: migration.trainingHours,
    },
    recommendedCareTier: options.recommendedCareTier ?? null,
    software: {
      keepKeys,
      keepNames: names(keepKeys),
      replaceKeys,
      replaceNames: names(replaceKeys),
    },
    integrationKeys: keepKeys.filter((key) => Boolean(getTool(key)?.canKeepAndConnect)),
    moduleKeys: quote.modules,
    currentSpend: { estimatedMonthly: spend.monthly, estimatedAnnual: spend.annual },
    estimatedRoi: roi
      ? { kind: roi.kind, monthlyDelta: roi.monthlyDelta, annualDelta: roi.annualDelta }
      : null,
    discoveryNotes: options.discoveryNotes ?? "",
  };
}
