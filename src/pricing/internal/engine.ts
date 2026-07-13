// src/pricing/internal/engine.ts
// ── INTERNAL ── derives retail rates from the cost model:
//
//   monthly cost to serve
//     + 20% safety buffer
//     → minimum price (margin floor)
//     → target gross margin
//     → published rate (rounded UP, so rounding never erodes margin)
//
// validateMargin() is the hard gate: nothing below MINIMUM_GROSS_MARGIN
// can be published. Runs at publish time and again in scripts/test-pricing.ts.

import type { PublishedRates } from "../types";
import { productModules } from "../data/modules";
import {
  internalCosts,
  implementationRates,
  MINIMUM_GROSS_MARGIN,
  SAFETY_BUFFER,
  TARGET_GROSS_MARGIN,
} from "./costs";

export interface CostBreakdown {
  base: number;
  seats: number;
  ai: number;
  modules: number;
  total: number;
}

/** Our estimated monthly cost to serve one customer configuration. */
export function costToServe(config: {
  moduleKeys: string[];
  employees: number;
}): CostBreakdown {
  const b = internalCosts.perCustomerBase;
  const base = b.hosting + b.database + b.storage + b.monitoring + b.email + b.sms + b.supportHuman;
  const seats = config.employees * internalCosts.perSeat.platform;
  const hasAi = config.moduleKeys.includes("ai-assistant");
  const ai = hasAi ? config.employees * internalCosts.perSeat.ai : 0;
  const addOns = config.moduleKeys.filter(
    (key) => !productModules.find((m) => m.key === key)?.baseIncluded
  );
  const modules = addOns.reduce(
    (sum, key) => sum + (internalCosts.perModule.overrides[key] ?? internalCosts.perModule.default),
    0
  );
  return { base, seats, ai, modules, total: base + seats + ai + modules };
}

/** Gross margin on a monthly price after Stripe's cut. */
export function grossMargin(price: number, cost: number): number {
  const netRevenue = price * (1 - internalCosts.billingFees.pct) - internalCosts.billingFees.fixed;
  return (netRevenue - cost) / price;
}

/** The hard floor. Throws — refusing to publish — rather than warns. */
export function validateMargin(price: number, cost: number, label: string): void {
  const margin = grossMargin(price, cost);
  if (margin < MINIMUM_GROSS_MARGIN) {
    throw new Error(
      `Margin floor violated for ${label}: price $${price.toFixed(2)} on cost $${cost.toFixed(2)} ` +
        `gives ${(margin * 100).toFixed(1)}% gross margin (floor: ${MINIMUM_GROSS_MARGIN * 100}%). ` +
        `Raise the rate or cut the cost — do not publish.`
    );
  }
}

/** cost → buffered cost → price at target margin, rounded up.
 * The fixed per-payment billing fee is charged once per invoice, so it is
 * folded into the base-platform rate only — component rates would
 * otherwise each absorb it and quietly overprice. */
function priceFromCost(monthlyCost: number, roundTo: number, includeFixedFee = false): number {
  const buffered = monthlyCost * (1 + SAFETY_BUFFER);
  const fees = internalCosts.billingFees;
  // Solve price so that price*(1-pct) - [fixed] - buffered = TARGET_GM * price
  const fixed = includeFixedFee ? fees.fixed : 0;
  const raw = (buffered + fixed) / (1 - fees.pct - TARGET_GROSS_MARGIN);
  return Math.ceil(raw / roundTo) * roundTo;
}

/** Derive the full public rate card from the cost model. */
export function derivePublishedRates(): PublishedRates {
  const b = internalCosts.perCustomerBase;
  const baseCost = b.hosting + b.database + b.storage + b.monitoring + b.email + b.sms + b.supportHuman;

  const rates: PublishedRates = {
    generatedAt: new Date().toISOString().slice(0, 10),
    basePlatformMonthly: priceFromCost(baseCost, 5, true),
    perEmployeeMonthly: priceFromCost(internalCosts.perSeat.platform, 1),
    aiPerEmployeeMonthly: priceFromCost(internalCosts.perSeat.ai, 1),
    moduleMonthly: Object.fromEntries(
      productModules
        .filter((m) => !m.baseIncluded)
        .map((m) => [
          m.key,
          priceFromCost(internalCosts.perModule.overrides[m.key] ?? internalCosts.perModule.default, 1),
        ])
    ),
    minimumMonthly: 0, // set below
    implementation: {
      base: implementationRates.baseHours * implementationRates.hourlyRate,
      perModule: implementationRates.perModuleHours * implementationRates.hourlyRate,
      perReplacedTool: implementationRates.perReplacedToolHours * implementationRates.hourlyRate,
      minimum: implementationRates.minimumFee,
    },
  };
  rates.minimumMonthly = rates.basePlatformMonthly;

  // Refuse to publish if ANY plausible configuration breaches the floor.
  const addOnKeys = productModules.filter((m) => !m.baseIncluded).map((m) => m.key);
  const sampleConfigs = [
    { moduleKeys: [] as string[], employees: 1 },
    { moduleKeys: ["crm", "projects"], employees: 5 },
    { moduleKeys: ["crm", "projects", "payments", "documents", "ai-assistant"], employees: 25 },
    { moduleKeys: addOnKeys, employees: 100 },
    { moduleKeys: ["ai-assistant"], employees: 200 },
  ];
  for (const config of sampleConfigs) {
    const cost = costToServe(config);
    const price = quoteFromRates(rates, config.moduleKeys, config.employees);
    validateMargin(price, cost.total, `${config.employees} seats / ${config.moduleKeys.length} add-ons`);
  }

  return rates;
}

/** The same arithmetic the public engine uses — kept here so margin
 * validation checks exactly what visitors will be quoted. */
export function quoteFromRates(rates: PublishedRates, moduleKeys: string[], employees: number): number {
  const addOns = moduleKeys.filter((key) => !productModules.find((m) => m.key === key)?.baseIncluded);
  let monthly = rates.basePlatformMonthly + employees * rates.perEmployeeMonthly;
  for (const key of addOns) monthly += rates.moduleMonthly[key] ?? 0;
  if (moduleKeys.includes("ai-assistant")) monthly += employees * rates.aiPerEmployeeMonthly;
  return Math.max(monthly, rates.minimumMonthly);
}
