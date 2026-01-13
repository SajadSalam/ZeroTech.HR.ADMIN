import type { TableHeader } from '~/components/app-table/types'

export const tableHeader = (): TableHeader[] => {
    return [
        {
            label: 'اسم المستخدم',
            key: 'username',
        },
        {
            label: 'الاسم الكامل',
            key: 'fullName',
        },
        {
            label: 'البريد الإلكتروني',
            key: 'email',
        },
        {
            label: 'رقم الهاتف',
            key: 'phoneNumber',
        },
        {
            label: 'آخر تسجيل دخول',
            key: 'lastLoginAt',
        },
        {
            label: 'الحالة',
            key: 'isActive',
        },
        {
            label: 'حالة التقييد',
            key: 'isLockedOut',
        },
        {
            label: 'الإجراءات',
            key: 'actions',
        },
    ]
}

