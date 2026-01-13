<script setup lang="ts">
import DotLoading from '~/components/DotLoading.vue';
import { fakeData } from '~/views/employees';
import Attachments from '~/views/employees/components/Attachments.vue';
import EmployeeDetailSection from '~/views/employees/components/EmployeeDetailSection.vue';
import UploadFiles from '~/views/employees/components/dialogs/UploadFiles.vue';
import Leaves from '~/views/employees/components/Leaves.vue';
import ProfileHeader from '~/views/employees/components/ProfileHeader.vue';
import StatsCard from '~/views/employees/components/StatsCard.vue';
import { useEmployeeStore } from '~/views/employees/store';
import type { EmployeeDto } from '~/views/employees/types';

const employee = ref<EmployeeDto | null>(null)
definePageMeta({
    title: `تفاصيل الموظف `,
    description: `تفاصيل الموظف في النظام`,
})
interface card {
    label: string
    value: string
    icon?: string

}
const employeeStore = useEmployeeStore()
const isLoading = computed(() => employeeStore.isLoading)
const employeeInfo= ref<card[]>([])
const personalInfo= ref<card[]>([])
const salaryInfo= ref<card[]>([])

const employeeId = useRoute().params.id
onMounted(async () => {
    employee.value = await employeeStore.getEmployeeById(employeeId)
    personalInfo.value = [
        {
            label: 'الاسم',
            value: employee.value?.fullName,
        },
        {
            label: 'البريد الإلكتروني',
            value: employee.value?.email,
        },
        {
            label: 'رقم الهاتف',
            value: employee.value?.phone,
        },
        {
            label: 'رقم الهوية',
            value: employee.value?.identityNumber,
        }]
    employeeInfo.value = [
        {
            label: 'الراتب',
            value: formatPrice(employee.value?.salary),
        },
        {
            label: 'الرقم الوظيفي',
            value: employee.value?.employeeNumber,
        },
        {
            label: 'القسم',
            value: employee.value?.department?.name,
        },
        {
            label: 'الوظيفة',
            value: employee.value?.jobTitle,
        },
       ]
})
</script>

<template>
    <div class="flex flex-col gap-4 mb-4" v-if="!isLoading">
        <ProfileHeader :profileData="employee" />
        <EmployeeDetailSection :employee="employee" />
        <StatsCard :stats="personalInfo" title="المعلومات الشخصية" :span="4" />
        <StatsCard :stats="employeeInfo" title="المعلومات الوظيفية" :span="4" />
        <!-- <StatsCard :stats="salaryInfo" title="الراتب و المستحقات" :span="3" /> -->
        <Leaves :leavesData="fakeData[0].leaves" />
        <Attachments :attachments="employee?.attachments" />
        <UploadFiles />
    </div>
    <div v-else class="flex justify-center items-center h-full">
        <DotLoading />
    </div>
</template>