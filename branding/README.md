# 3Stone AI Brand Assets

An evolution of the original 3Stone Capital mark — the same angular,
geometric monogram, redrawn as three ascending bars terminating in a
forward-pointing arrow, in the site's soft-blue accent (`#6e93d6`) against
near-black (`#050505`). This is a placeholder identity, not a final
professionally-designed logo — replace these files when one exists.

## Files

| File | Use |
| --- | --- |
| `logo-primary.svg` / `.png` | Main horizontal lockup (icon + wordmark) for dark backgrounds. Use this by default. |
| `logo-horizontal.svg` / `.png` | Identical to primary — provided under both names since they're referenced separately. |
| `logo-primary-light.svg` / `.png` | Same lockup, dark mark/text, for light/white backgrounds (documents, email signatures). |
| `logo-stacked.svg` / `.png` | Icon above wordmark, centered — for square or vertical contexts (social profile images, app tiles). |
| `logo-stacked-light.svg` / `.png` | Stacked lockup for light backgrounds. |
| `monogram.svg` / `.png` | Icon only, no wordmark. |
| `favicon.svg` / `.png` | Icon on a rounded dark square — self-contained for browser tabs / app icons. |
| `apple-touch-icon.png` | 180×180, solid background (required by iOS — must not be transparent). |
| `icon-white.svg` / `.png` | Icon only, pure white, transparent background — single-color use on dark or colored backgrounds. |
| `icon-black.svg` / `.png` | Icon only, pure black, transparent background — single-color use on light backgrounds. |
| `social-profile.svg` / `.png` | Square (800×800), icon centered with generous padding — safe for circular cropping on LinkedIn, X, Instagram, GitHub, etc. |

All PNGs are exported with true alpha transparency (verified against a
checkered background) except `apple-touch-icon.png` and `social-profile.png`,
which are intentionally opaque (avatar upload fields don't support
transparency, and it would show as black anyway).

## Colors

- Accent (mark): `#6e93d6`
- Dark background: `#050505`
- Text/mark on light backgrounds: `#050505`
- Single-color variants: pure white `#ffffff` or pure black `#000000` (no accent blue)

## Launch graphics

`social/` contains ready-to-post launch announcement graphics, sized to
each platform's recommended in-feed image dimensions:

| File | Size | Platform |
| --- | --- | --- |
| `social/linkedin-launch.png` | 1200×627 | LinkedIn post |
| `social/x-launch.png` | 1600×900 | X (Twitter) post |
| `social/instagram-launch.png` | 1080×1080 | Instagram post |

These are one-time launch-announcement assets (not evergreen brand
assets) — update the copy or regenerate before reusing them for a future
announcement.

## Known limitation

The wordmark in the SVG files is live `<text>` set in Inter, not converted
to outlines. It will render correctly anywhere Inter is available (it's
loaded via Google Fonts on the website itself), but will fall back to a
system sans-serif if opened in a design tool or OS without Inter installed.
Convert to outlines before using these in a context where font
substitution would be a problem (e.g., handing files to a print vendor).
