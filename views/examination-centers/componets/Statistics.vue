<script setup lang="ts">

definePageMeta({
  title: 'home-page',
  description: 'this-is-the-home-page',
})
</script>

<template>
    <div class="min-h-screen">
        <div class="flex items-center justify-between pa-5">
            <div>
                <span class="text-sm">
                    الإحصائيات
                </span>
                <h1 class="text-2xl font-bold">
                    احصائيات مدير المركز
                </h1>
            </div>

        </div>
        <!-- Second Row of InfoLabel Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <InfoLabelGradient label="عدد مراكز الامتحان الكلي" :value="279" icon="ph:buildings-fill" color="primary"
                variant="gradient" />

            <InfoLabelGradient label="عدد القاعات الكلية" :value="4124" icon="ph:door-fill" color="primary"
                variant="default" />

            <InfoLabelGradient label="اجمالي المسجلين المسجلين" :value="279" icon="ph:student-fill" color="primary"
                variant="default" />

            <InfoLabelGradient label="عدد المقاعد الكلية" :value="152351" icon="ph:chair-fill" color="primary"
                variant="default" />
        </div>


        <div class="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-6 mb-6">
            <!-- Hall Distribution Chart -->
            <div class="col-span-1">
                <AppChartHallDistributionChart />
            </div>
            <div class="col-span-2">
                <AppChartBookingTimeMaterialChart />
            </div>
        </div>

        <!-- Attendance Charts Section -->
        <div class="w-full">
            <AppChartAttendanceChartsLayout />
        </div>
    </div>
</template>