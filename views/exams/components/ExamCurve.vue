<script lang="ts" setup>
import { ref, watch } from 'vue'
import { requiredValidator } from '~/services/validation'
import { Validator } from '~/services/validator'
import { ExamGradeTypes, examGradeTypesOptions } from '~/views/exams/types'
import { useExamStore } from '../store/index'

const examStore = useExamStore()
const props = defineProps<{
  examId: string
}>()

// Default curveType is 0 (Curve)
const curveType = ref<ExamGradeTypes>(ExamGradeTypes.Curve)
// Default curveValue is 0 when curveType is ClassAverage, or a user-defined value for Curve
const curveValue = ref<number>(0)

const validator = new Validator(
  {
    curveValue: 0,
  },
  {
    curveValue: {
      required: requiredValidator('Curve value is required'),
    },
  }
)

const body = validator.validation

// Watch for changes in curveType
watch(curveType, (newValue: ExamGradeTypes) => {
  if (newValue === ExamGradeTypes.ClassAverage) {
    curveValue.value = 0 // Set curveValue to 0 when ClassAverage is selected
  }
})

const submit = async () => {
  const isValid = await body.value.$validate()
  if (!isValid) {
    return
  }

  try {
    const payload = {
      curveType: curveType.value,
      curveValue: curveValue.value,
    }
    await examStore.addCurve(props.examId, payload)
    examStore.isCurveDialogOpen = false
  } catch (error) {}
}
</script>

<template>
  <AppDialog
    v-model="examStore.isCurveDialogOpen"
    :title="$t('add-grades')"
    size="3xl"
    overflow-y="visible"
  >
    <div class="flex flex-col gap-4">
      <div class="flex items-center gap-4">
        <BaseRadio
          v-for="option in examGradeTypesOptions($t)"
          :key="option.value"
          v-model="curveType"
          :label="option.label"
          :value="option.value"
        />
      </div>
      <div class="flex flex-col gap-4">
        <p v-if="curveType === ExamGradeTypes.Curve" class="text-sm text-gray-500">
          {{ $t('add-a-grades-for-all-student') }}
        </p>
        <p v-if="curveType === ExamGradeTypes.ClassAverage" class="text-sm text-gray-500">
          {{ $t('add-grades-for-all-student-based-on-the-average') }}
        </p>
      </div>
      <BaseInput
        v-if="curveType === ExamGradeTypes.Curve"
        v-model="curveValue"
        :label="$t('curve-grade')"
        type="number"
        placeholder="Enter curve grade"
      />
    </div>

    <template #actions>
      <BaseButton color="primary" :loading="examStore.isLoading" class="gap-1" @click="submit">
        <Icon name="ph:upload-simple-duotone" class="size-5" />
        {{ $t('save-change') }}
      </BaseButton>
    </template>
  </AppDialog>
</template>
