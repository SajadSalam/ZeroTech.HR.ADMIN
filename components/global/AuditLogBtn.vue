<script setup lang="ts">
import { useAuditLogStore } from '~/views/auditLog/store'
const props = defineProps<{
    entityType?: string
    entityId?: string
}>()
const isAuditLogDialogOpen = inject<Ref<boolean>>('isAuditLogDialogOpen')
const auditLogStore = useAuditLogStore()
if (!isAuditLogDialogOpen) {
    throw new Error('isAuditLogDialogOpen must be provided by a parent component')
}

const toggleAuditLogDialogVisibility = () => {
    if (props.entityType) {
        auditLogStore.filters.entityType = props.entityType
    }
    if (props.entityId) {
        auditLogStore.filters.entityId = props.entityId
    }
    isAuditLogDialogOpen.value = !isAuditLogDialogOpen.value
}
</script>
<template>
    <BaseButtonIcon
      variant="pastel"
      class="size-9"
      color="none"
      size="sm"
      rounded="full"
      @click="toggleAuditLogDialogVisibility"
    >
      <Icon name="tabler-history" class="size-8 text-primary-500" />
    </BaseButtonIcon>
</template>