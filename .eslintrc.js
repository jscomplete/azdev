module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    node: true,
    commonjs: true,
    es2020: true,
    jest: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: 'module',
  },
  plugins: ['react-hooks', 'react', 'jsx-a11y'],
  settings: {
    react: {
      version: '17.x',
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
  ],
  rules: {
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',

    'react/prop-types': 'off',
    'react/no-unescaped-entities': ['error', { forbid: ['>', '}'] }],
    '@typescript-eslint/prefer-interface': 'off',

    // TODO: get rid of these ;)
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
};
