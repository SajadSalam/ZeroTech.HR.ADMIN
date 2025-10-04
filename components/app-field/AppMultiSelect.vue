<script setup lang="ts" generic="T extends Record<string, any>">
import type { ValidateError } from 'async-validator'

const props = defineProps<{
  modelValue: any
  label?: string
  items: T[]
  multiple?: boolean
  labelKey?: string
  valueKey?: string
  errorMessages?: ValidateError[]
  placeholder?: string
  disabled?: boolean
  selectedItems?: T[]
}>()

const emit = defineEmits(['update:modelValue'])

const computedItems = computed(() => props.items)

const isOpen = ref(false)
const query = ref('')

const selectedItems = ref<T[]>(props.selectedItems ?? [])

const dropdown = ref<HTMLDivElement | null>(null)
const button = ref<HTMLButtonElement | null>(null)

onClickOutside([dropdown], () => {
  isOpen.value = false
})

const filteredItems = computed(() => {
  const labelKey = props.labelKey ?? 'name'
  const valueKey = props.valueKey ?? 'id'

  return computedItems.value.filter((item) => {
    const isSelected = selectedItems.value.some(
      (selectedItem) => selectedItem[valueKey] === item[valueKey]
    )
    return !isSelected && item[labelKey]?.toLowerCase().includes(query.value.toLowerCase())
  })
})

onMounted(() => {
  watch(
    () => props.modelValue,
    (value) => {
      const valueKey = props.valueKey ?? 'id'

      if (value !== null) {
        const newSelectedItems = props.multiple
          ? props.items.filter((item) => value.includes(item[valueKey]))
          : ([props.items.find((item) => item[valueKey] === value)].filter(Boolean) as T[])

        if (JSON.stringify(newSelectedItems) !== JSON.stringify(selectedItems.value))
          selectedItems.value = newSelectedItems
      } else {
        selectedItems.value = []
      }
    },
    { immediate: true, deep: true }
  )
})

watch(
  selectedItems,
  (newSelectedItems) => {
    const valueKey = props.valueKey ?? 'id'
    const newValue = props.multiple
      ? newSelectedItems.map((item) => item[valueKey])
      : newSelectedItems[0]?.[valueKey]

    if (JSON.stringify(newValue) !== JSON.stringify(props.modelValue))
      emit('update:modelValue', newValue)
  },
  { deep: true }
)

function addItem(item: T) {
  const valueKey = props.valueKey ?? 'id'
  if (props.multiple) {
    if (!selectedItems.value.some((selectedItem) => selectedItem[valueKey] === item[valueKey]))
      selectedItems.value.push(item)
  } else {
    selectedItems.value = [item]
    isOpen.value = false
  }
  query.value = ''
}

function removeItem(index: number) {
  selectedItems.value.splice(index, 1)
}
</script>

<template>
  <div class="relative flex w-full flex-col">
    <div class="mb-2">{{ label }}</div>
    <button
      ref="button"
      type="button"
      class="gap2 px4 h13 flex w-full items-center overflow-hidden rounded-2xl border bg-white py-1 text-slate-600 duration-200"
      :class="[
        disabled ? 'opacity50 cursor-not-allowed' : '',
        isOpen ? 'border-brand-primary' : 'border-slate300',
      ]"
      @click="isOpen = !isOpen"
    >
      <div
        v-for="(item, i) in selectedItems"
        :key="i"
        class="b flex min-w-max flex-wrap items-center justify-center gap-2 rounded-3xl px-2 py-1"
      >
        <span text="text-sm my4" v-text="item[labelKey ?? 'name']" />

        <BaseButtonIcon
          class="!b-0 duration-200"
          color="danger"
          rounded="full"
          size="sm"
          @click.stop="() => removeItem(i)"
        >
          <Icon name="ph-x" class="size-4" />
        </BaseButtonIcon>
      </div>
      <span
        v-if="!selectedItems.length && placeholder && !isOpen"
        text="slate400"
        px="2"
        v-text="placeholder"
      />

      <input v-model="query" type="text" class="hfull outline-none" bg="transparent" >

      <button
        type="button"
        class="flex size-8 h-full items-center text-primary-500 transition-all duration-300"
        :class="isOpen ? 'translate-x-3 rotate-180' : ''"
      >
        <Icon name="hugeicons:arrow-down-01" class="size-5" />
      </button>
    </button>

    <Transition name="slide-top">
      <div
        v-if="isOpen && !disabled"
        ref="dropdown"
        flex="~ col"
        class="top-22 z40 wfull absolute left-0 flex max-h-48 flex-col overflow-y-auto overflow-x-hidden rounded-2xl bg-muted-50"
        bg="white"
        border="~ slate300"
      >
        <button
          v-for="item in filteredItems"
          :key="item[valueKey ?? 'id']"
          type="button"
          text="slate900 "
          class="b hover:!bg-brand-primary/20 flex min-h-8 cursor-pointer items-center px-4 py-2 duration-200 first:rounded-t-2xl last:rounded-b-2xl"
          p="x3 "
          @click="() => addItem(item)"
          v-text="item[labelKey ?? 'name']"
        />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.slide-top-enter-active,
.slide-top-leave-active {
  transition: all 0.1s ease;
}

.slide-top-enter-from,
.slide-top-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
