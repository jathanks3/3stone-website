// src/pricing/data/industries.ts
// Industry presets for the stack builder. EDITABLE — each entry seeds the
// "what you already use" cards (typicalStack) and the module recommendation.
// Typical stacks are deliberately conservative: it's better for a visitor
// to add a tool than to feel sold a stack they don't run.

import type { Industry } from "../types";

export const industries: Industry[] = [
  { key: "plumbing", label: "Plumbing", typicalStack: ["quickbooks", "jobber", "google-workspace", "stripe"], recommendedModules: ["crm", "projects", "scheduling", "payments", "documents", "reporting"], defaultEmployees: 8, defaultLocations: 1 },
  { key: "hvac", label: "HVAC", typicalStack: ["quickbooks", "housecall-pro", "google-workspace", "stripe"], recommendedModules: ["crm", "projects", "scheduling", "payments", "documents", "reporting"], defaultEmployees: 10, defaultLocations: 1 },
  { key: "electrical", label: "Electrical", typicalStack: ["quickbooks", "jobber", "google-workspace"], recommendedModules: ["crm", "projects", "scheduling", "payments", "documents"], defaultEmployees: 8, defaultLocations: 1 },
  { key: "roofing", label: "Roofing", typicalStack: ["quickbooks", "jobber", "dropbox", "google-workspace"], recommendedModules: ["crm", "projects", "documents", "payments", "approvals"], defaultEmployees: 12, defaultLocations: 1 },
  { key: "landscaping", label: "Landscaping", typicalStack: ["quickbooks", "jobber", "google-workspace"], recommendedModules: ["crm", "projects", "scheduling", "payments"], defaultEmployees: 10, defaultLocations: 1 },
  { key: "cleaning", label: "Cleaning Services", typicalStack: ["quickbooks", "jobber", "calendly", "google-workspace"], recommendedModules: ["crm", "scheduling", "payments", "messaging"], defaultEmployees: 12, defaultLocations: 1 },
  { key: "restaurant", label: "Restaurant", typicalStack: ["quickbooks", "toast", "google-workspace", "mailchimp"], recommendedModules: ["projects", "documents", "reporting", "approvals"], defaultEmployees: 25, defaultLocations: 1 },
  { key: "medical", label: "Medical Practice", typicalStack: ["quickbooks", "microsoft-365", "docusign", "zoom"], recommendedModules: ["client-portal", "documents", "scheduling", "approvals", "reporting"], defaultEmployees: 15, defaultLocations: 1 },
  { key: "dental", label: "Dental Practice", typicalStack: ["quickbooks", "microsoft-365", "docusign"], recommendedModules: ["client-portal", "documents", "scheduling", "reporting"], defaultEmployees: 10, defaultLocations: 1 },
  { key: "law-firm", label: "Law Firm", typicalStack: ["quickbooks", "microsoft-365", "docusign", "zoom", "dropbox"], recommendedModules: ["crm", "projects", "documents", "approvals", "payments", "reporting"], defaultEmployees: 8, defaultLocations: 1 },
  { key: "accounting", label: "Accounting Firm", typicalStack: ["quickbooks", "microsoft-365", "docusign", "calendly"], recommendedModules: ["crm", "projects", "documents", "scheduling", "payments"], defaultEmployees: 6, defaultLocations: 1 },
  { key: "real-estate", label: "Real Estate", typicalStack: ["quickbooks", "hubspot", "docusign", "calendly", "google-workspace"], recommendedModules: ["crm", "documents", "scheduling", "messaging", "reporting"], defaultEmployees: 10, defaultLocations: 1 },
  { key: "marketing-agency", label: "Marketing Agency", typicalStack: ["quickbooks", "hubspot", "slack", "asana", "google-workspace", "chatgpt"], recommendedModules: ["crm", "projects", "client-portal", "payments", "ai-assistant", "reporting"], defaultEmployees: 12, defaultLocations: 1 },
  { key: "construction", label: "Construction", typicalStack: ["quickbooks", "dropbox", "docusign", "google-workspace", "monday"], recommendedModules: ["crm", "projects", "documents", "approvals", "payments", "reporting"], defaultEmployees: 20, defaultLocations: 1 },
  { key: "event-center", label: "Event Center", typicalStack: ["quickbooks", "square", "calendly", "mailchimp", "google-workspace"], recommendedModules: ["crm", "scheduling", "payments", "documents", "messaging"], defaultEmployees: 15, defaultLocations: 1 },
  { key: "salon", label: "Salon & Spa", typicalStack: ["quickbooks", "square", "acuity", "mailchimp"], recommendedModules: ["scheduling", "crm", "payments", "messaging"], defaultEmployees: 8, defaultLocations: 1 },
  { key: "gym", label: "Gym & Fitness", typicalStack: ["quickbooks", "square", "acuity", "mailchimp"], recommendedModules: ["crm", "scheduling", "payments", "client-portal"], defaultEmployees: 10, defaultLocations: 1 },
  { key: "auto-repair", label: "Auto Repair", typicalStack: ["quickbooks", "square", "google-workspace"], recommendedModules: ["crm", "projects", "scheduling", "payments", "documents"], defaultEmployees: 8, defaultLocations: 1 },
];

export function getIndustry(key: string): Industry | undefined {
  return industries.find((i) => i.key === key);
}
