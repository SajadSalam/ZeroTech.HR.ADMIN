<script setup lang="ts">
import { debounce } from 'lodash-es'
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import AppInputField from '~/components/app-field/AppInputField.vue'
import { useEmployeeStore } from '~/views/employee/store'
import type { Employee, EmployeeFilters } from '~/views/employee/types'
import OrganizationTree from '~/views/orgaization/OrganizationTree.vue'
import { useOrganizationStore } from '~/views/orgaization/store'
import type { Organization } from '~/views/orgaization/types'
import { useExaminationCenters } from '../store/index'

const examinationCenterStore = useExaminationCenters()
const organizationStore = useOrganizationStore()
const employeeStore = useEmployeeStore()
const tree = ref<Organization[]>([])
const isLoading = ref(false)
const selectedEmployee = ref<Employee | null>(null)
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
const debouncedSearch = debounce((value: string) => {
  filters.value.search = value
  fetchEmployees(selectedItem.value)
}, 300)
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
const toggleEmployee = (employee: Employee) => {
  selectedEmployee.value = employee
}
const tabs = (t: (key: string) => string) => [
  
    {
        label: t('exam-center-managers'),
        value: 'exam-center-managers',
    },
      {
        label: t('surrogate-managers'),
        value: 'surrogate-managers',
    },
]
const selectedTab = ref<string>('exam-center-managers')
const saveAssign = async () => {
    if (selectedTab.value === 'exam-center-managers') {
        await examinationCenterStore.assignExamCenterManager(examinationCenterStore.selectedExaminationCenter.id, { managerId: selectedEmployee.value?.employeeId })
    } else {
        await examinationCenterStore.assignSurrogateManager(examinationCenterStore.selectedExaminationCenter.id, { managerId: selectedEmployee.value?.employeeId })
    }
    examinationCenterStore.isAssignExamCenterManagerDialogOpen = false
    await examinationCenterStore.getExaminationCenters(examinationCenterStore.filters)
    selectedEmployee.value = null
    selectedTab.value = 'exam-center-managers'
}

// watchDeep(
//   () => examinationCenterStore.assign,
//   () => {
//     selectedEmployee.value = examinationCenterStore.assign.map((emp: AssignDto) => {
//       return {
//         ...emp.employee,
//         empFullName: `${emp.employee.empArFirstName} ${emp.employee.empArSecondName} ${emp.employee.empArThirdName} ${emp.employee.empArFourthName}`,
//       }
//     })
//   }
// )
watchDeep(
  () => filters.value,
  () => {
    fetchEmployees(selectedItem.value)
  }
)
watch(
  () => examinationCenterStore.isAssignExamCenterManagerDialogOpen,
  () => {
    filters.value = {
      search: null,
      position: null,
      courses: [],
      collegeId: null,
      pageSize: 50,
      pageNumber: 1,
    }
    employeeStore.employees = []
  }
)
const handleCourseChange = (selectedCourses: any[]) => {
  filters.value.courses = selectedCourses
  fetchEmployees(selectedItem.value)
}

const examCenterManager = computed(() => {
  return examinationCenterStore.selectedExaminationCenter?.managerName
})
const surrogateManager = computed(() => {
  return examinationCenterStore.selectedExaminationCenter?.surrogateManagerName
})
const removeManager = () => {
  if (selectedTab.value === 'exam-center-managers') {
    selectedEmployee.value = null
    examinationCenterStore.selectedExaminationCenter.managerName = null
  } else {
    selectedEmployee.value = null
    examinationCenterStore.selectedExaminationCenter.surrogateManagerName = null
  }
}
</script>
<template>
  <AppDialog
    v-model="examinationCenterStore.isAssignExamCenterManagerDialogOpen"
    :title="
      $t('assigns') +
      ' ' + $t('exam-center-managers')
    "
    size="3xl"
    overflow-y="visible"
    class="!max-w-7xl"
  >
    <!-- Filter Section -->
    <BaseTabs :tabs="tabs($t)" v-model="selectedTab">

    </BaseTabs>
    <hr class="my-4" />
    <div class="min-h-[300px] grid gap-4 md:grid-cols-2">
      <div class="max-h-[300px] overflow-auto">
        <OrganizationTree v-model="selectedItem" />
      </div>

      <div class="max-h-[300px] overflow-auto border-s-2 border-gray-200 ps-3">
        <h1 class="text-xl font-bold">{{ $t('employees') }}</h1>
        <AppInputField v-if="employees.length" v-model="filters.search" :label="$t('search-employee')" />
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
          >
            <BaseCheckbox
              color="primary"
              :value="employee.employeeId"
              :model-value="selectedEmployee?.employeeId === employee.employeeId"
              @update:model-value="(val) => toggleEmployee(employee)"
            />
            <BaseAvatar color="primary" size="xs">
              <Icon name="ph-user-duotone" size="20" class="text-primary" />
            </BaseAvatar>
            <div>
              <h1 class="text-md font-bold">
                {{ employee.empFullName }}
              </h1>
              <p class="text-sm text-muted-500">
                {{ employee.academicRank }}
                -
                {{ employee.position }}
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
      {{
        ' ' + $t(selectedTab)
      }}
    </h1>
    <div class="bg-op-5 pa-5 grid gap-2 rounded-lg bg-primary md:grid-cols-3">
        
      <div
        v-if="(selectedTab === 'exam-center-managers' && examCenterManager) || (selectedTab === 'surrogate-managers' && surrogateManager)"
        class="bg-op-20 pa-2 flex items-center justify-around rounded-full bg-primary"
        color="primary"
        variant="pastel"
      >
        <BaseIconBox variant="pastel" rounded="full" color="primary" size="xs">
          <Icon name="ph-user-duotone" class="text-primary" />
        </BaseIconBox>
        <p class="text-black">
          {{ selectedTab === 'exam-center-managers' ? examCenterManager : surrogateManager }}
        </p>

        <Icon name="ph-x" class="cursor-pointer text-red-500" @click="removeManager" />
      </div>
      
    </div>
    <div class="mt-4 flex items-center justify-end">
      <BaseButton
        color="primary"
        :disabled="examinationCenterStore.isLoading"
        class="gap-1"
        :loading="examinationCenterStore.isLoading"
        @click="saveAssign"
      >
        <Icon name="ph:upload-simple-duotone" class="size-5" />
        {{ $t('assigns') }}
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
