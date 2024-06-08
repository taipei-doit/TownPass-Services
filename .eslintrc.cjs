/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    'plugin:prettier-vue/recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    // eslint
    'eol-last': 'error',

    // vue
    'vue/component-name-in-template-casing': 'error',
    'vue/html-closing-bracket-newline': 'error',
    'vue/multiline-html-element-content-newline': [
      'error',
      {
        ignores: ['pre', 'textarea']
      }
    ],
    'vue/multi-word-component-names': 'off',

    // typescript
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-explicit-any': 'off'
  }
};
