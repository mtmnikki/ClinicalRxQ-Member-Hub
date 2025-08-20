/**
 * ESLint configuration for the ClinicalRxQ React + TypeScript app
 * - Enforces no function declarations inside JSX/blocks (prevents prior error)
 * - Applies React, React Hooks, Accessibility, and TS recommended rules
 */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2023: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'jsx-a11y'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
  ],
  settings: {
    // Auto-detect React version
    react: { version: 'detect' },
  },
  rules: {
    /**
     * Prevent declaring functions/vars in blocks (and accidentally inside JSX),
     * which caused the previous “Expected '}' but found ':'” parse error.
     */
    'no-inner-declarations': ['error', 'both'],

    /** Keep TS tidy but allow underscore-prefixed unused vars when intentional */
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],

    /** Modern JSX transform – no need to import React */
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'off',

    /** Not using PropTypes with TS */
    'react/prop-types': 'off',
  },
  ignorePatterns: ['dist/**', 'build/**', 'scripts/**', 'node_modules/**'],
};
