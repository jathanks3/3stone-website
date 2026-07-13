// src/pricing/published-pricing.ts
// ── GENERATED FILE — DO NOT EDIT BY HAND ──
// Launch tier prices derived from the internal cost model by
// scripts/publish-rates.ts (npm run pricing:publish). Safe to ship to the
// browser: final prices only — no costs, no margins, no bands.

import type { PublishedPricing } from "./types";

export const publishedPricing: PublishedPricing = {
  "generatedAt": "2026-07-13",
  "tiers": [
    {
      "key": "hub",
      "label": "Hub",
      "priceMonthly": 99,
      "maxEmployees": 16
    },
    {
      "key": "growth",
      "label": "Growth",
      "priceMonthly": 179,
      "maxEmployees": 46
    },
    {
      "key": "business-os",
      "label": "Business OS",
      "priceMonthly": 279,
      "maxEmployees": 26
    }
  ],
  "implementation": {
    "base": 1140,
    "perModule": 285,
    "perReplacedTool": 285,
    "minimum": 750
  }
};
