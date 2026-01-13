<script setup lang="ts">
import DotLoading from '~/components/DotLoading.vue'
import { useEmployeeVacationStore } from '../store'

const vacationStore = useEmployeeVacationStore()

const isLoading = computed(() => vacationStore.isLoading)
const employee = computed(() => vacationStore.employeeVacation)

const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('en-US')
}

const closeDialog = () => {
    vacationStore.isDialogOpen = false
    vacationStore.resetStore()
}
</script>

<template>
    <AppDialog v-model="vacationStore.isDialogOpen" title="رصيد الإجازات" size="xl" overflow-y="visible"
        @close="closeDialog">
        <div v-if="isLoading" class="flex justify-center items-center py-10">
            <DotLoading />
        </div>

        <div v-else-if="employee" class="space-y-6">
            <!-- معلومات الموظف الأساسية -->
            <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="text-lg font-semibold text-gray-900 mb-3">
                    معلومات الموظف
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <span class="text-sm text-gray-600">الاسم الكامل:</span>
                        <p class="font-medium text-gray-900">
                            {{ employee?.fullName }}
                        </p>
                    </div>
                    <div>
                        <span class="text-sm text-gray-600">رقم الموظف:</span>
                        <p class="font-medium text-gray-900">
                            {{ employee?.employeeNumber }}
                        </p>
                    </div>
                    <div>
                        <span class="text-sm text-gray-600">البريد الإلكتروني:</span>
                        <p class="font-medium text-gray-900">
                            {{ employee?.email }}
                        </p>
                    </div>
                    <div>
                        <span class="text-sm text-gray-600">الهاتف:</span>
                        <p class="font-medium text-gray-900">
                            {{ employee?.phone }}
                        </p>
                    </div>
                    <div>
                        <span class="text-sm text-gray-600">المسمى الوظيفي:</span>
                        <p class="font-medium text-gray-900">
                            {{ employee?.jobTitle }}
                        </p>
                    </div>
                    <div>
                        <span class="text-sm text-gray-600">القسم:</span>
                        <p class="font-medium text-gray-900">
                            {{ employee?.department?.name || '-' }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- معلومات الخدمة -->
            <div class="bg-blue-50 rounded-lg p-4">
                <h3 class="text-lg font-semibold text-gray-900 mb-3">
                    معلومات الخدمة
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <span class="text-sm text-gray-600">تاريخ التعيين:</span>
                        <p class="font-medium text-gray-900">
                            {{ formatDate(employee?.hireDate) }}
                        </p>
                    </div>
                    <div>
                        <span class="text-sm text-gray-600">نوع العقد:</span>
                        <p class="font-medium text-gray-900">
                            {{ employee?.contractTypeDisplay }}
                        </p>
                    </div>
                    <div>
                        <span class="text-sm text-gray-600">سنوات الخدمة:</span>
                        <p class="font-medium text-gray-900">
                            {{ employee?.yearsOfService }} سنة
                        </p>
                    </div>
                    <div>
                        <span class="text-sm text-gray-600">أشهر الخدمة:</span>
                        <p class="font-medium text-gray-900">
                            {{ employee?.monthsOfService }} شهر
                        </p>
                    </div>
                    <div>
                        <span class="text-sm text-gray-600">أيام الخدمة:</span>
                        <p class="font-medium text-gray-900">
                            {{ employee?.daysOfService }} يوم
                        </p>
                    </div>
                    <div>
                        <span class="text-sm text-gray-600">الفرع:</span>
                        <p class="font-medium text-gray-900">
                            {{ employee?.branch?.name || '-' }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- رصيد الإجازات -->
            <div class="bg-green-50 rounded-lg p-4">
                <h3 class="text-lg font-semibold text-gray-900 mb-3">
                    رصيد الإجازات
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="col-span-full">
                        <span class="text-sm text-gray-600">الرصيد الحالي:</span>
                        <p class="text-3xl font-bold text-green-600">
                            {{ employee?.vacationBalance?.toFixed(2) }} يوم
                        </p>
                    </div>
                    <div>
                        <span class="text-sm text-gray-600">الرصيد المستخدم:</span>
                        <p class="font-medium text-gray-900">
                            {{
                                employee?.usedVacationBalance?.toFixed(2)
                            }}
                            يوم
                        </p>
                    </div>
                    <div>
                        <span class="text-sm text-gray-600">الرصيد المتاح:</span>
                        <p class="font-medium text-gray-900">
                            {{ employee?.availableVacationBalance?.toFixed(2) }}
                            يوم
                        </p>
                    </div>
                    <div class="col-span-full">
                        <span class="text-sm text-gray-600">الرصيد المعلق:</span>
                        <p class="font-medium text-gray-900">
                            {{ employee?.pendingVacationBalance?.toFixed(2) }}
                            يوم
                        </p>
                    </div>
                </div>
            </div>

            <!-- جدول العمل -->
            <div v-if="employee?.workSchedule" class="bg-purple-50 rounded-lg p-4">
                <h3 class="text-lg font-semibold text-gray-900 mb-3">
                    جدول العمل
                </h3>
                <div class="space-y-2">
                    <div>
                        <span class="text-sm text-gray-600">اسم الجدول:</span>
                        <p class="font-medium text-gray-900">
                            {{ employee?.workSchedule?.name }}
                        </p>
                    </div>
                    <div v-if="employee?.workSchedule?.description">
                        <span class="text-sm text-gray-600">الوصف:</span>
                        <p class="font-medium text-gray-900">
                            {{ employee?.workSchedule?.description }}
                        </p>
                    </div>
                    <div>
                        <span class="text-sm text-gray-600">الحالة:</span>
                        <span :class="[
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-2',
                            employee?.workSchedule?.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800',
                        ]">
                            {{
                                employee?.workSchedule?.isActive
                                    ? 'نشط'
                                    : 'غير نشط'
                            }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- معلومات إضافية -->
            <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="text-lg font-semibold text-gray-900 mb-3">
                    معلومات إضافية
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <span class="text-sm text-gray-600">الجنس:</span>
                        <p class="font-medium text-gray-900">
                            {{ employee?.genderDisplay }}
                        </p>
                    </div>
                    <div>
                        <span class="text-sm text-gray-600">العمر:</span>
                        <p class="font-medium text-gray-900">
                            {{ employee?.age }} سنة
                        </p>
                    </div>
                    <div>
                        <span class="text-sm text-gray-600">تاريخ الميلاد:</span>
                        <p class="font-medium text-gray-900">
                            {{ formatDate(employee?.birthDate) }}
                        </p>
                    </div>
                    <div>
                        <span class="text-sm text-gray-600">رقم الهوية:</span>
                        <p class="font-medium text-gray-900">
                            {{ employee?.identityNumber }}
                        </p>
                    </div>
                    <div v-if="employee?.attachmentCount > 0">
                        <span class="text-sm text-gray-600">عدد المرفقات:</span>
                        <p class="font-medium text-gray-900">
                            {{ employee?.attachmentCount }} ملف
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <template #actions>
            <BaseButton color="default" @click="closeDialog">
                <Icon name="ph:x-circle-duotone" class="size-5" />
                إغلاق
            </BaseButton>
        </template>
    </AppDialog>
</template>
