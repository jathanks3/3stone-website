// scripts/publish-rates.ts
// Regenerates src/pricing/published-pricing.ts from the internal cost
// model and launch tier bands. Run after editing internal/costs.ts:
//
//   npm run pricing:publish
//
// Margin flags print here (and appear on the admin dashboard) — they never
// reach the public page.

import { writeFileSync, existsSync, unlinkSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { derivePublishedPricing } from "../src/pricing/internal/engine";

const { pricing, flags } = derivePublishedPricing();

const target = fileURLToPath(new URL("../src/pricing/published-pricing.ts", import.meta.url));
const banner = `// src/pricing/published-pricing.ts
// ── GENERATED FILE — DO NOT EDIT BY HAND ──
// Launch tier prices derived from the internal cost model by
// scripts/publish-rates.ts (npm run pricing:publish). Safe to ship to the
// browser: final prices only — no costs, no margins, no bands.

import type { PublishedPricing } from "./types";

export const publishedPricing: PublishedPricing = `;

writeFileSync(target, `${banner}${JSON.stringify(pricing, null, 2)};\n`);

// The pre-tier rate card is superseded; remove it if it still exists.
const legacy = fileURLToPath(new URL("../src/pricing/published-rates.ts", import.meta.url));
if (existsSync(legacy)) unlinkSync(legacy);

console.log("Published pricing written to src/pricing/published-pricing.ts");
console.log(JSON.stringify(pricing, null, 2));
if (flags.length > 0) {
  console.log("\nINTERNAL MARGIN FLAGS (never shown publicly):");
  for (const flag of flags) console.log(`  ⚑ ${flag}`);
}
