<script setup lang="ts">

import { useRoute } from 'vue-router'
import Exams from '~/views/examination-centers/componets/Exams.vue'
import { useExaminationCenters } from '~/views/examination-centers/store'
import Students from '~/views/examination-centers/componets/Students.vue'

definePageMeta({
  title: 'examination-center-exams',
  description: 'manage-examination-center-exams',
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

const statistics = ref({
    halls: 12,
    exams: 5,
    students: 100,
    amount: 20000000,
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-4">
      <h1 class="text-2xl font-bold">{{ examinationCenter?.name }} - {{ $t('students') }}</h1>
    </div>
    
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 my-2">
    
      <InfoLabelGradient :label="$t('number-of-students')" color="primary" icon="ph:folder-notch-open-duotone"
          :value="statistics.students">
      </InfoLabelGradient>

      <InfoLabel :label="$t('amount')" color="warning" icon="ph:arrows-clockwise-duotone"
          :value="statistics.amount">
      </InfoLabel>
    </div>
    
    <!-- <Exams /> -->
    <Students />
  </div>
</template>