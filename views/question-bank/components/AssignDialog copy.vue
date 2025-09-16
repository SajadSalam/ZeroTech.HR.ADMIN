<script setup lang="ts">
import { useQuestionBankStore } from '../store/index'
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'

const questionBankStore = useQuestionBankStore()
const users = ref([
  {
    id: 1,
    name: 'John Doe',
  },
  {
    id: 2,
    name: 'Jane Doe',
  },
  {
    id: 3,
    name: 'John Smith',
  },
  {
    id: 4,
    name: 'Jane Smith',
  },
])
</script>
<template>
  <AppDialog
    v-model="questionBankStore.isAssignDialogOpen"
    :title="$t('assigns')"
    size="2xl"
    overflow-y="visible"
  >
    <div class="rounded-3xl p-3">
      <AppAutoCompleteField
        :label="$t('select-creator')"
        :items="users"
        item-label="name"
        item-value="id"
        class="col-span-2"
      />
      <div class="mt-2 flex justify-end">
        <BaseButton color="primary" variant="pastel">
          {{ $t('add-more') }}
        </BaseButton>
      </div>
      <AppAutoCompleteField
        multiple
        :label="$t('select-auditors')"
        :items="users"
        item-label="name"
        item-value="id"
        class="col-span-2"
      />
      <div class="mt-2 flex justify-end">
        <BaseButton color="primary" variant="pastel">
          {{ $t('add-more') }}
        </BaseButton>
      </div>
      <BaseButton color="primary" class="mt-5 w-full gap-1">
        <Icon name="ph:upload-simple-duotone" class="size-5" />
        {{ $t('save-change') }}
      </BaseButton>
    </div>
  </AppDialog>
</template>
