import vue from 'eslint-plugin-vue'
import globals from 'globals'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  files: ['**/*.{js,ts,vue}'],
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    globals: {
      ...globals.browser,
      ...globals.node,
    },
  },
  plugins: {
    vue,
  },
  rules: {
    // your custom rules here
  },
  ignores: [
    '**/node_modules/**',
    '**/dist/**',
    '**/.nuxt/**',
    '**/.output/**',
    '**/coverage/**',
    '**/build/**',
    '**/public/**',
    '**/assets/**',
    '**/static/**',
  ],
})
