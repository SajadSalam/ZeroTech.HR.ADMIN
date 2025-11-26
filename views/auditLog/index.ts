export const auditLogActions = {
  1: {
    name: 'انشاء',
    color: 'green',
  },
  2: {
    name: 'تحديث',
    color: 'blue',
  },
  3: {
    name: 'حذف',
    color: 'red',
  },
}

export const getAuditLogActionIcon = (action: number) => {
  switch (action) {
    case 1:
        return 'material-symbols:edit'
    case 2:
        return 'pepicons-pop:repeat'
    case 3:
        return 'ph-x'
  }
}