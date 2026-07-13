// src/pricing/data/modules.ts
// The 3Stone One module catalog the recommender picks from. EDITABLE.
// `baseIncluded` modules ship with every configuration (they're the
// platform itself) and are never billed as add-ons.

import type { ProductModule } from "../types";

export const productModules: ProductModule[] = [
  { key: "admin-dashboard", label: "Admin Dashboard", blurb: "One screen for the whole business — every module reports into it.", baseIncluded: true },
  { key: "client-portal", label: "Client Portal", blurb: "Clients log in, see progress, upload documents, approve work, and pay.", baseIncluded: true },
  { key: "messaging", label: "Messaging", blurb: "Team channels plus a private thread with every client.", baseIncluded: true },
  { key: "documents", label: "Documents & E-Sign", blurb: "Contracts, plans, and photos in one place — with electronic signatures.", baseIncluded: false },
  { key: "crm", label: "CRM & Pipeline", blurb: "Leads, customers, and deals — relabeled for your industry.", baseIncluded: false },
  { key: "projects", label: "Projects & Jobs", blurb: "Every job, milestone, and task, tracked to done.", baseIncluded: false },
  { key: "payments", label: "Invoices & Payments", blurb: "Send invoices; clients pay online. Runs on Stripe.", baseIncluded: false },
  { key: "scheduling", label: "Scheduling", blurb: "Booking and team calendars without the per-seat scheduling tool.", baseIncluded: false },
  { key: "ai-assistant", label: "AI Assistant", blurb: "An assistant that knows your business — every module, one AI.", baseIncluded: false },
  { key: "approvals", label: "Approvals", blurb: "One approval flow for milestones, purchases, and change orders.", baseIncluded: false },
  { key: "reporting", label: "Reporting", blurb: "The numbers that matter, pulled live — no copy-paste reports.", baseIncluded: false },
  { key: "automation", label: "Automation", blurb: "The follow-ups and reminders your team does by hand, done for you.", baseIncluded: false },
  { key: "meetings", label: "Meetings", blurb: "Agendas, action items, and decisions that don't evaporate.", baseIncluded: false },
];

export function getModule(key: string): ProductModule | undefined {
  return productModules.find((m) => m.key === key);
}

export const baseModuleKeys = productModules.filter((m) => m.baseIncluded).map((m) => m.key);
