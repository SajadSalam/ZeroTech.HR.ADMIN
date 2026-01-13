<script setup lang="ts">

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

</script>

<template>
  <div>
    <div
      class="grid h-screen w-screen grid-cols-1 md:grid-cols-[1.5fr_2fr] overflow-hidden"
      dir="rtl"
    >
      <div
        class="bg-[#EDF0F2] md:rounded-lt-3xl md:rounded-lb-3xl flex flex-col justify-center gap-7 px-6 py-10 md:px-14 md:py-20"
      >
        <div class="flex flex-col gap-5 rounded-3xl bg-white p-6 md:p-10">
          <span class="l text-center text-3xl md:text-4xl font-bold text-black">
            <p>تسجيل الدخول</p>
          </span>
          <p class="l text-center text-sm text-muted-500">
            قم بإدخال بريدك الإلكتروني أدناه لتسجيل الدخول إلى حسابك
          </p>
          <LoginForm />
          <div class="grow" />
        </div>
      </div>
      <div class="pa-4 flex flex-col justify-between gap-4 text-white hidden md:flex">
        <div class="flex items-center gap-4">
          <ToseelLogo :is-open="false" size="w-25 h-25" />
         
        </div>

        <div>
          <h1 class="w-4/4 text-xl font-normal">
           مرحبا بك في Zero Tech
          </h1>

          <h5 class="my-5">

           نظام ذكي لإدارة شؤون الموظفين يوفّر أدوات دقيقة لتتبع الحضور والانصراف، مراجعة الطلبات، تنظيم الرواتب، ومراقبة الأداء العام للمؤسسة. تم تصميم هذه اللوحة لتسهيل المهام الإدارية وتحسين كفاءة العمل من خلال واجهة سهلة الاستخدام وتقارير شاملة تدعم اتخاذ القرار.
          </h5>
        </div>
      </div>
      <div style="background: linear-gradient(180deg, #2B4BA3 0%, #1A2951 100%),
linear-gradient(0deg, rgba(3, 16, 17, 0.6), rgba(3, 16, 17, 0.6));
" class="absolute -z-10 size-full object-cover brightness-50" />
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
