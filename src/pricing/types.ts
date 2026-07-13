// src/pricing/types.ts
// Shared shapes for the pricing engine. Data lives in src/pricing/data/*
// (safe to ship to the browser) and src/pricing/internal/* (never shipped —
// see src/pricing/README.md for the public/internal split).

export type PricingModel = "flat" | "per_user" | "per_location" | "transaction";

/** How much trust to place in a competitor price estimate. */
export type PriceConfidence = "estimated" | "medium" | "high";

export interface SoftwareTool {
  key: string;
  name: string;
  category: string;
  pricingModel: PricingModel;
  /** Estimated USD list price: flat = per business/mo; per_user = per
   * seat/mo; per_location = per location/mo; transaction = 0 (fees only). */
  estMonthly: number;
  /** Fraction of employees who typically hold a seat (per_user tools). */
  seatFraction?: number;
  transactionNote?: string;
  /** Typical one-time setup/onboarding the business already paid. */
  estImplementation: number;
  /** True only after checking the vendor's current public pricing page. */
  verified: boolean;
  /** ISO date a human last checked sourceUrl, or null if never. */
  lastVerified: string | null;
  /** Where the price should be verified against. */
  sourceUrl: string;
  confidence: PriceConfidence;
  /** 3Stone One modules that replace this tool. May be empty for mature
   * platforms we advise keeping — replacing is still allowed; the page
   * shows the advisory and the discovery call evaluates the fit. */
  replacedByModules: string[];
  canKeepAndConnect: boolean;
  /** Why we advise keeping this tool (advisor voice, shown in WHY section). */
  whyKeep?: string;
  /** Premium advisory shown if the visitor chooses Replace on a tool we
   * advise keeping. Educates — never blocks. */
  advisory?: string;
}

export interface IndustryPreviewTerms {
  /** What this industry calls projects (e.g. "Jobs", "Cases", "Events"). */
  projects: string;
  /** What this industry calls clients (e.g. "Customers", "Clients", "Patients"). */
  clients: string;
  /** Three realistic sample work items for the workspace preview. */
  sampleProjects: { name: string; status: string }[];
  /** One-line AI daily summary for the preview ({n} = open items). */
  aiSummary: string;
}

export interface Industry {
  key: string;
  label: string;
  typicalStack: string[];
  recommendedModules: string[];
  defaultEmployees: number;
  defaultLocations: number;
  preview: IndustryPreviewTerms;
}

export interface ProductModule {
  key: string;
  label: string;
  blurb: string;
  baseIncluded: boolean;
}

/** A business pain the visitor can select; selecting it pulls modules into
 * the recommendation and a line into the WHY section. */
export interface PainPoint {
  key: string;
  statement: string;
  modules: string[];
  why: string;
}

/** Public tier composition (module sets and copy are public knowledge;
 * price BANDS and margins live in internal/ — only the final derived
 * price per tier is published). */
export interface TierDefinition {
  key: "hub" | "growth" | "business-os";
  label: string;
  blurb: string;
  /** Add-on modules included (base modules are always included). */
  includedModules: string[];
}

export type ToolChoice = "keep" | "replace" | "not-using";

export interface StackSelection {
  industryKey: string | null;
  businessName: string;
  employees: number;
  locations: number;
  /** Explicit tri-state per tool; absent = untouched (treated not-using). */
  tools: Record<string, ToolChoice>;
  painKeys: string[];
}

export interface SpendLine {
  key: string;
  name: string;
  monthly: number;
  choice: ToolChoice;
  estimated: boolean;
  transactionNote?: string;
}

export interface CurrentSpend {
  monthly: number;
  annual: number;
  implementationPaid: number;
  keptMonthly: number;
  replacedMonthly: number;
  lines: SpendLine[];
}

/** One line of the WHY WE RECOMMEND THIS section. */
export interface RecommendationReason {
  kind: "keep" | "replace" | "pain" | "advisory";
  toolKey?: string;
  text: string;
}

export interface TierQuote {
  /** null tierKey = Enterprise: price is a discovery-call conversation. */
  tierKey: TierDefinition["key"] | null;
  tierLabel: string;
  monthlySubscription: number | null;
  modules: string[];
  implementationOneTime: number | null;
  firstYearInvestment: number | null;
  /** Why this landed on Enterprise, when it did. */
  enterpriseReason?: string;
  reasons: RecommendationReason[];
}

export type RoiOutcomeKind = "savings" | "comparable" | "premium";

export interface RoiOutcome {
  kind: RoiOutcomeKind;
  monthlyDelta: number;
  annualDelta: number;
  headline: string;
  explanation: string;
  /** What the extra investment buys — shown for the premium outcome. */
  gains: string[];
}

export interface MigrationPlan {
  keep: string[];
  replace: string[];
  integrate: string[];
  implementationWeeks: string;
  trainingHours: string;
  goLiveRange: string;
  approach: string;
}

/** The published, browser-safe pricing. GENERATED by the internal engine
 * (npm run pricing:publish) — costs and margins never ship. */
export interface PublishedTier {
  key: TierDefinition["key"];
  label: string;
  priceMonthly: number;
  /** Team size this tier serves; larger teams route to Enterprise. */
  maxEmployees: number;
}

export interface PublishedPricing {
  generatedAt: string;
  tiers: PublishedTier[];
  implementation: {
    base: number;
    perModule: number;
    perReplacedTool: number;
    minimum: number;
  };
}
