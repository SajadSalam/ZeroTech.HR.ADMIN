<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AppInputField from '../app-field/AppInputField.vue'
import { useAuditLogStore } from '~/views/auditLog/store'
import type { AuditLog, AuditLogFilters } from '~/views/auditLog/types'
import { auditLogActions, getAuditLogActionIcon } from '~/views/auditLog'
import { formatDate } from '~/services/formatters'
import { getChanges } from '~/utils'

const { t } = useI18n()
const auditLogStore = useAuditLogStore()
const filters = computed(() => auditLogStore.filters)
const auditLogs = computed(() => auditLogStore.auditLogs)
const isLoading = computed(() => auditLogStore.loading)
const isAuditLogDialogOpen = computed(() => auditLogStore.isAuditLogDialogOpen)
const iconBg = (action: number) => {
  switch (action) {
    case 1:
      return "bg-emerald-500";
    case 3:
      return "bg-red-500";
    case 2:
    default:
      return "bg-blue-500";
  }
};
// Watch only the properties we care about, excluding entityType and entityId
watch(
  () => ({
    action: filters.value.action,
    startDate: filters.value.startDate,
    endDate: filters.value.endDate
  }),
  () => {
    auditLogStore.getAuditLogs(filters.value)
  },
  { deep: true }
)
watch(isAuditLogDialogOpen, () => {
  if (isAuditLogDialogOpen.value) {
    auditLogStore.getAuditLogs(filters.value)
  }
})
const isChangesVisible = ref<Record<string, boolean>>({})
</script>
<template>
  <AppDialog v-model="auditLogStore.isAuditLogDialogOpen" :title="$t('audit-log')" size="xl" overflow-y="visible">
    <div class="rounded-3xl p-3">
      <div class="flex flex-col gap-4">
        <div class="grid grid-cols-2 gap-4">
          <AppInputField v-model="filters.startDate" :label="$t('min_date')" type="date" />
          <AppInputField v-model="filters.endDate" :label="$t('max_date')" type="date" />
        </div>
        <div class="flex flex-col gap-2">
          <div v-if="auditLogs.length > 0 && !isLoading"
            class="bg-white rounded-2xl px-6 py-2 max-h-[560px] overflow-y-auto">
            <template v-for="(log, index) in auditLogs" :key="log.id">
              <div v-if="Object.keys(log.changes).length" class="flex flex-row gap-4">
                <div class="flex flex-col items-center">
                  <!-- Icon -->
                  <div
                    class="w-8 h-8 rounded-full flex items-center justify-center shadow-sm text-white text-sm font-semibold"
                    :class="iconBg(log.action)">
                    <Icon :name="getAuditLogActionIcon(log.action) ?? ''" />
                  </div>

                  <!-- Vertical line (except last item) -->
                  <div v-if="index !== auditLogs.length - 1" class="flex-1 min-h-[20px] w-[2px] bg-gray-200" />
                </div>

                <!-- Content -->
                <div class="flex-1 pb-6 ">
                  <div class="text-sm text-gray-800">
                    <span class="font-semibold text-primary-600">
                      {{ log.username || '[Name]' }}
                    </span>
                    <span class="font-semibold capitalize mr-1">
                      {{ auditLogActions[log.action as keyof typeof auditLogActions]?.name ?? '' }}
                    </span>
                    <span class="ml-1">
                      {{ }}
                    </span>
                  </div>

                  <p v-if="log.oldValues"
                    @click="isChangesVisible[log.id] = !isChangesVisible[log.id]"
                    class="mt-1 text-sm text-gray-500 leading-relaxed cursor-pointer hover:underline">
                    {{ $t('click-to-view-changes') }}
                  </p>
                  <div v-if="isChangesVisible[log.id]" class="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div v-for="(change, key) in log.changes" :key="key" class="mb-3 last:mb-0">
                      <div class="font-semibold text-sm text-gray-700 mb-1">{{ key }}:</div>
                      <div class="flex flex-col gap-1 text-xs">
                        <div class="flex items-start gap-2">
                          <span class="font-medium text-red-600 min-w-[60px]">{{ $t('old-value') }}:</span>
                          <span class="text-gray-600 break-words">{{ typeof change.oldValue === 'object' ?
                            JSON.stringify(change.oldValue, null, 2) : change.oldValue ?? 'null' }}</span>
                        </div>
                        <div class="flex items-start gap-2">
                          <span class="font-medium text-green-600 min-w-[60px]">{{ $t('new-value') }}:</span>
                          <span class="text-gray-600 break-words">{{ typeof change.newValue === 'object' ?
                            JSON.stringify(change.newValue, null, 2) : change.newValue ?? 'null' }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Right date -->
                <div class="pl-4 pt-1 text-xs text-gray-400 whitespace-nowrap">
                  {{formatDate(log.timestamp)}}
                </div>
              </div>
            </template>

          </div>
          <div v-else-if="isLoading" class="bg-white rounded-2xl p-6 max-h-[560px] overflow-y-auto">
            <AppLoading />
          </div>
          <div v-else class="bg-white rounded-2xl p-6 max-h-[560px] overflow-y-auto">
            <div class="text-center text-gray-500">
              {{ $t('no-audit-logs-found') }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppDialog>
</template>
