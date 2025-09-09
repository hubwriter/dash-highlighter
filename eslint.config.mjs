export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "script",
      globals: {
        chrome: "readonly",
        DASH_HIGHLIGHTER_CONSTANTS: "readonly",
        document: "readonly",
        window: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        Node: "readonly",
        NodeFilter: "readonly",
        MutationObserver: "readonly"
      }
    },
    rules: {
      "no-unused-vars": "error",
      "no-undef": "error",
      "no-console": "warn"
    }
  },
  {
    files: ["constants.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "script",
      globals: {
        module: "readonly",
        exports: "readonly"
      }
    }
  }
];
