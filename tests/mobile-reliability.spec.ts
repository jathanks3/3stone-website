import { expect, test, type Page } from "@playwright/test";

// Every public route this repo owns (mirrors src/pages, minus the env-gated
// internal pricing dashboard, which is not part of the public site).
const ROUTES = [
  "/",
  "/3stone-one",
  "/3stone-one/build-your-stack",
  "/about",
  "/contact",
  "/portfolio",
  "/pricing", // legacy redirect -> /3stone-one/build-your-stack
  "/privacy",
  "/services",
  "/terms",
];

function collectPageErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`console.error: ${msg.text()}`);
  });
  page.on("requestfailed", (req) => {
    // Font/analytics requests can be aborted by ad blockers in CI sandboxes;
    // only fail the test on same-origin asset failures, which are ours to fix.
    if (req.url().startsWith("http://localhost:4321")) {
      errors.push(`requestfailed: ${req.url()} — ${req.failure()?.errorText}`);
    }
  });
  return errors;
}

async function hasHorizontalOverflow(page: Page) {
  return page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
}

test.describe("every public route loads cleanly", () => {
  for (const route of ROUTES) {
    test(`${route} — no console errors, no horizontal scroll, no localhost refs`, async ({ page }) => {
      const errors = collectPageErrors(page);
      const response = await page.goto(route, { waitUntil: "load" });
      expect(response?.ok(), `${route} should respond 2xx/3xx`).toBe(true);

      // Viewport meta must be present (BaseLayout is the single source, but
      // verify per-page since a page could theoretically bypass the layout).
      await expect(page.locator('meta[name="viewport"]')).toHaveAttribute("content", /width=device-width/);

      const overflow = await hasHorizontalOverflow(page);
      expect(overflow, `${route} should not cause horizontal scroll at ${page.viewportSize()?.width}px`).toBe(false);

      const html = await page.content();
      expect(html, `${route} must not leak a localhost/127.0.0.1 reference`).not.toMatch(/localhost|127\.0\.0\.1/);

      expect(errors, `${route} produced console/page errors:\n${errors.join("\n")}`).toEqual([]);
    });
  }
});

test.describe("hard refresh and deep links", () => {
  for (const route of ["/3stone-one/build-your-stack", "/about", "/portfolio"]) {
    test(`${route} survives a direct load and a hard refresh`, async ({ page }) => {
      await page.goto(route, { waitUntil: "load" });
      await expect(page).toHaveURL(new RegExp(`${route.replace(/[/]/g, "\\/")}\\/?$`));
      await page.reload({ waitUntil: "load" });
      await expect(page.locator("h1").first()).toBeVisible();
    });
  }
});

test.describe("browser back/forward across pages", () => {
  test("back button returns to the previous page with correct content", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    await page.goto("/about", { waitUntil: "load" });
    await page.goBack();
    await expect(page).toHaveURL(/\/$/);
    await page.goForward();
    await expect(page).toHaveURL(/\/about\/?$/);
  });
});

test.describe("mobile navigation menu", () => {
  test("hamburger opens and closes the mobile menu, and its links work", async ({ page, isMobile }) => {
    test.skip(!isMobile, "desktop/tablet nav is not collapsed");
    await page.goto("/", { waitUntil: "load" });

    const toggle = page.locator("#mobile-nav-toggle");
    const menu = page.locator("#mobile-nav");

    await expect(toggle).toBeVisible();
    await expect(menu).toBeHidden();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");

    await toggle.click();
    await expect(menu).toBeVisible();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");

    await toggle.click();
    await expect(menu).toBeHidden();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");

    await toggle.click();
    await menu.getByRole("link", { name: "About", exact: true }).click();
    await expect(page).toHaveURL(/\/about\/?$/);
  });

  test("hamburger toggle meets the 44px minimum touch target", async ({ page, isMobile }) => {
    test.skip(!isMobile, "only the collapsed mobile toggle needs a touch-target check");
    await page.goto("/", { waitUntil: "load" });
    const box = await page.locator("#mobile-nav-toggle").boundingBox();
    expect(box, "mobile-nav-toggle should have a bounding box").not.toBeNull();
    expect(box!.width, "touch target width").toBeGreaterThanOrEqual(44);
    expect(box!.height, "touch target height").toBeGreaterThanOrEqual(44);
  });
});

test.describe("broken link scan", () => {
  for (const route of ROUTES) {
    test(`${route} — every link on the page resolves`, async ({ page, request }) => {
      await page.goto(route, { waitUntil: "load" });

      const hrefs = await page.$$eval("a[href]", (as) =>
        Array.from(new Set(as.map((a) => a.getAttribute("href")).filter((h): h is string => Boolean(h))))
      );

      const skipPrefixes = ["mailto:", "tel:", "#"];
      const toCheck = hrefs.filter((h) => !skipPrefixes.some((p) => h.startsWith(p)));

      for (const href of toCheck) {
        const isExternal = href.startsWith("http");
        try {
          const res = await request.fetch(isExternal ? href : new URL(href, page.url()).toString(), {
            method: "GET",
            maxRedirects: 5,
            timeout: 15_000,
          });
          expect(res.status(), `${route} → "${href}" returned ${res.status()}`).toBeLessThan(400);
        } catch (err) {
          throw new Error(`${route} → "${href}" failed to resolve: ${(err as Error).message}`);
        }
      }
    });
  }
});
