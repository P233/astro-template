import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginAstro from "eslint-plugin-astro";

export default tseslint.config(
  { ignores: ["dist", "node_modules", ".astro", ".git"] },
  {
    files: ["astro.config.mjs"],
    languageOptions: {
      globals: {
        process: "readonly"
      }
    }
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  ...eslintPluginAstro.configs["flat/jsx-a11y-recommended"]
);
