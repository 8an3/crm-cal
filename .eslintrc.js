module.exports = {
  parser: "@typescript-eslint/parser", // Use the TypeScript parser
  parserOptions: {
    ecmaVersion: 2020, // Use the latest ECMAScript version
    sourceType: "module", // Allow the use of imports
    ecmaFeatures: {
      jsx: true, // Enable JSX support
    },
  },
  extends: [
    "react-app", // ESLint rules for Create React App
    "react-app/jest", // ESLint rules for Jest
    "plugin:@typescript-eslint/recommended", // Recommended TypeScript rules
    "plugin:react/recommended", // Recommended React rules
    "prettier", // Prettier plugin to avoid conflicts with ESLint
    "plugin:prettier/recommended", // Enables eslint-plugin-prettier and eslint-config-prettier
  ],
  plugins: [
    "@typescript-eslint", // TypeScript plugin
    "react", // React plugin
    "prettier", // Prettier plugin
  ],
  rules: {
    // TypeScript-specific rules
    "@typescript-eslint/no-explicit-any": "error", // Disallow the use of `any`
    "@typescript-eslint/explicit-module-boundary-types": "off", // Allow implicit return types
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }], // Enforce no unused variables
    "@typescript-eslint/ban-ts-comment": "off", // Allow `@ts-ignore` comments

    // React-specific rules
    "react/react-in-jsx-scope": "off", // Disable React global requirement (React 17+)
    "react/prop-types": "off", // Disable prop-types (TypeScript handles this)

    // Prettier rules
    "prettier/prettier": [
      "error",
      {
        tabWidth: 2,
        printWidth: 120,
        singleQuote: true,
        arrowParens: "avoid",
        bracketSpacing: true,
        endOfLine: "auto", // Automatically detect line endings
        jsxSingleQuote: true,
        semi: true,
        bracketSameLine: false,
        singleAttributePerLine: true,
        trailingComma: "all",
      },
    ],
  },
  settings: {
    react: {
      version: "detect", // Automatically detect the React version
    },
  },
};