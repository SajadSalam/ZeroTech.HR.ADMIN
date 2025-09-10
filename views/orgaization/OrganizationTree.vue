<script lang="ts" setup>
import AppInputField from '~/components/app-field/AppInputField.vue'
import { useOrganizationStore } from './store/index'
import type { OrganizationFilters, Organization } from './types/index'

const props = defineProps<{ multiple: boolean }>()
const organizationStore = useOrganizationStore()
const emit = defineEmits(['itemAdded', 'itemRemoved'])
const modelValue = defineModel<number | number[]>()
const tree = ref<Organization[]>([])
const isLoading = ref(false)
const filters = computed<OrganizationFilters>({
  get() {
    return organizationStore.filters
  },
  set(value: OrganizationFilters) {
    organizationStore.filters = value
  },
})
const toggleItemSelection = (id: number, item: Organization) => {
  if (props.multiple) {
    const selectedValues = Array.isArray(modelValue.value) ? [...modelValue.value] : []

    if (selectedValues.includes(id)) {
      modelValue.value = selectedValues.filter((item) => item !== id) // Remove if already selected
      emit('itemRemoved', item)
    } else {
      modelValue.value = [...selectedValues, id] // Add new selection

      emit('itemAdded', item)
    }
  } else {
    modelValue.value = modelValue.value === id ? -1 : id
  }
}

onMounted(async () => {
  isLoading.value = true
  tree.value = await organizationStore.getOrganizations({ parentId: 'null', search: null })
  isLoading.value = false
})
watchDebounced(
  filters,
  async () => {
    tree.value = await organizationStore.getOrganizations(filters.value)
  },
  { deep: true, debounce: 500 }
)
</script>

<template>
  <AppInputField
    v-model="organizationStore.filters.search"
    :placeholder="$t('search-organization')"
    icon="ph-search"
  />
  <BaseTreeSelect
    :classes="{
      itemIcon: 'text-yellow-500 size-10',
    }"
    treeline
    :children="tree"
  >
    <template #item-label="{ child }">
      <BaseCheckbox
        color="primary"
        :value="child.id"
        :model-value="
          Array.isArray(modelValue) ? modelValue.includes(child.id) : modelValue == child.id
        "
        @update:model-value="(val) => toggleItemSelection(child.id, child)"
      />
      <Icon name="ph-folder-fill" class="me-2 size-7 text-yellow-500" />

      {{ isNullOrEmpty(filters.search) ? child.arabicName : child.fullNameAr }}
    </template>
  </BaseTreeSelect>
</template>
