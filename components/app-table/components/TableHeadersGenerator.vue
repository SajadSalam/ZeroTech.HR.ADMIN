<script lang="ts" setup>
import type { TableHeader } from '../types'

interface Props {
  headers: TableHeader[]
}
const props = defineProps<Props>()
const headers = computed(() => props.headers)
const slots = useSlots()
const hasSlot = (name: string) => !!slots[name]
</script>
<template>
  <tr>
    <th
      v-for="header in headers"
      :key="header.key"
      uppercase
      spaced
      :class="`${header.center ? 'text-center' : 'text-start'}`"
    >
      <div v-if="!hasSlot(`header-${header.key}`)" :id="`header-${header.key}`" class="flex  gap-2">
        <Icon v-if="header.icon" :name="header.icon" class="size-4" />
        {{ header.label }}
      </div>
      <slot v-else :name="`header-${header.key}`" />
    </th>
  </tr>
</template>
