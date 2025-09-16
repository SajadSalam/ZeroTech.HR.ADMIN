<script lang="ts" setup>
import type { Organization } from "~/views/orgaization/types";

const props = defineProps<{
  modelValue: boolean
  title: string
  structures: Organization[]
}>()

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

// Create a writable proxy for v-model
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
})

// Compute if there are any structures to display
const hasStructures = computed(() => props.structures?.length > 0)
</script>

<template>
  <AppDialog v-model="dialogVisible" :title="title" size="3xl" overflowY="visible">
    <div
      v-if="hasStructures"
      class="p-4 max-h-[70vh] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3"
    >
      <span
        v-for="org in structures"
        :key="org.id"
        class="truncate rounded-full bg-gray-200 px-3 py-2 text-center text-sm"
      >
        {{ org.fullNameAr }}
      </span>
    </div>
    <div v-else class="p-4 text-center text-gray-500">
      {{ $t("no_structures_found") }}
    </div>
  </AppDialog>
</template>
