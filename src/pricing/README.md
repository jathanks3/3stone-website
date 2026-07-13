# 3Stone One pricing system

The `/pricing` experience is a deterministic sales configurator. A visitor identifies their business, marks each current tool **Keep**, **Replace**, or **Not using**, selects operational pains, previews a synthetic industry workspace, and receives a tier, implementation estimate, honest value comparison, migration plan, and discovery-call handoff.

## Public and internal pricing split

This is a static Astro site. Anything imported by `/pricing` can be downloaded by a visitor, so public recommendation logic and confidential unit economics are deliberately separated.

| Area | Public bundle? | Contents |
| --- | --- | --- |
| `data/*` | Yes | Industries, modules, pain points, software catalog, verification metadata, tier composition |
| `published-pricing.ts` | Yes | Generated retail tier prices, team ceilings, and implementation retail rates only |
| `engine.ts` | Yes | Spend estimation, recommendation, ROI, migration, preview ID, Calendly summary |
| `internal/costs.ts` | No | Cost assumptions, safety buffer, margin policy, bands, discounts, LTV inputs |
| `internal/engine.ts` | No | Cost-to-serve, price derivation, margin floors, discount guardrails, scenario economics |
| `/internal/pricing-admin` | Flag-gated | Server-rendered internal economics dashboard; normal builds render only a noindex not-found shell |

`npm run pricing:test` checks import isolation. After a production build, `npm run pricing:isolation` scans public output for internal cost, margin, discount, and LTV markers.

## Launch pricing formula

For each public tier, the internal publisher calculates:

```text
estimated monthly cost to serve at the tier reference size
× 1.20 cost safety buffer
→ price required for the 80% target gross margin
→ constrained to the launch positioning band when floor-safe
→ checked against the absolute 75% gross-margin floor
→ final retail price and floor-safe employee ceiling published
```

Launch positioning bands:

- Hub: $79–$99/month
- Growth: $149–$179/month
- Business OS: $229–$279/month
- Enterprise: discovery call; no public widget price

The 80% target is a goal, not permission to breach the floor. The 75% floor is absolute. If a configuration cannot be served at or above 75% gross margin at a published price, its public employee ceiling stops before that configuration and the recommendation routes to Enterprise. Internal margin flags remain in the publish output and admin dashboard; they never ship to the public configurator.

## Tier recommendation logic

Every quote begins with base owner modules. Replaced tools add the 3Stone One modules that perform that work. Selected pain points add relevant capability. The engine selects the smallest public tier that:

1. contains every recommended add-on module;
2. supports the employee count above the margin floor; and
3. stays within the public location threshold.

Teams or configurations outside those guardrails route to Enterprise. Industry affects examples, terminology, defaults, and workspace preview—not an arbitrary upsell.

## Competitor verification metadata

Every software record includes:

- estimated monthly price;
- pricing model (`flat`, `per_user`, `per_location`, or `transaction`);
- estimated implementation/setup price when available;
- source URL;
- `verified` boolean;
- date last verified;
- confidence level.

Unverified prices display **Estimated**/`est.` publicly. A figure becomes verified only after a human independently checks the linked vendor page and records the date. Unverified figures may inform a directional comparison but must never support an absolute savings promise.

## Keep, Replace, and Not using

- **Keep** includes the tool in current spend and the post-launch stack.
- **Replace** includes it in current spend, recommends corresponding 3Stone One modules, and adds migration work.
- **Not using** removes it from both spend and migration math.

The visitor can keep every system and use 3Stone One as the operating hub, replace every selected system in one coordinated implementation, or choose a mixed plan.

## Mature-platform advisory behavior

QuickBooks, Toast, Square, Stripe, Google Workspace, Microsoft 365, and Mailchimp are mature systems that often should remain. Replacement is never disabled. Choosing **Replace** surfaces an advisory and flags the decision for discovery-call review; it does not tell the visitor replacement is unavailable or must wait for a future phase.

## Honest ROI classifications

The comparison always includes both the 3Stone One subscription and the cost of tools the visitor keeps. It never hides retained software spend to manufacture savings.

- **Savings:** the new total is lower by at least the greater of $25/month or 5%.
- **Comparable:** the difference is inside that band.
- **Premium investment:** the new total is higher, with an explicit explanation of what the added investment buys.
- **Enterprise:** no ROI claim is shown until pricing is scoped.

Public competitor estimates remain labeled, and the page does not present unverified data as guaranteed savings.

## Workspace preview

The preview uses industry-specific terminology, KPIs, sample work, and AI summary. It is explicitly synthetic and does not claim a workspace has been provisioned. `previewId(selection)` creates a deterministic `WS-…` identifier from the industry, team size, locations, tool choices, and pain selections so the configuration can be reconstructed during discovery.

## Migration and implementation

The customer-facing migration plan shows:

- tools to keep;
- tools to replace;
- kept systems that can integrate;
- estimated implementation duration;
- training estimate;
- expected go-live range;
- the recommended complete, focused, or operating-hub approach.

These are planning ranges, not contractual commitments. Actual data quality, API access, custom workflows, and stakeholder availability can change delivery timing.

## Calendly handoff

`buildDiscoverySummary()` includes the preview ID, optional business name, industry, employees, locations, Keep/Replace choices, mature-platform review flags, pains, estimated current spend, tier, implementation estimate, migration approach, integrations, training, go-live range, and ROI classification.

`buildCalendlyUrl()` sends attribution parameters plus a compact summary through `utm_content` and Calendly custom answer `a1`. The event type must have a compatible custom question for `a1` to appear. The page also provides **Copy my summary** as a reliable fallback.

Builder state is stored only in `sessionStorage`: it survives a reload in the same tab but is not shared, persisted server-side, or tracked.

## Internal admin protection

The internal dashboard is enabled only with:

```bash
PRICING_ADMIN_ENABLED=true npm run dev
```

Normal builds render a bare noindex not-found shell at that route, exclude `/internal/` from the sitemap, and ship no client-side admin script. The dashboard reports cost to serve, revenue, subscription and implementation profit, gross margin, target/floor warnings, suggested and maximum floor-safe discounts, margin after discount, AI/support/storage/infrastructure costs, and estimated customer lifetime value.

This flag is an exposure control for a static build, not authentication. Never deploy an admin-enabled build publicly.

## Commands

```bash
npm run pricing:publish      # regenerate public retail prices from internal costs
npm run pricing:test         # policy, recommendation, ROI, migration, integrity, isolation tests
npm run build                # normal production build; admin disabled
npm run pricing:isolation    # scan normal public build output for internal markers
PRICING_ADMIN_ENABLED=true npm run build
                              # local/staging admin-enabled verification only; do not deploy
```

## Publishing price changes

1. Edit only the internal assumptions in `internal/costs.ts`.
2. Run `npm run pricing:publish`.
3. Review every internal margin flag.
4. Run `npm run pricing:test`.
5. Run a normal production build and `npm run pricing:isolation`.
6. Review the public page and the flag-gated admin dashboard.
7. Commit both the internal assumption change and generated `published-pricing.ts`.

## Assumptions and limitations

- Internal costs are editable launch estimates, not audited financial statements; reconcile them against real invoices and support usage regularly.
- Competitor figures remain estimates until independently verified against their source URLs.
- Transaction pricing is described but not converted into monthly spend without a visitor’s transaction volume.
- Implementation and training ranges are deterministic planning guidance, not a statement that provisioning or migration has occurred.
- The workspace preview is synthetic.
- The configurator does not collect payment, create an account, provision infrastructure, or create a production workspace.
- Enterprise routing intentionally withholds a public quote when the standard model cannot support the configuration profitably or responsibly.
