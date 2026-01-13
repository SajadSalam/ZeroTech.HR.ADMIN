<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useAppTableStore } from '~/components/app-table/stores/AppTableStore'
import AppTable from '~/components/app-table/AppTable.vue'
import { useEmployeeBalanceStore } from '~/views/employee-balances/store'
import { tableHeader } from '~/views/employee-balances'
import BalanceCreate from '~/views/employee-balances/components/BalanceCreate.vue'
import BalanceDeduct from '~/views/employee-balances/components/BalanceDeduct.vue'
import BalanceAdd from '~/views/employee-balances/components/BalanceAdd.vue'
import type { Balance } from '~/views/employee-balances/types'

definePageMeta({
    title: 'رصيد الموظف',
    description: 'عرض وإدارة رصيد الموظف',
})

const route = useRoute()
const balanceStore = useEmployeeBalanceStore()
const appTableStore = useAppTableStore()

const employeeId = computed(() => route.params.id as string)
const isLoading = computed(() => balanceStore.isLoading)
const balances = computed(() => balanceStore.balanceSummary?.balances || [])
const employeeName = computed(
    () => balanceStore.balanceSummary?.employeeName || ''
)
const employeeEmail = computed(
    () => balanceStore.balanceSummary?.employeeEmail || ''
)
const lastUpdated = computed(
    () => balanceStore.balanceSummary?.lastUpdated || ''
)

const getEmployeeBalance = async () => {
    appTableStore.setLoading(true)
    await balanceStore.getEmployeeBalance(employeeId.value)
    appTableStore.setLoading(false)
}

const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('en-US')
}

const openDeductDialog = (balance: Balance) => {
    balanceStore.selectedBalance = balance
    balanceStore.isDeductDialogOpen = true
}

const openAddDialog = (balance: Balance) => {
    balanceStore.selectedBalance = balance
    balanceStore.isAddDialogOpen = true
}

onMounted(() => {
    getEmployeeBalance()
})

onUnmounted(() => {
    balanceStore.resetStore()
})
</script>

<template>
    <div>
        <div class="mb-6">
            <div class="flex items-center justify-between mb-4">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">
                        رصيد الموظف
                    </h1>
                    <div
                        v-if="employeeName"
                        class="mt-2 flex items-center gap-2"
                    >
                        <p class="text-sm text-gray-600">
                            الاسم: {{ employeeName }}
                        </p>
                        <p class="text-sm text-gray-600">
                            البريد الإلكتروني: {{ employeeEmail }}
                        </p>
                    </div>
                </div>
                <BaseButton
                    color="primary"
                    class="gap-2"
                    @click="balanceStore.isCreateDialogOpen = true"
                >
                    <Icon name="ph:plus-circle-duotone" class="size-5" />
                    إنشاء رصيد جديد
                </BaseButton>
            </div>
        </div>

        <AppCrud title="الأرصدة" hide-create :pagination="false">
            <AppTable
                title="جدول الأرصدة"
                :headers="tableHeader()"
                :items="balances"
                :is-loading="isLoading"
            >
                <template #data-balanceType="{ item }">
                    <span class="font-medium">{{ item.balanceType }}</span>
                </template>

                <template #data-allocatedBalance="{ item }">
                    <span>{{ item.allocatedBalance }}</span>
                </template>

                <template #data-currentBalance="{ item }">
                    <span class="font-semibold text-blue-600">{{
                        item.currentBalance
                    }}</span>
                </template>

                <template #data-pendingBalance="{ item }">
                    <span class="text-orange-600">{{
                        item.pendingBalance
                    }}</span>
                </template>

                <template #data-availableBalance="{ item }">
                    <span class="font-semibold text-green-600">{{
                        item.availableBalance
                    }}</span>
                </template>

                <template #data-periodStartDate="{ item }">
                    <span>{{ formatDate(item.periodStartDate) }}</span>
                </template>

                <template #data-periodEndDate="{ item }">
                    <span>{{ formatDate(item.periodEndDate) }}</span>
                </template>

                <template #data-notes="{ item }">
                    <span class="text-sm text-gray-600">{{
                        item.notes || '-'
                    }}</span>
                </template>

                <template #data-isActive="{ item }">
                    <span
                        :class="[
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                            item.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800',
                        ]"
                    >
                        {{ item.isActive ? 'نشط' : 'غير نشط' }}
                    </span>
                </template>

                <template #data-actions="{ item }">
                    <div class="flex items-center gap-2">
                        <BaseButton
                            size="sm"
                            color="success"
                            class="gap-1"
                            @click="openAddDialog(item)"
                        >
                            <Icon
                                name="ph:plus-circle-duotone"
                                class="size-4"
                            />
                            إضافة
                        </BaseButton>
                        <BaseButton
                            size="sm"
                            color="danger"
                            class="gap-1"
                            @click="openDeductDialog(item)"
                        >
                            <Icon
                                name="ph:minus-circle-duotone"
                                class="size-4"
                            />
                            خصم
                        </BaseButton>
                    </div>
                </template>
            </AppTable>
        </AppCrud>

        <BalanceCreate />
        <BalanceDeduct />
        <BalanceAdd />
    </div>
</template>

