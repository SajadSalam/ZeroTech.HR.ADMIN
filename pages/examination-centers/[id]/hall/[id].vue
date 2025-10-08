<script setup lang="ts">
definePageMeta({
    title: 'مراقبة الامتحان الحالي في القاعة',
})
import { useI18n } from 'vue-i18n'
import ExamTimer from '~/components/ExamTimer.vue'
import type { BaseFilters } from '~/utils/types/ApiResponses'
import GenerateOTP from '~/views/examination-centers/componets/GenerateOTP.vue'
import SupervisorOTP from '~/views/examination-centers/componets/SupervisorOTP.vue'
import BlacklistStudent from '~/views/examination-centers/componets/BlacklistStudent.vue'
import { useExaminationCenters } from '~/views/examination-centers/store'
import { examPresentStatus, examStudentStatus, progressHeaders, type ProgressStatistics, type ProgressStudent } from '~/views/examination-centers/types/progress'
import type { StudentTicket, StudentTicketFilters } from '~/views/examination-centers/types/ticket'

const { id } = useRoute().params

const examinationCenterStore = useExaminationCenters()

const isLoading = computed(() => examinationCenterStore.isLoading)

const isGenerateOTPDialogOpen = computed({
    get() {
        return examinationCenterStore.isGenerateOTPDialogOpen
    },
    set(value: boolean) {
        examinationCenterStore.isGenerateOTPDialogOpen = value
    }
})

const isSupervisorOTPDialogOpen = computed({
    get() {
        return examinationCenterStore.isSupervisorOTPDialogOpen
    },
    set(value: boolean) {
        examinationCenterStore.isSupervisorOTPDialogOpen = value
    }
})

const examEndTime = ref(new Date())


// Handle timer events
const handleTimerExpired = () => {
    console.log('Exam time has expired!')
}

const handleTimerTick = (timeRemaining: { hours: number; minutes: number; seconds: number }) => {
    console.log('Time remaining:', timeRemaining)
}

const statistics = ref<ProgressStatistics>({
    totalStudentInExam: 0,
    totalCheckedInStudent: 0,
    totalAbsentStudent: 0,
    totalBlockedStudent: 0,
    currentExamName: '',
    hallName: '',
    capacity: 0,
    examStartDate: '',
    examTime: '',
    remainingStartExamTime: '',
    remainingTimeToStartExam: 0,
    remainingTimeToEndExam: 0,
})
const { t } = useI18n()

const filters = ref<BaseFilters>({
    pageNumber: 1,
    pageSize: 10,
})
const total = ref(0)


async function getProgressStudents() {
    const response = await examinationCenterStore.getProgressStudents(id as string, filters.value)
    students.value = response.data
    total.value = response.pagesCount
}

watchDeep(filters, () => {
    getProgressStudents()
})
const isStartExam = ref(false)
let progressInterval: NodeJS.Timeout | null = null

onMounted(async () => {
    statistics.value = await examinationCenterStore.getHallStatistics(id as string)
    const now = new Date()
    if(Number(statistics.value.remainingTimeToStartExam) > 0){
        examEndTime.value = new Date(now.getTime() + statistics.value.remainingTimeToStartExam * 60 * 1000)
        isStartExam.value = true
    } else {
        isStartExam.value = false
        examEndTime.value = new Date(now.getTime() + statistics.value.remainingTimeToEndExam * 60 * 1000)

    }
    getProgressStudents()

    // Set up interval to refresh progress students every 30 seconds
    progressInterval = setInterval(() => {
        getProgressStudents()
    }, 5000)
})

onUnmounted(() => {
    if (progressInterval) {
        clearInterval(progressInterval)
        progressInterval = null
    }
})

const students = ref<ProgressStudent[]>([])

// Handle ending exam (blacklisting student)
const endExam = (student: ProgressStudent) => {
    examinationCenterStore.selectedStudentForBlacklist = student
    examinationCenterStore.isBlacklistStudentDialogOpen = true
}
</script>

<template>
    <div class="grid md:grid-cols-4 gap-4 my-5 grid-cols-1">
        <div class="col-span-3 bg-white p-5 rounded-2xl  border-0">
            <div class="flex items-center justify-between">
                <div>
                    <p>
                        {{ $t('exam-name') }}
                    </p>
                    <h1 class="text-2xl font-bold">
                        {{ statistics.currentExamName }}
                    </h1>
                </div>
                <div class="flex items-center gap-2">
                    <BaseButton color="primary" variant="pastel" @click="isSupervisorOTPDialogOpen = true">
                        <Icon name="ph:key-duotone" class="size-4" />
                        {{ $t('generate-supervisor-otp') }}
                    </BaseButton>
                    <BaseButton color="primary" @click="isGenerateOTPDialogOpen = true">
                        <Icon name="ph:qr-code-duotone" class="size-4" />
                        {{ $t('generate-otp') }}
                    </BaseButton>
                </div>
            </div>
            <hr class="my-4" />
            <div class="flex items-center justify-between ">
                <div class="flex items-center gap-2">
                    <div class="p-4 bg-gray-200 flex items-center justify-center text-center rounded-full">
                        <Icon name="ph:building-duotone" class="size-5 text-gray-500" />
                    </div>
                    <div>
                        <p>
                            {{ $t('hall') }}
                        </p>
                        <h1 class="text-xl font-bold">
                            {{ statistics.hallName }}
                        </h1>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <div class="p-4 bg-gray-200 flex items-center justify-center text-center rounded-full">
                        <Icon name="ph:users-duotone" class="size-5 text-gray-500" />
                    </div>
                    <div>
                        <p>
                            {{ $t('capacity') }}
                        </p>
                        <h1 class="text-xl font-bold">
                            {{ statistics.capacity }}
                        </h1>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <div class="p-4 bg-gray-200 flex items-center justify-center text-center rounded-full">
                        <Icon name="ph:calendar-duotone" class="size-5 text-gray-500" />
                    </div>
                    <div>
                        <p>
                            {{ $t('date') }}
                        </p>
                        <h1 class="text-xl font-bold">
                            {{ statistics.examStartDate }}
                        </h1>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <div class="p-4 bg-gray-200 flex items-center justify-center text-center rounded-full">
                        <Icon name="ph:clock-duotone" class="size-5 text-gray-500" />
                    </div>
                    <div>
                        <p>
                            {{ $t('time') }}
                        </p>
                        <h1 class="text-xl font-bold">
                            {{ statistics.examTime }}
                        </h1>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-span-1 bg-info bg-opacity-10 p-4 rounded-2xl border-0 flex items-center justify-center">
            <!-- Exam Timer Component -->
            <ExamTimer :end-time="examEndTime" :is-start-exam="isStartExam" @expired="handleTimerExpired"
                @tick="handleTimerTick" />
        </div>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 my-5">
        <InfoLabel :label="$t('all-students')" color="primary" icon="ph:users-duotone"
            :value="statistics.totalStudentInExam">
        </InfoLabel>

        <InfoLabel :label="$t('present-students')" color="warning" icon="ph:user-plus-duotone"
            :value="statistics.totalCheckedInStudent">
        </InfoLabel>

        <InfoLabel :label="$t('absent-students')" color="primary" icon="ph:user-minus-duotone"
            :value="statistics.totalAbsentStudent">
        </InfoLabel>

        <InfoLabel :label="$t('blacklisted-students')" color="warning" icon="ph:user-switch-duotone"
            :value="statistics.totalBlockedStudent">
        </InfoLabel>
    </div>

    <AppCrud hide-create pagination :total-pages="total" v-model:page-number="filters.pageNumber">


        <AppTable :loading="isLoading" title="Students" :items="students" :headers="progressHeaders($t)" :total="total"
            :pageNumber="filters.pageNumber" :pageSize="filters.pageSize" @page-change="getProgressStudents">
          
            <template #data-examStatus="{ item }">
                <BaseTag :color="examStudentStatus(t)?.find(status => status.value === item.examStatus)?.color"
                    variant="pastel">
                    {{ examStudentStatus(t)?.find(status => status.value === item.examStatus)?.label }}
                </BaseTag>
            </template>
            <template #data-examPresentStatus="{ item }">
                <BaseTag :color="examPresentStatus(t)?.find(status => status.value === item.examPresentStatus)?.color"
                    variant="pastel">
                    {{ examPresentStatus(t)?.find(status => status.value === item.examPresentStatus)?.label }}
                </BaseTag>
            </template>
            <template #data-checkedInDate="{ item }">
                {{ item.checkedInDate? new Date(item.checkedInDate).toLocaleString() : '-' }}
            </template>
            <!-- <template #data-status="{ item }">
                <BaseTag :color="statusLabel(item.status)?.color">
                    {{ statusLabel(item.status)?.label }}
                </BaseTag>
            </template> -->
            <template #data-actions="{ item }">
                <div class="flex items-center gap-3">
                    <BaseButton color="primary"  @click="endExam(item)">
                        <Icon name="ph:x-circle-duotone" class="size-6 me-2" />
                        {{ $t('mark-as-cheating') }}
                    </BaseButton>
                </div>
            </template>
        </AppTable>
    </AppCrud>
    <GenerateOTP />
    <SupervisorOTP />
    <BlacklistStudent />

</template>
