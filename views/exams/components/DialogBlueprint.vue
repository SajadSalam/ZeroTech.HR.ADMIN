<script lang="ts" setup>
import type { Organization } from "~/views/orgaization/types";
import type { Group } from "../types";
import ShowBlueprint from "~/views/blueprint/components/ShowBlueprint.vue";

const props = defineProps<{
  modelValue: boolean
  blueprintId: number
}>()

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>()

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
})

</script>

<template>
  <AppDialog v-model="dialogVisible" :title="$t('blueprint')" size="3xl" overflowY="visible">
    
    <div
      v-if="blueprintId"
      class="p-4 max-h-[70vh] overflow-y-auto "
    >
      <ShowBlueprint :blueprintId="blueprintId" />
    </div>

    <div v-else class="p-4 text-center text-gray-500">
      {{ $t("no_structures_found") }}
    </div>

  </AppDialog>
</template>
