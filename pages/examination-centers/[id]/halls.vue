<script setup lang="ts">

import { useRoute } from 'vue-router'
import GenerateOTP from '~/views/examination-centers/componets/GenerateOTP.vue'
import HallView from '~/views/examination-centers/halls/components/HallView.vue'
import { useExaminationCenters } from '~/views/examination-centers/store'
import type { ExamCenterStatistics } from '~/views/examination-centers/types'
import ManagerSignature from '~/views/examination-centers/componets/ManagerSignature.vue'

definePageMeta({
  title: 'halls',
  description: 'halls',
})

const { id } = useRoute().params
const examinationCenterStore = useExaminationCenters()

const isGenerateOTPDialogOpen = computed({
  get() {
    return examinationCenterStore.isGenerateOTPDialogOpen
  },
  set(value: boolean) {
    examinationCenterStore.isGenerateOTPDialogOpen = value
  }
})

const isManagerSignatureDialogOpen = computed({
  get() {
        return examinationCenterStore.isManagerSignatureDialogOpen
  },
  set(value: boolean) {
      examinationCenterStore.isManagerSignatureDialogOpen = value
  }
})
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
onMounted(() => {
  getExaminationCenter()
  getStatistics()
})


</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex  items-center justify-between gap-2 my-5">
      <h1 class="text-2xl font-bold">{{ examinationCenter?.name }} - {{ $t('halls') }} </h1>
      <div class="flex items-center gap-2">
        <BaseButton color="primary" @click="isGenerateOTPDialogOpen = true">
          <Icon name="ph:qr-code-duotone" class="size-4" />
          {{ $t('generate-otp') }}
        </BaseButton>
      </div>
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
    
    <HallView />
    <GenerateOTP />
    <ManagerSignature :exam-center-id="id" />
  </div>
</template>