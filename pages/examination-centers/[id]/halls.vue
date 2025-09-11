<script setup lang="ts">

import { useRoute } from 'vue-router'
import HallView from '~/views/examination-centers/halls/components/HallView.vue'
import { useExaminationCenters } from '~/views/examination-centers/store'
import GenerateOTP from '~/views/examination-centers/componets/GenerateOTP.vue'

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
  <div class="flex flex-col gap-2">
    <div class="flex  items-center justify-between gap-2 my-5">
      <h1 class="text-2xl font-bold">{{ $t('exam-center') }} {{ examinationCenter?.name }} - {{ $t('halls') }} {{ isGenerateOTPDialogOpen }}</h1>
      <BaseButton color="primary" @click="isGenerateOTPDialogOpen = true">
        <Icon name="ph:qr-code-duotone" class="size-4" />
        {{ $t('generate-otp') }}
      </BaseButton>
    </div>
    
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <InfoLabel :label="$t('number-of-halls')" color="primary" icon="ph:building-duotone"
          :value="statistics.halls">
      </InfoLabel>

      <InfoLabel :label="$t('number-of-exams')" color="warning" icon="ph:building-apartment-duotone"
          :value="statistics.exams">
      </InfoLabel>

      <InfoLabel :label="$t('number-of-students')" color="primary" icon="ph:folder-notch-open-duotone"
          :value="statistics.students">
      </InfoLabel>

      <InfoLabel :label="$t('amount')" color="warning" icon="ph:arrows-clockwise-duotone"
          :value="statistics.amount">
      </InfoLabel>
    </div>
    
    <HallView />
    <GenerateOTP />
  </div>
</template>