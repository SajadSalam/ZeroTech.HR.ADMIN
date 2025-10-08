<script lang="ts" setup>
import { FinancialDashboardService } from '~/views/financial-dashboard/service'
import type { FinancialDashboardResponse } from '~/views/financial-dashboard/types'
import AppChartIncomeByExamTypeChart from '~/views/financial-dashboard/components/AppChartIncomeByExamTypeChart.vue'
import BookingTimeMaterialChart from '~/views/financial-dashboard/components/BookingTimeMaterialChart.vue'
import IncomeByGovernorateChart from '~/views/financial-dashboard/components/IncomeByGovernorateChart.vue'
definePageMeta({
    title: 'financial-dashboard',
    description: 'financial-dashboard-description',
})
const isLoading = ref(true)
const error = ref(null)
const financialDashboardService = new FinancialDashboardService()
const financialDashboard = ref<FinancialDashboardResponse | null>(null)
const asyncData = async () => {
    try {
        error.value = null
        const response = await financialDashboardService.getFinancialDashboard(2025, 9)
        financialDashboard.value = response
    } catch (error) {
        error.value = error
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
                    الاحصائيات
                </span>
                <h1 class="text-2xl font-bold">
                    الاحصائيات المالية
                </h1>
            </div>
        </div>
         <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <InfoLabelGradient label="الايرادات الكلية" :value="financialDashboard?.totalIncome ?? 0" icon="solar:wallet-money-bold-duotone" color="primary"
                variant="gradient" />

            <InfoLabelGradient label="الاختبار الوطني العراقي لكفاءة الحاسوب" :value="financialDashboard?.totalComputerExamIncome ?? 0" icon="solar:laptop-bold-duotone" color="primary"
                variant="default" />

            <InfoLabelGradient label="الاختبار الوطني العراقي للغة العربية" :value="financialDashboard?.totalArabicExamIncome ?? 0" icon="ph:student-duotone" color="primary"
                variant="default" />

            <InfoLabelGradient label="الاختبار الوطني العراقي للغة الانجليزية" :value="financialDashboard?.totalEnglishExamIncome ?? 0" icon="solar:notebook-minimalistic-bold-duotone" color="primary"
                variant="default" />
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-6 mb-6">
            <div class="col-span-1">
                <AppChartIncomeByExamTypeChart :data="financialDashboard?.incomeByExamType" />
            </div>
            <div class="col-span-2">
                <BookingTimeMaterialChart :data="financialDashboard?.monthlyIncome" />
            </div>
            <div class="col-span-1">
                <IncomeByGovernorateChart :totalIncome="financialDashboard?.totalIncome ?? 0" :data="financialDashboard?.bookingPercentageByGovernorate" />
            </div>
            <div class="col-span-2">
                <!--  -->
            </div>
        </div>
    </div>
</template>