// Minimal flat config: Astro's own recommended rules, browser globals for
// component <script> blocks, and dist/build output excluded.
import eslintPluginAstro from "eslint-plugin-astro";
import globals from "globals";

export default [
  { ignores: ["dist/**", ".astro/**", "node_modules/**"] },
  ...eslintPluginAstro.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
];
