// src/pricing/data/industries.ts
// Industry presets for the stack builder. EDITABLE — each entry seeds the
// "what you already use" cards (typicalStack), the module recommendation,
// and the workspace preview's terminology and sample content. Typical
// stacks are deliberately conservative: better for a visitor to add a tool
// than to feel sold a stack they don't run.

import type { Industry } from "../types";

export const industries: Industry[] = [
  {
    key: "plumbing", label: "Plumbing",
    typicalStack: ["quickbooks", "jobber", "google-workspace", "stripe"],
    recommendedModules: ["crm", "projects", "scheduling", "payments", "documents", "reporting"],
    defaultEmployees: 8, defaultLocations: 1,
    preview: {
      projects: "Jobs", clients: "Customers",
      sampleProjects: [
        { name: "Water heater replacement — Henderson residence", status: "Today" },
        { name: "Repipe estimate — Maple St fourplex", status: "Quote sent" },
        { name: "Backflow inspection — Riverside Cafe", status: "Scheduled" },
      ],
      aiSummary: "3 jobs on today's board, 2 estimates awaiting approval, and one invoice is 9 days overdue — want me to send the reminder?",
    },
  },
  {
    key: "hvac", label: "HVAC",
    typicalStack: ["quickbooks", "housecall-pro", "google-workspace", "stripe"],
    recommendedModules: ["crm", "projects", "scheduling", "payments", "documents", "reporting"],
    defaultEmployees: 10, defaultLocations: 1,
    preview: {
      projects: "Jobs", clients: "Customers",
      sampleProjects: [
        { name: "AC install — Watson home", status: "In progress" },
        { name: "Seasonal maintenance — Oakmont HOA (12 units)", status: "Scheduled" },
        { name: "Furnace diagnostic — Kettle & Co. Bakery", status: "Today" },
      ],
      aiSummary: "Maintenance season is filling up: 14 tune-ups booked this week and two techs are double-booked Thursday — want me to suggest a fix?",
    },
  },
  {
    key: "electrical", label: "Electrical",
    typicalStack: ["quickbooks", "jobber", "google-workspace"],
    recommendedModules: ["crm", "projects", "scheduling", "payments", "documents"],
    defaultEmployees: 8, defaultLocations: 1,
    preview: {
      projects: "Jobs", clients: "Customers",
      sampleProjects: [
        { name: "Panel upgrade — Delgado residence", status: "In progress" },
        { name: "EV charger install — 22 Birch Lane", status: "Scheduled" },
        { name: "Warehouse lighting retrofit — Corridor Supply", status: "Quote sent" },
      ],
      aiSummary: "The Corridor Supply quote has been open 6 days without a reply — a follow-up now keeps it warm.",
    },
  },
  {
    key: "roofing", label: "Roofing",
    typicalStack: ["quickbooks", "jobber", "dropbox", "google-workspace"],
    recommendedModules: ["crm", "projects", "documents", "payments", "approvals"],
    defaultEmployees: 12, defaultLocations: 1,
    preview: {
      projects: "Jobs", clients: "Customers",
      sampleProjects: [
        { name: "Full tear-off — 114 Sycamore Dr", status: "In progress" },
        { name: "Storm damage inspection — Linden Court", status: "Today" },
        { name: "Flat roof coating — Eastgate Plaza", status: "Awaiting approval" },
      ],
      aiSummary: "Eastgate Plaza's change order has waited 3 days for the client's approval — I can nudge them from the portal.",
    },
  },
  {
    key: "landscaping", label: "Landscaping",
    typicalStack: ["quickbooks", "jobber", "google-workspace"],
    recommendedModules: ["crm", "projects", "scheduling", "payments"],
    defaultEmployees: 10, defaultLocations: 1,
    preview: {
      projects: "Jobs", clients: "Customers",
      sampleProjects: [
        { name: "Weekly maintenance route — North district", status: "Today" },
        { name: "Patio + firepit build — Alvarez backyard", status: "In progress" },
        { name: "Spring cleanup contract — Brookfield Offices", status: "Renewal due" },
      ],
      aiSummary: "Brookfield's annual contract renews in 12 days — last year's rate no longer covers your costs; want a suggested new number?",
    },
  },
  {
    key: "cleaning", label: "Cleaning Services",
    typicalStack: ["quickbooks", "jobber", "calendly", "google-workspace"],
    recommendedModules: ["crm", "scheduling", "payments", "messaging"],
    defaultEmployees: 12, defaultLocations: 1,
    preview: {
      projects: "Jobs", clients: "Customers",
      sampleProjects: [
        { name: "Move-out deep clean — 407 Ellis Ave", status: "Today" },
        { name: "Nightly office route — Meridian Tower", status: "Recurring" },
        { name: "Post-construction clean — Lot 9 townhomes", status: "Scheduled" },
      ],
      aiSummary: "Two crews finish early Friday — there's room for one more deep clean if you want me to open the slot for booking.",
    },
  },
  {
    key: "restaurant", label: "Restaurant",
    typicalStack: ["quickbooks", "toast", "google-workspace", "mailchimp"],
    recommendedModules: ["projects", "documents", "reporting", "approvals"],
    defaultEmployees: 25, defaultLocations: 1,
    preview: {
      projects: "Shifts & Tasks", clients: "Guests",
      sampleProjects: [
        { name: "Friday dinner service — 6 on floor, 4 in kitchen", status: "Staffed" },
        { name: "Walk-in cooler repair", status: "Vendor booked" },
        { name: "New seasonal menu rollout", status: "In progress" },
      ],
      aiSummary: "Food cost ran 31% last week, 3 points over target — the variance traces mostly to two suppliers' price changes.",
    },
  },
  {
    key: "medical", label: "Medical Practice",
    typicalStack: ["quickbooks", "microsoft-365", "docusign", "zoom"],
    recommendedModules: ["client-portal", "documents", "scheduling", "approvals", "reporting"],
    defaultEmployees: 15, defaultLocations: 1,
    preview: {
      projects: "Schedules", clients: "Patients",
      sampleProjects: [
        { name: "Tuesday clinic — 22 appointments", status: "Confirmed" },
        { name: "New patient intake forms (4 pending)", status: "Awaiting signature" },
        { name: "Quarterly compliance review", status: "In progress" },
      ],
      aiSummary: "4 intake packets are still unsigned for tomorrow's new patients — reminders can go out from the portal now.",
    },
  },
  {
    key: "dental", label: "Dental Practice",
    typicalStack: ["quickbooks", "microsoft-365", "docusign"],
    recommendedModules: ["client-portal", "documents", "scheduling", "reporting"],
    defaultEmployees: 10, defaultLocations: 1,
    preview: {
      projects: "Schedules", clients: "Patients",
      sampleProjects: [
        { name: "Hygiene day — 18 cleanings booked", status: "Confirmed" },
        { name: "Treatment plan follow-ups (6 open)", status: "This week" },
        { name: "Lab case tracking — 3 crowns due", status: "In transit" },
      ],
      aiSummary: "6 accepted treatment plans haven't been scheduled yet — that's roughly $9,400 sitting in the follow-up list.",
    },
  },
  {
    key: "law-firm", label: "Law Firm",
    typicalStack: ["quickbooks", "microsoft-365", "docusign", "zoom", "dropbox"],
    recommendedModules: ["crm", "projects", "documents", "approvals", "payments", "reporting"],
    defaultEmployees: 8, defaultLocations: 1,
    preview: {
      projects: "Cases", clients: "Clients",
      sampleProjects: [
        { name: "Hargrove v. Mercer — discovery phase", status: "Active" },
        { name: "Chen estate planning — drafts out", status: "Awaiting signature" },
        { name: "Delaney LLC formation", status: "Filed" },
      ],
      aiSummary: "The Hargrove discovery deadline is in 9 days and two document requests remain open — both assigned, neither started.",
    },
  },
  {
    key: "accounting", label: "Accounting Firm",
    typicalStack: ["quickbooks", "microsoft-365", "docusign", "calendly"],
    recommendedModules: ["crm", "projects", "documents", "scheduling", "payments"],
    defaultEmployees: 6, defaultLocations: 1,
    preview: {
      projects: "Engagements", clients: "Clients",
      sampleProjects: [
        { name: "Q2 close — Rivera Logistics", status: "In progress" },
        { name: "Annual return — Bloom Floral (docs missing)", status: "Waiting on client" },
        { name: "New client onboarding — Datum Labs", status: "This week" },
      ],
      aiSummary: "Bloom Floral still owes 3 documents for their return — the portal request has been open 8 days; I can re-send it.",
    },
  },
  {
    key: "real-estate", label: "Real Estate",
    typicalStack: ["quickbooks", "hubspot", "docusign", "calendly", "google-workspace"],
    recommendedModules: ["crm", "documents", "scheduling", "messaging", "reporting"],
    defaultEmployees: 10, defaultLocations: 1,
    preview: {
      projects: "Listings & Deals", clients: "Clients",
      sampleProjects: [
        { name: "412 Harborview — under contract", status: "Closing in 11 days" },
        { name: "Meadowbrook listing — 3 showings this week", status: "Active" },
        { name: "Buyer search — the Okafors, 3 tours Saturday", status: "Scheduled" },
      ],
      aiSummary: "Harborview's inspection contingency expires Friday — the repair addendum is still unsigned by the sellers.",
    },
  },
  {
    key: "marketing-agency", label: "Marketing Agency",
    typicalStack: ["quickbooks", "hubspot", "slack", "asana", "google-workspace", "chatgpt"],
    recommendedModules: ["crm", "projects", "client-portal", "payments", "ai-assistant", "reporting"],
    defaultEmployees: 12, defaultLocations: 1,
    preview: {
      projects: "Campaigns", clients: "Clients",
      sampleProjects: [
        { name: "Q3 launch campaign — Fieldstone Foods", status: "In production" },
        { name: "Website rebuild — Archer Dental", status: "Client review" },
        { name: "Monthly retainer — Solstice Gear", status: "Reporting due" },
      ],
      aiSummary: "Archer Dental has had the homepage design in review for 5 days — one portal nudge usually gets it moving.",
    },
  },
  {
    key: "construction", label: "Construction",
    typicalStack: ["quickbooks", "dropbox", "docusign", "google-workspace", "monday"],
    recommendedModules: ["crm", "projects", "documents", "approvals", "payments", "reporting"],
    defaultEmployees: 20, defaultLocations: 1,
    preview: {
      projects: "Jobs", clients: "Clients",
      sampleProjects: [
        { name: "Riverside remodel — framing inspection passed", status: "On schedule" },
        { name: "Downtown lofts — change order pending", status: "Awaiting approval" },
        { name: "Harbor View bid package", status: "Due Friday" },
      ],
      aiSummary: "The Downtown Lofts change order ($18,400) has waited 4 days for client approval — the portal shows they haven't opened it.",
    },
  },
  {
    key: "event-center", label: "Event Center",
    typicalStack: ["quickbooks", "square", "calendly", "mailchimp", "google-workspace"],
    recommendedModules: ["crm", "scheduling", "payments", "documents", "messaging"],
    defaultEmployees: 15, defaultLocations: 1,
    preview: {
      projects: "Events", clients: "Clients",
      sampleProjects: [
        { name: "Vasquez wedding — 180 guests, Grand Hall", status: "Deposit paid" },
        { name: "TechCo annual gala — AV walkthrough", status: "This week" },
        { name: "Spring bridal expo", status: "Booking" },
      ],
      aiSummary: "Three tours booked this weekend and the Grand Hall has one open Saturday left in May — worth mentioning to all three.",
    },
  },
  {
    key: "salon", label: "Salon & Spa",
    typicalStack: ["quickbooks", "square", "acuity", "mailchimp"],
    recommendedModules: ["scheduling", "crm", "payments", "messaging"],
    defaultEmployees: 8, defaultLocations: 1,
    preview: {
      projects: "Appointments", clients: "Clients",
      sampleProjects: [
        { name: "Saturday — 34 bookings across 5 chairs", status: "92% booked" },
        { name: "Color correction — Maya R. (2.5 hrs)", status: "Today" },
        { name: "New stylist onboarding — week 2", status: "In progress" },
      ],
      aiSummary: "Rebooking rate dipped to 61% this month — 14 regulars haven't scheduled their next visit; want me to draft the outreach list?",
    },
  },
  {
    key: "gym", label: "Gym & Fitness",
    typicalStack: ["quickbooks", "square", "acuity", "mailchimp"],
    recommendedModules: ["crm", "scheduling", "payments", "client-portal"],
    defaultEmployees: 10, defaultLocations: 1,
    preview: {
      projects: "Classes & Programs", clients: "Members",
      sampleProjects: [
        { name: "6am strength class — waitlist of 4", status: "Full" },
        { name: "8-week transformation program — cohort 3", status: "Enrolling" },
        { name: "Equipment maintenance — rower #2", status: "Scheduled" },
      ],
      aiSummary: "12 memberships lapse this month and 5 of those members haven't visited in 3 weeks — early outreach saves most of them.",
    },
  },
  {
    key: "auto-repair", label: "Auto Repair",
    typicalStack: ["quickbooks", "square", "google-workspace"],
    recommendedModules: ["crm", "projects", "scheduling", "payments", "documents"],
    defaultEmployees: 8, defaultLocations: 1,
    preview: {
      projects: "Repair Orders", clients: "Customers",
      sampleProjects: [
        { name: "Brake job + rotors — 2019 Silverado", status: "In bay 2" },
        { name: "Transmission diagnostic — Camry", status: "Awaiting approval" },
        { name: "Fleet service — Hartley Plumbing vans (3)", status: "Scheduled" },
      ],
      aiSummary: "The Camry's $2,150 estimate has been awaiting approval since yesterday — customers approve 40% faster with the portal link.",
    },
  },
];

export function getIndustry(key: string): Industry | undefined {
  return industries.find((i) => i.key === key);
}
