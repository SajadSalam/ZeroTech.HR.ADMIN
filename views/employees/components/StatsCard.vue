<script setup lang="ts">
defineProps<{
  stats: any[]
  title: string
  span:number
}>()
</script>

<template>
<div>
<div class="mb-2"> {{ title }} </div>
<div class="grid bg-#FBFCFE rounded-3xl b b-#E9EAF0" :style="`grid-template-columns: repeat(${span ?? 3}, 1fr);`">
  <div v-for="stat in stats" :key="stat.id" class="flex items-center justify-start b-l b-l-#E9EAF0 last:b-l-0 p-2 gap-2">
    <div v-if="stat.icon" class="bg-primary-500/10 rounded-full p-2 flex">
      <Icon :name="stat.icon" class="size-6 text-primary-500" /> 
    </div>
    <div>
      <div class="text-#687296"> {{ stat.label }} </div>
      <div > {{ stat.value }} </div>
    </div>
  </div>
</div>
</div>
</template>
