<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AppInputField from '~/components/app-field/AppInputField.vue'
import { createValidator } from '~/services/validationWithI18n'
import { Validator } from '~/services/validator'
import { useHallStore } from '../store'
import type { HallCreateDto } from '../types'

const hallStore = useHallStore()
const { t } = useI18n()

const selectedHall = computed(() => hallStore.selectedHall)

const validator = new Validator<HallCreateDto>(
  {
    name: '',
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
const updateHall = async () => {
  const isValid = await body.value.$validate()
  if (!isValid) return
  const extractedBody = validator.extractBody()
  await hallStore.updateHall(extractedBody)
  validator.resetBody()
  hallStore.isEditDialogOpen = false
}

watch(
  () => hallStore.isEditDialogOpen,
  (value) => {
    if (!value) {
      validator.resetBody()
    } else {
      validator.fillBody({
        name: selectedHall.value?.name as string,
        capacity: selectedHall.value?.capacity as number,
        examCenterId: selectedHall.value?.examCenterId as string,
      })
    }
  }
)
</script>
<template>
  <AppDialog
    v-model="hallStore.isEditDialogOpen"
    :title="$t('edit-hall')"
    size="xl"
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
      <BaseButton color="primary" class="gap-1" :loading="isLoading" @click="updateHall">
        <Icon name="ph:upload-simple-duotone" class="size-5" />
        {{ $t('save-changes') }}
      </BaseButton>
    </template>
  </AppDialog>
</template>
