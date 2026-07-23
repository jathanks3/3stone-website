import { defineConfig, devices } from "@playwright/test";

// Mobile reliability pass: exact viewport widths called out in the audit
// (320/375/390/430) plus tablet and desktop for comparison. Touch-enabled so
// tap-target and touch-only interaction bugs actually surface.
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:4321",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "mobile-320", use: { viewport: { width: 320, height: 568 }, isMobile: true, hasTouch: true, userAgent: devices["iPhone SE"].userAgent } },
    { name: "mobile-375", use: { ...devices["iPhone SE"], viewport: { width: 375, height: 667 } } },
    { name: "mobile-390", use: { ...devices["iPhone 13"] } },
    { name: "mobile-430", use: { ...devices["iPhone 14 Pro Max"] } },
    { name: "tablet", use: { ...devices["iPad Mini"] } },
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: "npm run build && npm run preview",
    url: "http://localhost:4321/",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
