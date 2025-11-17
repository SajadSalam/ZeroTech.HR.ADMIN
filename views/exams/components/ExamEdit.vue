<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Validator } from '~/services/validator'
import { useExamStore } from '../store/index'
import type { Exam, ExamEdit } from '../types'

const { t } = useI18n()
const examStore = useExamStore()

const props = defineProps<{
  modelValue: boolean
  examId: string | number
}>()
const emit = defineEmits(['update:modelValue'])
const modelValue = computed({
  get() {
    return props.modelValue
  },
  set(value: boolean) {
    emit('update:modelValue', value)
  }
})
const examObject = ref<ExamEdit | null>(null)

const createValidator = (exam: Partial<Exam>) =>
  new Validator<ExamEdit>(
    {
      examDate: exam.startDate ?? "",
      startTime: exam.startTime ?? "",
      endTime: exam.endTime ?? "",
      enterTimeAllowed: exam.enterTimeAllowed ?? 0,
    },
    {
      examDate: {  },
      startTime: {  },
      endTime: { },
      enterTimeAllowed: {  },
    }
  )

const validator = ref(createValidator({}))
const body = computed(() => validator.value.validation)



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


  if (!validator.value) {
    return;
  }

  const isValid = await body.value.$validate();
  if (!isValid) return;
  await examStore.updateExam(props.examId.toString(), validator.value.formData);
  validator.value.resetBody();
  modelValue.value = false;
};

const cancelExam = async () => {

  await examStore.deleteExam(props.examId.toString())
  modelValue.value = false;
}
</script>

<template>
  <AppDialog
    :model-value="modelValue"
    :title="$t('exam_details')"
    size="3xl"
    overflow-y="visible"
    @update:model-value="modelValue = $event"
  >
    <div class="flex flex-col gap-5 rounded-3xl p-3">
      <div class="grid gap-5 md:grid-cols-2">
        <AppFieldAppInputField
          v-model="body.examDate.$model"
          :errors="body.examDate.$errors"
          :label="$t('start-date')"
          :placeholder="$t('enter-start-date')"
          type="date"
          
        />
      </div>

      <div class="grid gap-5 md:grid-cols-2">
        <AppFieldAppInputField
          v-model="body.startTime.$model"
          :errors="body.startTime.$errors"
          :label="$t('start-time')"
          :placeholder="$t('enter-start-time')"
          type="time"
          
        />
        <AppFieldAppInputField
          v-model="body.endTime.$model"
          :errors="body.endTime.$errors"
          :label="$t('end-time')"
          :placeholder="$t('enter-end-time')"
          type="time"
          
        />
      </div>

      <div class="grid gap-5 md:grid-cols-1">
        <AppFieldAppInputField
          v-model="body.enterTimeAllowed.$model"
          :errors="body.enterTimeAllowed.$errors"
          :label="$t('enterance-time-allowed-in-minutes')"
          :placeholder="$t('enter-enterance-time-allowed')"
          
        />
      </div>
    </div>

    <template #actions>
      <BaseButton color="danger"  @click="cancelExam">
        {{ $t('cancel_exam') }}
      </BaseButton>
      <BaseButton color="primary" :loading="examStore.isLoading" class="gap-5" @click="update">
        <Icon name="ph:upload-simple-duotone" class="size-5" />
        {{ $t('reschedule') }}
      </BaseButton>
    </template>
  </AppDialog>
</template>
