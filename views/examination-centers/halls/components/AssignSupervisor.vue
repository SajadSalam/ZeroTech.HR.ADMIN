<script setup lang="ts">
import { useEmployeeStore } from '~/views/employee/store'
import type { Employee, EmployeeFilters } from '~/views/employee/types'
import OrganizationTree from '~/views/orgaization/OrganizationTree.vue'
import { useOrganizationStore } from '~/views/orgaization/store'
import type { Organization } from '~/views/orgaization/types'
import { useHallStore } from '../store/index'
import type { Supervisor } from '../types'

const hallsStore = useHallStore()
const organizationStore = useOrganizationStore()
const employeeStore = useEmployeeStore()
const tree = ref<Organization[]>([])
const isLoading = ref(false)
const selectedSupervisors = ref<(Employee & { isPrimary: boolean })[]>([])
const filters = computed<EmployeeFilters>({
  get() {
    return employeeStore.filters
  },
  set(value: EmployeeFilters) {
    employeeStore.filters = value
  },
})

const fetchEmployees = async (collegeId: number) => {
  filters.value.collegeId = collegeId
  await employeeStore.getEmployees(filters.value)
}
const employees = computed(() => {
  return employeeStore.employees
})
const selectedItem = ref<number>(0)

onMounted(async () => {
  filters.value = {
    search: null,
    position: null,
    courses: [],
    collegeId: null,
    pageSize: 50,
    pageNumber: 1,
  }
  tree.value = await organizationStore.getOrganizations({ parentId: null })
  isLoading.value = false
})

watchDeep(
  () => selectedItem.value,
  () => {
    fetchEmployees(selectedItem.value)
  }
)

// Validation computed properties
const validationErrors = computed(() => {
  const errors: string[] = []
  
  if (selectedSupervisors.value.length < 2) {
    errors.push('يجب تحديد 2 مراقبين على الاقل للقاعة')
  }
  

  return errors
})

const isFormValid = computed(() => validationErrors.value.length === 0)

const toggleEmployee = (employee: Employee) => {
  const existingIndex = selectedSupervisors.value.findIndex(s => s.employeeId === employee.employeeId)
  
  if (existingIndex >= 0) {
    // Remove supervisor if already selected
    selectedSupervisors.value.splice(existingIndex, 1)
  } else {
    // Add supervisor - set as primary if it's the first one
    const isPrimary = selectedSupervisors.value.length === 0
    selectedSupervisors.value.push({ ...employee, isPrimary })
  }
}

const togglePrimary = (employeeId: number) => {
  selectedSupervisors.value.forEach(supervisor => {
    supervisor.isPrimary = supervisor.employeeId === employeeId
  })
}

const removeSupervisor = (employeeId: number) => {
  const index = selectedSupervisors.value.findIndex(s => s.employeeId === employeeId)
  if (index >= 0) {
    selectedSupervisors.value.splice(index, 1)
  }
}

const isEmployeeSelected = (employeeId: number) => {
  return selectedSupervisors.value.some(s => s.employeeId === employeeId)
}

const isExistingSupervisor = (employeeId: number) => {
  return hallsStore.selectedHall?.supervisors?.some(s => s.supervisorId === employeeId && s.isActive) || false
}
const saveAssign = async () => {
    if (!isFormValid.value || !hallsStore.selectedHall) {
        return
    }
    
    const supervisors: Supervisor[] = selectedSupervisors.value.map(supervisor => ({
        supervisorId: supervisor.employeeId,
        isPrimary: supervisor.isPrimary,
        notes: null
    }))

    if (supervisors.length > 0) {
        supervisors[0].isPrimary = true
    }

    await hallsStore.assignMultipleSupervisors(hallsStore.selectedHall.id, { supervisors })
    hallsStore.isAssignSupervisorDialogOpen = false
    await hallsStore.getHalls(hallsStore.filters)
    selectedSupervisors.value = []
}

watchDeep(
  () => filters.value,
  () => {
    fetchEmployees(selectedItem.value)
  }
)
// Load existing supervisors when dialog opens
const loadExistingSupervisors = () => {
  if (hallsStore.selectedHall?.supervisors) {
    selectedSupervisors.value = hallsStore.selectedHall.supervisors
      .filter(s => s.isActive)
      .map(supervisor => ({
        employeeId: supervisor.supervisorId,
        empFullName: supervisor.supervisorName,
        academicRank: null, // Not available in HallSupervisor
        position: null, // Not available in HallSupervisor
        isPrimary: supervisor.isPrimary,
        // Add other Employee properties with defaults
        empArFirstName: '',
        empArSecondName: '',
        empArThirdName: '',
        empArFourthName: '',
        collegeId: 0,
      }))
  }
}

watch(
  () => hallsStore.isAssignSupervisorDialogOpen,
  (isOpen) => {
    if (isOpen) {
      loadExistingSupervisors()
    }
    filters.value = {
      search: null,
      position: null,
      courses: [],
      collegeId: null,
      pageSize: 50,
      pageNumber: 1,
    }
    employeeStore.employees = []
    if (!isOpen) {
      selectedSupervisors.value = []
    }
  }
)

</script>
<template>
  <AppDialog
    v-model="hallsStore.isAssignSupervisorDialogOpen"
    :title="
      $t('assign-supervisor')
    "
    size="3xl"
    overflow-y="visible"
    class="!max-w-7xl"
  >
    <hr class="my-4" />
    <div class="min-h-[300px] grid gap-4 md:grid-cols-2">
      <div class="max-h-[300px] overflow-auto">
        <OrganizationTree v-model="selectedItem" />
      </div>

      <div class="max-h-[300px] overflow-auto border-s-2 border-gray-200 ps-3">
        <h1 class="text-xl font-bold">{{ $t('employees') }}</h1>
        <AppFieldAppInputField v-if="employees.length" v-model="filters.search" :label="$t('search-employee')" />

        <div v-if="!employees.length" class="flex flex-col items-center justify-center">
          <img
            src="/assets/images/no-data.png"
            class="w-120 h-60 object-contain"
            alt=""
            srcset=""
          >
          <h1>
            {{ $t('no-data-found') }}
          </h1>
        </div>
        <div class="mt-2 grid gap-2 md:grid-cols-1">
          <div
            v-for="employee in employees"
            :key="employee.employeeId"
            class="flex items-center gap-3"
            :class="{ 'bg-green-50 border border-green-200 rounded p-2': isExistingSupervisor(employee.employeeId) }"
          >
            <BaseCheckbox
              color="primary"
              :value="employee.employeeId"
              :model-value="isEmployeeSelected(employee.employeeId)"
              @update:model-value="(val) => toggleEmployee(employee)"
            />
            <BaseAvatar color="primary" size="xs">
              <Icon name="ph-user-duotone" size="20" class="text-primary" />
            </BaseAvatar>
            <div class="flex-1">
              <h1 class="text-md font-bold flex items-center gap-2">
                {{ employee.empFullName }}
                <span 
                  v-if="isExistingSupervisor(employee.employeeId)"
                  class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                >
                  مُعيّن حالياً
                </span>
              </h1>
              <p class="text-sm text-muted-500">
                {{ (employee.academicRank && employee.position) ? `${employee.academicRank} - ${employee.position}` : 'معلومات المنصب غير متوفرة' }}
              </p>
            </div>
          </div>
          <template v-if="isLoading">
            <AppLoading v-for="i in 8" :key="i" :show-avatar="true" />
          </template>
        </div>
      </div>
    </div>
    <h1 class="my-3">
      {{ $t('supervisors') }} ({{ selectedSupervisors.length }})
    </h1>
    
    <!-- Validation Errors -->
    <div v-if="validationErrors.length > 0" class="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      <ul class="list-disc list-inside">
        <li
         v-for="error in validationErrors"
         :key="error"
         class="mb-2"
       >
         {{ error }}
      </li>
        </ul>
    </div>

    <div class="bg-op-5 pa-5 grid gap-3 rounded-lg bg-primary">
      <div
        v-for="supervisor in selectedSupervisors"
        :key="supervisor.employeeId"
        class="bg-op-20 pa-3 flex items-center justify-between rounded-lg bg-white border"
        :class="{ 'border-green-300 bg-green-50': isExistingSupervisor(supervisor.employeeId) }"
      >
        <div class="flex items-center gap-3">
          <BaseIconBox variant="pastel" rounded="full" color="primary" size="xs">
            <Icon name="ph-user-duotone" class="text-primary" />
          </BaseIconBox>
          <div>
            <p class="text-black font-medium flex items-center gap-2">
              {{ supervisor.empFullName }}
              <span 
                v-if="isExistingSupervisor(supervisor.employeeId)"
                class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
              >
                مُعيّن مسبقاً
              </span>
            </p>
            <p class="text-sm text-gray-600">
              {{ (supervisor.academicRank && supervisor.position) ? `${supervisor.academicRank} - ${supervisor.position}` : 'معلومات المنصب غير متوفرة' }}
            </p>
          </div>
        </div>
        
        <div class="flex items-center gap-3">
         
          
          <Icon 
            name="ph-x" 
            class="cursor-pointer text-red-500 hover:text-red-700" 
            @click="removeSupervisor(supervisor.employeeId)" 
          />
        </div>
      </div>
      
      <div v-if="selectedSupervisors.length === 0" class="text-center text-gray-500 py-4">
        {{ $t('no-supervisors-selected') }}
      </div>
    </div>
    <div class="mt-4 flex items-center justify-end">
      <BaseButton
        color="primary"
        :disabled="hallsStore.isLoading || !isFormValid"
        class="gap-1"
        :loading="hallsStore.isLoading"
        @click="saveAssign"
      >
        <Icon name="ph:upload-simple-duotone" class="size-5" />
        {{ $t('assign-supervisors') }}
      </BaseButton>
    </div>
  </AppDialog>
</template>
<style lang="scss">
.treeview {
  .nui-icon-box {
    background-color: transparent !important;
  }
}
</style>
