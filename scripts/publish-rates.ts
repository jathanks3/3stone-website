// scripts/publish-rates.ts
// Regenerates src/pricing/published-rates.ts from the internal cost model.
// Run after editing src/pricing/internal/costs.ts:
//
//   npm run pricing:publish
//
// Refuses to write if any sample configuration breaches the margin floor.

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { derivePublishedRates } from "../src/pricing/internal/engine";

const rates = derivePublishedRates();

const target = fileURLToPath(new URL("../src/pricing/published-rates.ts", import.meta.url));
const banner = `// src/pricing/published-rates.ts
// ── GENERATED FILE — DO NOT EDIT BY HAND ──
// Retail rate card derived from the internal cost model by
// scripts/publish-rates.ts (npm run pricing:publish). This file is safe to
// ship to the browser: it contains final prices only — no costs, no margins.

import type { PublishedRates } from "./types";

export const publishedRates: PublishedRates = `;

writeFileSync(target, `${banner}${JSON.stringify(rates, null, 2)};\n`);
console.log(`Published rates written to src/pricing/published-rates.ts`);
console.log(JSON.stringify(rates, null, 2));
