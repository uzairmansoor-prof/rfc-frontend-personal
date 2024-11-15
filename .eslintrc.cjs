module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:sonarjs/recommended-legacy",

    "plugin:@typescript-eslint/recommended",
    // 'plugin:jsx-a11y/recommended',
    "plugin:prettier/recommended",
    "eslint-config-prettier",
  ],
  ignorePatterns: ["dist", ".eslintrrc"],
  settings: {
    react: {
      version: "detect",
    },
    "import/resolver": {
      node: {
        paths: ["src"],
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh", "@typescript-eslint", "prettier", "unused-imports"],
  rules: {
    "prettier/prettier": ["error", {"endOfLine": "auto"}, { usePrettierrc: true }],
    "react/react-in-jsx-scope": "off",
    "react-hooks/exhaustive-deps": "warn",
    "prefer-const": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": "warn",
    "no-useless-escape": "off", //
    '@typescript-eslint/ban-types': 'warn', //
    "react/no-children-prop": "warn", //
    'prefer-spread': 'warn',  //
    'react/display-name': 'warn', //

    // 'simple-import-sort/imports': 'error',
    // 'simple-import-sort/exports': 'error',
    "react/prop-types": ["off"],
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],

    "sonarjs/no-duplicate-string": "warn",
    "sonarjs/no-nested-template-literals":"warn",
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": "warn" // Optional
  },
};
