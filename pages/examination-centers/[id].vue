<script setup lang="ts">
const {id} = useRoute().params
definePageMeta({
  title: 'examination-centers',
  description: 'create-and-manage-examination-centers',
})
import HallView from '~/views/examination-centers/halls/components/HallView.vue'
import { useExaminationCenters } from '~/views/examination-centers/store'
import type { ExaminationCenter } from '~/views/examination-centers/types'
import Exams from '~/views/examination-centers/componets/Exams.vue'
import Statistics from '~/views/examination-centers/componets/Statistics.vue'

const examinationCenterStore = useExaminationCenters()
const appTableStore = useAppTableStore()
const isLoading = computed(() => examinationCenterStore.isLoading)
const examinationCenter = ref<ExaminationCenterDto | null>(null)
const getExaminationCenter = async () => {
  const response = await examinationCenterStore.getExaminationCenter(id as string)
  examinationCenter.value = response
}
getExaminationCenter()
const selectedTab = ref('exams')
const tabs = (t: any) => [
  {
    label: t('halls'),
    value: 'halls',
  },
  {
    label: t('exams'),
    value: 'exams',
  },
  {
    label: t('statistics'),
    value: 'statistics',
  }
]

const statistics = ref({
    halls: 12,
    exams: 5,
    students: 100,
    amount: 20000000,
})
</script>

<template>  
  <div class="flex flex-col gap-2">
    <div class="flex flex-col gap-2">
        <h1 class="text-2xl font-bold">{{ $t('exam-center') }} {{ examinationCenter?.name }}</h1>
        <BaseTabs  :tabs="tabs($t)" v-model="selectedTab"></BaseTabs>
    </div>
     <div class="grid grid-cols-2 md:grid-cols-4 gap-3" v-if="selectedTab !== 'statistics'">
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
    <HallView v-if="selectedTab === 'halls'" />
    <Exams v-if="selectedTab === 'exams'" />
    <Statistics v-if="selectedTab === 'statistics'" />
  </div>
</template>
<style>
.nui-tabs.nui-tabs-primary .nui-tab-item {
  font-size: 18px !important;
}
</style>