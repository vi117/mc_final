module.exports = {
    root: true,
    extends: [
        "eslint:recommended",
    ],
    env: {
        browser: true,
        node: true,
    },
    ignorePatterns: [".eslintrc.cjs"],
    parserOptions: { ecmaVersion: "latest", sourceType: "module" },
    settings: {},
    plugins: [],
    rules: {
        "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }]
    },
};
