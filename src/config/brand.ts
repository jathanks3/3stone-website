// src/config/brand.ts
//
// Single source of truth for brand-level text and contact details. A final
// logo is coming later - when it's ready, replace public/logo-mark.svg;
// nothing else in the site needs to change.
//
// STILL PENDING (external services not created yet - see README):
//   - contactEmail:      domain is real (3stoneai.com), but the inbox needs
//                         Google Workspace (or similar) set up to receive mail
//   - linkedinUrl:       no LinkedIn Company Page created yet
//   - discoveryCallUrl:  no Calendly (or similar) set up yet, so this
//                         points at the contact form instead of direct booking
export const brand = {
  name: "3Stone AI",
  shortName: "3Stone",
  tagline: "Business Software That Solves Real Problems.",
  description:
    "3Stone AI designs and builds custom software - customer portals, internal dashboards, workflow automation, and AI assistants - that eliminates repetitive work and operational headaches.",
  contactEmail: "hello@3stoneai.com",
  linkedinUrl: "https://www.linkedin.com/company/3stone-ai",
  discoveryCallUrl: "/contact",
  betaiUrl: "https://bet-ai-five.vercel.app/",
  githubUrl: "https://github.com/jathanks3/bet-ai",
};

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const services = [
  {
    id: "customer-portals",
    name: "Customer Portals",
    summary: "Give your customers a self-serve place to track orders, view status, and get answers - without another phone call to your team.",
  },
  {
    id: "internal-dashboards",
    name: "Internal Dashboards",
    summary: "See what's actually happening in the business in one place, instead of piecing it together from five spreadsheets.",
  },
  {
    id: "workflow-automation",
    name: "Workflow Automation",
    summary: "Replace the manual, repetitive steps your team does every day with software that just does it - reliably, every time.",
  },
  {
    id: "ai-assistants",
    name: "AI Assistants",
    summary: "Purpose-built assistants that answer questions, analyze data, or make recommendations inside your existing workflow - not a generic chatbot bolted on.",
  },
  {
    id: "scheduling-systems",
    name: "Scheduling Systems",
    summary: "Booking, dispatch, and calendar coordination that removes the back-and-forth of scheduling by phone or email.",
  },
  {
    id: "reporting-systems",
    name: "Reporting Systems",
    summary: "Turn raw operational data into the reports your team and stakeholders actually need, generated automatically instead of by hand.",
  },
  {
    id: "business-process-automation",
    name: "Business Process Automation",
    summary: "Map how a process actually works today, then rebuild it so the repetitive parts run themselves.",
  },
  {
    id: "startup-mvp-development",
    name: "Startup MVP Development",
    summary: "A focused first version of your product, built to prove the idea and get in front of real users - not over-engineered for a scale you don't have yet.",
  },
  {
    id: "custom-web-applications",
    name: "Custom Web Applications",
    summary: "When off-the-shelf software almost fits but not quite, we build the application that actually matches how your business runs.",
  },
];
