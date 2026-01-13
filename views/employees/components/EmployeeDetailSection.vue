<script setup lang="ts">
import type { EmployeeDto } from '../types';



const props = defineProps<{
    employee: EmployeeDto
}>()

const performanceStats = computed(() => [
    {
        label: 'معدل الحضور',
        value: '95%',
        color: 'success',
        icon: 'i-ph:check-circle-duotone'
    },
    {
        label: 'الإجازات المتبقية',
        value: (props.employee?.vacationBalance ?? 0).toFixed(4) + ' / يوم',
        color: 'info',
        icon: 'i-ph:calendar-x-duotone'
    }
])


</script>

<template>
        <!-- Performance Statistics -->
        <div class="">


            <div class="grid grid-cols-2 md:grid-cols-2 gap-4">
                <div v-for="stat in performanceStats" :key="stat.label"
                    class=" flex items-center gap-2 text-center p-4 bg-gray-50 rounded-3xl">
                    <div class=" w-12 h-12 rounded-full flex items-center justify-center"
                        :class="`bg-${stat.color}-500/10`">
                        <Icon :name="stat.icon" class="size-6" :class="`text-${stat.color}-500`" />
                    </div>
                    <div class="flex flex-col items-start justify-start">
                        <div class="text-2xl font-bold text-gray-900 mb-1">{{ stat.value }}</div>
                        <div class="text-sm text-gray-500">{{ stat.label }}</div>
                    </div>
                </div>
            </div>
        </div>
</template>
