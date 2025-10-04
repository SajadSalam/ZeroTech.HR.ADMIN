<script setup lang="ts">

definePageMeta({
    title: 'exam-sessions',
    description: 'manage-exam-sessions',
    icon: 'heroicons:users',
})
import { useI18n } from 'vue-i18n'
import axiosIns from '~/services/app-client/axios'
import { strapiClient } from '~/services/strapi'
const { t } = useI18n()

// Reactive data
const totalPages = ref(1)
const currentPage = ref(1)
const sessions = ref<any[]>([])
const loading = ref(false)
const searchQuery = ref('')
const statusFilter = ref('all')

// Computed properties

const totalSessions = ref(0)
// Methods
interface Stats {
    total: number
    pending: number
    started: number
    inProgress: number
    completed: number
    expired: number
    abandoned: number
    passed: number
    failed: number
    averageScore: number
    averagePercentage: number
}
const stats = ref<Stats>({
    total: 0,
    pending: 0,
    started: 0,
    inProgress: 0,
    completed: 0,
    expired: 0,
    abandoned: 0,
    passed: 0,
    failed: 0,
    averageScore: 0,
    averagePercentage: 0
})
const fetchStats = async () => {
    const res = await axiosIns.get<{ data: { summary: Stats } }>('/exam-sessions/stats/all', {
    })
    stats.value = res.data.data.summary
}

const passStatusFilter = ref('all')

const fetchSessions = async () => {
    loading.value = true
    try {

        const filters: any = {
            applicant: {
                fullName: {
                    $containsi: searchQuery.value
                }
            },
            sessionStatus: statusFilter.value,
            isPassed: passStatusFilter.value === 'passed' ? true : passStatusFilter.value === 'failed' ? false : undefined
        }
        // delete empty filters if object deep 
        const deleteEmptyFilters = (obj: any) => {
            Object.keys(obj).forEach(key => {
                if (typeof obj[key] === 'object') {
                    deleteEmptyFilters(obj[key])
                } else {
                    if (obj[key] === '' || obj[key] === null || obj[key] === undefined || obj[key] === '' || obj[key] === 'all') {
                        delete obj[key]
                    }
                }
            })
        }
        deleteEmptyFilters(filters)
        console.log(filters)
        const res = await strapiClient.collection('exam-sessions').find({
            populate: {
                applicant: {
                    fields: ['id', 'fullName'],
                    populate: ['department', 'college', 'university', 'studyProgram']
                },
                award: {
                    fields: ['id', 'awardName', 'academicYear']
                }
            },
            pagination: {
                page: currentPage.value,
                pageSize: 20
            },
            filters,
            sort: ['createdAt:desc']
        })

        totalPages.value = res.meta.pagination?.pageCount || 1
        currentPage.value = res.meta.pagination?.page || 1
        totalSessions.value = res.meta.pagination?.total || 0
        sessions.value = res.data as any[]

        // Process session data
        sessions.value.forEach(session => {
            session.applicantName = `${session.applicant?.fullName || ''}`.trim()
            session.awardName = `${session.award?.awardName || ''} ${session.award?.academicYear || ''}`.trim()
            session.formattedStartTime = formatDateTime(session.startTime || '')
            session.formattedEndTime = formatDateTime(session.endTime || '')
            session.formattedCreatedAt = formatDateTime(session.createdAt || '')
            session.statusBadge = getStatusBadge(session)
            session.scorePercentage = session.score ? `${session.score}%` : '-'
            session.questionsProgress = `${session.questionsAnswered || 0}/${session.totalQuestions || 0}`
        })
    } catch (error) {
        console.error('Error fetching sessions:', error)
    } finally {
        loading.value = false
    }
}

const formatDateTime = (dateString: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleString()
}

const getStatusBadge = (session: any) => {
   if (session.sessionStatus === 'started') {
        return { text: t('started'), color: 'red' }
    } else if (session.sessionStatus === 'in_progress') {
        return { text: t('in-progress'), color: 'blue' }
    } else if (session.sessionStatus === 'completed') {
        return { text: t('completed'), color: 'gray' }
    } else {
        return { text: t('not-started'), color: 'yellow' }
    }
}


// Table headers with translations
const tableHeaders = [
    { label: t('id'), key: "id", sortable: true },
    { label: t('applicant-name'), key: "applicantName", sortable: true },
    { label: t('award'), key: "awardName", sortable: true },
    { label: t('status'), key: "status", sortable: true },
    { label: t('score'), key: "score", sortable: true },
    { label: t('questions'), key: "questionsProgress", sortable: false },
    { label: t('current-question'), key: "currentQuestionIndex", sortable: true },
    { label: t('start-time'), key: "formattedStartTime", sortable: true },
    { label: t('end-time'), key: "formattedEndTime", sortable: true },
    { label: t('time-taken'), key: "timeTaken", sortable: true },
    { label: t('ip-address'), key: "ipAddress", sortable: true },
    { label: t('created-at'), key: "formattedCreatedAt", sortable: true }
]

// Lifecycle
onMounted(() => {
    fetchSessions()
    fetchStats()
})

// Watch for page changes
watch(currentPage, () => {
    fetchSessions()
})

const examStatusOptions = [
    { value: 'all', label: t('all-statuses') },
    { value: 'in-progress', label: t('in-progress') },
    { value: 'completed', label: t('completed') },
    { value: 'not-started', label: t('not-started') }
]


watch(searchQuery, () => {
    fetchSessions()
})

watch(statusFilter, () => {
    fetchSessions()
})

watch(passStatusFilter, () => {
    fetchSessions()
})

const exportResultsToExcel = async () => {
    const res = await axiosIns.get('/exam-sessions/export/excel', {
        responseType: 'blob'
    })
    const url = window.URL.createObjectURL(new Blob([res.data]))
    const a = document.createElement('a')
    a.href = url
    const date = new Date().toISOString()
    a.download = `exam-sessions-${date}.xlsx`
    a.click()
    window.URL.revokeObjectURL(url)
}

const timeTaken = (startTime: string, endTime: string) => {
    let timeTaken = '0m 0s 0ms';
          if (startTime && endTime) {
            const diffMs = new Date(endTime).getTime() - new Date(startTime).getTime();
            const minutes = Math.floor(diffMs / 60000);
            const seconds = Math.floor((diffMs % 60000) / 1000);
            const milliseconds = diffMs % 1000;
            timeTaken = `${minutes}m ${seconds}s ${milliseconds}ms`;
          }
          return timeTaken
}
</script>

<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                    {{ t('exam-sessions') }}
                </h1>
                <p class="text-gray-600 dark:text-gray-400">
                    {{ t('manage-exam-sessions') }}
                </p>
            </div>
            <div class="flex items-center space-x-3">
                <button @click="fetchSessions" :disabled="loading" class="btn btn-primary">
                    <Icon name="heroicons:arrow-path" class="w-4 h-4 mr-2" :class="{ 'animate-spin': loading }" />
                    {{ t('refresh') }}
                </button>
            </div>
        </div>

        <!-- Filters -->
        <div class="card">
            <div class="card-body">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <AppFieldAppInputField v-model="searchQuery" type="text" :placeholder="t('search-sessions')"
                            :label="t('search')" />
                    </div>
                    <div>

                        <AppFieldAppAutoCompleteField v-model="statusFilter" :items="examStatusOptions"
                            item-value="value" item-label="label" :placeholder="t('exam-status')"
                            :label="t('exam-status')" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Statistics Cards -->

        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard color="primary" :label="t('total-sessions')" :value="stats.total" icon-name="heroicons:users" />
         
            <StatCard color="blue" :label="t('in-progress-sessions')" :value="stats.inProgress"
                icon-name="heroicons:clock" />
        </div>

        <!-- Sessions Table -->
        <AppCrud :title="t('exam-sessions')" hide-create v-model:current-page="currentPage" :total-pages="totalPages"
            :loading="loading">
            <template #filters>
                <div class="flex items-center space-x-2">
                    <span class="text-sm text-gray-600">
                        {{ t('showing') }} {{ sessions.length }} {{ t('of') }} {{ totalSessions }} {{
                            t('sessions') }}
                    </span>
                </div>
            </template>
            <template #headerActions>
                <BaseButton color="primary" @click="exportResultsToExcel">
                    <Icon name="ph:file-duotone" class=" me-2" />
                    {{ t('export-results-to-excel') }}
                </BaseButton>
            </template>
            <AppTable :headers="tableHeaders" :items="sessions" :loading="loading">
                <template #data-status="{ item }">
                    <span v-if="item.statusBadge"
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="{
                            'bg-green-100 text-green-800': item.statusBadge.color === 'green',
                            'bg-red-100 text-red-800': item.statusBadge.color === 'red',
                            'bg-blue-100 text-blue-800': item.statusBadge.color === 'blue',
                            'bg-gray-100 text-gray-800': item.statusBadge.color === 'gray',
                            'bg-yellow-100 text-yellow-800': item.statusBadge.color === 'yellow'
                        }">
                        {{ item.statusBadge.text }}
                    </span>
                    <span v-else class="text-gray-400">-</span>
                </template>

                <template #data-score="{ item }">
                    <span class="font-medium" :class="{
                        'text-green-600': item.isPassed === true,
                        'text-red-600': item.isPassed === false,
                        'text-gray-600': item.isPassed === null
                    }">
                        {{ item.score }}
                    </span>
                </template>

                <template #data-questionsProgress="{ item }">
                    <div class="flex items-center space-x-2">
                        <span class="text-sm">{{ item.questionsProgress }}</span>
                        <div class="flex-1 bg-gray-200 rounded-full h-2">
                            <div class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                :style="{ width: `${(item.questionsAnswered || 0) / (item.totalQuestions || 1) * 100}%` }">
                            </div>
                        </div>
                    </div>
                </template>

                <template #data-timeTaken="{ item }">
                        {{ timeTaken(item.startTime, item.endTime) }}
                </template>

                <template #data-attempts="{ item }">
                    <span class="font-medium">
                        {{ item.attempts || 0 }}/{{ item.maxAttempts || 0 }}
                    </span>
                </template>
            </AppTable>
        </AppCrud>
    </div>
</template>

<style scoped>
.card {
    @apply bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700;
}

.card-body {
    @apply p-6;
}

.form-label {
    @apply block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2;
}

.form-input {
    @apply w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white;
}

.form-select {
    @apply w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white;
}

.btn {
    @apply inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200;
}

.btn-primary {
    @apply text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500;
}

.btn-secondary {
    @apply text-gray-700 bg-white border-gray-300 hover:bg-gray-50 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600;
}

.btn-sm {
    @apply px-2 py-1 text-xs;
}
</style>