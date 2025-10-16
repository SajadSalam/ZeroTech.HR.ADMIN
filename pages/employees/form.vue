<script setup lang="ts">
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue';
import AppInputField from '~/components/app-field/AppInputField.vue';
import AppFileField from '~/components/app-field/AppFileField.vue';
import { useEmployeeStore } from '~/views/employees/store';
definePageMeta({
  title: 'إضافة موظف جديد',
  description: 'إضافة موظف جديد في النظام',
})
const employeeStore = useEmployeeStore()
const isLoading = computed(() => employeeStore.isLoading)
interface Shift {
    id: number
    startTime: string
    endTime: string
}

const form = ref({
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
})

const addEmployee = async () => {
    await employeeStore.createEmployee(form.value)
    useRouter().push('/employees')
}
</script>
<template>
    <div class="flex flex-col gap-6 mb-4">
        <div>
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
        <div>
            <div class="mb-2 text-lg font-bold">المعلومات الوظيفية</div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AppInputField
                    v-model="form.employeeNumber"
                    label="الرقم الوظيفي"
                    placeholder="الرقم الوظيفي"
                />
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
                <AppInputField
                    v-model="form.jobTitle"
                    label="المسمى الوظيفي"
                    placeholder="المسمى الوظيفي"
                />
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
        <div>
            <div class="mb-2 text-lg font-bold">معلومات حساب النظام</div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AppInputField
                    v-model="form.password"
                    label="كلمة المرور"
                    placeholder="كلمة المرور"
                    type="password"
                />
                <AppInputField
                    v-model="form.username"
                    label="اسم المستخدم"
                    placeholder="اسم المستخدم"
                />
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
            </div>
        </div>

        <!-- <div>
            <div class="mb-2 text-lg font-bold">الوثائق</div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <div class="mb-2 text-sm font-medium text-gray-700">الصورة الشخصية</div>
                    <AppFileField
                        v-model="form.personalPhoto"
                        accept="image/*"
                    />
                </div>
                <div>
                    <div class="mb-2 text-sm font-medium text-gray-700">الشهادات</div>
                    <AppFileField
                        v-model="form.certificates"
                        accept="application/pdf,image/*"
                        :multiple="true"
                    />
                </div>
                <div>
                    <div class="mb-2 text-sm font-medium text-gray-700">صورة الهوية</div>
                    <AppFileField
                        v-model="form.idPhoto"
                        accept="image/*"
                    />
                </div>
            </div>
        </div> -->
        <div class="flex justify-end mt-2">
            <BaseButton 
                variant="solid" 
                class="gap-2" 
                color="primary" 
                rounded="sm" 
                :loading="isLoading"
                :disabled="isLoading"
                @click="addEmployee"
            >
                اضافة 
            </BaseButton>
            
        </div>
    </div>
</template>