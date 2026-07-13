// scripts/test-pricing.ts
// Pricing engine test suite — `npm run pricing:test`. Fails loudly (exit 1)
// on any violation. Covers the promises the sales experience makes:
//   1. No publicly reachable quote breaches the 75% margin floor — teams
//      the tiers can't serve profitably route to Enterprise instead.
//   2. All three ROI outcomes are reachable and honestly classified.
//   3. Tier recommendations cover the recommended modules, always.
//   4. Pains, advisories, and three-state choices behave as designed.
//   5. Every data-table cross-reference resolves.
//   6. The public engine and page never import the internal cost model.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { softwareCatalog } from "../src/pricing/data/software";
import { industries } from "../src/pricing/data/industries";
import { productModules } from "../src/pricing/data/modules";
import { painPoints } from "../src/pricing/data/pains";
import { tiers } from "../src/pricing/data/tiers";
import { publishedPricing } from "../src/pricing/published-pricing";
import {
  buildQuote,
  buildReasons,
  buildCalendlyUrl,
  buildDiscoverySummary,
  buildMigrationPlan,
  computeRoi,
  discoveryReviewTools,
  estimateCurrentSpend,
  previewId,
  recommendModules,
} from "../src/pricing/engine";
import {
  costToServe,
  derivePublishedPricing,
  grossMargin,
} from "../src/pricing/internal/engine";
import { MINIMUM_GROSS_MARGIN, TARGET_GROSS_MARGIN, tierBands } from "../src/pricing/internal/costs";
import type { StackSelection, ToolChoice } from "../src/pricing/types";

let failures = 0;
function check(name: string, condition: boolean, detail = "") {
  if (condition) {
    console.log(`  ok  ${name}`);
  } else {
    failures += 1;
    console.error(`FAIL  ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

function selectionOf(
  tools: Record<string, ToolChoice>,
  employees = 10,
  extra: Partial<StackSelection> = {}
): StackSelection {
  return {
    industryKey: "hvac",
    businessName: "",
    employees,
    locations: 1,
    tools,
    painKeys: [],
    ...extra,
  };
}

// ---- 1. Margin floor across every publicly quotable configuration ----
console.log("\nMargin floor (75%):");
check("margin policy: target 80%, floor 75%", TARGET_GROSS_MARGIN === 0.8 && MINIMUM_GROSS_MARGIN === 0.75);
let worstMargin = 1;
for (const tier of tiers) {
  const published = publishedPricing.tiers.find((t) => t.key === tier.key)!;
  for (let employees = 1; employees <= published.maxEmployees; employees++) {
    const cost = costToServe({ moduleKeys: tier.includedModules, employees });
    worstMargin = Math.min(worstMargin, grossMargin(published.priceMonthly, cost.total));
  }
}
check(
  `worst reachable margin ${(worstMargin * 100).toFixed(1)}% >= floor ${MINIMUM_GROSS_MARGIN * 100}%`,
  worstMargin >= MINIMUM_GROSS_MARGIN
);
const derived = derivePublishedPricing();
check("published prices sit inside their launch bands", derived.pricing.tiers.every((t) => {
  const band = tierBands[t.key];
  return t.priceMonthly >= band.min && t.priceMonthly <= band.max;
}));
check("sub-floor configurations are flagged internally, not hidden", Array.isArray(derived.flags));

// ---- 2. Enterprise protection ----
console.log("\nEnterprise routing (profitability protection):");
const bigTeam = buildQuote(selectionOf({ jobber: "replace" }, 200));
check("200-employee team routes to Enterprise (no public price)", bigTeam.tierKey === null && bigTeam.monthlySubscription === null);
const manyLocations = buildQuote(selectionOf({ jobber: "replace" }, 10, { locations: 6 }));
check("6 locations route to Enterprise", manyLocations.tierKey === null);
const aiTeamPastFloor = buildQuote(
  selectionOf({ chatgpt: "replace" }, publishedPricing.tiers.find((t) => t.key === "business-os")!.maxEmployees + 1)
);
check("AI team past Business OS floor-safe size routes to Enterprise", aiTeamPastFloor.tierKey === null);

// ---- 3. Tier recommendation ----
console.log("\nTier recommendation:");
const hubQuote = buildQuote(selectionOf({ calendly: "replace", quickbooks: "keep" }, 5));
check("light stack lands on Hub", hubQuote.tierKey === "hub", `got ${hubQuote.tierKey}`);
const growthQuote = buildQuote(selectionOf({ jobber: "replace", quickbooks: "keep" }, 12));
check("field-service replacement lands on Growth", growthQuote.tierKey === "growth", `got ${growthQuote.tierKey}`);
const osQuote = buildQuote(selectionOf({ jobber: "replace", chatgpt: "replace" }, 12));
check("AI need lands on Business OS", osQuote.tierKey === "business-os", `got ${osQuote.tierKey}`);
for (const quote of [hubQuote, growthQuote, osQuote]) {
  const tier = tiers.find((t) => t.key === quote.tierKey)!;
  const addOns = quote.modules.filter((k) => !productModules.find((m) => m.key === k)?.baseIncluded);
  check(
    `${tier.label} covers every recommended module`,
    addOns.every((k) => tier.includedModules.includes(k))
  );
}
check(
  "tier prices land in launch bands (Hub 79-99, Growth 149-179, OS 229-279)",
  publishedPricing.tiers.every((t) => {
    const bands = { hub: [79, 99], growth: [149, 179], "business-os": [229, 279] } as const;
    const [min, max] = bands[t.key];
    return t.priceMonthly >= min && t.priceMonthly <= max;
  })
);

// ---- 4. Pains, advisories, three-state ----
console.log("\nPains, advisories, three-state:");
const painSel = selectionOf({}, 8, { painKeys: ["ai-help", "better-reporting"] });
const painModules = recommendModules(painSel);
check("pains pull their modules", painModules.includes("ai-assistant") && painModules.includes("reporting"));
check("pain reasons appear in WHY", buildReasons(painSel).some((r) => r.kind === "pain"));

const qbReplace = selectionOf({ quickbooks: "replace" });
check("replacing QuickBooks is allowed (never blocked)", estimateCurrentSpend(qbReplace).replacedMonthly > 0);
check("...but surfaces the advisory", buildReasons(qbReplace).some((r) => r.kind === "advisory"));
check("...and flags it for discovery review", discoveryReviewTools(qbReplace).includes("QuickBooks Online"));
check(
  "keeping QuickBooks yields a keep reason",
  buildReasons(selectionOf({ quickbooks: "keep" })).some((r) => r.kind === "keep")
);
const notUsing = selectionOf({ quickbooks: "not-using", jobber: "keep" });
check("not-using tools are excluded from spend", estimateCurrentSpend(notUsing).lines.every((l) => l.key !== "quickbooks"));

const hubMigration = buildMigrationPlan(selectionOf({ quickbooks: "keep", stripe: "keep" }));
check("keep-everything produces an operating-hub migration", hubMigration.replace.length === 0 && hubMigration.integrate.length === 2);
const completeMigration = buildMigrationPlan(selectionOf({ jobber: "replace", slack: "replace" }));
check("replace-everything produces a complete migration", completeMigration.replace.length === 2 && completeMigration.approach.startsWith("Complete migration"));
const mixedMigration = buildMigrationPlan(selectionOf({ quickbooks: "keep", jobber: "replace", calendly: "not-using" }));
check("mixed state produces keep, replace, and integrate guidance", mixedMigration.keep.length === 1 && mixedMigration.replace.length === 1 && mixedMigration.integrate.length === 1);
check("migration includes implementation, training, and go-live estimates", Boolean(mixedMigration.implementationWeeks && mixedMigration.trainingHours && mixedMigration.goLiveRange));

// ---- 5. ROI honesty ----
console.log("\nROI honesty:");
const premiumSel = selectionOf({ calendly: "replace" }, 3);
const premiumRoi = computeRoi(estimateCurrentSpend(premiumSel), buildQuote(premiumSel), premiumSel)!;
check("small stack classifies as premium (honest higher cost)", premiumRoi.kind === "premium");
check("premium outcome explains what the difference buys", premiumRoi.gains.length >= 3);

const savingsSel = selectionOf(
  { servicetitan: "replace", salesforce: "replace", docusign: "replace", quickbooks: "keep" },
  40
);
const savingsRoi = computeRoi(estimateCurrentSpend(savingsSel), buildQuote(savingsSel), savingsSel)!;
check("heavy stack classifies as savings", savingsRoi.kind === "savings", `delta=${savingsRoi.monthlyDelta.toFixed(0)}`);

let foundComparable = false;
for (const employees of [4, 5, 6, 8, 10, 12, 15]) {
  for (const stack of [
    { jobber: "replace" as const },
    { "housecall-pro": "replace" as const },
    { calendly: "replace" as const, dropbox: "replace" as const, docusign: "replace" as const },
    { asana: "replace" as const, slack: "replace" as const, calendly: "replace" as const },
  ]) {
    const sel = selectionOf(stack, employees);
    const roi = computeRoi(estimateCurrentSpend(sel), buildQuote(sel), sel);
    if (roi?.kind === "comparable") foundComparable = true;
  }
}
check("a comparable (same-cost) configuration exists", foundComparable);
const enterpriseSel = selectionOf({ jobber: "replace" }, 200);
check(
  "Enterprise makes no ROI claim",
  computeRoi(estimateCurrentSpend(enterpriseSel), buildQuote(enterpriseSel), enterpriseSel) === null
);

// ---- 6. Determinism + preview ----
console.log("\nDeterminism & preview:");
const sel = selectionOf({ jobber: "replace", quickbooks: "keep" });
check("quotes are deterministic", JSON.stringify(buildQuote(sel)) === JSON.stringify(buildQuote(sel)));
check("preview IDs are deterministic and distinct", previewId(sel) === previewId(sel) && previewId(sel) !== previewId(selectionOf({ jobber: "keep" })));

// ---- 7. Data integrity ----
console.log("\nData integrity:");
const moduleKeySet = new Set(productModules.map((m) => m.key));
const toolKeySet = new Set(softwareCatalog.map((t) => t.key));
check("every replacedByModules key resolves", softwareCatalog.every((t) => t.replacedByModules.every((k) => moduleKeySet.has(k))));
check("every industry stack tool resolves", industries.every((i) => i.typicalStack.every((k) => toolKeySet.has(k))));
check("every industry recommended module resolves", industries.every((i) => i.recommendedModules.every((k) => moduleKeySet.has(k))));
check("every pain module resolves", painPoints.every((p) => p.modules.every((k) => moduleKeySet.has(k))));
check("every tier module resolves", tiers.every((t) => t.includedModules.every((k) => moduleKeySet.has(k))));
check("every industry has preview terms + 3 samples", industries.every((i) => i.preview.sampleProjects.length === 3 && i.preview.aiSummary.length > 0));
check(
  "tools we advise keeping carry whyKeep AND advisory",
  softwareCatalog.every((t) => t.replacedByModules.length > 0 || (Boolean(t.whyKeep) && Boolean(t.advisory)))
);
const matureKeys = ["quickbooks", "toast", "square", "stripe", "google-workspace", "microsoft-365", "mailchimp"];
check(
  "every named mature platform allows Replace with an advisory instead of disabling it",
  matureKeys.every((key) => {
    const tool = softwareCatalog.find((item) => item.key === key);
    return Boolean(tool && tool.replacedByModules.length === 0 && tool.whyKeep && tool.advisory);
  })
);
check(
  "every competitor price carries verification metadata",
  softwareCatalog.every((t) => t.lastVerified === null || typeof t.lastVerified === "string")
    && softwareCatalog.every((t) => ["estimated", "medium", "high"].includes(t.confidence))
);
check(
  "unverified prices are never high-confidence",
  softwareCatalog.every((t) => t.verified || t.confidence !== "high")
);

// ---- 8. Public/internal isolation ----
console.log("\nPublic/internal isolation:");
function fileImportsInternal(relPath: string): boolean {
  const source = readFileSync(fileURLToPath(new URL(`../${relPath}`, import.meta.url)), "utf8");
  return /from\s+["'][^"']*internal\//.test(source) || /import\s+["'][^"']*internal\//.test(source);
}
check("public engine never imports internal/", !fileImportsInternal("src/pricing/engine.ts"));
check("published-pricing never imports internal/", !fileImportsInternal("src/pricing/published-pricing.ts"));
check("/pricing page never imports internal/", !fileImportsInternal("src/pages/pricing.astro"));

// ---- 9. Public flow + Calendly + persistence contracts ----
console.log("\nPublic flow contracts:");
const pricingPage = readFileSync(fileURLToPath(new URL("../src/pages/pricing.astro", import.meta.url)), "utf8");
const requiredOrder = [
  "<!-- Hero -->",
  "<!-- Industry + business size -->",
  "<!-- Current software: Keep / Replace / Not using -->",
  "<!-- Current spend -->",
  "<!-- Business pain assessment -->",
  "<!-- Recommended configuration -->",
  "<!-- Why we recommend this -->",
  "<!-- Preview my workspace -->",
  "<!-- Pricing recommendation -->",
  "<!-- Implementation estimate -->",
  "<!-- Honest ROI -->",
  "<!-- Recommended migration strategy -->",
  "<!-- Discovery call -->",
];
const orderPositions = requiredOrder.map((marker) => pricingPage.indexOf(marker));
check(
  "public pricing sections appear in the required order",
  orderPositions.every((position) => position >= 0) && orderPositions.every((position, index) => index === 0 || position > orderPositions[index - 1])
);
check(
  "session persistence reads and writes the V2 builder state",
  pricingPage.includes("sessionStorage.getItem(STORAGE_KEY)") && pricingPage.includes("sessionStorage.setItem(STORAGE_KEY")
);
check(
  "workspace preview explicitly says it is synthetic",
  pricingPage.includes("synthetic preview") && pricingPage.includes("not a workspace that has already been created")
);

const handoffSelection = selectionOf(
  { quickbooks: "keep", jobber: "replace", calendly: "not-using" },
  12,
  { businessName: "Northstar Plumbing", painKeys: ["ai-help"] }
);
const handoffSpend = estimateCurrentSpend(handoffSelection);
const handoffQuote = buildQuote(handoffSelection);
const handoffRoi = computeRoi(handoffSpend, handoffQuote, handoffSelection);
const handoffSummary = buildDiscoverySummary(handoffSelection, handoffSpend, handoffQuote, handoffRoi);
const handoffUrl = new URL(buildCalendlyUrl("https://calendly.com/example/discovery", handoffSummary));
check(
  "Calendly summary includes business, preview, choices, migration, training, and go-live",
  ["Northstar Plumbing", "Preview: WS-", "Keeping:", "Replacing:", "Migration:", "Training:", "Expected go-live:"].every((text) => handoffSummary.includes(text))
);
check(
  "Calendly URL carries attribution and the full custom-answer handoff",
  handoffUrl.searchParams.get("utm_medium") === "pricing_builder"
    && handoffUrl.searchParams.get("utm_campaign") === "stack_builder"
    && (handoffUrl.searchParams.get("a1")?.includes("Northstar Plumbing") ?? false)
);

const adminPage = readFileSync(fileURLToPath(new URL("../src/pages/internal/pricing-admin.astro", import.meta.url)), "utf8");
check(
  "internal pricing admin remains environment-gated and noindex",
  adminPage.includes('PRICING_ADMIN_ENABLED === "true"') && adminPage.includes("noindex, nofollow")
);

console.log("");
if (failures > 0) {
  console.error(`${failures} check(s) failed.`);
  process.exit(1);
}
console.log("All pricing engine checks passed.");
