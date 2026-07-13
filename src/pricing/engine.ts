// src/pricing/engine.ts
// ── PUBLIC ── everything the /pricing page computes in the browser.
// May import ONLY: types, data/* (the software catalog is public
// knowledge), and published-rates (final retail prices). It must never
// import src/pricing/internal/* — scripts/test-pricing.ts fails the build
// check if that ever happens.

import type {
  CurrentSpend,
  PriceQuote,
  RoiOutcome,
  SpendLine,
  StackSelection,
} from "./types";
import { getTool, softwareCatalog } from "./data/software";
import { baseModuleKeys, productModules } from "./data/modules";
import { getIndustry } from "./data/industries";
import { publishedRates } from "./published-rates";

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

/** Base platform + the industry's recommendation + whatever is needed to
 * replace the tools the visitor marked REPLACE. */
export function recommendModules(selection: StackSelection): string[] {
  const keys = new Set<string>(baseModuleKeys);
  const industry = selection.industryKey ? getIndustry(selection.industryKey) : undefined;
  for (const key of industry?.recommendedModules ?? []) keys.add(key);
  for (const [toolKey, choice] of Object.entries(selection.tools)) {
    if (choice !== "replace") continue;
    for (const moduleKey of getTool(toolKey)?.replacedByModules ?? []) keys.add(moduleKey);
  }
  // Stable, catalog-ordered output.
  return productModules.filter((m) => keys.has(m.key)).map((m) => m.key);
}

export function buildQuote(selection: StackSelection): PriceQuote {
  const modules = recommendModules(selection);
  const addOns = modules.filter(
    (key) => !productModules.find((m) => m.key === key)?.baseIncluded
  );

  let monthly =
    publishedRates.basePlatformMonthly +
    selection.employees * publishedRates.perEmployeeMonthly;
  for (const key of addOns) monthly += publishedRates.moduleMonthly[key] ?? 0;
  if (modules.includes("ai-assistant")) {
    monthly += selection.employees * publishedRates.aiPerEmployeeMonthly;
  }
  monthly = Math.max(monthly, publishedRates.minimumMonthly);

  const replacedCount = Object.values(selection.tools).filter((c) => c === "replace").length;
  const implementation = Math.max(
    publishedRates.implementation.minimum,
    publishedRates.implementation.base +
      addOns.length * publishedRates.implementation.perModule +
      replacedCount * publishedRates.implementation.perReplacedTool
  );

  return {
    modules,
    monthlySubscription: monthly,
    implementationOneTime: implementation,
    firstYearInvestment: monthly * 12 + implementation,
  };
}

/** Honest three-outcome comparison. "New total" = the tools you keep plus
 * 3Stone One; we never hide kept-tool spend to manufacture savings. */
export function computeRoi(spend: CurrentSpend, quote: PriceQuote): RoiOutcome {
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
    };
  }
  if (spend.monthly > 0 && Math.abs(monthlyDelta) < comparableBand) {
    return {
      kind: "comparable",
      monthlyDelta,
      annualDelta: monthlyDelta * 12,
      headline: "About the same monthly cost — one platform instead of many.",
      explanation:
        "You replace multiple disconnected systems with one platform: one login, one dashboard, one AI, and your whole business in view.",
    };
  }
  return {
    kind: "premium",
    monthlyDelta,
    annualDelta: monthlyDelta * 12,
    headline: "A modest step up in investment — a big step up in capability.",
    explanation:
      "You gain automation, AI, approvals, reporting, and one place to run the business — capability your current stack doesn't have. We'd rather show you the honest number than a manufactured saving.",
  };
}

export function formatMoney(value: number): string {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

/** Plain-text summary the salesperson sees before the call. */
export function buildDiscoverySummary(
  selection: StackSelection,
  spend: CurrentSpend,
  quote: PriceQuote,
  roi: RoiOutcome
): string {
  const industry = selection.industryKey ? getIndustry(selection.industryKey)?.label : "Not selected";
  const keep = Object.entries(selection.tools)
    .filter(([, c]) => c === "keep")
    .map(([k]) => getTool(k)?.name ?? k);
  const replace = Object.entries(selection.tools)
    .filter(([, c]) => c === "replace")
    .map(([k]) => getTool(k)?.name ?? k);
  const modules = quote.modules
    .map((key) => productModules.find((m) => m.key === key)?.label ?? key)
    .join(", ");

  return [
    `Industry: ${industry}`,
    `Employees: ${selection.employees} | Locations: ${selection.locations}`,
    `Keeping: ${keep.join(", ") || "none"}`,
    `Replacing: ${replace.join(", ") || "none"}`,
    `Current est. spend: ${formatMoney(spend.monthly)}/mo (${formatMoney(spend.annual)}/yr)`,
    `Recommended modules: ${modules}`,
    `Est. subscription: ${formatMoney(quote.monthlySubscription)}/mo`,
    `Est. implementation: ${formatMoney(quote.implementationOneTime)} one-time`,
    `Outcome: ${roi.kind} (${roi.monthlyDelta >= 0 ? "+" : ""}${formatMoney(roi.monthlyDelta)}/mo vs today)`,
  ].join("\n");
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
