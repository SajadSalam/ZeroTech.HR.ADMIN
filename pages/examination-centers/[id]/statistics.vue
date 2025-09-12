<script setup lang="ts">

import { useRoute } from 'vue-router'
import Statistics from '~/views/examination-centers/componets/Statistics.vue'
import { useExaminationCenters } from '~/views/examination-centers/store'

definePageMeta({
  title: 'statistics',
  description: 'statistics',
})

const { id } = useRoute().params
const examinationCenterStore = useExaminationCenters()
const examinationCenter = ref<any>(null)

const getExaminationCenter = async () => {
  const response = await examinationCenterStore.getExaminationCenter(id as string)
  examinationCenter.value = response
}

onMounted(() => {
  getExaminationCenter()
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-4">
      <h1 class="text-2xl font-bold">{{ $t('exam-center') }} {{ examinationCenter?.name }} - {{ $t('statistics') }}</h1>
    </div>
    <Statistics />
  </div>
</template>