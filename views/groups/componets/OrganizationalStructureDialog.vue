<script lang="ts" setup>
import type { Organization } from "~/views/orgaization/types";
import type { Group } from "../types";

const props = defineProps<{
  modelValue: boolean
  title: string
  structures?: Organization[]
  groups?: Group[]
}>()

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>()

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
})

// Check which list to display
// const displayList = computed(() => {
//   if (props.structures && props.structures.length > 0) return props.structures
//   if (props.groups && props.groups.length > 0) return props.groups
//   return []
// })

const isStructureMode = computed(() => props.structures && props.structures.length > 0)
</script>

<template>
  <AppDialog v-model="dialogVisible" :title="title" size="3xl" overflowY="visible">
    
    <div
      v-if="isStructureMode ? structures.length : groups.length"
      class="p-4 max-h-[70vh] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3"
    >
      <span
        v-for="item in isStructureMode ? structures : groups"
        :key="isStructureMode ? item.id : item.id"
        class="truncate rounded-full bg-gray-200 px-3 py-2 text-center text-sm"
      >
        {{ isStructureMode ? item.fullNameAr : item.name }}
      </span>
    </div>

    <div v-else class="p-4 text-center text-gray-500">
      {{ $t("no_structures_found") }}
    </div>

  </AppDialog>
</template>
