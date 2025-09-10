<script lang="ts" setup>
import { defineProps } from 'vue'
defineProps<{
  isOpen: boolean
}>()
</script>

<template>
  <div class="flex gap-3 my-5 mx-2 items-center text-white">
    <img class="object-contain w-15 h-15"  src="~/assets/images/sidebar-logo.png" />
    <div v-if="isOpen">
      <h1 class=" font-bold" :class="{
        'text-2xl': $i18n.locale === 'en',
        'text-xl': $i18n.locale === 'ar'
      }">
        {{ $t('moheser') }}
      </h1>
      <h2 class="text-sm mt-1">{{ $t('ems') }}</h2>
    </div>
  </div>
</template>
