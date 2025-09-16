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
                    احصائيات مدير النظام
                </h1>
            </div>

        </div>
        <!-- Second Row of InfoLabel Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <InfoLabelGradient label="عدد مراكز الامتحان الكلي" :value="279" icon="ph:buildings-fill" color="primary"
                variant="gradient" />

            <InfoLabelGradient label="عدد القاعات الكلية" :value="4124" icon="ph:door-fill" color="primary"
                variant="default" />

            <InfoLabelGradient label="اجمالي المسجلين" :value="279" icon="ph:student-fill" color="primary"
                variant="default" />

            <InfoLabelGradient label="عدد المقاعد الكلية" :value="152351" icon="ph:chair-fill" color="primary"
                variant="default" />
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-6">
            <!-- <InfoLabel label="مبلغ رسوم الامتحانات المدفوعة" value="204,000,000 د.ع" icon="ph:money-fill"
                color="primary" :no-counting="true" /> -->

            <InfoLabel label="عدد الامتحانات القادمة" :value="279" icon="ph:calendar-plus-fill" color="primary" />

            <InfoLabel label="نسبة انشغال المقاعد" :value="279" icon="ph:chair-fill" color="primary" />

            <InfoLabel label="الامتحانات الجارية حاليا" :value="50" icon="ph:play-circle-fill" color="primary" />
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