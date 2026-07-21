// src/config/brand.ts
//
// Single source of truth for brand-level text and contact details. A final
// logo is coming later - when it's ready, replace the files in /branding
// and public/logo-mark.svg; nothing else in the site needs to change.
//
// STILL PENDING (external services not created yet - see README):
//   - contactFormAccessKey:    no Web3Forms access key set up yet, so the
//                               contact form falls back to a mailto: link
//                               (see branding/CONTACT_FORM_SETUP.md)
//
// Discovery calls are free - there is no paid-consultation link yet. Add a
// `stripePaymentLink` field (and a button wired to it) once paid
// consultations launch.
export const brand = {
  name: "3Stone AI",
  shortName: "3Stone",
  tagline: "Stop Managing Software. Start Running Your Business.",
  description:
    "3Stone AI builds 3Stone One, the AI operating system that runs your business — one login, one dashboard, one AI, for every business you own. We also build custom software for what it doesn't cover yet.",
  contactEmail: "jathan@3stoneai.com",
  linkedinUrl: "https://www.linkedin.com/company/3stone-ai/" as string | null,
  discoveryCallUrl: "https://calendly.com/jathan-spaulding3/30min",
  // Web3Forms access key - a public/client-side identifier (not a secret),
  // safe to commit. Get one free at https://web3forms.com. See
  // branding/CONTACT_FORM_SETUP.md for exact setup steps.
  contactFormAccessKey: null as string | null,
  betaiUrl: "https://bet-ai-five.vercel.app/",
  githubUrl: "https://github.com/jathanks3/bet-ai",
  // 3Stone One - flagship interactive B2B demo (CRM, Projects, Finance,
  // Automation, and more, in one command center that relabels itself per
  // industry). STILL PENDING: not yet deployed to Vercel or pushed to
  // GitHub - this placeholder needs to become the real production URL
  // (and threeStoneOneGithubUrl needs a real repo URL) before this goes live.
  threeStoneOneUrl: "https://3stone-one.vercel.app/",
  threeStoneOneGithubUrl: "https://github.com/jathanks3/3stone-one",
  // 3Stone Workspace - the client-facing portal for people who hire 3Stone AI
  // (proposals, agreements, payments, project delivery, 3Stone Care). Separate
  // product from 3Stone One above. This is the real, live production
  // deployment (workspace.3stoneai.com) - not the 3stone-workspace.vercel.app
  // preview project, which lacks production configuration (e.g. no Resend key).
  clientWorkspaceLoginUrl: "https://workspace.3stoneai.com/login",
};

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/3stone-one", label: "3Stone One" },
  { href: "/3stone-one/build-your-stack", label: "Pricing" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const footerLinks = [
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "https://github.com/jathanks3", label: "GitHub", external: true },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

// Short, skimmable capability list for the homepage - not the full
// service descriptions (those live in `services` below, on /services).
export const capabilities = [
  "Custom Software",
  "Workflow Automation",
  "Internal Dashboards",
  "Customer Portals",
  "AI Assistants",
  "System Integrations",
];

export const services = [
  {
    id: "custom-software",
    name: "Custom Software",
    problem: "Off-the-shelf tools almost fit how your business works, but not quite - so your team builds workarounds.",
    solution: "Software built specifically around your actual process, not a generic template.",
    outcome: "A system your team actually uses instead of fighting.",
  },
  {
    id: "workflow-automation",
    name: "Workflow Automation",
    problem: "The same multi-step process gets done by hand, the same way, every single time.",
    solution: "Software that runs the process for you - reliably, without the manual steps.",
    outcome: "More consistent output and less time spent on busywork.",
  },
  {
    id: "internal-dashboards",
    name: "Internal Dashboards",
    problem: "Data lives in five different tools and spreadsheets, so nobody has a clear picture of what's happening.",
    solution: "One dashboard that pulls the numbers that matter into a single, live view.",
    outcome: "Faster, better-informed decisions.",
  },
  {
    id: "customer-portals",
    name: "Customer Portals",
    problem: "Customers call or email for updates your team already has - status, orders, documents.",
    solution: "A self-serve portal where customers get answers instantly, without waiting on your team.",
    outcome: "Fewer support requests and happier customers.",
  },
  {
    id: "ai-assistants",
    name: "AI Assistants",
    problem: "Teams spend hours every week answering the same questions or digging through data for an answer.",
    solution: "A purpose-built assistant trained on your business, tuned to answer, analyze, or recommend inside your existing workflow.",
    outcome: "Faster answers, without adding headcount.",
  },
  {
    id: "business-intelligence",
    name: "Business Intelligence",
    problem: "Decisions get made on gut feel because the data that would inform them is scattered or stale.",
    solution: "Data pulled into one place and shaped into something a decision-maker can actually read at a glance.",
    outcome: "Decisions backed by current numbers, not guesswork.",
  },
  {
    id: "reporting-systems",
    name: "Reporting Systems",
    problem: "Reports get built by hand every week or month, copy-pasted from three different sources.",
    solution: "Reports generated automatically from the data you already have, in the format your team and stakeholders need.",
    outcome: "Hours saved every reporting cycle, with fewer copy-paste errors.",
  },
  {
    id: "startup-mvp-development",
    name: "Startup MVP Development",
    problem: "You have a product idea but need something real to test with users before investing further.",
    solution: "A focused first version built to prove the idea - not over-engineered for a scale you don't have yet.",
    outcome: "Real user feedback, faster, without wasted spend.",
  },
  {
    id: "system-integrations",
    name: "System Integrations",
    problem: "The tools your business already uses don't talk to each other, so someone re-enters the same data twice.",
    solution: "We connect your existing systems so data flows between them automatically.",
    outcome: "One source of truth instead of duplicate manual entry.",
  },
];

export const values = [
  "Solve the real problem",
  "Build reusable systems",
  "Simplicity beats complexity",
  "Never overpromise",
  "Every project strengthens the company",
];

export const whyUs = [
  {
    title: "Business-first thinking",
    detail: "Every technical decision is explained in terms of the business outcome it serves, not just the tech.",
  },
  {
    title: "Modern architecture",
    detail: "Current, well-supported tools and frameworks, not legacy stacks that are expensive to maintain.",
  },
  {
    title: "Scalable systems",
    detail: "Built to grow with your business instead of needing to be rebuilt at the next stage.",
  },
  {
    title: "Transparent communication",
    detail: "You'll always know where a project stands - no waiting weeks for an update.",
  },
  {
    title: "3Stone Care",
    detail: "Hosting, security, monitoring, updates, and AI improvements after launch - we stay, we don't disappear.",
  },
  {
    title: "Custom solutions",
    detail: "No templates or one-size-fits-all products - every system is built around how your business actually operates.",
  },
];

export const processSteps = [
  { step: "01", name: "Discovery", detail: "We learn how your business actually operates today - the workarounds, the manual steps, the spreadsheets holding things together." },
  { step: "02", name: "Strategy", detail: "We define what success actually looks like and scope the project around that outcome, not a feature list." },
  { step: "03", name: "Architecture", detail: "We design the underlying system - data model, integrations, how it'll scale - before any interface work starts." },
  { step: "04", name: "Design", detail: "We map out the experience that removes the friction, and explain it in plain English before a line of code gets written." },
  { step: "05", name: "Development", detail: "We build in focused, working increments - not a black box that reappears months later." },
  { step: "06", name: "Testing", detail: "We verify the system actually works the way it's supposed to before it touches your business." },
  { step: "07", name: "Deployment", detail: "We ship the system into your business with minimal disruption to what's already running." },
  { step: "08", name: "3Stone Care", detail: "Hosting, security, monitoring, performance, and AI improvements - ongoing, not a one-off handoff." },
];

// The client-facing engagement journey - working with 3Stone AI end to end,
// distinct from processSteps above (which describes our build methodology).
export const howWeWorkSteps = [
  { step: "01", name: "Discovery", detail: "A call to understand your business and what's actually costing you time or money today." },
  { step: "02", name: "Proposal", detail: "An interactive proposal - scope, timeline, and investment - reviewed and accepted online, no back-and-forth PDFs." },
  { step: "03", name: "Agreements", detail: "Clear contracts, signed electronically in your 3Stone Workspace." },
  { step: "04", name: "Payment", detail: "Pay in full, deposit plus milestones, or a monthly plan - your choice." },
  { step: "05", name: "Build", detail: "We build in tracked phases you can follow the whole way, with milestones you approve as we go." },
  { step: "06", name: "Launch", detail: "Go live with training and support in place, not a handoff and a goodbye." },
  { step: "07", name: "3Stone Care", detail: "Ongoing hosting, monitoring, and support afterward, at the tier that fits your business." },
];

// Three ways to work with us - deliberately not fixed pricing beyond Connect.
// Every Transform/Enterprise proposal is scoped and quoted individually.
export const pricingTiers = [
  {
    name: "Connect",
    price: "Affordable monthly plan",
    detail: "Keep the tools you already use - QuickBooks, Toast, Calendly, and more. 3Stone One connects them into one login, one dashboard, one AI.",
  },
  {
    name: "Transform",
    price: "Custom builds starting around $5,000",
    detail: "A custom-built operating system for your business, with flexible payment plans and 3Stone Care included after launch.",
  },
  {
    name: "Enterprise",
    price: "Custom proposal",
    detail: "Multiple businesses, multiple locations, dedicated support, and advanced AI - built and priced for your scale.",
  },
];

export const faqs = [
  {
    question: "How much does software cost?",
    answer: "It depends entirely on scope, which is why we don't publish fixed prices beyond Connect's monthly plan. Transform engagements typically start around $5,000, with flexible payment plans available, and Enterprise work is quoted separately. Every proposal is customized to what you actually need.",
  },
  {
    question: "How long does a project take?",
    answer: "Most Transform projects take between 2 and 10 weeks depending on scope - a focused automation might take two weeks, while a full custom build takes longer. We give you a realistic timeline after a discovery call, not before.",
  },
  {
    question: "What happens after launch?",
    answer: "You're covered by 3Stone Care - hosting, security, monitoring, updates, performance, and AI improvements, plus priority support. We don't disappear after launch.",
  },
  {
    question: "What happens during a discovery call?",
    answer: "We talk through what's actually costing you time or money, whether custom software is the right fix, and roughly what that would take. No sales pitch, no obligation - if the answer is 'you don't need this,' we'll tell you.",
  },
  {
    question: "Can AI integrate into my business?",
    answer: "Usually, yes - but not every problem needs AI. Part of a discovery call is figuring out honestly where AI adds real value for your business and where a simpler solution is the better call.",
  },
  {
    question: "How do you handle data security?",
    answer: "We follow standard best practices - least-privilege access, encrypted connections, and no storing of sensitive data your system doesn't need. Specific compliance requirements (HIPAA, SOC 2, etc.) are scoped per project during discovery.",
  },
];

// Industries 3Stone One's demo relabels itself for - see /3stone-one.
export const industries3StoneOne = [
  "Construction",
  "Restaurant",
  "Law Firm",
  "Security",
  "Event Center",
  "Medical Practice",
  "Property Management",
];

// Standalone future products only - anything 3Stone One's industry-adaptive
// demo already covers (customer/client portals, restaurant, medical, and
// construction operations) lives there instead. See /3stone-one.
export const futurePortfolio = [
  { name: "Inventory System", detail: "Stock tracking and reordering automation for product-based businesses." },
];
