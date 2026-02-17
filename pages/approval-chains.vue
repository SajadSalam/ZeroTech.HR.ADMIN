<script setup lang="ts">
import AppCrudActions from '~/components/app-crud/components/AppCrudActions.vue'
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import AppTable from '~/components/app-table/AppTable.vue'
import { useAppTableStore } from '~/components/app-table/stores/AppTableStore'
import { ActiveStatusOptions, tableHeader } from '~/views/approval-chains'
import ApprovalChainCreate from '~/views/approval-chains/components/ApprovalChainCreate.vue'
import ApprovalChainEdit from '~/views/approval-chains/components/ApprovalChainEdit.vue'
import { useApprovalChainStore } from '~/views/approval-chains/store'
import type {
    ApprovalChainDto,
    ApprovalChainFilters,
} from '~/views/approval-chains/types'

definePageMeta({
    title: 'سلاسل الموافقات',
    description: 'إدارة سلاسل الموافقات في النظام',
})

const approvalChainStore = useApprovalChainStore()
const appTableStore = useAppTableStore()

const isLoading = computed(() => approvalChainStore.isLoading)
const approvalChains = computed(() => approvalChainStore.approvalChains || [])
const filters = computed<ApprovalChainFilters>({
    get() {
        return approvalChainStore.filters
    },
    set(value) {
        approvalChainStore.filters = value
    },
})

const getApprovalChains = async () => {
    appTableStore.setLoading(true)
    await approvalChainStore.getApprovalChains()
    appTableStore.setLoading(false)
}

const viewTimeline = (approvalChain: ApprovalChainDto) => {
  navigateTo(`/approval-chain/${approvalChain.id}`)
}

getApprovalChains()
watch(
    filters,
    () => {
        getApprovalChains()
    },
    { deep: true }
)

onUnmounted(() => {
    approvalChainStore.filters = {
        pageSize: 10,
        pageNumber: 1,
        name: null,
        requestTypeId: null,
        departmentId: null,
    }
})
</script>

<template>
    <div>
        <AppCrud
            add-button-text="إضافة سلسلة موافقات جديدة"
            :add-btn-action="
                () => (approvalChainStore.isCreateDialogOpen = true)
            "
            :pagination="true"
            :total-pages="approvalChainStore.totalPages"
            title="سلاسل الموافقات"
            @update:current-page="filters.pageNumber = $event"
        >
            <AppTable
                title="قائمة سلاسل الموافقات"
                :headers="tableHeader()"
                :items="approvalChains"
                :is-loading="isLoading"
            >
                <template #data-name="{ item }">
                    <div class="flex flex-col">
                        <button
                            class="font-medium text-muted-800 dark:text-muted-100 hover:text-primary-600 text-left"
                            @click="viewTimeline(item)"
                        >
                            {{ item.name }}
                        </button>
                        <span
                            v-if="item.description"
                            class="text-xs text-muted-500 mt-1"
                        >
                            {{ item.description }}
                        </span>
                    </div>
                </template>

                <template #data-requestType="{ item }">
                    <div class="flex flex-col">
                        <span
                            class="font-medium text-muted-800 dark:text-muted-100"
                        >
                            {{ item.requestType.name }}
                        </span>
                        <span class="text-xs text-muted-500">
                            {{ item.requestType.code }}
                        </span>
                    </div>
                </template>

                <template #data-department="{ item }">
                    <div class="flex flex-col">
                        <span
                            class="font-medium text-muted-800 dark:text-muted-100"
                        >
                            {{ item.department.name }}
                        </span>
                        <span class="text-xs text-muted-500">
                            {{ item.department.code }}
                        </span>
                    </div>
                </template>

        <template #data-priority="{ item }">
          <BaseTag
            color="primary"
            variant="pastel"
            size="sm"
          >
            {{ item.priority || 0 }}
          </BaseTag>
        </template>

                <template #data-stepsCount="{ item }">
                    <div class="flex items-center gap-2">
                        <Icon
                            name="ph:list-duotone"
                            class="size-4 text-muted-500"
                        />
                        <span class="font-medium">{{
                            item.approvalSteps?.length || 0
                        }}</span>
                    </div>
                </template>

                <template #data-maxCompletionHours="{ item }">
                    <div class="flex items-center gap-1">
                        <Icon
                            name="ph:clock-duotone"
                            class="size-4 text-muted-500"
                        />
                        <span>{{ item.maxCompletionHours || '-' }}</span>
                    </div>
                </template>

        <template #data-isActive="{ item }">
          <BaseTag
            :color="item.isActive ? 'success' : 'muted'"
            variant="pastel"
            size="sm"
          >
            {{ item.isActive ? 'نشط' : 'غير نشط' }}
          </BaseTag>
        </template>

        <template #data-actions="{ item }">
          <div class="flex items-center gap-2">
            <BaseButton
              size="sm"
              variant="outline"
              @click="viewTimeline(item)"
            >
              <Icon name="ph:timeline" class="size-4" />
            </BaseButton>
            <AppCrudActions
              :item="item"
              
              :edit-button-action="() => {
                approvalChainStore.selectedApprovalChain = item
                approvalChainStore.selectedApprovalChainId = item.id
                approvalChainStore.isEditDialogOpen = true
              }"
              :delete-service="approvalChainStore.deleteApprovalChain"
            />
          </div>
        </template>
      </AppTable>
    </AppCrud>
    
    <ApprovalChainCreate />
    <ApprovalChainEdit />
  </div>
</template>
