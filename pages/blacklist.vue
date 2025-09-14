<script setup lang="ts">
import AppTable from '~/components/app-table/AppTable.vue'
import { useAppTableStore } from '~/components/app-table/stores/AppTableStore'
import { useAuthStore } from '~/views/auth/store/auth'
import { tableHeader } from '~/views/blacklist'
import UnblacklistStudent from '~/views/blacklist/components/UnblacklistStudent.vue'
import { useBlacklistStore } from '~/views/blacklist/store'
import type { BlacklistFilters } from '~/views/blacklist/types'

definePageMeta({
  title: 'blacklist',
  description: 'manage-blacklisted-students',
})

const blacklistStore = useBlacklistStore()
const appTableStore = useAppTableStore()
const isLoading = computed(() => blacklistStore.isLoading)
const blacklistEntries = computed(() => blacklistStore.blacklistEntries || [])

const filters = computed<BlacklistFilters>({
  get() {
    return blacklistStore.filters
  },
  set(value) {
    blacklistStore.filters = value
  },
})

const getBlacklistEntries = async () => {
  appTableStore.setLoading(true)
  await blacklistStore.getBlacklistEntries()
  appTableStore.setLoading(false)
}

// Initial load
getBlacklistEntries()

// Watch for filter changes
watch(
  filters,
  () => {
    getBlacklistEntries()
  },
  { deep: true }
)

// Format date helper
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

// Get status label and color
const getStatusInfo = (isUnblacklisted: boolean) => {
  return isUnblacklisted 
    ? { label: 'Unblacklisted', color: 'success' }
    : { label: 'Blacklisted', color: 'danger' }
}

const { hasPrivilege } = useAuthStore()
</script>

<template>
  <div>
    <AppCrud
      :pagination="true"
      :total-pages="blacklistStore.totalPages"
      :title="$t('blacklisted-students')"
      :hide-create="true"
      @update:current-page="filters.pageNumber = $event"
    >
      <template #filters>
        <BaseInput 
          v-model="filters.externalStudentName" 
          :placeholder="$t('search-student-name')" 
        />
        <BaseInput 
          v-model="filters.examCenterName" 
          :placeholder="$t('search-exam-center')" 
        />
        <BaseSelect 
          v-model="filters.isUnblacklisted"
          :placeholder="$t('status')"
        >
          <option value="">{{ $t('all') }}</option>
          <option :value="false">{{ $t('blacklisted') }}</option>
          <option :value="true">{{ $t('unblacklisted') }}</option>
        </BaseSelect>
      </template>
      
      <AppTable
        title="Blacklisted Students"
        :headers="tableHeader($t)"
        :items="blacklistEntries"
        :is-loading="isLoading"
      >
        <template #data-externalStudentName="{ item }">
          <div class="flex items-center gap-2">
            <Icon name="lucide:user" class="size-4 text-muted-400" />
            <span>{{ item.externalStudentName }}</span>
          </div>
        </template>

        <template #data-externalStudentNationalId="{ item }">
          <div class="font-mono text-sm">
            {{ item.externalStudentNationalId }}
          </div>
        </template>

        <template #data-examCenterName="{ item }">
          <div class="flex items-center gap-2">
            <Icon name="lucide:building" class="size-4 text-muted-400" />
            <span>{{ item.examCenterName }}</span>
          </div>
        </template>

        <template #data-hallName="{ item }">
          <div class="flex items-center gap-2">
            <Icon name="lucide:map-pin" class="size-4 text-muted-400" />
            <span>{{ item.hallName }}</span>
          </div>
        </template>

        <template #data-reason="{ item }">
          <div class="max-w-xs truncate" :title="item.reason">
            {{ item.reason }}
          </div>
        </template>

        <template #data-blacklistedAt="{ item }">
          <div class="flex items-center gap-2">
            <Icon name="lucide:calendar" class="size-4 text-muted-400" />
            <span>{{ formatDate(item.blacklistedAt) }}</span>
          </div>
        </template>

        <template #data-isUnblacklisted="{ item }">
          <BaseTag 
            :color="getStatusInfo(item.isUnblacklisted).color"
            variant="pastel"
          >
            {{ $t(getStatusInfo(item.isUnblacklisted).label.toLowerCase()) }}
          </BaseTag>
        </template>

        <template #data-actions="{ item }">
          <div class="flex items-center gap-2">
            <BaseButton
              v-if="!item.isUnblacklisted"
              color="success"
              variant="outline"
              size="sm"
              @click="
                () => {
                  blacklistStore.selectedBlacklistEntry = item
                  blacklistStore.isUnblacklistDialogOpen = true
                }
              "
            >
              <Icon name="material-symbols:check-circle" class="size-4" />
              {{ $t('unblacklist') }}
            </BaseButton>
          </div>
        </template>
      </AppTable>
    </AppCrud>
    
    <UnblacklistStudent />
  </div>
</template>