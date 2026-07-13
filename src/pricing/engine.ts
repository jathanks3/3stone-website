// src/pricing/engine.ts
// ── PUBLIC ── everything the /pricing page computes in the browser.
// May import ONLY: types, data/* (public knowledge), and
// published-pricing (final retail prices). It must never import
// src/pricing/internal/* — scripts/test-pricing.ts fails if it does.

import type {
  CurrentSpend,
  MigrationPlan,
  RecommendationReason,
  RoiOutcome,
  SpendLine,
  StackSelection,
  TierQuote,
} from "./types";
import { getTool } from "./data/software";
import { baseModuleKeys, productModules } from "./data/modules";
import { getIndustry } from "./data/industries";
import { getPain } from "./data/pains";
import { tiers, ENTERPRISE_LABEL } from "./data/tiers";
import { publishedPricing } from "./published-pricing";

/** Locations beyond this deserve a scoped conversation, not a widget. */
const ENTERPRISE_LOCATIONS_THRESHOLD = 3;

export function toolMonthlyCost(
  toolKey: string,
  employees: number,
  locations: number
): number {
  const tool = getTool(toolKey);
  if (!tool) return 0;
  switch (tool.pricingModel) {
    case "flat":
      return tool.estMonthly;
    case "per_user":
      return tool.estMonthly * Math.max(1, Math.ceil(employees * (tool.seatFraction ?? 1)));
    case "per_location":
      return tool.estMonthly * Math.max(1, locations);
    case "transaction":
      return 0;
  }
}

export function estimateCurrentSpend(selection: StackSelection): CurrentSpend {
  const lines: SpendLine[] = [];
  let keptMonthly = 0;
  let replacedMonthly = 0;
  let implementationPaid = 0;

  for (const [key, choice] of Object.entries(selection.tools)) {
    if (choice === "not-using") continue;
    const tool = getTool(key);
    if (!tool) continue;
    const monthly = toolMonthlyCost(key, selection.employees, selection.locations);
    lines.push({
      key,
      name: tool.name,
      monthly,
      choice,
      estimated: !tool.verified,
      transactionNote: tool.transactionNote,
    });
    if (choice === "replace") replacedMonthly += monthly;
    else keptMonthly += monthly;
    implementationPaid += tool.estImplementation;
  }

  const monthly = keptMonthly + replacedMonthly;
  return {
    monthly,
    annual: monthly * 12,
    implementationPaid,
    keptMonthly,
    replacedMonthly,
    lines: lines.sort((a, b) => b.monthly - a.monthly),
  };
}

/** Base platform + whatever replaces the tools marked REPLACE + whatever
 * the selected pains call for. Deliberately NOT the industry preset:
 * recommendations come from what the visitor told us hurts, so a
 * keep-everything business lands on Hub (connect) rather than being
 * upsold a preset they never asked for. Industry choice shapes the
 * workspace preview and the conversation, not the bill. */
export function recommendModules(selection: StackSelection): string[] {
  const keys = new Set<string>(baseModuleKeys);
  for (const [toolKey, choice] of Object.entries(selection.tools)) {
    if (choice !== "replace") continue;
    for (const moduleKey of getTool(toolKey)?.replacedByModules ?? []) keys.add(moduleKey);
  }
  for (const painKey of selection.painKeys) {
    for (const moduleKey of getPain(painKey)?.modules ?? []) keys.add(moduleKey);
  }
  return productModules.filter((m) => keys.has(m.key)).map((m) => m.key);
}

function moduleLabels(keys: string[]): string {
  return keys
    .map((key) => productModules.find((m) => m.key === key)?.label ?? key)
    .join(", ");
}

/** Every recommendation, explained — the WHY WE RECOMMEND THIS section. */
export function buildReasons(selection: StackSelection): RecommendationReason[] {
  const reasons: RecommendationReason[] = [];

  for (const [toolKey, choice] of Object.entries(selection.tools)) {
    const tool = getTool(toolKey);
    if (!tool) continue;
    if (choice === "keep" && tool.whyKeep) {
      reasons.push({
        kind: "keep",
        toolKey,
        text: `We recommend keeping ${tool.name}. ${tool.whyKeep}`,
      });
    }
    if (choice === "replace") {
      if (tool.replacedByModules.length > 0) {
        reasons.push({
          kind: "replace",
          toolKey,
          text: `We recommend replacing ${tool.name} because ${moduleLabels(tool.replacedByModules)} ${tool.replacedByModules.length > 1 ? "are" : "is"} built directly into 3Stone One.`,
        });
      } else if (tool.advisory) {
        reasons.push({ kind: "advisory", toolKey, text: tool.advisory });
      }
    }
  }

  for (const painKey of selection.painKeys) {
    const pain = getPain(painKey);
    if (pain) reasons.push({ kind: "pain", text: pain.why });
  }

  return reasons;
}

/** Tools the visitor wants replaced against our advice — flagged for the
 * discovery call, never blocked. */
export function discoveryReviewTools(selection: StackSelection): string[] {
  return Object.entries(selection.tools)
    .filter(([key, choice]) => {
      const tool = getTool(key);
      return choice === "replace" && tool && tool.replacedByModules.length === 0;
    })
    .map(([key]) => getTool(key)!.name);
}

/** Pick the smallest launch tier that covers the recommended modules and
 * the team size; route to Enterprise when nothing fits. */
export function buildQuote(selection: StackSelection): TierQuote {
  const modules = recommendModules(selection);
  const reasons = buildReasons(selection);
  const addOns = modules.filter(
    (key) => !productModules.find((m) => m.key === key)?.baseIncluded
  );
  const replacedCount = Object.values(selection.tools).filter((c) => c === "replace").length;

  const enterprise = (reason: string): TierQuote => ({
    tierKey: null,
    tierLabel: ENTERPRISE_LABEL,
    monthlySubscription: null,
    modules,
    implementationOneTime: null,
    firstYearInvestment: null,
    enterpriseReason: reason,
    reasons,
  });

  if (selection.locations > ENTERPRISE_LOCATIONS_THRESHOLD) {
    return enterprise(
      `${selection.locations} locations deserve scoped pricing — that's a conversation, not a widget.`
    );
  }

  for (const tier of tiers) {
    const covers = addOns.every((key) => tier.includedModules.includes(key));
    if (!covers) continue;
    const published = publishedPricing.tiers.find((t) => t.key === tier.key);
    if (!published) continue;
    if (selection.employees > published.maxEmployees) continue;

    const implementation = Math.max(
      publishedPricing.implementation.minimum,
      publishedPricing.implementation.base +
        addOns.length * publishedPricing.implementation.perModule +
        replacedCount * publishedPricing.implementation.perReplacedTool
    );
    return {
      tierKey: tier.key,
      tierLabel: tier.label,
      monthlySubscription: published.priceMonthly,
      modules,
      implementationOneTime: implementation,
      firstYearInvestment: published.priceMonthly * 12 + implementation,
      reasons,
    };
  }

  return enterprise(
    "Your team size and configuration are past our standard tiers — custom pricing keeps it fair in both directions."
  );
}

/** Honest three-outcome comparison. "New total" = the tools you keep plus
 * 3Stone One; we never hide kept-tool spend to manufacture savings.
 * Enterprise quotes have no public price, so no ROI claim is made. */
export function computeRoi(
  spend: CurrentSpend,
  quote: TierQuote,
  selection: StackSelection
): RoiOutcome | null {
  if (quote.monthlySubscription === null) return null;

  const gains = [
    "One dashboard for the whole business",
    ...(quote.modules.includes("ai-assistant") ? ["AI that knows your whole business"] : []),
    "Less time lost switching between apps",
    ...(quote.modules.includes("automation") ? ["Automation doing the repeated work"] : []),
    "Better visibility into every job and dollar",
    "Owner-level control in one place",
  ];

  const newTotal = spend.keptMonthly + quote.monthlySubscription;
  const monthlyDelta = newTotal - spend.monthly;
  const comparableBand = Math.max(25, spend.monthly * 0.05);

  if (spend.monthly > 0 && monthlyDelta <= -comparableBand) {
    return {
      kind: "savings",
      monthlyDelta,
      annualDelta: monthlyDelta * 12,
      headline: "Your stack gets simpler — and cheaper.",
      explanation:
        "Replacing the tools you marked costs less than what you pay for them today, even keeping everything you love.",
      gains: [],
    };
  }
  if (spend.monthly > 0 && Math.abs(monthlyDelta) < comparableBand) {
    return {
      kind: "comparable",
      monthlyDelta,
      annualDelta: monthlyDelta * 12,
      headline: "About the same monthly cost — one platform instead of many.",
      explanation:
        "You replace multiple disconnected systems with one platform: one login, one dashboard, and your whole business in view.",
      gains: [],
    };
  }
  return {
    kind: "premium",
    monthlyDelta,
    annualDelta: monthlyDelta * 12,
    headline: "A modest step up in investment — a big step up in how you run.",
    explanation:
      "We'd rather show you the honest number than a manufactured saving. Here's what the difference buys:",
    gains,
  };
}

/** Customer-facing migration guidance. This never forces a phased wait:
 * replacing every selected tool is a valid immediate plan, while teams
 * that keep mature systems get an integration-first recommendation. */
export function buildMigrationPlan(selection: StackSelection): MigrationPlan {
  const keep = Object.entries(selection.tools)
    .filter(([, choice]) => choice === "keep")
    .map(([key]) => getTool(key)?.name ?? key);
  const replace = Object.entries(selection.tools)
    .filter(([, choice]) => choice === "replace")
    .map(([key]) => getTool(key)?.name ?? key);
  const integrate = Object.entries(selection.tools)
    .filter(([key, choice]) => choice === "keep" && Boolean(getTool(key)?.canKeepAndConnect))
    .map(([key]) => getTool(key)?.name ?? key);

  const complexity = replace.length + Math.max(0, selection.locations - 1) * 2;
  const implementationWeeks = complexity >= 6 || selection.employees > 50
    ? "6–10 weeks"
    : complexity >= 3 || selection.employees > 20
      ? "4–6 weeks"
      : "2–3 weeks";
  const trainingHours = selection.employees > 30
    ? "Two role-based sessions (about 6 hours total)"
    : selection.employees > 10
      ? "One half-day team session"
      : "One 2-hour guided session";

  const usedCount = Object.values(selection.tools).filter((choice) => choice !== "not-using").length;
  const completeMigration = usedCount > 0 && replace.length === usedCount;
  const approach = completeMigration
    ? "Complete migration: move the selected systems into 3Stone One in one coordinated implementation."
    : replace.length === 0
      ? "Operating-hub launch: keep every current system and connect 3Stone One as the owner’s command center."
      : "Focused migration: replace the tools you selected and connect the systems you want to keep.";

  return {
    keep,
    replace,
    integrate,
    implementationWeeks,
    trainingHours,
    goLiveRange: implementationWeeks,
    approach,
  };
}

export function formatMoney(value: number): string {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

/** Deterministic short ID for a configuration — shown on the preview and
 * passed to the discovery call so the salesperson can rebuild it. */
export function previewId(selection: StackSelection): string {
  const json = JSON.stringify([
    selection.industryKey,
    selection.employees,
    selection.locations,
    selection.tools,
    [...selection.painKeys].sort(),
  ]);
  let hash = 5381;
  for (let i = 0; i < json.length; i++) {
    hash = ((hash << 5) + hash + json.charCodeAt(i)) >>> 0;
  }
  return `WS-${hash.toString(36).toUpperCase().padStart(7, "0")}`;
}

/** Everything the salesperson needs before the meeting starts. */
export function buildDiscoverySummary(
  selection: StackSelection,
  spend: CurrentSpend,
  quote: TierQuote,
  roi: RoiOutcome | null
): string {
  const industry = selection.industryKey ? getIndustry(selection.industryKey)?.label : "Not selected";
  const keep = Object.entries(selection.tools)
    .filter(([, c]) => c === "keep")
    .map(([k]) => getTool(k)?.name ?? k);
  const replace = Object.entries(selection.tools)
    .filter(([, c]) => c === "replace")
    .map(([k]) => getTool(k)?.name ?? k);
  const pains = selection.painKeys.map((k) => getPain(k)?.statement ?? k);
  const review = discoveryReviewTools(selection);
  const migration = buildMigrationPlan(selection);

  return [
    `Preview: ${previewId(selection)}`,
    `Business: ${selection.businessName || "(not given)"} | Industry: ${industry}`,
    `Employees: ${selection.employees} | Locations: ${selection.locations}`,
    `Keeping: ${keep.join(", ") || "none"}`,
    `Replacing: ${replace.join(", ") || "none"}`,
    review.length > 0 ? `Wants to replace (advised keep — review on call): ${review.join(", ")}` : "",
    `Pains: ${pains.join(" / ") || "none selected"}`,
    `Current est. spend: ${formatMoney(spend.monthly)}/mo (${formatMoney(spend.annual)}/yr)`,
    `Recommended: ${quote.tierLabel}${quote.monthlySubscription !== null ? ` — ${formatMoney(quote.monthlySubscription)}/mo` : " (custom pricing)"}`,
    quote.implementationOneTime !== null
      ? `Est. implementation: ${formatMoney(quote.implementationOneTime)} one-time`
      : "Implementation: scoped on the call",
    `Migration: ${migration.approach}`,
    `Integrate: ${migration.integrate.join(", ") || "none"}`,
    `Training: ${migration.trainingHours} | Expected go-live: ${migration.goLiveRange}`,
    roi
      ? `Outcome: ${roi.kind} (${roi.monthlyDelta >= 0 ? "+" : ""}${formatMoney(roi.monthlyDelta)}/mo vs today)`
      : "Outcome: custom (Enterprise)",
  ]
    .filter(Boolean)
    .join("\n");
}

/** Discovery-call URL carrying the summary: UTM params for attribution
 * plus Calendly's a1 custom-answer prefill (shows in the event details if
 * the Calendly event has at least one custom question). */
export function buildCalendlyUrl(baseUrl: string, summary: string): string {
  const url = new URL(baseUrl);
  url.searchParams.set("utm_source", "website");
  url.searchParams.set("utm_medium", "pricing_builder");
  url.searchParams.set("utm_campaign", "stack_builder");
  const compact = summary.replace(/\n/g, " | ");
  url.searchParams.set("utm_content", compact.slice(0, 250));
  url.searchParams.set("a1", compact.slice(0, 900));
  return url.toString();
}
