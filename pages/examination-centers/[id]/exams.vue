<script setup lang="ts">

import { useRoute } from 'vue-router'
import Exams from '~/views/examination-centers/componets/Exams.vue'
import DeactivateExamCenter from '~/views/examination-centers/componets/DeactivateExamCenter.vue'
import { useExaminationCenters } from '~/views/examination-centers/store'
import type { ExamCenterStatistics } from '~/views/examination-centers/types'

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

const statistics = ref<ExamCenterStatistics>({
  numberOfHall: 0,
  numberOfExams: 0,
  numberOfStudents: 0,
  amount: 0,
})
const getStatistics = async () => {
  const response = await examinationCenterStore.getExamCenterStatistics(id as string)
  statistics.value = response
}
const openDeactivateExamCenterDialog = () => {
  examinationCenterStore.isDeactivateDialogOpen = true
}

onMounted(() => {
  getExaminationCenter()
  getStatistics()
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between gap-4">
      <h1 class="text-2xl font-bold">{{ examinationCenter?.name }} - {{ $t('exams') }}</h1>
      <BaseButton color="primary" @click="openDeactivateExamCenterDialog">
        {{ $t('deactivate-exam-center') }}
      </BaseButton>
    </div>
    
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <InfoLabel :label="$t('number-of-halls')" color="primary" icon="ph:building-duotone"
          :value="statistics.numberOfHall">
      </InfoLabel>

      <InfoLabel :label="$t('number-of-exams')" color="warning" icon="ph:building-apartment-duotone"
          :value="statistics.numberOfExams">
      </InfoLabel>

      <InfoLabel :label="$t('number-of-students')" color="primary" icon="ph:folder-notch-open-duotone"
          :value="statistics.numberOfStudents">
      </InfoLabel>

      <InfoLabel :label="$t('amount')" color="warning" icon="ph:arrows-clockwise-duotone"
          :value="statistics.amount">
      </InfoLabel>
    </div>
    
    <Exams />
    
    <!-- Deactivation Dialog -->
    <DeactivateExamCenter 
      :exam-center-id="id as string" 
      :exam-center-name="examinationCenter?.name" 
    />
  </div>
</template>