<script setup lang="ts">
import systemper from './system-performance-dashboard/index.vue'
definePageMeta({
  title: 'home-page',
  description: 'this-is-the-home-page',
})
</script>

<template>
  <systemper />
  <!-- <div class="text-red-900">
    {{$t('home-page')}}
  </div> -->
</template>
