// eslint.config.js
import js from "@eslint/js";
import globals from "globals";
import noSecrets from "eslint-plugin-no-secrets";
import reactPlugin from "eslint-plugin-react";
import nextPlugin from "@next/eslint-plugin-next";
import importPlugin from "eslint-plugin-import";
import { FlatCompat } from "@eslint/eslintrc";

// Helper to translate some old-style configs
const compat = new FlatCompat();

export default [
  js.configs.recommended, // ✅ base JS rules

  {
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: { jsx: true }, // enable JSX parsing
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        process: "readonly",
      },
    },

    plugins: {
      react: reactPlugin,
      import: importPlugin,
      "@next/next": nextPlugin,
      "no-secrets": noSecrets,
    },

    rules: {
      // React
      ...(reactPlugin.configs.recommended.rules ?? {}),

      // Next.js
      ...(nextPlugin.configs["core-web-vitals"]?.rules ??
        nextPlugin.configs.recommended?.rules ??
        {}),

      // Custom rules
      semi: ["error", "always"],
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "no-secrets/no-secrets": ["error", { tolerance: 4.2 }],
      "import/no-unresolved": "error",
      "import/named": "error",
    },

    settings: {
      react: { version: "detect" },
      "import/resolver": {
        node: { extensions: [".js", ".jsx", ".ts", ".tsx"] },
        alias: {
          map: [["@", "./src"]],
          extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
        },
      },
    },
  },

  {
    ignores: ["**/.next/**", "**/node_modules/**"],
  },
];
