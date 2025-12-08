import type { TableHeader } from '~/components/app-table/types'

export const tableHeader = (): TableHeader[] => {
    return [
        {
            label: 'الاسم',
            key: 'name',
        },
        {
            label: 'الوصف',
            key: 'description',
        },
        {
            label: 'دور النظام',
            key: 'isSystemRole',
        },
        {
            label: 'الحالة',
            key: 'isActive',
        },
        {
            label: 'عدد الصلاحيات',
            key: 'permissions',
        },
    ]
}

