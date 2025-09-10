<script lang="ts" setup>
import { tableHeaders } from '~/views/exams/index'
import { useExaminationCenters } from '~/views/examination-centers/store'
import { useI18n } from 'vue-i18n'
import { examTypesOptions,examStatusOptions } from '~/views/exams/types/index'
import { ExamStatus } from '~/views/exams/types/index'
import axios from '~/services/app-client/axios'

const examinationCenterStore = useExaminationCenters()
const isLoading = computed(() => examinationCenterStore.isLoading)
const exams = ref<Exam[]>([])

const {id} = useRoute().params
async function getExams() {
  const response = await examinationCenterStore.getExams(id as string)
  exams.value = response
}
const {t} = useI18n()
const headers = computed(() => {
    const excludeHeaders = ['templateName', 'orgnaizations','actions']
  const headers2= tableHeaders(t).filter((header) => !excludeHeaders.includes(header.key)).map((header) => {
    if (header.key === 'templateName') return
    return {
        ...header,
        key: 'exam.' + header.key,
    }
  })

  headers2.push({
    key: 'status',
    label: t('status'),
  })
  headers2.push({
    key: 'actions',
    label: t('actions'),
  })
  return headers2
})
getExams()

const statusLabel = (status: ExamStatus) => {
    if (status === ExamStatus.Pending) return {
        label: t('incoming'),
        color: 'warning',
    }
    if (status === ExamStatus.Expired) return {
        label: t('expired'),
        color: 'error',
    }
    if (status === ExamStatus.Completed) return {
        label: t('completed'),
        color: 'success',
    }
}
const toggleExamStatus = async (examId: string,isRejected: boolean) => {
    isLoading.value = true
    await axios.put(`/examtoexamcenter/${examId}/status`,
    {
        isRejected: isRejected,
    },
    {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json-patch+json',
        },
    })
    await getExams()
    isLoading.value = false
}
</script>
<template>
    <div v-if="isLoading">
        <AppLoading />
    </div>
    <div v-else>

    <AppTable title="Exams" :items="exams.data" :headers="headers" >
        <template #data-actions="{ item }">
          <BaseButton :loading="isLoading" @click="toggleExamStatus(item.id,!item.isRejected)"
          variant="pastel"
          :color="!item.isRejected ? 'danger' : 'success'"
          class="w-full text-lg font-bold"
          >
            <Icon :name="!item.isRejected ? 'ph:x-circle-duotone' : 'ph:check-circle-duotone'" class="size-6 me-2" />
            {{ item.isRejected ? "المركز جاهز للامتحان" : "المركز غير جاهز للامتحان" }}
          </BaseButton>
        </template>
      
        <template #['data-exam.examType']="{ item }">
          {{ examTypesOptions($t).find((type) => type.value === item.exam.examType)?.label }}
        </template>
        <template #['data-exam.time']="{ item }">
          {{ item.exam.startTime }} - {{ item.exam.endTime }}
        </template>
        <template #['data-exam.startDate']="{ item }">
          {{ item.exam.startDate.split("T")[0] }}
        </template>
        <template #['data-exam.endDate']="{ item }">
          {{ item.exam.endDate.split("T")[0] }}
        </template>
        <template #['data-status']="{ item }">
            <BaseTag :color="statusLabel(item.exam.status).color">
                {{ statusLabel(item.exam.status).label }}
            </BaseTag>  
        </template>
      </AppTable>
    </div>

</template>

<style>
.nui-button.nui-button-pastel.nui-button-success {
    border: 1px solid rgb(68 213 128)
}
</style>