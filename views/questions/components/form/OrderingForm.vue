<script setup lang="ts">
import type { QuestionOrderingItemRequest } from '../../types/request'

interface Props {
  items: QuestionOrderingItemRequest[]
  disabled?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:items': [items: QuestionOrderingItemRequest[]]
  'add-item': []
  'remove-item': [index: number]
}>()

const localItems = computed({
  get: () => props.items,
  set: (value) => emit('update:items', value),
})

const canRemove = computed(() => props.items.length > 2)

const updateItemText = (index: number, text: string) => {
  const updated = [...localItems.value]
  updated[index] = { ...updated[index], text }
  localItems.value = updated
}

const updateItemOrder = (index: number, orderIndex: number) => {
  const updated = [...localItems.value]
  updated[index] = { ...updated[index], correctOrderIndex: orderIndex }
  localItems.value = updated
}

// Drag and drop support
const draggedIndex = ref<number | null>(null)

const handleDragStart = (index: number) => {
  if (props.disabled) return
  draggedIndex.value = index
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
}

const handleDrop = (targetIndex: number) => {
  if (props.disabled || draggedIndex.value === null) return
  
  const sourceIndex = draggedIndex.value
  if (sourceIndex === targetIndex) return

  const updated = [...localItems.value]
  const [removed] = updated.splice(sourceIndex, 1)
  updated.splice(targetIndex, 0, removed)
  
  // Update order indices after reordering
  updated.forEach((item, i) => {
    updated[i] = { ...item, correctOrderIndex: i + 1 }
  })
  
  localItems.value = updated
  draggedIndex.value = null
}

const handleDragEnd = () => {
  draggedIndex.value = null
}

// Move item up/down with buttons
const moveItem = (index: number, direction: 'up' | 'down') => {
  if (props.disabled) return
  
  const targetIndex = direction === 'up' ? index - 1 : index + 1
  if (targetIndex < 0 || targetIndex >= localItems.value.length) return

  const updated = [...localItems.value]
  const temp = updated[index]
  updated[index] = updated[targetIndex]
  updated[targetIndex] = temp

  // Update order indices
  updated.forEach((item, i) => {
    updated[i] = { ...item, correctOrderIndex: i + 1 }
  })

  localItems.value = updated
}

// Check if order is sequential and valid
const isOrderValid = computed(() => {
  const orders = localItems.value.map((item) => item.correctOrderIndex)
  const sorted = [...orders].sort((a, b) => a - b)
  return sorted.every((val, idx) => val === idx + 1)
})
</script>

<template>
  <div class="ordering-form space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-muted-700 dark:text-muted-200">
        {{ $t('ordering-items') }}
      </h3>
      <BaseTag color="primary" variant="pastel" class="text-xs">
        {{ $t('drag-to-reorder') }}
      </BaseTag>
    </div>

    <p class="text-sm text-muted-500">
      {{ $t('ordering-instructions') }}
    </p>

    <TransitionGroup name="list" tag="div" class="space-y-3">
      <div
        v-for="(item, index) in localItems"
        :key="index"
        class="group relative flex items-center gap-3 rounded-xl border-2 border-muted-200 bg-white p-4 transition-all duration-300 hover:border-primary-300 dark:border-muted-700 dark:bg-muted-800 dark:hover:border-primary-500"
        :class="{
          'border-primary-500 bg-primary-50 dark:bg-primary-500/10': draggedIndex === index,
        }"
        draggable="true"
        @dragstart="handleDragStart(index)"
        @dragover="handleDragOver"
        @drop="handleDrop(index)"
        @dragend="handleDragEnd"
      >
        <!-- Drag Handle -->
        <div
          class="flex cursor-grab items-center text-muted-400 active:cursor-grabbing"
          :class="{ 'cursor-not-allowed': disabled }"
        >
          <Icon name="ph:dots-six-vertical" class="size-6" />
        </div>

        <!-- Order Number Badge -->
        <div
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-500 text-sm font-bold text-white shadow-lg shadow-primary-500/30"
        >
          {{ item.correctOrderIndex }}
        </div>

        <!-- Item Input -->
        <div class="flex-1">
          <BaseInput
            :model-value="item.text"
            :placeholder="$t('enter-ordering-item-text')"
            :disabled="disabled"
            class="w-full"
            @update:model-value="updateItemText(index, $event as string)"
          />
        </div>

        <!-- Order Controls -->
        <div class="flex shrink-0 items-center gap-1">
          <!-- Move Up -->
          <button
            type="button"
            class="flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-muted-400 transition-all duration-200 hover:bg-muted-100 hover:text-muted-600 disabled:opacity-30 dark:hover:bg-muted-700"
            :disabled="disabled || index === 0"
            :title="$t('move-up')"
            @click="moveItem(index, 'up')"
          >
            <Icon name="ph:caret-up" class="size-5" />
          </button>

          <!-- Move Down -->
          <button
            type="button"
            class="flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-muted-400 transition-all duration-200 hover:bg-muted-100 hover:text-muted-600 disabled:opacity-30 dark:hover:bg-muted-700"
            :disabled="disabled || index === localItems.length - 1"
            :title="$t('move-down')"
            @click="moveItem(index, 'down')"
          >
            <Icon name="ph:caret-down" class="size-5" />
          </button>

          <!-- Remove Button -->
          <button
            v-if="canRemove"
            type="button"
            class="flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-muted-400 opacity-0 transition-all duration-200 hover:bg-danger-100 hover:text-danger-500 group-hover:opacity-100 dark:hover:bg-danger-500/20"
            :disabled="disabled"
            :title="$t('remove-item')"
            @click="$emit('remove-item', index)"
          >
            <Icon name="ph:trash" class="size-5" />
          </button>
        </div>
      </div>
    </TransitionGroup>

    <!-- Add Item Button -->
    <div class="pt-2">
      <BaseButton
        color="primary"
        variant="pastel"
        :disabled="disabled"
        class="w-full"
        @click="$emit('add-item')"
      >
        <Icon name="ph:plus-circle" class="me-2 size-5" />
        {{ $t('add-ordering-item') }}
      </BaseButton>
    </div>

    <!-- Preview Section -->
    <div class="mt-6 rounded-xl bg-muted-100 p-4 dark:bg-muted-800/50">
      <h4 class="mb-3 text-sm font-semibold text-muted-600 dark:text-muted-300">
        {{ $t('correct-order-preview') }}
      </h4>
      <div class="flex flex-wrap gap-2">
        <div
          v-for="(item, index) in [...localItems].sort((a, b) => a.correctOrderIndex - b.correctOrderIndex)"
          :key="index"
          class="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm shadow-sm dark:bg-muted-700"
        >
          <span class="flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 text-xs font-bold text-white">
            {{ item.correctOrderIndex }}
          </span>
          <span class="text-muted-700 dark:text-muted-200">
            {{ item.text || $t('empty') }}
          </span>
        </div>
      </div>
    </div>

    <!-- Validation Warning -->
    <div
      v-if="!isOrderValid"
      class="flex items-center gap-2 rounded-lg bg-warning-50 p-3 text-sm text-warning-600 dark:bg-warning-500/10 dark:text-warning-400"
    >
      <Icon name="ph:warning" class="size-5" />
      {{ $t('ordering-sequence-invalid') }}
    </div>
  </div>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.list-move {
  transition: transform 0.3s ease;
}
</style>

