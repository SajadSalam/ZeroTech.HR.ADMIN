<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import LoginImage from '~/assets/images/login-bg.jpg'
import ToseelLogo from '~/components/global/ToseelLogo.vue'
import LoginForm from '~/views/auth/components/LoginForm.vue'

// Page meta definition
definePageMeta({
  layout: 'empty',
  title: 'تسجيل الدخول',
  preview: {
    title: 'تسجيل الدخول',
    description: 'صفحة تسجيل الدخول للمستخدمين',
    categories: ['layouts', 'default'],
  },
  name: 'login',
})
useHead({
  title: 'تسجيل الدخول',
})

const i18n = useI18n()
</script>

<template>
  <div>
    <div
      class="min-h-screen w-screen overflow-hidden grid grid-cols-1 lg:grid-cols-[1.5fr_2fr]"
      :dir="i18n.locale.value === 'ar' ? 'rtl' : 'ltr'"
    >
      <!-- Login Form Section -->
      <div
        class="bg-[#EDF0F2] flex flex-col justify-center gap-4 px-4 py-8 sm:px-8 sm:py-12 lg:px-14 lg:py-20 lg:rounded-lt-3xl lg:rounded-lb-3xl order-2 lg:order-1"
      >
        <div class="flex flex-col gap-5 rounded-3xl bg-white p-6 sm:p-8 lg:p-10 mx-auto w-full max-w-md lg:max-w-none">
          <span class="text-center text-2xl sm:text-3xl lg:text-4xl font-bold text-black">
            <p>{{ $t('login') }}</p>
          </span>
          <p class="text-center text-xs sm:text-sm text-muted-500">
            {{ $t('enter-your-email-below-to-login-to-your-account') }}
          </p>
          <LoginForm />
          <div class="grow" />
        </div>
      </div>

      <!-- Content Section -->
      <div class="relative pa-4 flex flex-col justify-between gap-4 text-white min-h-[40vh] lg:min-h-screen order-1 lg:order-2">
        <!-- Background Image -->
        <img :src="LoginImage" class="absolute inset-0 -z-10 size-full object-cover brightness-50" >
        
        <!-- Header -->
        <div class="flex items-center gap-2 sm:gap-4 p-4 sm:p-6">
          <ToseelLogo :is-open="false" size="w-16 h-16 sm:w-20 sm:h-20 lg:w-25 lg:h-25" />
          <div>
            <h1
              class="font-bold text-lg sm:text-xl lg:text-2xl"
              :class="{
                'lg:text-2xl': $i18n.locale === 'en',
                'lg:text-xl': $i18n.locale === 'ar',
              }"
            >
              {{ $t('ministry-of-higher-education') }}
            </h1>
            <h2 class="mt-1 text-xs sm:text-sm">{{ $t('ems') }}</h2>
          </div>
        </div>

        <!-- Description -->
        <div class="p-4 sm:p-6 hidden sm:block">
          <h1 class="w-full text-sm sm:text-lg lg:text-xl font-normal">
            <span class="font-black"> {{ $t('ems') }}</span>
            {{
              $t(
                'ems-is-a-digital-platform-by-the-iraqi-ministry-of-education-designed-to-simplify-academic-management-enhance-learning-and-provide-easy-access-to-educational-data-for-students-teachers-and-administrators'
              )
            }}
          </h1>

          <h5 class="my-3 sm:my-5 text-sm sm:text-base">{{ $t('ems') }}</h5>
        </div>

        <!-- Mobile Description (Compact) -->
        <div class="p-4 block sm:hidden">
          <h5 class="text-sm font-medium">{{ $t('ems') }}</h5>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main {
  height: 80vh;
  overflow: hidden;
  background-color: #010518;
}

.card {
  background: linear-gradient(90deg, #ffffff17 0%, #ffffff00 100%);
  border: 1px solid #ffffff42;
}

/* Transition classes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Transition classes for sliding */
.slide-x-enter-active,
.slide-x-leave-active {
  transition: transform 0.5s ease;
}

.slide-x-enter-from {
  transform: translateX(100%);
  overflow: hidden;
  max-width: 100%;
}

.slide-x-leave-to {
  transform: translateX(-100%);
  overflow: hidden;
  max-width: 100%;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
  transition-delay: 0.3s;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
