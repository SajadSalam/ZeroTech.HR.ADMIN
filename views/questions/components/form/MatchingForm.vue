<script setup lang="ts">
import type { MatchingLeftItemRequest, MatchingRightItemRequest } from '../../types/request'

interface Props {
  leftItems: MatchingLeftItemRequest[]
  rightItems: MatchingRightItemRequest[]
  disabled?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:leftItems': [items: MatchingLeftItemRequest[]]
  'update:rightItems': [items: MatchingRightItemRequest[]]
  'add-pair': []
  'remove-pair': [index: number]
  'add-right-item': []
  'remove-right-item': [index: number]
}>()

const localLeftItems = computed({
  get: () => props.leftItems,
  set: (value) => emit('update:leftItems', value),
})

const localRightItems = computed({
  get: () => props.rightItems,
  set: (value) => emit('update:rightItems', value),
})

const canRemovePair = computed(() => props.leftItems.length > 2)
const canRemoveRightItem = computed(() => props.rightItems.length > props.leftItems.length)

const updateLeftItemText = (index: number, text: string) => {
  const updated = [...localLeftItems.value]
  updated[index] = { ...updated[index], text }
  localLeftItems.value = updated
}

const updateRightItemText = (index: number, text: string) => {
  const updated = [...localRightItems.value]
  updated[index] = { ...updated[index], text }
  localRightItems.value = updated
}

const updateLeftItemMatch = (index: number, rightItemId: string) => {
  const updated = [...localLeftItems.value]
  updated[index] = { ...updated[index], correctRightItemId: rightItemId }
  localLeftItems.value = updated
}

// Get label for left items (A, B, C...)
const getLeftLabel = (index: number): string => {
  return String.fromCharCode(65 + index)
}

// Get label for right items (1, 2, 3...)
const getRightLabel = (index: number): string => {
  return String(index + 1)
}

// Get right item by ID
const getRightItemById = (id: string) => {
  return props.rightItems.find((item) => item.id === id)
}

// Get label for a right item by its ID
const getRightLabelById = (id: string): string => {
  const index = props.rightItems.findIndex((item) => item.id === id)
  return index >= 0 ? getRightLabel(index) : '?'
}

// Check if a right item is matched by any left item
const isRightItemMatched = (rightItemId: string): boolean => {
  return props.leftItems.some((item) => item.correctRightItemId === rightItemId)
}

// Validation: Check if all left items have valid matches
const hasValidMatches = computed(() => {
  return props.leftItems.every((left) =>
    props.rightItems.some((right) => right.id === left.correctRightItemId)
  )
})

// Validation: Check if there are orphan right items (no left item points to them)
const orphanRightItems = computed(() => {
  return props.rightItems.filter((right) => !isRightItemMatched(right.id))
})
</script>

<template>
  <div class="matching-form space-y-6">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-muted-700 dark:text-muted-200">
        {{ $t('matching-pairs') }}
      </h3>
      <BaseTag color="primary" variant="pastel" class="text-xs">
        {{ $t('match-left-to-right') }}
      </BaseTag>
    </div>

    <p class="text-sm text-muted-500">
      {{ $t('matching-instructions') }}
    </p>

    <!-- Main Matching Grid -->
    <div class="grid gap-6 lg:grid-cols-2">
      <!-- Left Column (Questions) -->
      <div class="space-y-4">
        <div class="flex items-center gap-2">
          <div class="h-3 w-3 rounded-full bg-primary-500" />
          <h4 class="font-medium text-muted-700 dark:text-muted-200">
            {{ $t('left-items-questions') }}
          </h4>
        </div>

        <TransitionGroup name="list" tag="div" class="space-y-3">
          <div
            v-for="(item, index) in localLeftItems"
            :key="index"
            class="group relative rounded-xl border-2 border-muted-200 bg-white p-4 transition-all duration-300 hover:border-primary-300 dark:border-muted-700 dark:bg-muted-800 dark:hover:border-primary-500"
          >
            <div class="flex items-start gap-3">
              <!-- Label Badge -->
              <div
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-500 text-sm font-bold text-white shadow-lg shadow-primary-500/30"
              >
                {{ getLeftLabel(index) }}
              </div>

              <div class="flex-1 space-y-3">
                <!-- Left Item Text -->
                <BaseInput
                  :model-value="item.text"
                  :placeholder="$t('enter-left-item-text')"
                  :disabled="disabled"
                  class="w-full"
                  @update:model-value="updateLeftItemText(index, $event as string)"
                />

                <!-- Match Selector -->
                <div class="flex items-center gap-2">
                  <span class="text-sm text-muted-500">
                    {{ $t('matches-with') }}:
                  </span>
                  <select
                    :value="item.correctRightItemId"
                    :disabled="disabled"
                    class="rounded-lg border border-muted-300 bg-white px-3 py-2 text-sm transition-colors focus:border-primary-500 focus:outline-none dark:border-muted-600 dark:bg-muted-700"
                    @change="updateLeftItemMatch(index, ($event.target as HTMLSelectElement).value)"
                  >
                    <option value="" disabled>
                      {{ $t('select-match') }}
                    </option>
                    <option
                      v-for="(rightItem, rightIndex) in localRightItems"
                      :key="rightItem.id"
                      :value="rightItem.id"
                    >
                      {{ getRightLabel(rightIndex) }}: {{ rightItem.text || $t('empty') }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Remove Button -->
              <button
                v-if="canRemovePair"
                type="button"
                class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-transparent text-muted-400 opacity-0 transition-all duration-200 hover:bg-danger-100 hover:text-danger-500 group-hover:opacity-100 dark:hover:bg-danger-500/20"
                :disabled="disabled"
                :title="$t('remove-pair')"
                @click="$emit('remove-pair', index)"
              >
                <Icon name="ph:trash" class="size-5" />
              </button>
            </div>
          </div>
        </TransitionGroup>

        <!-- Add Pair Button -->
        <BaseButton
          color="primary"
          variant="pastel"
          :disabled="disabled"
          class="w-full"
          @click="$emit('add-pair')"
        >
          <Icon name="ph:plus-circle" class="me-2 size-5" />
          {{ $t('add-matching-pair') }}
        </BaseButton>
      </div>

      <!-- Right Column (Answers) -->
      <div class="space-y-4">
        <div class="flex items-center gap-2">
          <div class="h-3 w-3 rounded-full bg-success-500" />
          <h4 class="font-medium text-muted-700 dark:text-muted-200">
            {{ $t('right-items-answers') }}
          </h4>
        </div>

        <TransitionGroup name="list" tag="div" class="space-y-3">
          <div
            v-for="(item, index) in localRightItems"
            :key="item.id"
            class="group relative rounded-xl border-2 p-4 transition-all duration-300"
            :class="{
              'border-success-500 bg-success-50 dark:bg-success-500/10': isRightItemMatched(item.id),
              'border-muted-200 bg-white hover:border-success-300 dark:border-muted-700 dark:bg-muted-800 dark:hover:border-success-500': !isRightItemMatched(item.id),
            }"
          >
            <div class="flex items-center gap-3">
              <!-- Label Badge -->
              <div
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-lg"
                :class="{
                  'bg-success-500 shadow-success-500/30': isRightItemMatched(item.id),
                  'bg-muted-400 shadow-muted-400/30': !isRightItemMatched(item.id),
                }"
              >
                {{ getRightLabel(index) }}
              </div>

              <!-- Right Item Input -->
              <div class="flex-1">
                <BaseInput
                  :model-value="item.text"
                  :placeholder="$t('enter-right-item-text')"
                  :disabled="disabled"
                  class="w-full"
                  @update:model-value="updateRightItemText(index, $event as string)"
                />
              </div>

              <!-- Match indicator -->
              <div
                v-if="isRightItemMatched(item.id)"
                class="flex items-center gap-1 text-sm text-success-600 dark:text-success-400"
              >
                <Icon name="ph:link" class="size-4" />
                <span>
                  {{ localLeftItems.filter((l) => l.correctRightItemId === item.id).map((l) => getLeftLabel(localLeftItems.indexOf(l))).join(', ') }}
                </span>
              </div>

              <!-- Remove Button (only for extra right items) -->
              <button
                v-if="canRemoveRightItem && !isRightItemMatched(item.id)"
                type="button"
                class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-transparent text-muted-400 opacity-0 transition-all duration-200 hover:bg-danger-100 hover:text-danger-500 group-hover:opacity-100 dark:hover:bg-danger-500/20"
                :disabled="disabled"
                :title="$t('remove-item')"
                @click="$emit('remove-right-item', index)"
              >
                <Icon name="ph:trash" class="size-5" />
              </button>
            </div>
          </div>
        </TransitionGroup>

        <!-- Add Extra Right Item Button -->
        <BaseButton
          color="success"
          variant="pastel"
          :disabled="disabled"
          class="w-full"
          @click="$emit('add-right-item')"
        >
          <Icon name="ph:plus-circle" class="me-2 size-5" />
          {{ $t('add-distractor') }}
        </BaseButton>

        <p class="text-xs text-muted-400">
          {{ $t('distractor-hint') }}
        </p>
      </div>
    </div>

    <!-- Connection Preview -->
    <div class="rounded-xl bg-muted-100 p-4 dark:bg-muted-800/50">
      <h4 class="mb-3 text-sm font-semibold text-muted-600 dark:text-muted-300">
        {{ $t('matching-preview') }}
      </h4>
      <div class="space-y-2">
        <div
          v-for="(item, index) in localLeftItems"
          :key="index"
          class="flex items-center gap-3 text-sm"
        >
          <span class="flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 text-xs font-bold text-white">
            {{ getLeftLabel(index) }}
          </span>
          <span class="max-w-[200px] truncate text-muted-700 dark:text-muted-200">
            {{ item.text || $t('empty') }}
          </span>
          <Icon name="ph:arrow-right" class="size-4 text-muted-400" />
          <span class="flex h-6 w-6 items-center justify-center rounded-full bg-success-500 text-xs font-bold text-white">
            {{ getRightLabelById(item.correctRightItemId) }}
          </span>
          <span class="max-w-[200px] truncate text-muted-700 dark:text-muted-200">
            {{ getRightItemById(item.correctRightItemId)?.text || $t('not-selected') }}
          </span>
        </div>
      </div>
    </div>

    <!-- Validation Warnings -->
    <div
      v-if="!hasValidMatches"
      class="flex items-center gap-2 rounded-lg bg-warning-50 p-3 text-sm text-warning-600 dark:bg-warning-500/10 dark:text-warning-400"
    >
      <Icon name="ph:warning" class="size-5" />
      {{ $t('matching-invalid-references') }}
    </div>

    <div
      v-if="orphanRightItems.length > 0"
      class="flex items-center gap-2 rounded-lg bg-info-50 p-3 text-sm text-info-600 dark:bg-info-500/10 dark:text-info-400"
    >
      <Icon name="ph:info" class="size-5" />
      {{ $t('orphan-right-items', { count: orphanRightItems.length }) }}
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
  transform: translateX(-30px);
}

.list-move {
  transition: transform 0.3s ease;
}
</style>

