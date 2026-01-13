import type { TableHeader } from '~/components/app-table/types'
import { BalanceType } from './types'

export const tableHeader = (): TableHeader[] => [
    {
        label: 'نوع الرصيد',
        key: 'balanceType',
    },
    {
        label: 'الرصيد المخصص',
        key: 'allocatedBalance',
    },
    {
        label: 'الرصيد الحالي',
        key: 'currentBalance',
    },
    {
        label: 'الرصيد المعلق',
        key: 'pendingBalance',
    },
    {
        label: 'الرصيد المتاح',
        key: 'availableBalance',
    },
    {
        label: 'تاريخ بداية الفترة',
        key: 'periodStartDate',
    },
    {
        label: 'تاريخ نهاية الفترة',
        key: 'periodEndDate',
    },
    {
        label: 'ملاحظات',
        key: 'notes',
    },
    {
        label: 'الحالة',
        key: 'isActive',
    },
    {
        label: 'الإجراءات',
        key: 'actions',
    },
]

export const balanceTypes = [
    {
        label: 'اجازات السنوية',
        value: BalanceType.ANNUAL,
    },
    {
        label: 'المرضية',
        value: BalanceType.SICK,
    },
    {
        label: 'الرصيد الشخصي',
        value: BalanceType.PERSONAL,
    },
    {
        label: 'الامومة',
        value: BalanceType.MATERNITY,
    },
    {
        label: 'الأبوبة',
        value: BalanceType.PATERNITY,
    },
]