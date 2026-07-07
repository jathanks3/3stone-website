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

All PNGs are exported with true alpha transparency (verified against a
checkered background) except `apple-touch-icon.png`, which is intentionally
opaque.

## Colors

- Accent (mark): `#6e93d6`
- Dark background: `#050505`
- Text/mark on light backgrounds: `#050505`

## Known limitation

The wordmark in the SVG files is live `<text>` set in Inter, not converted
to outlines. It will render correctly anywhere Inter is available (it's
loaded via Google Fonts on the website itself), but will fall back to a
system sans-serif if opened in a design tool or OS without Inter installed.
Convert to outlines before using these in a context where font
substitution would be a problem (e.g., handing files to a print vendor).
