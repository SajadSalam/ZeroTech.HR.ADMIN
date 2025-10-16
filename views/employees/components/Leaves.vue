<script setup lang="ts">
import AppTable from '~/components/app-table/AppTable.vue';

const leavesData = ref([
    {
        date: '2025-01-01',
        inTime: '08:00',
        outTime: '17:00',
        status: 0,
    },
    {
        date: '2025-01-01',
        inTime: '08:00',
        outTime: '17:00',
        status: 0,
    },  
    {
        date: '2025-01-01',
        inTime: '08:00',
        outTime: '17:00',
        status: 0,
    },
]);
const tableHeader = [
    {
        key: 'date',
        label: 'التاريخ',
    },
    {
        key: 'inTime',
        label: 'وقت الدخول',
    },
    {
        key: 'outTime',
        label: 'وقت الخروج',
    },
    {
        key: 'status',
        label: 'الحالة',
    },
]
</script>

<template>
    <div class="">سجل الحضور و الانصراف</div>
        <AppTable
        title="الأقسام"
        :headers="tableHeader"
        :items="leavesData"
        :is-loading="isLoading"
      >
      <template #data-status="{ item }">
   <BaseTag color="success" variant="pastel">
        {{ item.status === 0 ? 'حضور' : 'غير موجود' }}
    </BaseTag>
  </template>
</AppTable>
</template>