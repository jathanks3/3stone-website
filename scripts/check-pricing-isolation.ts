import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = new URL("../", import.meta.url).pathname;
const dist = join(root, "dist");

if (!existsSync(dist)) {
  console.error("dist/ does not exist. Run npm run build before npm run pricing:isolation.");
  process.exit(1);
}

function filesUnder(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? filesUnder(path) : [path];
  });
}

const publicFiles = filesUnder(dist).filter((path) => {
  const rel = relative(dist, path);
  if (rel.startsWith("internal/")) return false;
  return /\.(?:html|js|mjs|css|json|xml|txt)$/.test(path);
});

const forbidden = [
  "perCustomerBase",
  "aiWorkspacePool",
  "implementationGrossMarginPct",
  "Pricing unit economics",
  "Target gross margin",
  "Margin floor (flagged in code)",
  "Cost model (per customer, monthly)",
  "suggestedPct",
  "expectedRetentionMonths",
];

const leaks: string[] = [];
for (const path of publicFiles) {
  const source = readFileSync(path, "utf8");
  for (const marker of forbidden) {
    if (source.includes(marker)) leaks.push(`${relative(dist, path)} contains ${JSON.stringify(marker)}`);
  }
}

if (leaks.length > 0) {
  console.error("Internal pricing data leaked into public build output:");
  leaks.forEach((leak) => console.error(`  - ${leak}`));
  process.exit(1);
}

console.log(`Pricing isolation passed: scanned ${publicFiles.length} public build files.`);
console.log("No internal cost, margin, discount, or LTV markers were found in public output.");
