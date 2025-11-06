<script setup lang="ts">
import { definePageMeta } from '~/.nuxt/imports'
import { HomeService } from '~/views/home/service'
import type { Counts } from '~/views/home/types/counts'
import type { ProficiencyExamGroupChartData } from '~/views/home/types/proficiencyExamGroupChartData'

definePageMeta({
  title: 'home-page',
  description: 'this-is-the-home-page',
})

const homeService = new HomeService()
const isLoading = ref(true)
const error = ref<string | null>(null)
const counts = ref<Counts | null>(null)
const proficiencyExamGroupChartData = ref<ProficiencyExamGroupChartData | null>(null)
const asyncData = async () => {
    try {
    error.value = null
    const [countsData, chartData] = await Promise.all([
      homeService.getCounts(),
      homeService.getProficiencyExamGroupChartData(2025)
    ])
    counts.value = countsData
    proficiencyExamGroupChartData.value = chartData
  } catch (err) {
    console.error('Error loading home page data:', err)
    error.value = 'حدث خطأ في تحميل البيانات. يرجى المحاولة مرة أخرى.'
  } finally {
    isLoading.value = false
  }
}
onMounted(async () => {
    await asyncData()
})

</script>

<template>
      
    <div v-if="isLoading">
        <AppLoading />
    </div>
    <div v-else-if="error" class="min-h-screen flex items-center justify-center">
        <div class="text-center">
            <div class="text-red-500 text-xl mb-4">{{ error }}</div>
            <button @click="asyncData()" class="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark">
                إعادة المحاولة
            </button>
        </div>
    </div>
    <div v-else class="min-h-screen mb-10">
        <div class="flex items-center justify-between pa-5">
            <div>
                <span class="text-sm">
                    الإحصائيات
                </span>
                <h1 class="text-2xl font-bold">
                    احصائيات مدير النظام
                </h1>
            </div>

        </div>
        <!-- Info Label Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <InfoLabelGradient label="عدد المجموعات" :value="counts?.totalGroups ?? 0" icon="ph:users-three-fill" color="primary"
                variant="gradient" />

            <InfoLabelGradient label="عدد الكلي للطلاب الممتحنين" :value="counts?.totalExaminedStudents ?? 0" icon="ph:student-fill" color="primary"
                variant="default" />

            <InfoLabelGradient label="عدد الكلي للطلاب المتغيبين" :value="counts?.totalAbsentStudents ?? 0" icon="ph:user-minus-fill" color="primary"
                variant="default" />
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-6">
            <InfoLabel label="عدد الامتحانات القادمة" :value="counts?.totalUpcomingExams ?? 0" icon="ph:calendar-plus-fill" color="primary" />

            <InfoLabel label="الامتحانات الجارية حاليا" :value="counts?.currentActiveExams ?? 0" icon="ph:play-circle-fill" color="primary" />
        </div>



        <div class="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-6 mb-6">
            <!-- Hall Distribution Chart -->
            <!-- <div class="col-span-1">
                <AppChartExamCenterActivationChart 
                    v-if="counts?.examCentersAcceptanceStatus" 
                    :data="counts.examCentersAcceptanceStatus" 
                />
                <div v-else class="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
                    <span class="text-gray-500">لا توجد بيانات للعرض</span>
                </div>
            </div> -->
            <div class="col-span-3">
                <AppChartCollegeStudentCountsChart 
                    v-if="counts?.collegeStudentCounts" 
                    :data="counts.collegeStudentCounts" 
                />
                <div v-else class="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
                    <span class="text-gray-500">لا توجد بيانات للعرض</span>
                </div>
            </div>
        </div>

        <!-- Attendance Charts Section -->
        <div class="w-full">
            <AppChartAttendanceChartsLayout 
                :registered-students-statistics="counts?.registeredStudentsStatistics"
                :pass-fail-chart-data="counts?.passFailChartData"
                :group-student-counts="counts?.groupStudentCounts"
            />
        </div>
    </div>
</template>