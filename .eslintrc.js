module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  extends: [
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended",
  ],
  rules: {
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": "off",
  },
  ignorePatterns: ["*.config.js"],
};
