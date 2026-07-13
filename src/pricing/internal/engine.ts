// src/pricing/internal/engine.ts
// ── INTERNAL ── derives the launch tier prices from the cost model:
//
//   monthly cost to serve (tier modules @ reference team size)
//     + 20% safety buffer
//     → price at the 80% target margin
//     → clamped into the tier's launch band (value positioning wins)
//     → floor check at 75% — breaches are FLAGGED internally and the
//       configuration space that can't hold the floor routes to
//       Enterprise via each tier's derived maxEmployees
//
// Nothing below the floor is ever published or shown publicly.

import type { PublishedPricing, PublishedTier } from "../types";
import { productModules } from "../data/modules";
import { tiers } from "../data/tiers";
import {
  discountPolicy,
  implementationRates,
  internalCosts,
  ltvAssumptions,
  MINIMUM_GROSS_MARGIN,
  SAFETY_BUFFER,
  TARGET_GROSS_MARGIN,
  tierBands,
} from "./costs";

export interface CostBreakdown {
  base: number;
  infrastructure: number;
  storage: number;
  seats: number;
  ai: number;
  modules: number;
  total: number;
  support: number;
}

/** Our estimated monthly cost to serve one customer configuration. */
export function costToServe(config: {
  moduleKeys: string[];
  employees: number;
}): CostBreakdown {
  const b = internalCosts.perCustomerBase;
  const infrastructure = b.hosting + b.database + b.monitoring + b.email + b.sms;
  const storage = b.storage;
  const base = infrastructure + storage + b.supportHuman;
  const seats = config.employees * internalCosts.perSeat.platform;
  const hasAi = config.moduleKeys.includes("ai-assistant");
  const ai = hasAi
    ? internalCosts.aiWorkspacePool + config.employees * internalCosts.perSeat.ai
    : 0;
  const addOns = config.moduleKeys.filter(
    (key) => !productModules.find((m) => m.key === key)?.baseIncluded
  );
  const modules = addOns.reduce(
    (sum, key) => sum + (internalCosts.perModule.overrides[key] ?? internalCosts.perModule.default),
    0
  );
  return {
    base,
    infrastructure,
    storage,
    seats,
    ai,
    modules,
    total: base + seats + ai + modules,
    support: b.supportHuman,
  };
}

/** Gross margin on a monthly price after Stripe's cut. */
export function grossMargin(price: number, cost: number): number {
  const netRevenue = price * (1 - internalCosts.billingFees.pct) - internalCosts.billingFees.fixed;
  return (netRevenue - cost) / price;
}

/** The lowest price that still holds the margin floor for a given cost. */
export function floorPrice(cost: number): number {
  const fees = internalCosts.billingFees;
  return (cost + fees.fixed) / (1 - fees.pct - MINIMUM_GROSS_MARGIN);
}

/** cost → buffered cost → price at the target margin. */
function targetPrice(cost: number): number {
  const buffered = cost * (1 + SAFETY_BUFFER);
  const fees = internalCosts.billingFees;
  return (buffered + fees.fixed) / (1 - fees.pct - TARGET_GROSS_MARGIN);
}

/** Largest team size a tier can serve at its published price without the
 * margin falling through the floor. Beyond this, Enterprise. */
export function maxEmployeesAtFloor(tierKey: keyof typeof tierBands, price: number): number {
  const moduleKeys = tiers.find((t) => t.key === tierKey)!.includedModules;
  let max = 0;
  for (let employees = 1; employees <= 500; employees++) {
    const cost = costToServe({ moduleKeys, employees });
    if (grossMargin(price, cost.total) < MINIMUM_GROSS_MARGIN) break;
    max = employees;
  }
  return max;
}

export interface DerivedPricing {
  pricing: PublishedPricing;
  /** Internal-only margin flags — surfaced at publish time and in the
   * admin dashboard, never on the public page. */
  flags: string[];
}

export function derivePublishedPricing(): DerivedPricing {
  const flags: string[] = [];

  const publishedTiers: PublishedTier[] = tiers.map((tier) => {
    const band = tierBands[tier.key];
    const referenceCost = costToServe({
      moduleKeys: tier.includedModules,
      employees: band.referenceEmployees,
    });

    // Target-margin price, held inside the launch band.
    const ideal = targetPrice(referenceCost.total);
    let price = Math.min(Math.max(ideal, band.min), band.max);
    if (ideal > band.max) {
      flags.push(
        `${tier.key}: 80% target wants $${ideal.toFixed(0)} but launch band caps at $${band.max} — priced for value, margin below target (still above floor).`
      );
    }

    // Floor is non-negotiable: if even the band top can't hold it at the
    // reference size, publish the floor price and flag loudly.
    const referenceMargin = grossMargin(price, referenceCost.total);
    if (referenceMargin < MINIMUM_GROSS_MARGIN) {
      price = Math.ceil(floorPrice(referenceCost.total));
      flags.push(
        `${tier.key}: launch band cannot hold the ${MINIMUM_GROSS_MARGIN * 100}% floor at ${band.referenceEmployees} seats — published $${price} above band. Revisit the cost model or the band.`
      );
    }

    price = Math.round(price);
    const maxEmployees = maxEmployeesAtFloor(tier.key, price);
    if (maxEmployees < band.referenceEmployees) {
      flags.push(
        `${tier.key}: floor-safe team size (${maxEmployees}) is below the reference size (${band.referenceEmployees}) — band and cost model disagree.`
      );
    }

    return { key: tier.key, label: tier.label, priceMonthly: price, maxEmployees };
  });

  return {
    pricing: {
      generatedAt: new Date().toISOString().slice(0, 10),
      tiers: publishedTiers,
      implementation: {
        base: implementationRates.baseHours * implementationRates.hourlyRate,
        perModule: implementationRates.perModuleHours * implementationRates.hourlyRate,
        perReplacedTool: implementationRates.perReplacedToolHours * implementationRates.hourlyRate,
        minimum: implementationRates.minimumFee,
      },
    },
    flags,
  };
}

// ---- Sales guardrails (admin dashboard) ----

export interface DiscountGuardrails {
  suggestedPct: number;
  suggestedPrice: number;
  marginAfterSuggested: number;
  /** Largest discount that keeps the configuration at/above the floor. */
  maxPct: number;
  maxPrice: number;
}

export function discountGuardrails(price: number, cost: number): DiscountGuardrails {
  const minPrice = floorPrice(cost);
  const maxPct = Math.max(0, (price - minPrice) / price);
  const suggestedPct = Math.min(discountPolicy.suggestedPct, maxPct);
  const suggestedPrice = price * (1 - suggestedPct);
  return {
    suggestedPct,
    suggestedPrice,
    marginAfterSuggested: grossMargin(suggestedPrice, cost),
    maxPct,
    maxPrice: minPrice,
  };
}

export interface ScenarioEconomics {
  revenue: number;
  cost: CostBreakdown;
  margin: number;
  belowFloor: boolean;
  belowTarget: boolean;
  monthlyProfit: number;
  supportCost: number;
  aiCost: number;
  infrastructureCost: number;
  storageCost: number;
  lifetimeValue: number;
  implementationFee: number;
  implementationProfit: number;
  discounts: DiscountGuardrails;
}

export function scenarioEconomics(params: {
  price: number;
  moduleKeys: string[];
  employees: number;
  implementationFee: number;
}): ScenarioEconomics {
  const cost = costToServe({ moduleKeys: params.moduleKeys, employees: params.employees });
  const margin = grossMargin(params.price, cost.total);
  const monthlyProfit = params.price - cost.total;
  const implementationProfit = params.implementationFee * ltvAssumptions.implementationGrossMarginPct;
  return {
    revenue: params.price,
    cost,
    margin,
    belowFloor: margin < MINIMUM_GROSS_MARGIN,
    belowTarget: margin < TARGET_GROSS_MARGIN,
    monthlyProfit,
    supportCost: cost.support,
    aiCost: cost.ai,
    infrastructureCost: cost.infrastructure,
    storageCost: cost.storage,
    lifetimeValue: monthlyProfit * ltvAssumptions.expectedRetentionMonths + implementationProfit,
    implementationFee: params.implementationFee,
    implementationProfit,
    discounts: discountGuardrails(params.price, cost.total),
  };
}
