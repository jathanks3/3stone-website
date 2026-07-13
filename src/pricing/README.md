# The pricing engine

The `/pricing` page ("Build Your Business Stack") is powered entirely by
this directory. Nothing on the page is hardcoded — change a number here,
and the page changes.

## The public/internal split (read this first)

This is a static site: anything the public page imports is shipped,
readable, to every visitor. So the engine is split:

| | Ships to browser? | Contains |
| --- | --- | --- |
| `data/*` | yes | software catalog, industries, module list — public knowledge |
| `published-rates.ts` | yes | **final retail prices only** (generated file) |
| `engine.ts` | yes | spend math, recommendations, honest ROI, Calendly handoff |
| `internal/costs.ts` | **never** | our cost-to-serve, margins, buffers |
| `internal/engine.ts` | **never** | cost → price derivation + margin floor |

`npm run pricing:test` fails if the public engine or page ever imports
`internal/` — that would publish our margins to the world.

## The formula (mission spec, implemented in `internal/engine.ts`)

```text
monthly cost to serve
  + 20% safety buffer        (SAFETY_BUFFER)
  → minimum price
  → target gross margin      (TARGET_GROSS_MARGIN, 70%)
  → published rate, rounded UP
  → compared on-page against the visitor's current stack spend
```

`validateMargin()` refuses — throws, hard — to publish any rate whose
gross margin (after Stripe's cut) falls below `MINIMUM_GROSS_MARGIN`
(60%). The test suite sweeps seat counts 1–200 across module combinations
to prove no reachable quote breaches the floor.

## Editing prices or costs

1. **Our costs changed** → edit `internal/costs.ts`, run
   `npm run pricing:publish` (regenerates `published-rates.ts`), commit
   both. The publish step re-validates the margin floor.
2. **A competitor's price changed** → edit its entry in
   `data/software.ts`, set `verified: true`, and note the date you checked
   `sourceUrl`. Until then the UI shows "est.".
3. **New tool / industry / module** → append to the relevant file in
   `data/`; `npm run pricing:test` checks that all cross-references resolve.

## Honesty rules encoded here

- **Every competitor price is an estimate** (`verified: false`) of typical
  small-business list pricing as of early 2026, from assistant knowledge —
  none have been checked against live vendor pages yet. The UI labels them
  "est." and the page says so in plain words. Flip `verified` only after a
  human checks the vendor's page.
- **Three ROI outcomes, never forced savings** (`computeRoi`): savings /
  comparable / premium, classified against a ±max($25, 5%) band. The "new
  total" always includes the tools the visitor keeps.
- **Tools we don't replace** (QuickBooks, Toast, Square, Stripe, Google
  Workspace, Microsoft 365, Mailchimp) have their REPLACE button disabled
  with an honest note — accounting, POS, email, and payments stay where
  they are and 3Stone One connects to them.

## Other assumptions (documented per mission)

- **Logos**: cards use neutral monogram chips, not vendor logos —
  trademarked logo files were not bundled. Drop real ones in later if
  brand-use guidelines are cleared.
- **Calendly handoff**: the booking URL carries `utm_source/medium/
  campaign`, a compact summary in `utm_content` (250 chars), and the same
  summary in `a1` — Calendly prefills custom answer #1 with it **only if
  the event type has at least one custom question** (add one, e.g. "Notes
  from the stack builder"). A "Copy my summary" button covers every other
  case. No PII is collected by the page itself.
- **Per-seat tools** are priced as `estMonthly × ceil(employees ×
  seatFraction)` — `seatFraction` models that not every employee holds a
  seat (field crews don't get Salesforce licenses). Flat tools ignore head
  count; per-location tools (POS) multiply by locations; transaction-fee
  tools (Stripe) count as $0/mo with the fee noted, never summed.
- **Setup costs already paid** are the catalog's `estImplementation`
  one-time estimates summed across the tools in use — sunk cost shown for
  context, never counted as a "saving".
- **The admin dashboard** (`/internal/pricing-admin`) renders only when
  built with `PRICING_ADMIN_ENABLED=true` (local/staging). Production
  builds emit a bare not-found shell with `noindex`, and `/internal/` is
  excluded from the sitemap. It is server-rendered — no JS bundle can leak
  the cost model.
- **Session only**: builder state persists in `sessionStorage` (survives
  reloads, not shared, no cookies, no tracking).

## Commands

```bash
npm run pricing:test     # engine test suite (margins, ROI honesty, data integrity, isolation)
npm run pricing:publish  # regenerate published-rates.ts from internal costs
PRICING_ADMIN_ENABLED=true npm run dev   # view the internal dashboard locally
```
