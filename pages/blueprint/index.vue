<script lang="ts" setup>
import AppCrudActions from '~/components/app-crud/components/AppCrudActions.vue'
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import { useAuthStore } from '~/views/auth/store/auth'
import { tableHeaders } from '~/views/blueprint/index'
import { useBlueprintStore } from '~/views/blueprint/store/index'
import type { BlueprintFilter } from '~/views/blueprint/types'

definePageMeta({
  title: 'blueprints',
  description: 'create-and-manage-blueprints',
})
const blueprintStore = useBlueprintStore()
blueprintStore.getBlueprints()
const blueprints = computed(() => {
  return blueprintStore.blueprints
})
const filters = computed<BlueprintFilter>({
  get() {
    return blueprintStore.filters
  },
  set(value: BlueprintFilter) {
    blueprintStore.filters = value
  },
})
watchDebounced(
  filters,
  () => {
    blueprintStore.getBlueprints()
  },
  { deep: true, debounce: 500 }
)
const router = useRouter()
const isLoading = computed(() => blueprintStore.isLoading)
const { hasPrivilege } = useAuthStore()
</script>

<template>
  <div>
    <AppCrud v-model:current-page="blueprintStore.filters.pageNumber" pagination
      :total-pages="blueprintStore.totalPages" :add-btn-action="() => router.push('/blueprint/form/create')"
      :add-button-text="$t('create-blueprint')" :hide-create="!hasPrivilege('ums:ems:examtemplate:create')">
      <template #filters>
        <BaseInput v-model="filters.search" :placeholder="$t('search')" />
        <AppAutoCompleteField
          v-model="filters.questionBankId"
          fetch-on-search
          search-key="name"
          :placeholder="$t('question-banks')"
          get-url="/question-banks"
          item-label="title"
          item-value="id"
        />
        <AppAutoCompleteField v-model="filters.topicId" fetch-on-search search-key="name"
          :placeholder="$t('topics')" get-url="/topics/lookup" without-data item-label="title" item-value="id" />
      </template>
      <template #additional-filters>
        <div class="flex gap-4">
          <BaseInput v-model="filters.successGrade" :label="$t('half-success-grade')" :placeholder="$t('half-success-grade')" />
          <BaseInput v-model="filters.fullGrade" :label="$t('maximum-grade')" :placeholder="$t('maximum-grade')" />
        </div>
      </template>
      <AppTable :is-loading="isLoading" :title="$t('blueprints')" :headers="tableHeaders($t)" :items="blueprints">
        <template #data-questionBankNames="{ item }">
          {{ item.questionBankNames.join(', ') }}
        </template>
        <template #data-topicNames="{ item }">
          {{ item.topicNames.join(', ') }}
        </template>
        <template #data-actions="data">
          <div class="flex items-center justify-center gap-2">
            <AppCrudActions :hide-delete="!hasPrivilege('ums:ems:examtemplate:delete')" :edit-button-action="() => router.push(`/blueprint/form/${data.item.id}`)"
              :delete-service="blueprintStore.deleteBlueprint" :item="data.item" />
            <BaseButtonIcon :data-nui-tooltip="$t('view')" rounded="full" size="sm" color="primary" variant="outline"
              :to="`/blueprint/${data.item.id}/view`">
              <Icon name="ph:eye" size="18" />
            </BaseButtonIcon>
            <AuditLogBtn :entity-id="data.item.id" />
          </div>
        </template>
        <template #data-displayResult="{ item }">
          <span class="font-bold" :class="{
              'text-green-500': item.displayResult,
              'text-danger-500': !item.displayResult,
            }">
            {{ $t(item.displayResult ? 'Yes' : 'No') }}
          </span>
        </template>
        <template #data-randomizeChoices="{ item }">
          <span class="font-bold" :class="{
              'text-green-500': item.randomizeChoices,
              'text-danger-500': !item.randomizeChoices,
            }">
            {{ $t(item.randomizeChoices ? 'Yes' : 'No') }}
          </span>
        </template>
        <template #data-randomizeAnswer="{ item }">
          <span class="font-bold" :class="{
              'text-green-500': item.randomizeAnswer,
              'text-danger-500': !item.randomizeAnswer,
            }">
            {{ $t(item.randomizeAnswer ? 'Yes' : 'No') }}
          </span>
        </template>
        <template #data-moveBetweenQuestion="{ item }">
          <span class="font-bold" :class="{
              'text-green-500': item.moveBetweenQuestion,
              'text-danger-500': !item.moveBetweenQuestion,
            }">
            {{ $t(item.moveBetweenQuestion ? 'Yes' : 'No') }}
          </span>
        </template>
      </AppTable>
    </AppCrud>
  </div>
</template>
<style></style>
