<script setup lang="ts">
import AppInputField from '~/components/app-field/AppInputField.vue'
import { Validator } from '~/services/validator'
import { createValidator } from '~/services/validationWithI18n'
import { useHallStore } from '../store'
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import { UserRoles } from '~/utils/constants/enum'
import type { Hall, HallCreateDto } from '../types'
import { useI18n } from 'vue-i18n'

const hallStore = useHallStore()
const { t } = useI18n()

const validator = new Validator<HallCreateDto>(
  {
    name: '',
    examCenterId: '',
    capacity: 0,
  },
  {
    name: {
      required: createValidator(t, 'hall-name', 'required'),
    },
    capacity: {
      required: createValidator(t, 'capacity', 'required'),
    },
  }
)

const body = validator.validation

const isLoading = computed(() => {
  return hallStore.isLoading
})


const {id} = useRoute().params
const createHall = async () => {
  const isValid = await body.value.$validate()

  if (!isValid) return
  const extractedBody = validator.extractBody()
  extractedBody.examCenterId = id as string
  await hallStore.createHall(extractedBody)
  validator.resetBody()
  hallStore.isCreateDialogOpen = false
}
watch(
  () => hallStore.isCreateDialogOpen,
  (val: boolean) => {
    if (val) {
      validator.resetBody()
    }
  }
)
</script>
<template>
  <AppDialog
    v-model="hallStore.isCreateDialogOpen"
    :title="$t('create-hall')"
    size="md"
    overflow-y="visible"
  >
    <div class="rounded-3xl p-3">
      <div class="flex flex-col gap-4">
        <AppInputField
          v-model="body.name.$model"
          :errors="body.name.$errors"
          size="md"
          :label="$t('name')"
        />
        <AppInputField
          v-model="body.capacity.$model"
          :errors="body.capacity.$errors"
          size="md"
          :label="$t('capacity')"
        />
      </div>
    </div>
    <template #actions>
      <BaseButton color="primary" class="gap-1" :loading="isLoading" @click="createHall">
        <Icon name="ph:upload-simple-duotone" class="size-5" />
        {{ $t('create') }}
      </BaseButton>
    </template>
  </AppDialog>
</template>
