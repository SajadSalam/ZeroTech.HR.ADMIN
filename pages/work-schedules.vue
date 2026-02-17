<script setup lang="ts">
import AppCrudActions from '~/components/app-crud/components/AppCrudActions.vue'
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import AppTable from '~/components/app-table/AppTable.vue'
import { useAppTableStore } from '~/components/app-table/stores/AppTableStore'
import { formatDate, formatFlexibility, formatLateAttendanceRules, formatScheduleType, formatShifts, formatassignments, tableHeader } from '~/views/work-schedules'
import UserAssignmentDialog from '~/views/work-schedules/components/UserAssignmentDialog.vue'
import WorkScheduleCreate from '~/views/work-schedules/components/WorkScheduleCreate.vue'
import WorkScheduleEdit from '~/views/work-schedules/components/WorkScheduleEdit.vue'
import { useWorkScheduleStore } from '~/views/work-schedules/store'
import type { WorkScheduleDto, WorkScheduleFilters } from '~/views/work-schedules/types'

definePageMeta({
  title: 'جداول العمل',
  description: 'إنشاء وإدارة جداول العمل والشفتات',
})

const workScheduleStore = useWorkScheduleStore()
const appTableStore = useAppTableStore()
const isLoading = computed(() => workScheduleStore.isLoading)
const workSchedules = computed(() => workScheduleStore.workSchedules || [])
const filters = computed<WorkScheduleFilters>({
  get() {
    return workScheduleStore.filters
  },
  set(value) {
    workScheduleStore.filters = value
  },
})

const getWorkSchedules = async () => {
  appTableStore.setLoading(true)
  await workScheduleStore.getWorkSchedules()
  appTableStore.setLoading(false)
}

const getTemplatesOnly = async () => {
  appTableStore.setLoading(true)
  await workScheduleStore.getTemplates()
  appTableStore.setLoading(false)
}

// View mode toggle
const viewMode = ref<'all' | 'templates'>('all')

const switchViewMode = (mode: 'all' | 'templates') => {
  viewMode.value = mode
  if (mode === 'templates') {
    getTemplatesOnly()
  } else {
    getWorkSchedules()
  }
}

// Initialize
getWorkSchedules()
watch(
  filters,
  () => {
    if (viewMode.value === 'templates') {
      getTemplatesOnly()
    } else {
      getWorkSchedules()
    }
  },
  { deep: true }
)

// Action handlers
const handleEdit = (item: WorkScheduleDto) => {
  workScheduleStore.openEditDialog(item)
}

const handleAssignUsers = (item: WorkScheduleDto) => {
  workScheduleStore.openUserAssignmentDialog(item)
}

const handleDelete = async (id: number) => {
  await workScheduleStore.deleteWorkSchedule(id)
}

onUnmounted(() => {
  workScheduleStore.filters = {
    pageSize: 10,
    pageNumber: 1,
    name: null,
    isFlexible: null,
    isGeneralTemplate: null,
    specificUserId: null,
  }
})

</script>

<template>
  <div>
    <AppCrud
      add-button-text="إنشاء جدول عمل جديد"
      :add-btn-action="() => workScheduleStore.openCreateDialog()"
      :pagination="true"
      :total-pages="workScheduleStore.totalPages"
      title="جداول العمل"
      @update:current-page="filters.pageNumber = $event"
    >
      <template #filters>
        <!-- View Mode Toggle -->
        <div class="flex gap-2">
          <BaseButton
            :color="viewMode === 'all' ? 'primary' : 'muted'"
            :variant="viewMode === 'all' ? 'solid' : 'pastel'"
            size="sm"
            @click="switchViewMode('all')"
          >
            جميع الجداول
          </BaseButton>
          <BaseButton
            :color="viewMode === 'templates' ? 'primary' : 'muted'"
            :variant="viewMode === 'templates' ? 'solid' : 'pastel'"
            size="sm"
            @click="switchViewMode('templates')"
          >
            القوالب العامة
          </BaseButton>
        </div>

        <!-- Search Filters -->
        <BaseInput 
          v-model="filters.name" 
          placeholder="البحث في أسماء الجداول" 
        />
        
        <AppAutoCompleteField
          v-model="filters.isFlexible"
          placeholder="جدول مرن"
          :items="[{ value: true, label: 'جدول مرن' }, { value: false, label: 'جدول ثابت' }]"
          item-label="label"
          item-value="value"
        />


        <AppAutoCompleteField
          v-if="viewMode === 'all'"
          v-model="filters.specificUserId"
          placeholder="تصفية حسب المستخدم"
          get-url="/user"
          item-label="fullName"
          item-value="id"
          fetch-on-search
          search-key="fullName"
        />
      </template>

      <AppTable
        title="جداول العمل"
        :headers="tableHeader()"
        :items="workSchedules"
        :is-loading="isLoading"
      >
        <!-- Schedule Name -->
        <template #data-name="{ item }">
          <div class="flex flex-col">
            <span class="font-medium text-muted-800 dark:text-muted-100">
              {{ item.name }}
            </span>
            <span v-if="item.description" class="text-xs text-muted-500">
              {{ item.description }}
            </span>
          </div>
        </template>

        <!-- Schedule Type -->
        <template #data-type="{ item }">
          <BaseTag
            :color="item.isGeneralTemplate ? 'info' : 'primary'"
            variant="pastel"
            size="sm"
          >
            {{ formatScheduleType(item) }}
          </BaseTag>
        </template>

        <!-- Flexibility -->
        <template #data-flexibility="{ item }">
          <BaseTag
            :color="item.isFlexible ? 'success' : 'muted'"
            variant="pastel"
            size="sm"
          >
            {{ formatFlexibility(item) }}
          </BaseTag>
        </template>

        <!-- Total Weekly Hours -->
        <template #data-totalWeeklyHours="{ item }">
          <span class="font-medium text-muted-800 dark:text-muted-100">
            {{ item.totalWeeklyHours }} ساعة
          </span>
        </template>

        <!-- Shifts -->
        <template #data-shifts="{ item }">
          <div class="flex flex-col">
            <span class="text-sm font-medium text-muted-800 dark:text-muted-100">
              {{ formatShifts(item.shifts) }}
            </span>
            <div v-if="item.shifts && item.shifts.length > 1" class="mt-1 flex flex-wrap gap-1">
              <span
                v-for="shift in item.shifts.slice(0, 2)"
                :key="shift.id"
                class="text-xs text-muted-500"
              >
                {{ shift.startTime }}-{{ shift.endTime }}
              </span>
              <span v-if="item.shifts.length > 2" class="text-xs text-muted-400">
                +{{ item.shifts.length - 2 }} أخرى
              </span>
            </div>
          </div>
        </template>

        <!-- User Assignments -->
        <template #data-assignments="{ item }">
          <div class="flex items-center gap-2">
            <span class="text-sm text-muted-800 dark:text-muted-100">
              {{ formatassignments(item.assignments) }}
            </span>
            <BaseButton
              v-if="item.isGeneralTemplate"
              size="sm"
              color="primary"
              variant="pastel"
              @click="handleAssignUsers(item)"
            >
              <Icon name="ph:user-plus" class="size-3" />
              تعيين
            </BaseButton>
          </div>
        </template>

        <!-- Late Attendance Rules -->
        <template #data-lateAttendanceRules="{ item }">
          <div class="flex flex-col">
            <span class="text-sm font-medium text-muted-800 dark:text-muted-100">
              {{ formatLateAttendanceRules(item.lateAttendanceRules) }}
            </span>
            <div v-if="item.lateAttendanceRules && item.lateAttendanceRules.length > 0" class="mt-1 flex flex-wrap gap-1">
              <span
                v-for="rule in item.lateAttendanceRules.slice(0, 2)"
                :key="rule.id"
                class="text-xs text-muted-500"
              >
                {{ rule.lateMinutesThreshold }}دق-{{ rule.deductionAmount.toLocaleString() }}
              </span>
              <span v-if="item.lateAttendanceRules.length > 2" class="text-xs text-muted-400">
                +{{ item.lateAttendanceRules.length - 2 }} أخرى
              </span>
            </div>
          </div>
        </template>

        <!-- Created At -->
        <template #data-createdAt="{ item }">
          <span class="text-sm text-muted-600 dark:text-muted-400">
            {{ formatDate(item.createdAt) }}
          </span>
        </template>

        <!-- Actions -->
        <template #data-actions="{ item }">
          <div class="flex items-center gap-2">
            <!-- Assign Users Button (for templates) -->
            <BaseButton
              v-if="item.isGeneralTemplate"
              size="sm"
              color="info"
              variant="pastel"
              @click="handleAssignUsers(item)"
            >
              <Icon name="ph:user-plus" class="size-4" />
            </BaseButton>

            <!-- Standard CRUD Actions -->
            <AppCrudActions
              :item="item"
              :edit-button-action="() => handleEdit(item)"
              :delete-service="handleDelete"
            />
          </div>
        </template>
      </AppTable>
    </AppCrud>

    <!-- Dialogs -->
    <WorkScheduleCreate />
    <WorkScheduleEdit />
    <UserAssignmentDialog />
  </div>
</template>
