import { VueQueryPlugin } from '@tanstack/vue-query'
export default defineNuxtPlugin((context) => {
    context.vueApp.use(VueQueryPlugin)
})
