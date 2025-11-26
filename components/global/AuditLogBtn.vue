<script setup lang="ts">
import { useAuditLogStore } from '~/views/auditLog/store'
const props = defineProps<{
    entityType?: string
    entityId?: string
}>()
const auditLogStore = useAuditLogStore()

const toggleAuditLogDialogVisibility = () => {
    if (props.entityType) {
        auditLogStore.filters.entityType = props.entityType
    }
    if (props.entityId) {
        auditLogStore.filters.entityId = props.entityId
    }
    auditLogStore.toggleAuditLogDialogVisibility()
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