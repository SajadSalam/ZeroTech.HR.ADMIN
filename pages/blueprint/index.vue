<script lang="ts" setup>
import AppCrudActions from '~/components/app-crud/components/AppCrudActions.vue'
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import { useAuthStore } from '~/views/auth/store/auth'
import CreateBlueprint from '~/views/blueprint/components/CreateBlueprint.vue'
// import CreateQuestionBank from '~/views/question-bank/components/CreateQuestionBank.vue';
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
    <AppCrud
      v-model:current-page="blueprintStore.filters.pageNumber"
      pagination
      :total-pages="blueprintStore.totalPages"
      :add-btn-action="() => router.push('/blueprint/create')"
      :add-button-text="$t('create-blueprint')"
      :hide-create="!hasPrivilege('ums:ems:examtemplate:create')"
    >
      <template #filters>
        <BaseInput v-model="filters.search" :placeholder="$t('search')" />
        <AppAutoCompleteField
          v-model="filters.questionBankId"
          fetch-on-search
          search-key="name"
          :placeholder="$t('questions-bank')"
          get-url="/question-bank/lookup"
          without-data
          item-label="title"
          item-value="id"
        />
        <AppAutoCompleteField
          v-model="filters.subjectId"
          fetch-on-search
          search-key="name"
          :placeholder="$t('subject')"
          get-url="/subjects/lookup"
          without-data
          item-label="title"
          item-value="id"
        />
      </template>
      <template #additional-filters>
        <div class="flex gap-4">
          <AppAutoCompleteField
            v-model="filters.topicId"
            fetch-on-search
            search-key="name"
            :label="$t('topics')"
            :placeholder="$t('topics')"
            get-url="/topics/lookup"
            without-data
            item-label="title"
            item-value="id"
          />
          <BaseInput
            v-model="filters.minGrade"
            :label="$t('min_grade')"
            :placeholder="$t('min_grade')"
          />
          <BaseInput
            v-model="filters.maxGrade"
            :label="$t('max_grade')"
            :placeholder="$t('max_grade')"
          />
        </div>
      </template>
      <AppTable
        :is-loading="isLoading"
        :title="$t('blueprints')"
        :headers="tableHeaders($t)"
        :items="blueprints"
      >
        <template #data-questionBanks="{ item }">
          {{ item.questionBanks.map((questionBank) => questionBank.questionBank.title).join(', ') }}
        </template>
        <template #data-studyYear="{ item }">
          {{ new Date().getFullYear() - 1 }} -
          {{ new Date().getFullYear() }}
        </template>
        <template #data-actions="data">
          <div class="flex items-center justify-center gap-2">
            <AppCrudActions
              hide-update
              :hide-delete="!hasPrivilege('ums:ems:examtemplate:delete')"
              :delete-service="blueprintStore.deleteBlueprint"
              :item="data.item"
            />
            <BaseButtonIcon
              :data-nui-tooltip="$t('view')"
              rounded="full"
              size="sm"
              color="primary"
              variant="outline"
              :to="`/blueprint/${data.item.id}/view`"
            >
              <Icon name="ph:eye" size="18" />
            </BaseButtonIcon>
          </div>
        </template>
        <template #data-displayResult="{ item }">
          <span
            class="font-bold"
            :class="{
              'text-green-500': item.displayResult,
              'text-danger-500': !item.displayResult,
            }"
          >
            {{ $t(item.displayResult ? 'Yes' : 'No') }}
          </span>
        </template>
        <template #data-randomizeChoices="{ item }">
          <span
            class="font-bold"
            :class="{
              'text-green-500': item.randomizeChoices,
              'text-danger-500': !item.randomizeChoices,
            }"
          >
            {{ $t(item.randomizeChoices ? 'Yes' : 'No') }}
          </span>
        </template>
        <template #data-randomizeAnswer="{ item }">
          <span
            class="font-bold"
            :class="{
              'text-green-500': item.randomizeAnswer,
              'text-danger-500': !item.randomizeAnswer,
            }"
          >
            {{ $t(item.randomizeAnswer ? 'Yes' : 'No') }}
          </span>
        </template>
        <template #data-moveBetweenQuestion="{ item }">
          <span
            class="font-bold"
            :class="{
              'text-green-500': item.moveBetweenQuestion,
              'text-danger-500': !item.moveBetweenQuestion,
            }"
          >
            {{ $t(item.moveBetweenQuestion ? 'Yes' : 'No') }}
          </span>
        </template>
      </AppTable>
    </AppCrud>
  </div>
  <CreateBlueprint />
</template>
<style></style>
