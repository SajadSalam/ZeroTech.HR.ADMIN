<script setup lang="ts">
import AuditLog from '~/components/global/AuditLogDialog.vue';

// Provide the shared ref at the layout level so both AuditLog and AuditLogBtn can access it
const isAuditLogDialogOpen = ref(false)
provide('isAuditLogDialogOpen', isAuditLogDialogOpen)
</script>

<template>
  <TairoCollapseLayout>
    <slot />
  </TairoCollapseLayout>
  <AuditLog />
</template>
