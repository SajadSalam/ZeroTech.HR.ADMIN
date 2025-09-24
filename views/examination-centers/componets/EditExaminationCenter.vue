<script setup lang="ts">
import AppInputField from '~/components/app-field/AppInputField.vue'

import { useExaminationCenters } from '../store/index'
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import type { ExaminationCenter } from '../types'
import OrganizationTree from '~/views/orgaization/OrganizationTree.vue'
import { Validator } from '~/services/validator'
import { required } from '@vuelidate/validators'
import { createValidator } from '~/services/validationWithI18n'
import axios from '~/services/app-client/axios'
import { useI18n } from 'vue-i18n'
interface GovernorateDto {
  id: number
  name: string
}

const examinationCentersStore = useExaminationCenters()
const { t } = useI18n()

const validator = new Validator<ExaminationCenter>(
  {
    name: '',
    isActive: true,
    collegeId: 0,
    governorateId:0,
    maxCapacity: 0,
    surveillanceDevices: [],
    longitude: 0,
    latitude: 0

  },
  {
    name: {
      required: createValidator(t, 'name', 'required'),
    },
    maxCapacity: {
      required: createValidator(t, 'max-capacity', 'required'),
    },
    governorateId: {
      required: createValidator(t, 'governorate', 'required'),
    },
    collegeId: {
      required: createValidator(t, 'college', 'required'),
    },
    longitude: {
      required: createValidator(t, 'longitude', 'required'),
    },
    latitude: {
      required: createValidator(t, 'latitude', 'required'),
    },
  }
)

const body = validator.validation

const isLoading = computed(() => {
  return examinationCentersStore.isLoading
})
watchDeep(
  () => examinationCentersStore.selectedExaminationCenter,
  (val) => {
    validator.fillBody(examinationCentersStore.selectedExaminationCenter)
  }
)

const updateExaminationCenter = async () => {
  const isValid = await body.value.$validate()
  if (!isValid) return
  await examinationCentersStore.updateExaminationCenter(validator.extractBody())
  validator.resetBody()
  examinationCentersStore.isEditDialogOpen = false
}
const governorateOptions = ref<GovernorateDto[]>([])

const getGovernorateOptions = async () => {
  const response = await axios.get<GovernorateDto[]>('/ums/governates')
  governorateOptions.value = response.data
}

onMounted(() => {
  getGovernorateOptions()
})
</script>
<template>
  <AppDialog
    v-model="examinationCentersStore.isEditDialogOpen"
    :title="$t('edit-examination-center')"
    size="2xl"
    overflow-y="visible"
  >
  <div class="grid grid-cols-2 gap-2 rounded-3xl p-3">
       
      <AppInputField
        v-model="body.name.$model"
        :errors="body.name.$errors"
        :label="$t('name')"
        class="col-span-2"
      />
      <AppInputField
          v-model="body.maxCapacity.$model"
          :errors="body.maxCapacity.$errors"
          :label="$t('max-capacity')"
        />
      <AppAutoCompleteField
        v-model="body.governorateId.$model"
        :items="governorateOptions"
        :label="$t('governorate')"
        :errors="body.governorateId.$errors"
        item-label="arabicName"
        item-value="id"
      />
      <div class="col-span-2">
        <h1 class="my-2">
          {{ $t('select-organization') }}
        </h1>
        <OrganizationTree v-model="body.collegeId.$model" />
      </div>
      <div class="col-span-2">

        <AppFieldAppMapField
            class="col-span-2"
            v-model:lat="body.latitude.$model"
            v-model:lng="body.longitude.$model"
            label="الموقع"
        />
      </div>
    </div>
    <div class="rounded-3xl p-3">
      

      <BaseButton
        color="primary"
        class="mt-5 w-full gap-1"
        :loading="isLoading"
        @click="updateExaminationCenter"
      >
        <Icon name="ph:upload-simple-duotone" class="size-5" />
        {{ $t('save-change') }}
      </BaseButton>
    </div>
  </AppDialog>
</template>
