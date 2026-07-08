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
  tagline: "Software That Gives Your Business Time Back.",
  description:
    "We build custom software, automation systems, dashboards, portals, and AI-powered tools that help businesses eliminate repetitive work and scale efficiently.",
  contactEmail: "jathan@3stoneai.com",
  linkedinUrl: "https://www.linkedin.com/company/3stone-ai/" as string | null,
  discoveryCallUrl: "https://calendly.com/jathan-spaulding3/30min",
  // Web3Forms access key - a public/client-side identifier (not a secret),
  // safe to commit. Get one free at https://web3forms.com. See
  // branding/CONTACT_FORM_SETUP.md for exact setup steps.
  contactFormAccessKey: null as string | null,
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
    title: "Long-term support",
    detail: "We aim to keep working with clients well past launch, not move on to the next project.",
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
  { step: "08", name: "Support", detail: "Software evolves with your business. We stick around past launch instead of treating it as a one-off handoff." },
];

// Typical Project Investments - deliberately not fixed pricing. Every
// proposal is scoped and quoted individually.
export const pricingTiers = [
  { name: "Automation", price: "Starting around $2,500" },
  { name: "Dashboards", price: "Typically $5,000 – $15,000" },
  { name: "Custom Platforms", price: "Typically $15,000+" },
  { name: "Enterprise", price: "Custom Proposal" },
];

export const faqs = [
  {
    question: "How much does software cost?",
    answer: "It depends entirely on scope, which is why we don't publish fixed prices. As a general range, most engagements fall between $2,500 and $15,000+, with enterprise work quoted separately. Every proposal is customized to what you actually need.",
  },
  {
    question: "How long does a project take?",
    answer: "Most projects take between 2 and 10 weeks depending on scope - a focused automation might take two weeks, while a full custom platform takes longer. We give you a realistic timeline after a discovery call, not before.",
  },
  {
    question: "Do you provide support after launch?",
    answer: "Yes. We don't disappear after launch - ongoing support and iteration are part of how we work, not an upsell.",
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

export const futurePortfolio = [
  { name: "Customer Portal", detail: "A self-serve customer experience, generalized from client work into a reusable template." },
  { name: "Restaurant Platform", detail: "Ordering, reservations, and operations in one system built for food service." },
  { name: "Medical Office Platform", detail: "Scheduling and patient coordination software for small medical practices." },
  { name: "Construction Dashboard", detail: "Project and crew tracking built for how construction businesses actually operate." },
  { name: "Inventory System", detail: "Stock tracking and reordering automation for product-based businesses." },
  { name: "Client Portal", detail: "A branded, self-serve hub for service businesses to share status and documents with clients." },
];
