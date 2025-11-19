<script setup lang="ts">
import axiosIns from '~/services/app-client/axios'
import { useQuestionBankStore } from '../store/index'
import { useOrganizationStore } from '~/views/orgaization/store'
import type { Organization } from '~/views/orgaization/types'
import OrganizationTree from '~/views/orgaization/OrganizationTree.vue'
import { useEmployeeStore } from '~/views/employee/store'
import type { Employee, EmployeeFilters, Course } from '~/views/employee/types'
import { AssignType, type AssignDto, type AssignForm } from '../types'
import AppInputField from '~/components/app-field/AppInputField.vue'
import { debounce, get } from 'lodash-es'
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'

const questionBankStore = useQuestionBankStore()
const organizationStore = useOrganizationStore()
const employeeStore = useEmployeeStore()
const tree = ref<Organization[]>([])
const isLoading = ref(false)
const selectedEmployees = ref<Employee[]>([])
const filters = employeeStore.filters as EmployeeFilters

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
  if (selectedEmployees.value.includes(employee)) {
    selectedEmployees.value = selectedEmployees.value.filter((emp: Employee) => emp !== employee)
  } else {
    selectedEmployees.value = [...selectedEmployees.value, employee]
  }
}

const saveAssign = async () => {
  questionBankStore.isLoading = true
  const employeeIds: AssignForm[] = selectedEmployees.value.map<AssignForm>((emp: Employee) => {
    return {
      employeeId: emp.employeeId,
    }
  })
  if (questionBankStore.assignType === AssignType.Auditor) {
    questionBankStore.assignAuditor(
      questionBankStore.selectedQuestionBank?.id as string,
      employeeIds
    )
  } else {
    questionBankStore.assignCreator(
      questionBankStore.selectedQuestionBank?.id as string,
      employeeIds
    )
  }

  questionBankStore.isLoading = false
  questionBankStore.isAssignDialogOpen = false
}

watchDeep(
  () => questionBankStore.assign,
  () => {
    selectedEmployees.value = questionBankStore.assign.map((emp: AssignDto) => {
      return {
        ...emp.employee,
        empFullName: `${emp.employee.empArFirstName} ${emp.employee.empArSecondName} ${emp.employee.empArThirdName} ${emp.employee.empArFourthName}`,
      }
    })
  }
)
watchDeep(
  () => filters.value,
  () => {
    fetchEmployees(selectedItem.value)
  }
)
watch(
  () => questionBankStore.isAssignDialogOpen,
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
</script>
<template>
  <AppDialog
    v-model="questionBankStore.isAssignDialogOpen"
    :title="
      $t('assigns') +
      (questionBankStore.assignType === AssignType.Auditor
        ? ' ' + $t('auditors')
        : ' ' + $t('creators')) + ' (' + selectedEmployees.length + ')'
    "
    size="3xl"
    overflow-y="visible"
    class="!max-w-7xl"
  >
    <!-- Filter Section -->
    <div class="mb-4">
      <div class="mb-4 flex items-center gap-4">
        <AppInputField
          v-model="filters.value.search"
          :placeholder="$t('search-employee')"
          icon="ph-search"
          class="flex-1"
          @update:model-value="debouncedSearch"
        />
        <AppAutoCompleteField
          v-model="filters.value.position"
          fetch-on-search
          search-key="name"
          get-url="/ums/positions"
          :placeholder="$t('select-a-position')"
          item-label="arabicName"
          item-value="id"
          class="w-64"
        />
        <AppAutoCompleteField
          v-model="filters.value.courses"
          fetch-on-search
          search-key="courseName"
          get-url="/ums/courses"
          :placeholder="$t('select-subject')"
          item-label="courseName"
          item-value="id"
          multiple
          class="w-64"
          @update:model-value="handleCourseChange"
        />
      </div>
    </div>
    <hr class="my-4" />
    <div class="min-h-[300px] grid gap-4 md:grid-cols-2">
      <div class="max-h-[300px] overflow-auto">
        <OrganizationTree v-model="selectedItem" />
      </div>

      <div class="max-h-[300px] overflow-auto border-s-2 border-gray-200 ps-3">
        <h1 class="text-xl font-bold">{{ $t('employees') }}</h1>

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
              :model-value="selectedEmployees.includes(employee)"
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
        questionBankStore.assignType === AssignType.Auditor
          ? ' ' + $t('auditors')
          : ' ' + $t('creators')
      }}
    </h1>
    <div class="bg-op-5 pa-5 grid gap-2 rounded-lg bg-primary md:grid-cols-3">
      <div
        v-for="employee in selectedEmployees"
        :key="employee.employeeId"
        class="bg-op-20 pa-2 flex items-center justify-around rounded-full bg-primary"
        color="primary"
        variant="pastel"
      >
        <BaseIconBox variant="pastel" rounded="full" color="primary" size="xs">
          <Icon name="ph-user-duotone" class="text-primary" />
        </BaseIconBox>
        <p class="text-black">
          {{ employee.empFullName }}
        </p>

        <Icon name="ph-x" class="cursor-pointer text-red-500" @click="toggleEmployee(employee)" />
      </div>
    </div>
    <div class="mt-4 flex items-center justify-end">
      <BaseButton
        color="primary"
        :disabled="questionBankStore.isLoading"
        class="gap-1"
        :loading="questionBankStore.isLoading"
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
