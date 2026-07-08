# 3Stone AI Brand Guidelines

This is the reference for how to present 3Stone AI consistently across the
website, decks, social media, email, and any future materials. It covers
logo usage, color, typography, spacing, and voice. If you're handing
assets to a client, contractor, or design vendor, send them this file
along with the `/branding` folder.

**Status:** this is a placeholder identity, not a final professionally
designed logo. It was evolved from the original 3Stone Capital mark to get
the company to launch with something consistent and premium. Replace the
files in `/branding` when a final logo is designed — nothing else in this
guide (color, typography, voice) needs to change when that happens.

---

## 1. Logo

The mark is three ascending horizontal bars terminating in a
forward-pointing arrow — read as motion, progress, and the "3" of 3Stone,
rendered as a geometric monogram rather than a literal numeral.

### Which file to use

| Situation | File |
| --- | --- |
| Default, dark background (website, decks, dark UI) | `logo-primary.svg` / `.png` |
| Light or white background (documents, email signatures, light decks) | `logo-primary-light.svg` / `.png` |
| Square or vertical space (app tiles, stacked layouts) | `logo-stacked.svg` / `.png` (dark bg) or `logo-stacked-light.svg` (light bg) |
| Icon only, brand context already established | `monogram.svg` / `.png` |
| Browser tab / app icon | `favicon.svg` / `.png` |
| iOS home screen icon | `apple-touch-icon.png` |
| Single-color print, dark or colored surface | `icon-white.svg` / `.png` |
| Single-color print, light surface | `icon-black.svg` / `.png` |
| Social media profile photo (LinkedIn, X, Instagram, GitHub) | `social-profile.png` |

### Clear space

Keep empty space around the logo equal to at least the height of the
arrow's vertical span in the mark (the height of one of the three bars).
Don't let text, other logos, or edges of a page/card crowd closer than
that.

### Minimum size

- Full lockup (icon + wordmark): don't render narrower than 120px wide —
  the wordmark stops being legible below that.
- Icon alone: don't render smaller than 24px wide — the negative-space
  gaps between bars start to fill in below that.

### Don'ts

- Don't recolor the mark to anything other than the accent blue
  (`#6e93d6`), pure white, or pure black. No gradients, no other hues.
- Don't stretch or skew the logo — always scale proportionally (lock the
  aspect ratio).
- Don't rotate the mark.
- Don't add a drop shadow, outline, or glow effect to the logo itself
  (the website's glow effects are applied to backgrounds behind the logo,
  never to the mark).
- Don't place the dark-background version on a light background or vice
  versa — contrast will fail.
- Don't recreate the wordmark in a different typeface. It's set in Inter
  Extra Bold with tight letter-spacing; substituting fonts breaks brand
  consistency immediately.

---

## 2. Color

### Primary palette

| Name | Hex | Use |
| --- | --- | --- |
| Near-black (base) | `#050505` | Primary background everywhere — website base, logo backgrounds |
| Surface | `#0c0c0d` | Slightly raised sections, card backgrounds |
| Surface raised | `#131314` | Form fields, further-raised elements |
| Accent blue | `#6e93d6` | Logo mark, links, small UI accents, highlights — used sparingly, never as a large fill |
| Accent blue (strong) | `#8aabe3` | Hover states on accent elements |
| White (primary text) | `rgba(255,255,255,0.94)` | Headlines, primary body text |
| White (secondary text) | `rgba(255,255,255,0.62)` | Supporting copy |
| White (tertiary text) | `rgba(255,255,255,0.48)` | Labels, captions, least-important text |

### Signal color (BetAI only)

| Name | Hex | Use |
| --- | --- | --- |
| BetAI signal green | `#2fe0a8` | Only used when referencing BetAI specifically on the Portfolio page, so BetAI keeps its own product identity. Never use this color for 3Stone AI's own brand elements. |

### Rules

- The accent blue is a highlight color, not a brand color to fill large
  areas with. If a section feels like it needs more color, add more
  contrast/spacing instead — don't reach for blue.
- Never use pure black (`#000000`) or pure white (`#ffffff`) as a
  background — always the near-black `#050505` or one of its surface
  steps. Pure black/white are reserved for the single-color logo variants
  only.
- Maintain WCAG AA contrast (4.5:1 minimum) for all text against its
  background. The tertiary text color is already tuned to the minimum
  passing value against `#050505` — don't make it more transparent.

---

## 3. Typography

**Inter** is the only typeface, for everything — headlines, body copy,
labels, buttons. No second "display" font. Hierarchy comes from weight,
size, and letter-spacing, not from mixing typefaces.

| Role | Weight | Notes |
| --- | --- | --- |
| Headlines (H1/H2) | 700–800 (Bold/Extra Bold) | Tight letter-spacing (around -1 to -2px at large sizes) |
| Body copy | 400 (Regular) | Comfortable line-height (1.6–1.7) |
| Buttons, nav | 600 (Semibold) | |
| Eyebrow labels, form labels | 600 (Semibold), uppercase | Wide letter-spacing (1–2px), small size (12px), tertiary text color |

Loaded via Google Fonts (`Inter:wght@400;500;600;700;800`) — see
`BaseLayout.astro` for the exact `<link>` tag if setting this up in a new
project.

---

## 4. Spacing

The site uses a fixed spacing scale — always pick from this scale rather
than an arbitrary pixel value, so spacing stays consistent everywhere:

```
4px   (xs)
8px   (sm)
16px  (md)
28px  (lg)
40px  (xl)
64px  (2xl)
112px (3xl)
```

Err generous. This brand reads as premium partly because sections have
room to breathe — cramped spacing undercuts that immediately.

Corner radius scale: `10px` (small elements like buttons/inputs), `16px`
(cards), `24px` (large containers).

---

## 5. Voice

- Plain English, no jargon. Every technical concept gets translated into
  a business outcome (time saved, errors avoided, revenue gained) — see
  Section 1 of `CLAUDE.md` for the underlying principle.
- Confident, not hype-y. No exclamation points in body copy, no "game-
  changing" / "revolutionary" language. The Bloomberg/Apple/Stripe
  reference points mean calm authority, not startup energy.
- Honest about scope. If something is a portfolio/future item rather than
  live client work, say so plainly (see the "Future Portfolio — Coming
  Soon" framing on the Portfolio page) rather than implying more than is
  true.
- Never overpromise. This is a named company value (`values` in
  `brand.ts`) and should show up in copy: no guaranteed timelines or
  outcomes without qualification.

---

## 6. Applying this to new materials

When creating anything new (a slide deck, a one-pager, a social post, a
partner's co-branded asset):

1. Background is near-black `#050505` (or white, if the context requires
   a light document — use `logo-primary-light` / `icon-black` in that
   case).
2. Logo placement follows the clear-space and minimum-size rules above.
3. Typography is Inter throughout, no exceptions.
4. Any accent color usage is the single blue `#6e93d6`, applied sparingly.
5. Copy follows the voice rules above — plain English, confident, honest
   about scope.

If in doubt, look at how the live website (3stoneai.com) already handles
the situation — it's the reference implementation of this guide.
