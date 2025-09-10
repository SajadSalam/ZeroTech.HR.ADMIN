<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import { useExamStore } from '../store/index'
import { useI18n } from 'vue-i18n'
import { Validator } from '~/services/validator'
import { requiredValidator } from '~/services/validation'
import type { ExamEdit } from '../types'

const { t } = useI18n()
const examStore = useExamStore()

const props = defineProps<{
  modelValue: boolean
  examId: string | number
}>()
const emit = defineEmits(['update:modelValue'])

const examObject = ref<ExamEdit | null>(null)

const createValidator = (exam: Partial<ExamEdit>) =>
  new Validator<ExamEdit>(
    {
      title: exam.title ?? "",
      examType: exam.examType ?? null,
      examTemplateId: exam.examTemplateId ?? null,
      startDate: exam.startDate ?? "",
      endDate: exam.endDate ?? "",
      startTime: exam.startTime ?? "",
      endTime: exam.endTime ?? "",
      duration: exam.duration ?? null,
      enterTimeAllowed: exam.enterTimeAllowed ?? 0,
      examCenterId: exam.examCenterId ?? null,
      instructions: exam.instructions ?? "",
    },

    {
      startDate: { required: requiredValidator(t('required')) },
      startTime: { required: requiredValidator(t('required')) },
      endDate: { required: requiredValidator(t('required')) },
      endTime: { required: requiredValidator(t('required')) },
      enterTimeAllowed: { required: requiredValidator(t('required')) },
    }
  )

const validator = ref(createValidator({}))
const body = computed(() => validator.value.validation)

const hasExamStarted = computed(() => {
  const date = examObject.value?.startDate
  const time = examObject.value?.startTime
  if (!date || !time) return false

  const datePart = date.split('T')[0]
  const isoDateTime = `${datePart}T${time}:00`
  const examStart = new Date(isoDateTime)

  return !isNaN(examStart.getTime()) && new Date() >= examStart
})

const fetchExamDetails = async () => {
  try {
    const exam = (await examStore.getById(props.examId.toString())) as ExamEdit;
    examObject.value = exam;
    console.log("Fetched exam details:", exam);

    validator.value = createValidator(exam);
  } catch (error) {
    console.error("Error fetching exam details:", error);
    validator.value = createValidator({});
  }
};

onMounted(() => {
  if (props.examId) {
    fetchExamDetails();
  }
})

watch(
  () => props.examId,
  async (value: string | number) => {
    if (value) {
      await fetchExamDetails();
    } else {
      validator.value?.resetsBody?.();
    }
  }
)

const update = async () => {
  if (hasExamStarted.value) {
    useToast({ message: t('exam_already_started_no_changes'), isError: true })
    return
  }

  if (!validator.value) {
    return;
  }
  // Check for date and time validation
  if (
    body.value.startDate.$model &&
    body.value.endDate.$model &&
    body.value.startTime.$model &&
    body.value.endTime.$model
  ) {
    const startDateTime = new Date(
      `${body.value.startDate.$model}T${body.value.startTime.$model}`
    );

    const endDateTime = new Date(
      `${body.value.endDate.$model}T${body.value.endTime.$model}`
    );

    // Validate dates
    if (endDateTime < startDateTime) {
      useToast({
        message: t("end_before_start_date_error"),
        isError: true,
      });
      return;
    }

    // Validate times on same day
    if (body.value.startDate.$model === body.value.endDate.$model) {
      const startTime = body.value.startTime.$model;
      const endTime = body.value.endTime.$model;

      if (startTime >= endTime) {
        useToast({
          message: t("same_day_time_error"),
          isError: true,
        });
        return;
      }
    }
  }

  const isValid = await body.value.$validate();
  if (!isValid) return;

  await examStore.updateExam(props.examId.toString(), validator.value.extractBody());
  validator.value.resetBody();
  examStore.isUpdateDialogOpen = false;
};

const cancelExam = async () => {
  if (hasExamStarted.value) {
    useToast({ message: t('exam_already_started_no_changes'), isError: true })
    return
  }

  await examStore.cancelExam(props.examId.toString())
  emit('update:modelValue', false)
}
</script>

<template>
  <AppDialog
    :model-value="modelValue"
    :title="$t('exam_details')"
    size="3xl"
    overflow-y="visible"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="flex flex-col gap-5 rounded-3xl p-3">
      <div class="grid gap-5 md:grid-cols-2">
        <AppFieldAppInputField
          v-model="body.startDate.$model"
          :errors="body.startDate.$errors"
          :label="$t('start-date')"
          :placeholder="$t('enter-start-date')"
          type="date"
          :disabled="hasExamStarted"
        />
        <AppFieldAppInputField
          v-model="body.endDate.$model"
          :errors="body.endDate.$errors"
          :label="$t('end-date')"
          :placeholder="$t('enter-end-date')"
          type="date"
          :disabled="hasExamStarted"
        />
      </div>

      <div class="grid gap-5 md:grid-cols-2">
        <AppFieldAppInputField
          v-model="body.startTime.$model"
          :errors="body.startTime.$errors"
          :label="$t('start-time')"
          :placeholder="$t('enter-start-time')"
          type="time"
          :disabled="hasExamStarted"
        />
        <AppFieldAppInputField
          v-model="body.endTime.$model"
          :errors="body.endTime.$errors"
          :label="$t('end-time')"
          :placeholder="$t('enter-end-time')"
          type="time"
          :disabled="hasExamStarted"
        />
      </div>

      <div class="grid gap-5 md:grid-cols-1">
        <AppFieldAppInputField
          v-model="body.enterTimeAllowed.$model"
          :errors="body.enterTimeAllowed.$errors"
          :label="$t('enterance-time-allowed-in-minutes')"
          :placeholder="$t('enter-enterance-time-allowed')"
          :disabled="hasExamStarted"
        />
      </div>
    </div>

    <template #actions>
      <BaseButton color="danger" :disabled="hasExamStarted" @click="cancelExam">
        {{ $t('cancel_exam') }}
      </BaseButton>
      <BaseButton color="primary" :loading="examStore.isLoading" class="gap-5" @click="update">
        <Icon name="ph:upload-simple-duotone" class="size-5" />
        {{ $t('reschedule') }}
      </BaseButton>
    </template>
  </AppDialog>
</template>
