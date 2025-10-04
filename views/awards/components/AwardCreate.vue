<script setup lang="ts">
import { computed, watch } from 'vue'
import AppInputField from '~/components/app-field/AppInputField.vue'
import AppTextAreaField from '~/components/app-field/AppTextAreaField.vue'
import { requiredValidator, minValueValidator } from '~/services/validation'
import { Validator } from '~/services/validator'
import { useAwardStore } from '../store'
import type { Award } from '../types'

const awardStore = useAwardStore()

const awardStatusOptions = [
    { label: 'In Progress', value: 'inprogress' },
    { label: 'Completed', value: 'completed' },
]

const validator = new Validator<Award>(
    {
        awardName: '',
        awardStatus: null,
        version: '',
        academicYear: '',
        lunchDate: '',
        applicationEndDate: '',
        honoringDate: '',
        resultDate: '',
        formRequirement: '',
        criteria: '',
        examTime: null,
        delayAllowedTime: null,
        publishedAt: '',
        examDate: '',
    },
    {
        awardName: {
            required: requiredValidator('Award name'),
        },
        academicYear: {
            required: requiredValidator('Academic year'),
        },
        examDate: {
            required: requiredValidator('Exam date'),
        },

        examTime: {
            required: requiredValidator(''),
            min: minValueValidator('', 0)
        },
        delayAllowedTime: {
            min: minValueValidator('', 0)
        }
    }
)

const body = validator.validation

const isLoading = computed(() => {
    return awardStore.isLoading
})

const createAward = async () => {
    const isValid = await body.value.$validate()

    if (!isValid) return
    body.value.awardStatus.$model = 'inprogress'
    await awardStore.createAward(validator.extractBody())
    validator.resetBody()
    awardStore.isCreateDialogOpen = false
}

watch(
    () => awardStore.isCreateDialogOpen,
    (val: boolean) => {
        if (val) {
            validator.resetBody()
        }
    }
)
</script>

<template>
    <AppDialog v-model="awardStore.isCreateDialogOpen" :title="$t('create-new-award')" size="xl" overflow-y="visible">
        <div class="rounded-3xl p-3">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AppInputField v-model="body.awardName.$model" :errors="body.awardName.$errors" class-name="col-span-2" size="md"
                    :label="$t('award-name')" />

                <!-- <AppFieldAppAutoCompleteField v-model="body.awardStatus.$model" :errors="body.awardStatus.$errors"
                    :items="awardStatusOptions" item-value="value" item-label="label" size="md"
                    :label="$t('award-status')" /> -->

                <AppInputField v-model="body.academicYear.$model" :errors="body.academicYear.$errors" size="md"
                    :label="$t('academic-year')" />


                <AppInputField v-model="body.version.$model" :errors="body.version.$errors" size="md"
                    :label="$t('version')" />

                <AppInputField v-model="body.lunchDate.$model" :errors="body.lunchDate.$errors" size="md" type="date"
                    :label="$t('lunch-date')" />

                <AppInputField v-model="body.applicationEndDate.$model" :errors="body.applicationEndDate.$errors"
                    size="md" type="date" :label="$t('application-end-date')" />
                <AppInputField v-model="body.resultDate.$model" :errors="body.resultDate.$errors" size="md" type="date"
                    :label="$t('result-date')" />
                <AppInputField v-model="body.honoringDate.$model" :errors="body.honoringDate.$errors" size="md"
                    type="date" :label="$t('honoring-date')" />



                <AppInputField v-model="body.examTime.$model" :errors="body.examTime.$errors" size="md" type="number"
                    :label="$t('exam-time')" :min="0"  />

                <AppInputField v-model="body.delayAllowedTime.$model" :errors="body.delayAllowedTime.$errors" size="md"
                    type="number" :label="$t('delay-allowed-time')" :min="0"  />

                <AppInputField v-model="body.examDate.$model" :errors="body.examDate.$errors" size="md"
                    type="datetime-local" :label="$t('exam-date')" />
            </div>

            <div class="mt-4">
                <AppTextAreaField v-model="body.formRequirement.$model" :errors="body.formRequirement.$errors" size="md"
                    :label="$t('form-requirement')" rows="3" />
            </div>

            <div class="mt-4">
                <AppTextAreaField v-model="body.criteria.$model" :errors="body.criteria.$errors" size="md"
                    :label="$t('criteria')" rows="3" />
            </div>
        </div>

        <template #actions>
            <BaseButton color="primary" class="gap-1" :disabled="isLoading" :loading="isLoading" @click="createAward">
                <Icon name="ph:check-circle-duotone" class="size-5" />
                {{ $t('create-new-award') }}
            </BaseButton>
        </template>
    </AppDialog>
</template>
