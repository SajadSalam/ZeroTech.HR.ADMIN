<script setup lang="ts">
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue';
import AppInputField from '~/components/app-field/AppInputField.vue';
import AppFileField from '~/components/app-field/AppFileField.vue';
import DotLoading from '~/components/DotLoading.vue';
import { useEmployeeStore } from '~/views/employees/store';
import type { EmployeeDto } from '~/views/employees/types'
const employeeStore = useEmployeeStore()
const isLoading = computed(() => employeeStore.isLoading)
const isFetchingEmployee = ref(false)
const route = useRoute()
const router = useRouter()

const employeeId = computed(() => route.query.id as string)
const pageTitle = computed(() => employeeId.value ? 'تعديل موظف' : 'إضافة موظف جديد')

definePageMeta({
    title: "ادارة الموظفين",
    description: 'إدارة بيانات الموظف في النظام',
})

useHead(() => ({
  title: pageTitle.value,
}))
interface Shift {
    id: number
    startTime: string
    endTime: string
}

const createEmptyForm = () => ({
    fullName: '',
    name: '',
    email: '',
    phone: '',
    identityNumber: '',
    gender: undefined,
    birthDate: '',
    employeeNumber: '',
    departmentId: '',
    branchId: '',
    jobTitle: '',
    contractType: '',
    hireDate: '',
    salary: '',
    workScheduleId: '',
    firstName: '',
    lastName: '',
    password: '',
    username: '',
    zoneId: '',
})
const form = ref(createEmptyForm())

const normalizeDate = (value?: string | null) => {
    if (!value) return ''
    return value.split('T')[0]
}

const fillFormFromEmployee = (employee: EmployeeDto) => {
    form.value = {
        ...createEmptyForm(),
        fullName: employee.fullName ?? '',
        name: employee.fullName ?? '',
        email: employee.email ?? '',
        phone: employee.phone ?? '',
        identityNumber: employee.identityNumber ?? '',
        gender: employee.gender ?? undefined,
        birthDate: normalizeDate(employee.birthDate),
        employeeNumber: employee.employeeNumber ?? '',
        departmentId: employee.departmentId ?? '',
        branchId: employee.branchId ?? '',
        jobTitle: employee.jobTitle ?? '',
        contractType: employee.contractType ?? '',
        hireDate: normalizeDate(employee.hireDate),
        salary: employee.salary ?? '',
        workScheduleId: employee.workScheduleId ?? '',
        username: employee.user?.username ?? '',
        firstName: employee.user?.firstName ?? '',
        lastName: employee.user?.lastName ?? '',
        zoneId: employee.zoneId ?? '',
    }
}

const loadEmployee = async (id: number) => {
    isFetchingEmployee.value = true
    try {
        const employee = await employeeStore.getEmployeeById(id)
        if (!employee) return
        employeeStore.setSelectedEmployee(employee)
        fillFormFromEmployee(employee)
    } finally {
        isFetchingEmployee.value = false
    }
}

onMounted(async () => {
    if (employeeId.value) {
        await loadEmployee(Number(employeeId.value))
    }
})

const submitEmployee = async () => {
    if (employeeId.value) {
        employeeStore.selectedEmployeeId = employeeId.value
        await employeeStore.updateEmployee({
            ...(form.value as any),
            id: employeeId.value,
        })
    } else {
        await employeeStore.createEmployee(form.value as any)
    }
    router.push('/employees')
}
</script>
<template>
    <div v-if="isFetchingEmployee" class="flex justify-center items-center h-96">
        <DotLoading />
    </div>
    <div v-else class="flex flex-col gap-6 mb-4">
        <div class="container">
            <div class="mb-2 text-lg font-bold">البيانات الشخصية</div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AppInputField
                    v-model="form.fullName"
                    label="الاسم"
                    placeholder="الاسم"
                />
                <AppInputField
                    v-model="form.email"
                    label="البريد الإلكتروني"
                    placeholder="البريد الإلكتروني"
                />
                <AppInputField
                    v-model="form.phone"
                    label="رقم الهاتف"
                    placeholder="رقم الهاتف"
                />
                <AppInputField
                    v-model="form.identityNumber"
                    label="رقم الهوية"
                    placeholder="رقم الهوية"
                />
                <AppAutoCompleteField
                    v-model="form.gender"
                    label="الجنس"
                    :items="[{
                        label: 'ذكر',
                        value: 1,
                    }, {
                        label: 'أنثى',
                        value: 2,
                    }]"
                    item-label="label"
                    item-value="value"
                    placeholder="الجنس"
                />
                <AppInputField
                    v-model="form.birthDate"
                    label="تاريخ الميلاد"
                    placeholder="تاريخ الميلاد"
                    type="date"
                />
            </div>
        </div>
        <div class="container">
            <div class="mb-2 text-lg font-bold">المعلومات الوظيفية</div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AppInputField
                    v-model="form.employeeNumber"
                    label="الرقم الوظيفي"
                    placeholder="الرقم الوظيفي"
                />
                <AppInputField
                    v-model="form.jobTitle"
                    label="المسمى الوظيفي"
                    placeholder="المسمى الوظيفي"
                />
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2">
                    <AppAutoCompleteField
                    v-model="form.departmentId"
                    label="القسم"
                    placeholder="القسم"
                    get-url="/Department"
                    item-label="name"
                    item-value="id"
                    />
                    <AppAutoCompleteField
                    v-model="form.branchId"
                    label="الفرع"
                    placeholder="الفرع"
                    get-url="/Governorate"
                    item-label="name"
                    item-value="id"
                    />
                    <AppAutoCompleteField
                    label="المنطقة الجغرافية"
                    v-model="form.zoneId"
                    placeholder="المنطقة الجغرافية"
                    get-url="/Zone/paged"
                    item-label="name"
                    item-value="id"
                    />
                </div>
                <AppAutoCompleteField
                    v-model="form.contractType"
                    label="نوع العقد"
                    :items="[{
                        label: 'دوام كامل',
                        value: 1,
                    }, 
                    {
                        label: 'دوام جزئي',
                        value: 2,
                    },
                    {
                        label: 'عقد ',
                        value:3,
                    },
                    {
                        label: 'مؤقت',
                      value: 4,
                    },
                    {
                        label: 'متدرب',
                        value: 5,
                    },

                    ]"
                    item-label="label"
                    item-value="value"
                    placeholder="نوع العقد"
                />
                 <AppInputField
                    v-model="form.hireDate"
                    label="تاريخ التعيين"
                    placeholder="تاريخ التعيين"
                    type="date"
                />
                 <AppInputField
                    v-model="form.salary"
                    label="الراتب"
                    placeholder="الراتب"
                />
                <AppAutoCompleteField
                    v-model="form.workScheduleId"
                    get-url="/WorkSchedule"
                    item-label="name"
                    item-value="id"
                    label="الجدول الزمني"
                    placeholder="الجدول الزمني"
                />
            </div>
        </div>
        <div class="container">
            <div class="mb-2 text-lg font-bold">معلومات حساب النظام</div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AppInputField
                    v-model="form.firstName"
                    label="الاسم الأول"
                    placeholder="الاسم الأول"
                />
                <AppInputField
                    v-model="form.lastName"
                    label="الاسم العائلة"
                    placeholder="الاسم العائلة"
                />
                <AppInputField
                    v-model="form.username"
                    label="اسم المستخدم"
                    placeholder="اسم المستخدم"
                />
                <AppInputField
                    v-if="!employeeId"
                    v-model="form.password"
                    label="كلمة المرور"
                    placeholder="كلمة المرور"
                    type="password"
                />
            </div>
        </div>
        <div class="flex justify-end mt-2">
            <BaseButton 
                variant="solid" 
                class="gap-2" 
                color="primary" 
                rounded="sm" 
                :loading="isLoading"
                :disabled="isLoading"
                @click="submitEmployee"
            >
                {{ employeeId ? 'تعديل' : 'اضافة' }}
            </BaseButton>
            
        </div>
    </div>
</template>

<style scoped>
    .container {
        @apply bg-white rounded-lg p-4;
    }
</style>