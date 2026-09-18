import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // This app deliberately fetches on mount from client components to
      // sync with server-side session/DB state (e.g. dashboard summaries,
      // employee lists) — a standard, correct pattern that this newer,
      // stricter rule flags as a heuristic warning rather than a real bug.
      "react-hooks/set-state-in-effect": "warn",
      // Standard convention: an underscore-prefixed name in a destructure
      // marks "intentionally unused" (e.g. omitting passwordHash from a
      // safe-user object) without needing a per-line disable comment.
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", destructuredArrayIgnorePattern: "^_" },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
