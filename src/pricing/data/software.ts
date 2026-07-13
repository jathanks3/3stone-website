// src/pricing/data/software.ts
// The competitor/software catalog behind the stack builder. EDITABLE —
// add a tool by appending an entry; the page and engine pick it up.
//
// HONESTY RULES:
// - Every price is an ESTIMATE of typical small-business list pricing
//   (assistant knowledge as of early 2026) until a human checks the
//   vendor's live page, sets `verified: true`, `lastVerified` to that
//   date, and raises `confidence`. The UI labels estimates "est.".
// - Mature platforms we advise keeping carry `whyKeep` (the reason shown
//   in WHY WE RECOMMEND THIS) and `advisory` (the card shown if the
//   visitor still chooses Replace). Replacing is never blocked — the
//   advisory educates and the discovery call evaluates the fit.

import type { SoftwareTool } from "../types";

type ToolInput = Omit<SoftwareTool, "verified" | "lastVerified" | "confidence"> &
  Partial<Pick<SoftwareTool, "verified" | "lastVerified" | "confidence">>;

// Every price starts unverified/estimated until a human checks sourceUrl.
function tool(input: ToolInput): SoftwareTool {
  return { verified: false, lastVerified: null, confidence: "estimated", ...input };
}

export const softwareCatalog: SoftwareTool[] = [
  tool({
    key: "quickbooks",
    name: "QuickBooks Online",
    category: "Accounting",
    pricingModel: "flat",
    estMonthly: 99,
    estImplementation: 500,
    sourceUrl: "https://quickbooks.intuit.com/pricing/",
    replacedByModules: [],
    canKeepAndConnect: true,
    whyKeep:
      "QuickBooks remains one of the strongest accounting platforms available. Your books stay where your accountant expects them — 3Stone One connects to it.",
    advisory:
      "QuickBooks is one of the strongest accounting platforms available today. Most businesses continue using it while connecting it to 3Stone One. If you'd like to replace it entirely, we'll evaluate whether that's the right fit during your discovery call.",
  }),
  tool({
    key: "toast",
    name: "Toast POS",
    category: "Point of Sale",
    pricingModel: "per_location",
    estMonthly: 110,
    estImplementation: 1200,
    sourceUrl: "https://pos.toasttab.com/pricing",
    replacedByModules: [],
    canKeepAndConnect: true,
    whyKeep:
      "Toast runs your counter and kitchen hardware well. 3Stone One reads sales data from it rather than asking you to rip out a working POS.",
    advisory:
      "Toast is a mature POS with hardware on your counter. Most restaurants keep it and connect it to 3Stone One. If you want to move off it entirely, we'll talk through what that involves on your discovery call.",
  }),
  tool({
    key: "square",
    name: "Square POS",
    category: "Point of Sale",
    pricingModel: "per_location",
    estMonthly: 60,
    transactionNote: "plus ~2.6% + 10¢ per card transaction",
    estImplementation: 300,
    sourceUrl: "https://squareup.com/us/en/pricing",
    replacedByModules: [],
    canKeepAndConnect: true,
    whyKeep:
      "Square handles your register reliably. 3Stone One connects to it for sales visibility instead of replacing the hardware your team knows.",
    advisory:
      "Square is a mature payments and POS platform. Most businesses keep it connected to 3Stone One. If you'd rather replace it, your discovery call is where we'll see if that genuinely fits.",
  }),
  tool({
    key: "stripe",
    name: "Stripe",
    category: "Payments",
    pricingModel: "transaction",
    estMonthly: 0,
    transactionNote: "no subscription — ~2.9% + 30¢ per transaction",
    estImplementation: 0,
    sourceUrl: "https://stripe.com/pricing",
    replacedByModules: [],
    canKeepAndConnect: true,
    whyKeep:
      "Stripe is the payment rail 3Stone One itself runs on — keeping it costs you nothing extra and changes nothing for your customers.",
    advisory:
      "Stripe is the payments infrastructure 3Stone One uses under the hood, so there's usually nothing to replace. If you have a different processor in mind, bring it to the discovery call.",
  }),
  tool({
    key: "calendly",
    name: "Calendly",
    category: "Scheduling",
    pricingModel: "per_user",
    estMonthly: 12,
    seatFraction: 0.5,
    estImplementation: 0,
    sourceUrl: "https://calendly.com/pricing",
    replacedByModules: ["scheduling"],
    canKeepAndConnect: true,
  }),
  tool({
    key: "dropbox",
    name: "Dropbox Business",
    category: "File Storage",
    pricingModel: "per_user",
    estMonthly: 18,
    seatFraction: 0.7,
    estImplementation: 0,
    sourceUrl: "https://www.dropbox.com/plans",
    replacedByModules: ["documents"],
    canKeepAndConnect: true,
  }),
  tool({
    key: "google-workspace",
    name: "Google Workspace",
    category: "Productivity Suite",
    pricingModel: "per_user",
    estMonthly: 14,
    estImplementation: 300,
    sourceUrl: "https://workspace.google.com/pricing",
    replacedByModules: [],
    canKeepAndConnect: true,
    whyKeep:
      "Your email, calendar, and docs already work in Google Workspace. 3Stone One sits on top of it, not instead of it.",
    advisory:
      "Google Workspace is mature, reliable infrastructure for email and documents. Nearly every business keeps it and connects it. If you're set on replacing it, we'll map out what that means together on your discovery call.",
  }),
  tool({
    key: "microsoft-365",
    name: "Microsoft 365",
    category: "Productivity Suite",
    pricingModel: "per_user",
    estMonthly: 12.5,
    estImplementation: 300,
    sourceUrl: "https://www.microsoft.com/en-us/microsoft-365/business/compare-all-microsoft-365-business-products",
    replacedByModules: [],
    canKeepAndConnect: true,
    whyKeep:
      "Office and Outlook are deeply woven into how your team works. 3Stone One connects to Microsoft 365 rather than asking you to unwind it.",
    advisory:
      "Microsoft 365 is mature infrastructure most teams should keep. If replacing it is important to you, your discovery call is where we'll look at it honestly.",
  }),
  tool({
    key: "jobber",
    name: "Jobber",
    category: "Field Service",
    pricingModel: "flat",
    estMonthly: 129,
    estImplementation: 500,
    sourceUrl: "https://getjobber.com/pricing/",
    replacedByModules: ["crm", "projects", "scheduling", "client-portal", "payments"],
    canKeepAndConnect: false,
  }),
  tool({
    key: "housecall-pro",
    name: "Housecall Pro",
    category: "Field Service",
    pricingModel: "flat",
    estMonthly: 129,
    estImplementation: 500,
    sourceUrl: "https://www.housecallpro.com/pricing/",
    replacedByModules: ["crm", "projects", "scheduling", "client-portal", "payments"],
    canKeepAndConnect: false,
  }),
  tool({
    key: "servicetitan",
    name: "ServiceTitan",
    category: "Field Service",
    pricingModel: "flat",
    estMonthly: 398,
    estImplementation: 5000,
    sourceUrl: "https://www.servicetitan.com/pricing",
    replacedByModules: ["crm", "projects", "scheduling", "client-portal", "payments", "reporting"],
    canKeepAndConnect: false,
  }),
  tool({
    key: "hubspot",
    name: "HubSpot",
    category: "CRM & Marketing",
    pricingModel: "per_user",
    estMonthly: 25,
    seatFraction: 0.4,
    estImplementation: 1000,
    sourceUrl: "https://www.hubspot.com/pricing",
    replacedByModules: ["crm", "reporting"],
    canKeepAndConnect: true,
  }),
  tool({
    key: "salesforce",
    name: "Salesforce",
    category: "CRM & Marketing",
    pricingModel: "per_user",
    estMonthly: 80,
    seatFraction: 0.4,
    estImplementation: 5000,
    sourceUrl: "https://www.salesforce.com/pricing/",
    replacedByModules: ["crm", "reporting"],
    canKeepAndConnect: true,
  }),
  tool({
    key: "mailchimp",
    name: "Mailchimp",
    category: "CRM & Marketing",
    pricingModel: "flat",
    estMonthly: 45,
    estImplementation: 0,
    sourceUrl: "https://mailchimp.com/pricing/",
    replacedByModules: [],
    canKeepAndConnect: true,
    whyKeep:
      "3Stone One doesn't do email campaigns yet, and we won't pretend it does — Mailchimp keeps doing that job well.",
    advisory:
      "Mailchimp covers email marketing, which 3Stone One doesn't replace today. If you want off Mailchimp anyway, let's talk through the options on your discovery call rather than overpromise here.",
  }),
  tool({
    key: "slack",
    name: "Slack",
    category: "Communication",
    pricingModel: "per_user",
    estMonthly: 8.75,
    seatFraction: 0.8,
    estImplementation: 0,
    sourceUrl: "https://slack.com/pricing",
    replacedByModules: ["messaging"],
    canKeepAndConnect: false,
  }),
  tool({
    key: "teams",
    name: "Microsoft Teams",
    category: "Communication",
    pricingModel: "per_user",
    estMonthly: 4,
    seatFraction: 0.8,
    estImplementation: 0,
    sourceUrl: "https://www.microsoft.com/en-us/microsoft-teams/compare-microsoft-teams-business-options",
    replacedByModules: ["messaging"],
    canKeepAndConnect: false,
  }),
  tool({
    key: "zoom",
    name: "Zoom",
    category: "Communication",
    pricingModel: "per_user",
    estMonthly: 13.33,
    seatFraction: 0.5,
    estImplementation: 0,
    sourceUrl: "https://zoom.us/pricing",
    replacedByModules: ["meetings"],
    canKeepAndConnect: true,
  }),
  tool({
    key: "docusign",
    name: "DocuSign",
    category: "E-Signature",
    pricingModel: "per_user",
    estMonthly: 25,
    seatFraction: 0.3,
    estImplementation: 0,
    sourceUrl: "https://www.docusign.com/products-and-pricing",
    replacedByModules: ["documents", "approvals"],
    canKeepAndConnect: false,
  }),
  tool({
    key: "dropbox-sign",
    name: "Dropbox Sign",
    category: "E-Signature",
    pricingModel: "per_user",
    estMonthly: 15,
    seatFraction: 0.3,
    estImplementation: 0,
    sourceUrl: "https://sign.dropbox.com/pricing",
    replacedByModules: ["documents", "approvals"],
    canKeepAndConnect: false,
  }),
  tool({
    key: "chatgpt",
    name: "ChatGPT Team",
    category: "AI",
    pricingModel: "per_user",
    estMonthly: 25,
    seatFraction: 0.5,
    estImplementation: 0,
    sourceUrl: "https://openai.com/chatgpt/pricing/",
    replacedByModules: ["ai-assistant"],
    canKeepAndConnect: false,
  }),
  tool({
    key: "claude",
    name: "Claude Team",
    category: "AI",
    pricingModel: "per_user",
    estMonthly: 25,
    seatFraction: 0.5,
    estImplementation: 0,
    sourceUrl: "https://claude.com/pricing",
    replacedByModules: ["ai-assistant"],
    canKeepAndConnect: false,
  }),
  tool({
    key: "monday",
    name: "Monday.com",
    category: "Project Management",
    pricingModel: "per_user",
    estMonthly: 12,
    seatFraction: 0.6,
    estImplementation: 300,
    sourceUrl: "https://monday.com/pricing",
    replacedByModules: ["projects", "reporting"],
    canKeepAndConnect: false,
  }),
  tool({
    key: "asana",
    name: "Asana",
    category: "Project Management",
    pricingModel: "per_user",
    estMonthly: 10.99,
    seatFraction: 0.6,
    estImplementation: 0,
    sourceUrl: "https://asana.com/pricing",
    replacedByModules: ["projects", "reporting"],
    canKeepAndConnect: false,
  }),
  tool({
    key: "notion",
    name: "Notion",
    category: "Project Management",
    pricingModel: "per_user",
    estMonthly: 10,
    seatFraction: 0.6,
    estImplementation: 0,
    sourceUrl: "https://www.notion.com/pricing",
    replacedByModules: ["documents", "projects"],
    canKeepAndConnect: false,
  }),
  tool({
    key: "acuity",
    name: "Acuity Scheduling",
    category: "Scheduling",
    pricingModel: "flat",
    estMonthly: 34,
    estImplementation: 0,
    sourceUrl: "https://www.acuityscheduling.com/signup",
    replacedByModules: ["scheduling"],
    canKeepAndConnect: false,
  }),
];

export function getTool(key: string): SoftwareTool | undefined {
  return softwareCatalog.find((t) => t.key === key);
}
