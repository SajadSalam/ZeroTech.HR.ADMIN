<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import axios from '~/services/app-client/axios'
import { useExaminationCenters } from '~/views/examination-centers/store'
import { tableHeaders } from '~/views/exams/index'
import { ExamStatus, examTypesOptions, type Exam } from '~/views/exams/types/index'

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

onMounted(() => {
    getExams()
})
</script>
<template>
    <div v-if="isLoading">
        <AppLoading />
    </div>
    <div v-else>

    <AppTable title="Exams" :items="exams.data" :headers="headers" >
        <template #data-actions="{ item }">
          <div class="flex items-center gap-3">
            <BaseButton :loading="isLoading" @click="toggleExamStatus(item.id,!item.isRejected)"
          variant="pastel"
          :color="item.isRejected ? 'danger' : 'success'"
          class=" font-bold"
          >
            <Icon :name="item.isRejected ? 'ph:x-circle-duotone' : 'ph:check-circle-duotone'" class="size-6 me-2" />
            {{ !item.isRejected ? "المركز جاهز للامتحان" : "المركز غير جاهز للامتحان" }}
          </BaseButton>
           <BaseButton :loading="isLoading" :to="`/examination-centers/${id}/students/${item.examId}`"
          variant="pastel"
          color="primary"
          class="font-bold"
          >
            <Icon name="ph:users-duotone" class="size-6 me-2" />
            المسجلين المتقدمين
          </BaseButton>
          </div>
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
.nui-button.nui-button-pastel.nui-button-primary {
    border: 1px solid #A9321E
}
</style>