// src/pricing/data/pains.ts
// The business pain assessment. EDITABLE — each selected pain pulls its
// modules into the recommendation and its `why` line into the WHY WE
// RECOMMEND THIS section. Pains with no modules still shape the
// conversation (they ride along to the discovery call).

import type { PainPoint } from "../types";

export const painPoints: PainPoint[] = [
  {
    key: "app-switching",
    statement: "I spend too much time switching between apps.",
    modules: [],
    why: "You said app-switching eats your day — everything below lives behind one login, on one screen.",
  },
  {
    key: "find-info",
    statement: "I can't find information quickly.",
    modules: ["documents"],
    why: "You said finding information is slow — Documents puts contracts, plans, and files in one searchable place.",
  },
  {
    key: "team-communication",
    statement: "My employees don't communicate well.",
    modules: ["meetings"],
    why: "You said communication is a struggle — team messaging is built in, and Meetings keeps decisions from evaporating.",
  },
  {
    key: "duplicate-work",
    statement: "The same work gets done twice.",
    modules: ["automation"],
    why: "You said work gets duplicated — Automation runs the repeated steps so they happen once, the same way, every time.",
  },
  {
    key: "better-reporting",
    statement: "I want better reporting.",
    modules: ["reporting"],
    why: "You asked for better reporting — Reporting pulls live numbers instead of copy-paste spreadsheets.",
  },
  {
    key: "ai-help",
    statement: "I want AI assistance.",
    modules: ["ai-assistant"],
    why: "You asked for AI — the AI Assistant knows your whole business, not just one app's slice of it.",
  },
  {
    key: "client-experience",
    statement: "I want to look more professional to my clients.",
    modules: ["payments"],
    why: "You want a sharper client experience — clients get a branded portal to see progress, approve work, and pay online.",
  },
  {
    key: "cash-flow",
    statement: "Invoices go out late and get paid late.",
    modules: ["payments"],
    why: "You said invoicing drags — Invoices & Payments sends them on time and lets clients pay the moment they open them.",
  },
];

export function getPain(key: string): PainPoint | undefined {
  return painPoints.find((p) => p.key === key);
}
