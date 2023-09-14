/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  env: {
    browser: true,
    node: true,
  },
  ignorePatterns: [".eslintrc.cjs", "coverage/**", "dist/**"],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  settings: {},
  plugins: [],
  rules: {
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
  },
};
