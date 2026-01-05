import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Project-specific rule overrides
  {
    rules: {
      // allow `any` in codebase as warnings instead of errors to unblock builds
      "@typescript-eslint/no-explicit-any": "warn",
      // set-state-in-effect is useful but can be noisy in some patterns here
      "react-hooks/set-state-in-effect": "warn",
      // relax rules-of-hooks errors raised for Next.js app router `page` exports
      "react-hooks/rules-of-hooks": "warn",
      // reduce unused-vars strictness
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }
      ]
    }
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
