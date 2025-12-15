<script lang="ts" setup>
import type { Organization } from "~/views/orgaization/types";
import type { GroupDto } from "../types";

const props = defineProps<{
  modelValue: boolean
  title: string
  structures?: Organization[]
  groups?: GroupDto[]
}>()

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>()

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
})

const isStructureMode = computed(() => props.structures && props.structures.length > 0)
const items = computed(() =>
  isStructureMode.value ? props.structures : props.groups
)

const hasItems = computed(() =>
  items.value && items.value.length > 0
)

const getItemLabel = (item: Organization | GroupDto) => {
  return 'name' in item ? item.name : item.title
}
</script>

<template>
  <AppDialog v-model="dialogVisible" :title="title" size="3xl" overflowY="visible">
    
    <div
      v-if="hasItems"
      class="p-4 max-h-[70vh] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3"
    >
      <span
        v-for="item in items"
        :key="item?.id"
        class="rounded-full bg-gray-200 px-3 py-2 text-center text-sm"
      >
        {{ getItemLabel(item) }}
      </span>
    </div>

    <div v-else class="p-4 text-center text-gray-500">
      {{ $t("no_structures_found") }}
    </div>

  </AppDialog>
</template>
