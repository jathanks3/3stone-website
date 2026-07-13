// src/pricing/published-rates.ts
// ── GENERATED FILE — DO NOT EDIT BY HAND ──
// Retail rate card derived from the internal cost model by
// scripts/publish-rates.ts (npm run pricing:publish). This file is safe to
// ship to the browser: it contains final prices only — no costs, no margins.

import type { PublishedRates } from "./types";

export const publishedRates: PublishedRates = {
  "generatedAt": "2026-07-13",
  "basePlatformMonthly": 335,
  "perEmployeeMonthly": 6,
  "aiPerEmployeeMonthly": 27,
  "moduleMonthly": {
    "documents": 12,
    "crm": 12,
    "projects": 12,
    "payments": 16,
    "scheduling": 12,
    "ai-assistant": 18,
    "approvals": 12,
    "reporting": 12,
    "automation": 18,
    "meetings": 12
  },
  "minimumMonthly": 335,
  "implementation": {
    "base": 2280,
    "perModule": 570,
    "perReplacedTool": 380,
    "minimum": 1500
  }
};
