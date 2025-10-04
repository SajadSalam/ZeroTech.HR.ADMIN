<script setup lang="ts">
import { computed, watch } from 'vue'
import AppInputField from '~/components/app-field/AppInputField.vue'
import AppTextAreaField from '~/components/app-field/AppTextAreaField.vue'
import { requiredValidator,minValueValidator  } from '~/services/validation'
import { Validator } from '~/services/validator'
import { useAwardStore } from '../store'
import type { Award, AwardStatus } from '../types'
import { useAppToaster } from '~/services/toaster/toaster'

const awardStore = useAwardStore()

const selectedAward = computed(() => awardStore.selectedAward)

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
            min: minValueValidator('', 1)
        },
        delayAllowedTime: {
            min: minValueValidator('', 1)
        }
    }
)

const body = validator.validation

const isLoading = computed(() => {
    return awardStore.isLoading
})

const error = ref('')
const isError = ref(false)
const toaster = useAppToaster()

const updateAward = async () => {
    isError.value = false
    error.value = ''
    const isValid = await body.value.$validate()
    if (!isValid) return
    // Compare exam time with delay allowed time (both are numbers in minutes)
    if(Number(body.value.examTime.$model) >= Number(body.value.delayAllowedTime.$model)) {
        isError.value = true
        toaster.show('danger', 'وقت التأخير المسموح يجب أن يكون أصغر من مدة الامتحان نفسه')
        return
    }

    // Compare dates - convert to Date objects for proper comparison
    const examDate = new Date(body.value.examDate.$model as string)
    const lunchDate = new Date(body.value.lunchDate.$model as string)
    const applicationEndDate = new Date(body.value.applicationEndDate.$model as string)

    if(examDate <= lunchDate) {
        isError.value = true
        toaster.show('danger', 'تاريخ الامتحان يجب أن يكون بعد تاريخ بدء التقديم')
        return
    }
    if(examDate <= applicationEndDate) {
        isError.value = true
        toaster.show('danger', 'تاريخ الامتحان يجب أن يكون بعد تاريخ انتهاء التقديم')
        return
    }
    if(isError.value) return
    body.value.awardStatus.$model = 'inprogress'

    await awardStore.updateAward(validator.extractBody())
    validator.resetBody()
    awardStore.isEditDialogOpen = false
}

watch(
    () => awardStore.isEditDialogOpen,
    (value) => {
        if (!value) {
            validator.resetBody()
        } else {
            validator.fillBody({
                awardName: selectedAward.value?.awardName as string,
                awardStatus: selectedAward.value?.awardStatus as AwardStatus,
                version: selectedAward.value?.version as string,
                academicYear: selectedAward.value?.academicYear as string,
                lunchDate: selectedAward.value?.lunchDate as string,
                applicationEndDate: selectedAward.value?.applicationEndDate as string,
                honoringDate: selectedAward.value?.honoringDate as string,
                resultDate: selectedAward.value?.resultDate as string,
                formRequirement: selectedAward.value?.formRequirement as string,
                criteria: selectedAward.value?.criteria as string,
                examTime: selectedAward.value?.examTime as number,
                delayAllowedTime: selectedAward.value?.delayAllowedTime as number,
                publishedAt: new Date().toISOString(),
                examDate: selectedAward.value?.examDate?.replace('Z', '') as string,
            })
        }
    }
)
</script>

<template>
    <AppDialog v-model="awardStore.isEditDialogOpen" :title="$t('edit-award')" size="xl" overflow-y="visible">
        <div class="rounded-3xl p-3">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AppInputField v-model="body.awardName.$model" :errors="body.awardName.$errors" size="md"
                    :label="$t('award-name')"  class-name="col-span-2"/>

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
                    :label="$t('exam-time')" :min="1"  />

                <AppInputField v-model="body.delayAllowedTime.$model" :errors="body.delayAllowedTime.$errors" size="md"
                    type="number" :label="$t('delay-allowed-time')" :min="1"  />

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
        <!-- <div v-if="isError" class="text-red-500 text-sm mt-2">{{ error }}</div> -->

            <BaseButton color="primary" class="gap-1" :loading="isLoading" @click="updateAward">
                <Icon name="ph:check-circle-duotone" class="size-5" />
                {{ $t('save') }}
            </BaseButton>
        </template>
    </AppDialog>
</template>
