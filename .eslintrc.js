module.exports = {
    root: true,
    env: {
      browser: true,
      node: true,
      es2021: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:vue/vue3-recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:prettier/recommended', // must be last
    ],
    parser: 'vue-eslint-parser',
    parserOptions: {
      parser: '@typescript-eslint/parser',
      ecmaVersion: 'latest',
      sourceType: 'module',
      extraFileExtensions: ['.vue'],
    },
    plugins: ['vue', '@typescript-eslint', 'prettier', 'tailwindcss'],
    rules: {
      // Vue Rules
      'vue/multi-word-component-names': 'off',
      'vue/require-default-prop': 'off',
  
      // TypeScript Rules
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  
      // Tailwind (optional)
      'tailwindcss/classnames-order': 'warn',
  
      // Prettier
      'prettier/prettier': ['warn'],
    },
    overrides: [
      {
        files: ['*.vue'],
        rules: {
          'max-lines-per-function': ['warn', 100],
        },
      },
    ],
  }
  