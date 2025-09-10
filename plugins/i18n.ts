import { createI18n } from 'vue-i18n'
import ar from '~/locales/ar.json'
import en from '~/locales/en.json'

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: localStorage.getItem('locale') || 'en',
    messages: {
      ar,
      en,
    },
  })

  vueApp.use(i18n)
})
