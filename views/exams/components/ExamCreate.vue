<script lang="ts" setup>
import { helpers, requiredIf } from '@vuelidate/validators'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { useI18n } from 'vue-i18n'
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import { createValidator } from '~/services/validationWithI18n'
import { Validator } from '~/services/validator'
import { useExamStore } from '../store/index'
import { ExamType, examTypesOptions, type ExamCreate } from '../types/index'

const examStore = useExamStore()

const { isCreateDialogOpen } = storeToRefs(examStore)

const { t } = useI18n()
const editorModules = {
  toolbar: [
    [{ direction: 'rtl' }, { direction: 'ltr' }],
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['clean'],
  ],
  clipboard: {
    matchVisual: false,
  },
}
// Create formData separately so we can reference it in validation rules
const formData = reactive<ExamCreate>({
  duration: null,
  title: null,
  examTemplateId: null,
  startDate: null,
  startTime: null,
  endTime: null,
  examType: null,
  enterTimeAllowed: null,
  examGroups: [],
  instructions: '',
})

const validator = new Validator<ExamCreate>(
  formData,
  {
    title: {
      required: createValidator(t, 'title', 'required'),
      minLength: createValidator(t, 'title', 'minLength', 3),
    },
    examTemplateId: {
      required: createValidator(t, 'blueprint', 'required'),
    },
    startDate: {
      required: createValidator(t, 'start-date', 'required'),
    },
    startTime: {
      required: createValidator(t, 'start-time', 'required'),
    },
    endTime: {
      required: createValidator(t, 'end-time', 'required'),
    },
    examType: {
      required: createValidator(t, 'exam-type', 'required'),
    },
    duration: {
      required: createValidator(t, 'duration', 'required'),
      minValue: createValidator(t, 'duration', 'minValue', 1),
    },
    enterTimeAllowed: {
      required: createValidator(t, 'enterance-time-allowed', 'required'),
      minValue: createValidator(t, 'enterance-time-allowed', 'minValue', 1),
    },
    examGroups: {
      requiredIfFinal: helpers.withMessage(
        () => t('validation.required', { field: t('groups') }),
        requiredIf(computed(() => formData.examType === ExamType.Final))
      ),
    },

  }
)

const body = validator.validation
const calculateDuration = () => {
  const now = new Date().toISOString().split('T')[0]
  if (
    isNullOrEmpty(body.value.startTime.$model as string) ||
    isNullOrEmpty(body.value.endTime.$model as string)
  ) {
    return
  }
  const start = new Date(`${now}T${body.value.startTime.$model}`)
  const end = new Date(`${now}T${body.value.endTime.$model}`)
  const diff = end.getTime() - start.getTime()
  const minutes = Math.floor(diff / 60000)
  // Only set duration if it's positive
  if (minutes > 0) {
    body.value.duration.$model = minutes
  } else {
    body.value.duration.$model = null
    // Trigger validation error on endTime
    body.value.endTime.$touch()
  }
}
watchDeep(body, calculateDuration)

const submit = async () => {
  const isValid = await body.value.$validate()
  if (!isValid) {
    return
  }

  try {
    await examStore.createExam(validator.extractBody())
    validator.resetBody()
    isCreateDialogOpen.value = false
  } catch (error) {}
}
watch(
  () => isCreateDialogOpen.value,
  (val: boolean) => {
    if (val) {
      validator.resetBody()
      body.value.examType.$model = examTypesOptions(t)[0].value;
    }
  }
)
const updateInstructions = (content: string) => {
  // Remove HTML tags and trim whitespace to check if content is empty
  // const plainText = content.replace(/<[^>]*>/g, '').trim();

  body.value.instructions.$model = content
}

const updateExamType = (type: ExamType) => {
    body.value.examType.$model = type;
    window.setTimeout(() => {
    }, 1300);
}
</script>

<template>
  <AppDialog
    v-model="isCreateDialogOpen"
    :title="$t('create-exams')"
    size="3xl"
    overflow-y="visible"
  >
    <div class="grid gap-5 md:grid-cols-2">
        <div
        v-for="type in examTypesOptions($t)"
        :key="type.value"
        @click="updateExamType(type.value)"
        class="
        transition-all duration-300
        flex flex-col gap-4 rounded-3xl p-3 hover:bg-primary border-2 hover:border-primary hover:text-white cursor-pointer"
        :class="type.value == body.examType.$model ? 'bg-primary/20 border-primary text-primary' : 'bg-white'"
        >
            <h1 class="text-xl font-bold">{{ type.label }}</h1>
           <p class="text-sm ">
            {{ type.description }}
           </p>
        </div>
    </div>
    <Transition name="slide-up-down"> 
        <div class="flex flex-col gap-5 rounded-3xl p-3" v-if="body.examType.$model">
      <div class="grid gap-5 md:grid-cols-2">
        <AppFieldAppInputField
          v-model="body.title.$model"
          :errors="body.title.$errors"
          :label="$t('title')"
          :placeholder="$t('enter-title')"
        />
        <AppAutoCompleteField
          v-model="body.examTemplateId.$model"
          fetch-on-search
          search-key="search"
          :errors="body.examTemplateId.$errors"
          :label="$t('blueprint')"
          :placeholder="$t('blueprint')"
          get-url="/examtemplate"
          item-label="name"
          item-value="id"
        />
      </div>
      <div class="grid gap-5 md:grid-cols-1">
        <AppAutoCompleteField
          v-if="body.examType.$model == ExamType.Final"
          v-model="body.examGroups.$model"
          fetch-on-search
          search-key="name"
          :errors="body.examGroups.$errors"
          :label="$t('groups')"
          :placeholder="$t('groups')"
          get-url="/groups/lookup"
          without-data
          multiple
          item-label="title"
          item-value="id"
        />
      </div>
      <div class="grid gap-5 md:grid-cols-4">
        <AppFieldAppInputField
          v-model="body.startDate.$model"
          :errors="body.startDate.$errors"
          :label="$t('start-date')"
          :placeholder="$t('enter-start-date')"
          type="date"
        />
    
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
      <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
        <AppFieldAppInputField
          v-model="body.duration.$model"
          :errors="body.duration.$errors"
          :label="$t('duration-in-minutes')"
          :placeholder="$t('enter-duration')"
          disabled
        />
        <AppFieldAppInputField
          v-model="body.enterTimeAllowed.$model"
          :errors="body.enterTimeAllowed.$errors"
          :label="$t('enterance-time-allowed-in-minutes')"
          :placeholder="$t('enter-enterance-time-allowed')"
        />
      </div>
     
      <div class="quill-editor-container rounded-lg bg-gray-50 p-4 shadow-md">
        <label class="mb-2 block text-sm font-medium text-gray-700">
          {{ $t('exam-instructions') }}
        </label>
        <QuillEditor
          :value="body.instructions.$model"
          content-type="html"
          theme="snow"
          :toolbar="editorModules.toolbar"
          :clipboard="editorModules.clipboard"
          class="quill-editor"
          @update:content="updateInstructions"
        />
      </div>
    </div>
    <div v-else class="flex items-center justify-center h-full my-10">
        <div class="flex flex-col gap-4 items-center justify-center">
            <Icon name="ph-info-duotone" class="text-primary size-25" />
            <h1 class="text-2xl font-bold">
                قم بتحديد نوع الامتحان ليتم تحديد الاعدادات الخاصة به
            </h1>
        </div>
    </div>
    </Transition>
    <template #actions>
      <BaseButton color="primary" :loading="examStore.isLoading" class="gap-1" @click="submit">
        <Icon name="ph:upload-simple-duotone" class="size-5" />
        {{ $t('save-change') }}
      </BaseButton>
    </template>
  </AppDialog>
</template>
<style lang="scss">
.quill-editor-container {
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease-in-out;
}

.quill-editor-container:hover {
  border-color: #000000;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.quill-editor .ql-toolbar {
  background-color: #f9fafb; /* Light gray toolbar background */
  border-bottom: 1px solid #e5e7eb; /* Toolbar border */
  border-radius: 8px 8px 0 0; /* Rounded corners for the top */
}

.quill-editor .ql-container {
  border: none; /* Remove inner border */
  border-radius: 0 0 8px 8px; /* Rounded corners for the bottom */
}

.quill-editor .ql-editor {
  color: #374151; /* Dark gray text */
}

.quill-editor .ql-editor:focus {
  outline: none; /* Remove focus outline */
  box-shadow: 0 0 0 2px #3b82f6; /* Blue focus ring */
}
.quill-editor.border-red-500 .ql-toolbar,
.quill-editor.border-red-500 .ql-container {
  border-color: #ef4444 !important;
}

.quill-editor.border-red-500 .ql-toolbar {
  border-bottom: 1px solid #ef4444 !important;
}
.ql-editor {
  li:not(.ql-direction-rtl) {
    direction: ltr !important;
    text-align: left !important;
  }
}

// slide up and down transition
.slide-up-down-enter-active,
.slide-up-down-leave-active {
  transition: all 0.3s ease-in-out;
}

.slide-up-down-enter-from,
.slide-up-down-leave-to {
  transform: translateY(100%);
}

</style>
