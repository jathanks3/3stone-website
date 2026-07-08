# Google Search Console Setup — 3Stone AI

Follow these steps exactly, in order. This gets 3stoneai.com indexed by Google
and lets you see search traffic, click-through rates, and any indexing errors.

## Step 1: Add the property

1. Go to https://search.google.com/search-console
2. Sign in with the Google account you want to own this (recommend a
   3Stone AI Google Workspace account, e.g. jathan@3stoneai.com, not a
   personal Gmail — ownership of Search Console data should live with the
   business).
3. Click **Add Property**.
4. Choose the **Domain** property type (not "URL prefix") and enter:
   ```
   3stoneai.com
   ```
   The Domain type is the better choice here because it automatically
   covers `http://`, `https://`, `www`, and non-`www` versions in one
   property — you don't have to verify each variant separately.

## Step 2: Verify ownership (DNS TXT record — recommended)

Google will show you a TXT record that looks like:
```
google-site-verification=some-long-random-string
```

Add it in Cloudflare (same place you added the domain's A records for
Vercel):

1. Go to the Cloudflare dashboard → your domain → **DNS** → **Records**.
2. Click **Add record**.
3. Set:
   - **Type:** `TXT`
   - **Name:** `@`
   - **Content:** the exact `google-site-verification=...` value Google
     gives you (paste it exactly, including the `google-site-verification=`
     prefix)
   - **TTL:** Auto
4. Save.
5. Go back to Search Console and click **Verify**.

DNS changes are sometimes instant, sometimes take up to a few minutes — if
verification fails immediately, wait 5 minutes and click Verify again.

**Why DNS TXT instead of the HTML file/meta tag method:** the HTML methods
require uploading a file to the site or editing page `<head>` code, and
they break if you ever migrate hosting. A DNS TXT record lives with your
domain, not your code, so it survives any future rebuild or host change.

## Step 3: Submit the sitemap

Once verified:

1. In Search Console, go to **Sitemaps** in the left sidebar.
2. Under "Add a new sitemap," enter:
   ```
   sitemap-index.xml
   ```
3. Click **Submit**.

This points Google at:
```
https://3stoneai.com/sitemap-index.xml
```
which Astro already generates automatically on every build (confirmed in
the last build — it lists all 7 pages: home, services, portfolio, about,
contact, privacy, terms).

## Step 4: Request indexing for the homepage (speeds things up)

Sitemap submission tells Google the pages exist, but initial crawling can
still take days to weeks. To speed up the homepage specifically:

1. In Search Console, use the **URL Inspection** search bar at the top.
2. Enter `https://3stoneai.com`.
3. Click **Request Indexing**.

You can repeat this for `/services`, `/portfolio`, `/about`, and
`/contact` individually if you want them indexed faster too.

## Step 5 (optional but recommended): Connect Google Analytics

Not required for indexing, but if you want traffic data beyond what
Search Console shows (which is limited to search performance), set up
Google Analytics 4 separately and link it to this Search Console property
under **Settings → Associations**. This is a separate task — flag it
if/when you want it done, since it involves adding a tracking script to
the site.

## What to expect after setup

- Verification: immediate to a few minutes.
- Sitemap processed: usually within 24 hours.
- Pages actually appearing in Google search results: anywhere from a few
  days to a few weeks for a brand-new domain — this is normal and not a
  sign anything is broken.
- Check back in **Coverage** (or **Pages**, in the newer UI) under
  **Indexing** to see which pages Google has crawled and indexed, and any
  errors it found.
