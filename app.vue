<script setup lang="ts">
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from './views/auth/store/auth'

interface TairoConfig {
  title?: string
}

interface AppConfig {
  tairo?: TairoConfig
  // add other properties if needed
}

const app = useAppConfig() as AppConfig
const auth = useAuthStore()
const router = useRouter()
onMounted(async () => {
  if (auth.isLogged && auth.userPrivileges.length == 0) {
    await auth.fetchUserPrivileges()
  }

   // Route guard: redirect to hall page if user has hall data and is not already on that route
    if (auth.isLogged && auth.userData.examCenter) {
        const expectedRoute = `/examination-centers/${auth.userData.examCenter.id}`
        const currentRoute = router.currentRoute.value.path
        if (currentRoute !== expectedRoute) {
            router.push(expectedRoute + '/exams')
        }
    }
    if (auth.isLogged && auth.userData.hall) {
        const expectedRoute = `/examination-centers/${auth.userData.hall.examCenterId}/hall/${auth.userData.hall.id}`
        const currentRoute = router.currentRoute.value.path
        
        if (currentRoute !== expectedRoute) {
        router.push(expectedRoute)
        }
    }
})
const i18n = useI18n()
useHead({
  titleTemplate: (titleChunk) => {
    //

    return titleChunk ? `${titleChunk} - ${app.tairo?.title}` : `${app.tairo?.title}`
  },
  htmlAttrs: {
    lang: i18n.locale.value,
    dir: i18n.locale.value === 'ar' ? 'rtl' : 'ltr',
  },
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: '/img/favicon.png',
    },
  ],
})

useColorMode().value = 'light'
useColorMode().preference = 'light'


</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtLoadingIndicator color="rgb(var(--color-primary-500))" />
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<style lang="scss">
@import url('styles/main.scss');

@font-face {
  font-family: 'BahijHelveticaNeue';
  src: url('~/assets/fonts/BahijHelveticaNeue-Roman.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: 'BahijHelveticaNeue';
  src: url('~/assets/fonts/BahijHelveticaNeue-Bold.ttf') format('truetype');
  font-weight: bold;
  font-style: normal;
}

@font-face {
  font-family: 'BahijHelveticaNeue';
  src: url('~/assets/fonts/BahijHelveticaNeue-Light.ttf') format('truetype');
  font-weight: lighter;
  font-style: normal;
}

body,
* {
  font-family: 'BahijHelveticaNeue', sans-serif !important;
}
</style>
