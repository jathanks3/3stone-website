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
  tagline: "Custom Software That Gives Your Business Time Back.",
  description:
    "3Stone AI builds AI-powered software, dashboards, portals, and automation systems that eliminate repetitive work so your business can scale.",
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

// Short, skimmable capability list for the homepage - not the full
// service descriptions (those live in `services` below, on /services).
export const capabilities = [
  "AI Automation",
  "Internal Dashboards",
  "Customer Portals",
  "Workflow Automation",
  "Custom Software",
  "Integrations",
];

export const services = [
  {
    id: "ai-business-automation",
    name: "AI Business Automation",
    problem: "Teams spend hours every week on repetitive tasks that don't require human judgment.",
    solution: "AI-powered automation tuned to your specific process, handling the repetitive work automatically.",
    outcome: "Hours back every week, and fewer manual errors.",
  },
  {
    id: "customer-portals",
    name: "Customer Portals",
    problem: "Customers call or email for updates your team already has - status, orders, documents.",
    solution: "A self-serve portal where customers get answers instantly, without waiting on your team.",
    outcome: "Fewer support requests and happier customers.",
  },
  {
    id: "internal-dashboards",
    name: "Internal Dashboards",
    problem: "Data lives in five different tools and spreadsheets, so nobody has a clear picture of what's happening.",
    solution: "One dashboard that pulls the numbers that matter into a single, live view.",
    outcome: "Faster, better-informed decisions.",
  },
  {
    id: "workflow-automation",
    name: "Workflow Automation",
    problem: "The same multi-step process gets done by hand, the same way, every single time.",
    solution: "Software that runs the process for you - reliably, without the manual steps.",
    outcome: "More consistent output and less time spent on busywork.",
  },
  {
    id: "scheduling-systems",
    name: "Scheduling Systems",
    problem: "Booking and coordination happens through back-and-forth calls, texts, and emails.",
    solution: "A scheduling system that lets people book, reschedule, and get reminders automatically.",
    outcome: "Less coordination overhead and fewer missed appointments.",
  },
  {
    id: "custom-software",
    name: "Custom Software",
    problem: "Off-the-shelf tools almost fit how your business works, but not quite - so your team builds workarounds.",
    solution: "Software built specifically around your actual process, not a generic template.",
    outcome: "A system your team actually uses instead of fighting.",
  },
  {
    id: "startup-mvp-development",
    name: "Startup MVP Development",
    problem: "You have a product idea but need something real to test with users before investing further.",
    solution: "A focused first version built to prove the idea - not over-engineered for a scale you don't have yet.",
    outcome: "Real user feedback, faster, without wasted spend.",
  },
  {
    id: "business-process-optimization",
    name: "Business Process Optimization",
    problem: "A process has grown complicated over time, with steps nobody remembers the reason for.",
    solution: "We map how the process actually works today, then redesign and rebuild it to remove the friction.",
    outcome: "A simpler, faster process that's easier to maintain.",
  },
];

export const values = [
  "Solve the real problem first",
  "Simplicity beats complexity",
  "Build reusable systems",
  "Never overpromise",
  "Every project makes the company stronger",
];

export const whyUs = [
  {
    title: "Custom-built software",
    detail: "No templates or one-size-fits-all products - every system is built around how your business actually operates.",
  },
  {
    title: "Modern technology",
    detail: "Current, well-supported tools and frameworks, not legacy stacks that are expensive to maintain.",
  },
  {
    title: "Fast communication",
    detail: "You'll always know where a project stands - no waiting weeks for an update.",
  },
  {
    title: "Business-first thinking",
    detail: "Every technical decision is explained in terms of the business outcome it serves, not just the tech.",
  },
  {
    title: "Scalable architecture",
    detail: "Systems are built to grow with your business instead of needing to be rebuilt at the next stage.",
  },
  {
    title: "Long-term partnership",
    detail: "We aim to keep working with clients well past launch, not move on to the next project.",
  },
];

export const processSteps = [
  { step: "01", name: "Discovery", detail: "We learn how your business actually operates today - the workarounds, the manual steps, the spreadsheets holding things together." },
  { step: "02", name: "Planning", detail: "We scope the project around the outcome you need, with a clear, realistic timeline." },
  { step: "03", name: "Design", detail: "We map out the system that removes the friction, and explain it in plain English before a line of code gets written." },
  { step: "04", name: "Development", detail: "We build in focused, working increments - not a black box that reappears months later." },
  { step: "05", name: "Testing", detail: "We verify the system actually works the way it's supposed to before it touches your business." },
  { step: "06", name: "Deployment", detail: "We ship the system into your business with minimal disruption to what's already running." },
  { step: "07", name: "Support", detail: "Software evolves with your business. We stick around past launch instead of treating it as a one-off handoff." },
];

// Typical Project Investments - deliberately not fixed pricing. Every
// proposal is scoped and quoted individually.
export const pricingTiers = [
  { name: "Business Automation", price: "Starting around $2,500" },
  { name: "Internal Dashboards", price: "Typically $5k – $15k" },
  { name: "Custom Platforms", price: "$15k+" },
  { name: "Enterprise", price: "Custom Quote" },
];

export const faqs = [
  {
    question: "How long does a project take?",
    answer: "Most projects take between 2 and 10 weeks depending on scope - a focused automation might take two weeks, while a full custom platform takes longer. We give you a realistic timeline after a discovery call, not before.",
  },
  {
    question: "How much does software cost?",
    answer: "It depends entirely on scope, which is why we don't publish fixed prices. As a general range, most engagements fall between $2,500 and $15,000+, with enterprise work quoted separately. Every proposal is customized to what you actually need.",
  },
  {
    question: "Do you provide support?",
    answer: "Yes. We don't disappear after launch - ongoing support and iteration are part of how we work, not an upsell.",
  },
  {
    question: "Can you work with existing systems?",
    answer: "In most cases, yes. We design new software to integrate with the tools you already use rather than asking you to replace everything at once.",
  },
  {
    question: "Can AI integrate into my business?",
    answer: "Usually, yes - but not every problem needs AI. Part of a discovery call is figuring out honestly where AI adds real value for your business and where a simpler solution is the better call.",
  },
];
