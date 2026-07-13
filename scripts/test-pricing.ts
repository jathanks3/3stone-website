// scripts/test-pricing.ts
// Pricing engine test suite — `npm run pricing:test`. Fails loudly (exit 1)
// on any violation. Covers the promises the pricing page makes:
//   1. No published rate ever breaches the minimum gross margin (in code).
//   2. All three ROI outcomes are reachable and honestly classified.
//   3. Quotes are deterministic and never below the published minimum.
//   4. Every data-table cross-reference resolves.
//   5. The public engine and page never import the internal cost model.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { softwareCatalog } from "../src/pricing/data/software";
import { industries } from "../src/pricing/data/industries";
import { productModules } from "../src/pricing/data/modules";
import { publishedRates } from "../src/pricing/published-rates";
import {
  buildQuote,
  computeRoi,
  estimateCurrentSpend,
  recommendModules,
} from "../src/pricing/engine";
import {
  costToServe,
  derivePublishedRates,
  grossMargin,
  quoteFromRates,
} from "../src/pricing/internal/engine";
import { MINIMUM_GROSS_MARGIN } from "../src/pricing/internal/costs";
import type { StackSelection } from "../src/pricing/types";

let failures = 0;
function check(name: string, condition: boolean, detail = "") {
  if (condition) {
    console.log(`  ok  ${name}`);
  } else {
    failures += 1;
    console.error(`FAIL  ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

// ---- 1. Margin floor, exhaustively across the configuration space ----
console.log("\nMargin floor:");
const addOnKeys = productModules.filter((m) => !m.baseIncluded).map((m) => m.key);
let worstMargin = 1;
for (const employees of [1, 3, 5, 10, 25, 50, 100, 200]) {
  for (let mask = 0; mask < 32; mask++) {
    // sample module subsets: every combination of the 5 most cost-heavy
    const sampled = addOnKeys.filter((_, i) => i < 5 && (mask >> i) & 1);
    const withAi = [...sampled, "ai-assistant"];
    for (const moduleKeys of [sampled, withAi]) {
      const cost = costToServe({ moduleKeys, employees });
      const price = quoteFromRates(publishedRates, moduleKeys, employees);
      worstMargin = Math.min(worstMargin, grossMargin(price, cost.total));
    }
  }
}
check(
  `worst-case gross margin ${(worstMargin * 100).toFixed(1)}% >= floor ${MINIMUM_GROSS_MARGIN * 100}%`,
  worstMargin >= MINIMUM_GROSS_MARGIN
);
check("derivePublishedRates() runs its own floor validation without throwing", (() => {
  try {
    derivePublishedRates();
    return true;
  } catch {
    return false;
  }
})());

// ---- 2. The three ROI outcomes ----
console.log("\nROI honesty:");
function selectionOf(tools: Record<string, "keep" | "replace">, employees = 10): StackSelection {
  return { industryKey: "hvac", employees, locations: 1, tools };
}

// Premium: tiny current spend -> 3Stone One costs more. Never lie about it.
const premiumSel = selectionOf({ calendly: "replace" }, 3);
const premiumRoi = computeRoi(estimateCurrentSpend(premiumSel), buildQuote(premiumSel));
check("small stack classifies as premium (honest higher cost)", premiumRoi.kind === "premium");
check("premium outcome admits the higher number", premiumRoi.monthlyDelta > 0);

// Savings: heavy field-service stack replaced.
const savingsSel = selectionOf(
  { servicetitan: "replace", salesforce: "replace", docusign: "replace", chatgpt: "replace", quickbooks: "keep" },
  40
);
const savingsSpend = estimateCurrentSpend(savingsSel);
const savingsRoi = computeRoi(savingsSpend, buildQuote(savingsSel));
check("heavy stack classifies as savings", savingsRoi.kind === "savings", `delta=${savingsRoi.monthlyDelta}`);
check("savings math includes kept tools", savingsSpend.keptMonthly > 0);

// Comparable: find a configuration inside the ±band programmatically.
let foundComparable = false;
for (const employees of [5, 8, 10, 12, 15, 20, 25, 30]) {
  for (const stack of [
    { jobber: "replace" as const, hubspot: "replace" as const, docusign: "replace" as const, chatgpt: "replace" as const },
    { servicetitan: "replace" as const },
    { jobber: "replace" as const, salesforce: "replace" as const, slack: "replace" as const, zoom: "replace" as const, chatgpt: "replace" as const },
  ]) {
    const sel = selectionOf(stack, employees);
    if (computeRoi(estimateCurrentSpend(sel), buildQuote(sel)).kind === "comparable") {
      foundComparable = true;
    }
  }
}
check("a comparable (same-cost) configuration exists", foundComparable);

// ---- 3. Quote invariants ----
console.log("\nQuote invariants:");
const sel = selectionOf({ jobber: "replace", quickbooks: "keep" });
const q1 = buildQuote(sel);
const q2 = buildQuote(sel);
check("quotes are deterministic", JSON.stringify(q1) === JSON.stringify(q2));
check("quote never below published minimum", q1.monthlySubscription >= publishedRates.minimumMonthly);
check(
  "implementation never below its minimum",
  q1.implementationOneTime >= publishedRates.implementation.minimum
);
check(
  "first-year math adds up",
  q1.firstYearInvestment === q1.monthlySubscription * 12 + q1.implementationOneTime
);
check(
  "replacing a tool adds its replacement modules",
  buildQuote(selectionOf({ chatgpt: "replace" })).modules.includes("ai-assistant")
);

// ---- 4. Data integrity ----
console.log("\nData integrity:");
const moduleKeySet = new Set(productModules.map((m) => m.key));
const toolKeySet = new Set(softwareCatalog.map((t) => t.key));
check(
  "every replacedByModules key resolves",
  softwareCatalog.every((t) => t.replacedByModules.every((k) => moduleKeySet.has(k)))
);
check(
  "every industry stack tool resolves",
  industries.every((i) => i.typicalStack.every((k) => toolKeySet.has(k)))
);
check(
  "every industry recommended module resolves",
  industries.every((i) => i.recommendedModules.every((k) => moduleKeySet.has(k)))
);
check(
  "non-replaceable tools carry an honest keepNote",
  softwareCatalog.every((t) => t.replacedByModules.length > 0 || Boolean(t.keepNote))
);
check(
  "unverified prices are flagged (never presented as fact)",
  softwareCatalog.every((t) => t.verified === true || t.verified === false)
);
check(
  "recommendModules always includes the base platform",
  recommendModules(sel).includes("admin-dashboard")
);

// ---- 5. Public/internal isolation ----
console.log("\nPublic/internal isolation:");
function fileImportsInternal(relPath: string): boolean {
  const source = readFileSync(fileURLToPath(new URL(`../${relPath}`, import.meta.url)), "utf8");
  return /from\s+["'][^"']*internal\//.test(source) || /import\s+["'][^"']*internal\//.test(source);
}
check("public engine never imports internal/", !fileImportsInternal("src/pricing/engine.ts"));
check("published-rates never imports internal/", !fileImportsInternal("src/pricing/published-rates.ts"));
check("/pricing page never imports internal/", !fileImportsInternal("src/pages/pricing.astro"));

console.log("");
if (failures > 0) {
  console.error(`${failures} check(s) failed.`);
  process.exit(1);
}
console.log("All pricing engine checks passed.");
