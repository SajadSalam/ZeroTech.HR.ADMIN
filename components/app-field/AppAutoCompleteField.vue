<script lang="ts" setup generic="T, TModel">
import axiosInstance from '~/services/app-client/axios'
import type { ErrorObject } from '@vuelidate/core'
import { get } from 'lodash-es'
interface Props {
  items?: T[]
  itemLabel?: string
  itemValue?: string
  itemSubtitle?: string
  errors?: ErrorObject[]
  label?: string
  appendIcon?: string
  getUrl?: string
  fetchOnSearch?: boolean
  searchKey?: string
  multiple?: boolean
  placeholder?: string
  modelValue?: TModel
  disabled?: boolean
  allowCreate?: boolean
  oldData?: T[]
}
const emits = defineEmits(['update:objectValue', 'update:modelValue', 'create:item'])
const createNewItem = () => {
  if (!search.value.trim()) return

  const newItem = {
    [props.itemLabel!]: search.value,
    [props.itemValue!]: search.value,
    isNew: true,
  } as T

  selectItem(newItem)
  emits('create:item', newItem)
}
const props = defineProps<Props>()
const error = computed(() => {
  return props.errors?.length ? props.errors.map((e) => e.$message).join(', ') : ''
})
const pageSize = 50
defineSlots<{
  item: { item: T }
}>()
const modelValue = computed({
  get: () => props.modelValue ?? '',
  set: (value: string | string[]) => {
    emits('update:modelValue', value)
  },
})
const search = ref<string>('')
const isOpen = ref(false)
// const items = ref<T[]>(props.items || [])
const itemsRef = ref<T[]>(props.items || [])
const items = computed({
  get: () => props.items || itemsRef.value || [],
  set: (value) => {
    itemsRef.value = value
  },
})
const searchKey = computed(() => props.searchKey || 'name')
const selectedItems = ref<T[]>([])

function itemWithLabel(item: T): string {
  if (!item || !item[props.itemLabel! as keyof T]) return modelValue.value as string
  if (typeof item === 'string') return item
  if (
    item[props.itemLabel! as keyof T] !== undefined &&
    typeof item[props.itemLabel! as keyof T] === 'string'
  )
    return item[props.itemLabel! as keyof T] as string

  return modelValue.value as string
}
function itemWithSubtitle(item: T): string {
  if (typeof item === 'string') return item

  const val = get(item, props.itemSubtitle)
  if (val !== undefined && typeof val === 'string') return val as string

  return modelValue.value as string
}
function itemWithValue(item: T): string | number {
  if (!item || item[props.itemValue! as keyof T] === undefined) {
    return modelValue.value as string | number // Allow 0 as a valid value
  }
  if (typeof item === 'string') return item
  return item[props.itemValue! as keyof T] as string | number
}
const filteredItems = computed(() => {
  if (!props.fetchOnSearch)
    return items.value.filter((item) =>
      itemWithLabel(item as T)
        .toLowerCase()
        .includes(search.value.toLowerCase())
    )
  return items.value
})
const menu = ref(null)
function selectItem(item: T) {
  // if(props.disabled) return
  search.value = itemWithLabel(item)
  if (!props.multiple) {
    selectedItems.value = [item]
  } else {
    if (isItemSelected(item)) {
      removeItem(item)

      search.value = ''
      return
    }
    selectedItems.value.push(item)

    search.value = ''
  }
  isOpen.value = false
}
function removeItem(item: T) {
  selectedItems.value = selectedItems.value.filter((i) => i !== item)
}
watchDeep(
  () => selectedItems.value,
  () => {
    if (props.multiple) {
      modelValue.value = selectedItems.value.map((i) => itemWithValue(i as T))
      emits('update:objectValue', selectedItems.value)
    } else {
      if (selectedItems.value.length === 0) {
        modelValue.value = ''
        emits('update:objectValue', null)
        return
      }

      modelValue.value = itemWithValue(selectedItems.value[0] as T)

      emits('update:objectValue', selectedItems.value[0])
    }
  }
)
async function fetchData() {
  if (props.getUrl) {
    let params = { pageSize: pageSize } // default pageSize
    if (props.fetchOnSearch) {
      if (search.value) params = { ...params, [searchKey.value]: search.value }
    }
    const res = await axiosInstance.get(props.getUrl, { params })
    items.value = res.data.data
  }
}

onMounted(async () => {
  onClickOutside(menu, () => {
    isOpen.value = false
  })
  
  // For fetchOnSearch mode with an initial value, fetch the specific item(s)
  if (props.fetchOnSearch && props.getUrl && modelValue.value !== '' && modelValue.value !== null) {
    try {
      if (props.multiple && Array.isArray(modelValue.value) && modelValue.value.length > 0) {
        // For multiple selection, fetch all items first to get the selected ones
        await fetchData()
        // Find selected items from the fetched data
        const selected = items.value.filter((i) => 
          (modelValue.value as any[]).includes((i as any)[props.itemValue!])
        )
        selectedItems.value = selected as T[]
      } else if (!props.multiple) {
        // For single selection, try direct fetch first, fallback to list fetch
        try {
          const res = await axiosInstance.get(`${props.getUrl}/${modelValue.value}`)
          if (res.data) {
            items.value = [res.data]
            selectedItems.value = [res.data]
            search.value = itemWithLabel(res.data as T)
          }
        } catch (directFetchError) {
          // Fallback: fetch all items and find the selected one
          await fetchData()
          const item = items.value.find((i) => (i as any)[props.itemValue!] === modelValue.value)
          if (item) {
            selectedItems.value = [item] as T[]
            search.value = itemWithLabel(item as T)
          }
          
        }
      }
    } catch (error) {
      console.error('Error fetching initial item(s):', error)
    }
  } else {
    // For non-fetchOnSearch mode, fetch all items first
    if (props.getUrl) await fetchData()
    
    if (modelValue.value !== '' && modelValue.value !== null) {
      if (props.multiple && Array.isArray(modelValue.value)) {
        // For multiple selection
        const selected = items.value.filter((i) => 
          (modelValue.value as any[]).includes((i as any)[props.itemValue!])
        )
        selectedItems.value = selected as T[]
      } else {
        // For single selection
        const item = items.value.find((i) => (i as any)[props.itemValue!] === modelValue.value)
        if (item) {
          selectItem(item as T)
        }
      }
    }
  }
})

const slots = useSlots()
const hasSlot = (name: string) => !!slots[name]

watchDebounced(
  search,
  () => {
    if (props.fetchOnSearch) fetchData()
  },
  { debounce: 300 }
)

// Watch for when dropdown opens to fetch initial data
watch(isOpen, (newValue) => {
  if (newValue && props.fetchOnSearch && items.value.length === 0) {
    fetchData()
  }
})

const menuWidth = computed(() => {
  if (menu.value) return menu.value.clientWidth
  return 0
})

const isItemSelected = (item: T) => {
  return selectedItems.value.some((i) => itemWithValue(i) === itemWithValue(item))
}

const isAnySelected = computed(() => selectedItems.value.length > 0)
const clearSelected = () => {
  selectedItems.value = []
  search.value = ''
}
const oldData = computed(() => props.oldData)
// watchDeep(() => oldData.value,() => {
//     items.value [...oldData.value]
// })
</script>

<template>
  <div ref="menu" relative>
    <div class="relative">
      <div class="text-gray pointer-events-none absolute inset-y-0 start-0 flex items-center ps-5">
        <i :class="appendIcon" />
      </div>
      <div class="text-gray pointer-events-none absolute inset-y-0 end-5 flex items-center ps-5">
        <i
          class="i-ph-caret-down transition-all-300"
          :class="{
            'rotate-180': isOpen,
          }"
        />
      </div>
      <BaseInput
        v-model="search"
        type="text"
        :class="{
          'ps-12': appendIcon,
          'rounded-b-0': isOpen,
        }"
        :icon="isAnySelected ? 's' : null"
        :error="error"
        :disabled="props.disabled"
        :label="label"
        :placeholder="placeholder"
        @focus="isOpen = true"
      >
        <template #icon>
          <Icon
            v-if="selectedItems.length > 0"
            name="ph-x"
            class="cursor-pointer text-red-500"
            size="20"
            @click="clearSelected"
          />
        </template>
      </BaseInput>
      <div v-if="props.multiple" class="flex max-w-[full] mt-2 overflow-x-auto gap-2 scrollbar-hide">
  <BaseTag
    v-for="item in selectedItems"
    :key="itemWithValue(item)"
    color="primary"
    variant="pastel"
    class="flex shrink-0 items-center gap-2 text-lg"
  >
    <div>
      <p>
        {{ itemWithLabel(item) }}
      </p>
      <small v-if="props.itemSubtitle">
        {{ itemWithSubtitle(item) }}
      </small>
    </div>

    <Icon name="ph:x" class="size-3 cursor-pointer" @click="removeItem(item)" />
  </BaseTag>
</div>

    </div>
    <div
      v-if="isOpen"
      class="max-h-[200px] rounded-box dark:bg-dark absolute z-[99] flex flex-col overflow-y-auto rounded-xl border bg-white p-2 shadow dark:text-white"
      :style="{ width: `${menuWidth}px` }"
    >
      <!-- Add create option when no exact match is found -->
      <div
        v-if="
          props.allowCreate &&
          search &&
          !filteredItems.some(
            (item) => itemWithLabel(item as T).toLowerCase() === search.toLowerCase()
          )
        "
        class="pa-3 my-1 flex cursor-pointer items-center justify-between rounded-lg bg-gray-50 p-2 text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
        @click="createNewItem"
      >
        <div class="flex items-center gap-2">
          <Icon name="ph-plus" class="text-green-500" size="20" />
          <p>Create "{{ search }}"</p>
        </div>
      </div>
      <div
        v-for="item in filteredItems"
        :key="itemWithValue(item as T)"
        class="pa-3 my-1 flex cursor-pointer items-center justify-between rounded-lg bg-white p-2 text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
        :class="{ 'font-bold': isItemSelected(item as T) }"
        @click="selectItem(item as T)"
      >
        <div>
          <p v-if="!hasSlot('item')" class="">
            {{ itemWithLabel(item as T) }}
          </p>
          <p v-if="!hasSlot('item') && props.itemSubtitle" class="text-sm">
            {{ itemWithSubtitle(item as T) }}
          </p>
        </div>

        <slot name="item" :item="item" />

        <Icon
          :name="isItemSelected(item as T) ? 'ph-check-square' : 'ph-square'"
          class="text-green-500"
          size="22"
        />
      </div>
      <div
        v-if="filteredItems.length == 0"
        class="pa-3 flex items-center justify-center text-center"
      >
        <p class="text-gray-500 dark:text-gray-400">
          {{ $t('no-data-found') }}
        </p>
      </div>
    </div>
  </div>
</template>
