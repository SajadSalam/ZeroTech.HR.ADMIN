<script lang="ts" setup>
import { helpers, requiredIf } from '@vuelidate/validators'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { useI18n } from 'vue-i18n'
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import { createValidator } from '~/services/validationWithI18n'
import { Validator } from '~/services/validator'
import { useExamStore } from '../store/index'
import { ExamType, availableDaysOptions, examTypesOptions, proficiencyExamGroupOptions, type ExamCreate } from '../types/index'
import ExamCardCreationResult from './ExamCardCreationResult.vue'



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
    endDate: null,
    endTime: null,
    examType: null,
    // required only when exam type is not final
    examCenters: [],
    enterTimeAllowed: null,
    // required only when exam type is final
    examGroups: [],
    instructions: '',
    // required only when exam type is EvaluationProficiency
    price: 30000,
    // required only when exam type is EvaluationProficiency
    retryPrice: 20000,
    // required only when exam type is EvaluationProficiency
    proficiencyExamGroupId: null,
    availableDays: [],
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
        endDate: {
            required: createValidator(t, 'end-date', 'required'),
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
        examCenters: {
            required: createValidator(t, 'exam-centers', 'required'),
        },
        examGroups: {
            requiredIfFinal: helpers.withMessage(
                () => t('validation.required', { field: t('groups') }),
                requiredIf(computed(() => formData.examType === ExamType.Final))
            ),
        },
        price: {
            requiredIfProficiency: helpers.withMessage(
                () => t('validation.required', { field: t('price') }),
                requiredIf(computed(() => formData.examType === ExamType.EvaluationProficiency))
            ),
            minValue: createValidator(t, 'price', 'minValue', 0),
        },
        retryPrice: {
            requiredIfProficiency: helpers.withMessage(
                () => t('validation.required', { field: t('retry-price') }),
                requiredIf(computed(() => formData.examType === ExamType.EvaluationProficiency))
            ),
            minValue: createValidator(t, 'retry-price', 'minValue', 0),
        },
        proficiencyExamGroupId: {
            requiredIfProficiency: helpers.withMessage(
                () => t('validation.required', { field: t('proficiency-exam-group') }),
                requiredIf(computed(() => formData.examType === ExamType.EvaluationProficiency))
            ),
        },
        availableDays: {
            required: createValidator(t, 'available-days', 'required'),
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

    // Check for date validation
    if (body.value.startDate.$model && body.value.endDate.$model) {
        const startDate = body.value.startDate.$model
            ? new Date(body.value.startDate.$model as string)
            : null

        const endDate = body.value.endDate.$model ? new Date(body.value.endDate.$model as string) : null

        if (startDate && endDate && endDate < startDate) {
            useToast({
                message: t('end-date-before-start-date'),
                isError: true,
            })
            return
        }
    }

    // Check for time validation when dates are equal
    if (body.value.startDate.$model === body.value.endDate.$model) {
        const now = new Date().toISOString().split('T')[0]
        const startTime = new Date(`${now}T${body.value.startTime.$model}`)
        const endTime = new Date(`${now}T${body.value.endTime.$model}`)

        if (endTime <= startTime) {
            useToast({
                message: t('end-time-before-start-time'),
                isError: true,
            })
            return
        }
    }

    if (!isValid) {
        return
    }

    try {
        await examStore.createExam(validator.extractBody())
        validator.resetBody()
        isCreateDialogOpen.value = false
    } catch (error) { }
}
// watch(
//   ()=> true,
//   (val: boolean) => {
//     if (val) {
//       validator.resetBody()
//       body.value.examType.$model = examTypesOptions(t)[0].value;
//       body.value.price.$model = 30000;
//       body.value.retryPrice.$model = 20000;

//     }
//   }
// )
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

onMounted(() => {
    body.value.examType.$model = examTypesOptions(t)[0].value
})


const selectedGroupObjects = ref([])
const selectedExamCentersObjects = ref([])
const selectedAvailableDaysObjects = ref([])

function onSelectedGroups(items) {
  selectedGroupObjects.value = items
}

function onSeelectExamCenters(items) {
    selectedExamCentersObjects.value = items
}

function onSelectedAvailableDays(items) {
    selectedAvailableDaysObjects.value = items
}

</script>

<template>
    <div class="w-full h-screen grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 " >
        <div class="relative mb-6 col-span-2">
            <!-- Tabs -->
            <div class="flex gap-2 absolute -top-10 right-4">
                <button v-for="type in examTypesOptions($t)" :key="type.value" @click="updateExamType(type.value)"
                    class="px-4 py-1.5 text-lg font-bold rounded-t-lg border transition-all duration-200" :class="[
                        body.examType.$model === type.value
                            ? 'bg-white border-gray-300 border-b-white text-primary'
                            : 'bg-gray-200 text-gray-600 border-transparent hover:bg-gray-300'
                    ]">
                    {{ type.label }}
                </button>
            </div>

            <!-- Form container -->
            <div class="border border-gray-300 rounded-lg bg-white p-6">

                <div name="slide-up-down">
                    <div>
                        <h1 class="font-bold text-2xl">
                         {{ $t('create-exams') }} 
                        </h1>
                        <p class="text-[#9F9E9E]">
                            {{ $t('create-exams-with-filters') }}
                        </p>
                    </div>
                    <div class="flex flex-col gap-5 rounded-3xl p-3" v-if="body.examType.$model">
                        <AppFieldAppInputField v-model="body.title.$model" :errors="body.title.$errors"
                            :label="$t('title')" :placeholder="$t('enter-title')" />
                        <div class="grid gap-5 md:grid-cols-2">
                            <AppAutoCompleteField v-model="body.examTemplateId.$model" fetch-on-search
                                search-key="search" :errors="body.examTemplateId.$errors" :label="$t('blueprint')"
                                :placeholder="$t('blueprint')" get-url="/examtemplate" item-label="" item-value="id" />
                            <AppAutoCompleteField v-model="body.examType.$model" :items="examTypesOptions($t)"
                                item-label="label" item-value="value" :errors="body.examType.$errors"
                                :label="$t('exam-type')" :placeholder="$t('exam-type')" />

                        </div>
                        <!-- EvaluationProficiency specific fields -->
                        <div v-if="body.examType.$model === ExamType.EvaluationProficiency"
                            class="grid gap-5 md:grid-cols-3">
                            <AppFieldAppInputField v-model="body.price.$model" :errors="body.price.$errors"
                                :label="$t('price')" :placeholder="$t('price')" type="number" min="0" />
                            <AppFieldAppInputField v-model="body.retryPrice.$model" :errors="body.retryPrice.$errors"
                                :label="$t('retry-price')" :placeholder="$t('retry-price')" type="number" min="0" />
                            <AppAutoCompleteField v-model="body.proficiencyExamGroupId.$model"
                                :errors="body.proficiencyExamGroupId.$errors" :items="proficiencyExamGroupOptions($t)"
                                item-label="label" item-value="value" :placeholder="$t('proficiency-exam-group')"
                                :label="$t('proficiency-exam-group')" />
                        </div>
                        <div class="grid gap-5 md:grid-cols-2">
                            <AppAutoCompleteField v-model="body.examCenters.$model" :errors="body.examCenters.$errors"
                                :label="$t('exam-centers')" :placeholder="$t('exam-centers')"
                                item-subtitle="college.fullNameAr" get-url="/exam-center" search-key="search"
                                fetch-on-search multiple item-label="name"
                                :class="body.examType.$model != ExamType.Final ? 'col-span-2' : ''" item-value="id"
                                select-all @update:object-value="onSeelectExamCenters" />
                            <AppAutoCompleteField v-if="body.examType.$model == ExamType.Final"
                                v-model="body.examGroups.$model" fetch-on-search search-key="search"
                                :errors="body.examGroups.$errors" :label="$t('groups')" :placeholder="$t('groups')"
                                get-url="/groups" multiple item-label="name" item-value="id"
                                @update:objectValue="onSelectedGroups" 
                                />
                        </div>
                        <div class="grid gap-5 md:grid-cols-2">
                            <AppFieldAppInputField v-model="body.startDate.$model" :errors="body.startDate.$errors"
                                :label="$t('start-date')" :placeholder="$t('enter-start-date')" type="date" />
                            <AppFieldAppInputField v-model="body.endDate.$model" :errors="body.endDate.$errors"
                                :label="$t('end-date')" :placeholder="$t('enter-end-date')" type="date" />
                        </div>
                        <div class="grid gap-5 md:grid-cols-2">

                            <AppFieldAppInputField v-model="body.startTime.$model" :errors="body.startTime.$errors"
                                :label="$t('start-time')" :placeholder="$t('enter-start-time')" type="time" />
                            <AppFieldAppInputField v-model="body.endTime.$model" :errors="body.endTime.$errors"
                                :label="$t('end-time')" :placeholder="$t('enter-end-time')" type="time" />

                        </div>
                        <div class="grid gap-5 md:grid-cols-2">
                            <AppAutoCompleteField class="col-span-4" v-model="body.availableDays.$model"
                                :errors="body.availableDays.$errors" :label="$t('available-days')"
                                :placeholder="$t('available-days')" :items="availableDaysOptions($t)" item-label="label"
                                item-value="value" multiple @update:object-value="onSelectedAvailableDays" />
                        </div>
                        <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <AppFieldAppInputField v-model="body.duration.$model" :errors="body.duration.$errors"
                                :label="$t('duration-in-minutes')" :placeholder="$t('enter-duration')" disabled />
                            <AppFieldAppInputField v-model="body.enterTimeAllowed.$model"
                                :errors="body.enterTimeAllowed.$errors" :label="$t('enterance-time-allowed-in-minutes')"
                                :placeholder="$t('enter-enterance-time-allowed')" />
                        </div>

                        <div class="quill-editor-container bg-white p-4 ">
                            <label class="mb-2 block text-sm font-medium text-gray-700">
                                {{ $t('exam-instructions') }}
                            </label>
                            <QuillEditor :value="body.instructions.$model" content-type="html" theme="snow"
                                :toolbar="editorModules.toolbar" :clipboard="editorModules.clipboard"
                                class="quill-editor" @update:content="updateInstructions" />
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
                </div>

                <BaseButton color="primary" :loading="examStore.isLoading" class="gap-1 m-2 w-full" @click="submit">
                    <Icon name="ph:upload-simple-duotone" class="size-5" />
                    {{ $t('save-change') }}
                </BaseButton>
            </div>

        </div>
        <div class="flex flex-col gap-4">
            <ExamCardCreationResult 
                :title="examTypesOptions($t).find((type) => type.value === body.examType.$model)?.label"
                :description="body.title.$model ?? ''"
                :groups="selectedGroupObjects"
                :exam-centers="selectedExamCentersObjects"
                :start-time="body.startTime.$model ?? '09:00'"
                :end-time="body.endTime.$model ?? '09:00'" 
                :start-date="body.startDate.$model ?? new Date('2026-01-01')" 
                :end-date="body.endDate.$model ?? new Date('2026-01-01')"
                :available-days="selectedAvailableDaysObjects" />

        </div>

    </div>
</template>
<style lang="scss">
.quill-editor-container {
    // Remove all borders from container
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
    position: relative;
    label {
        border: none !important;
        margin-bottom: 8px;
    }
}

.quill-editor {
    border: 1px solid #d1d5db !important;
    border-bottom-left-radius:  6px !important;
    border-bottom-right-radius:  6px !important;
    transition: all 0.2s ease-in-out;
    width: 100%;
    height: 40vh;
}

.quill-editor:hover {
    border-color: #9ca3af !important;
}

.quill-editor:focus-within {
    border-color: #cddbf3 !important;
    box-shadow: 0 0 0 1px #9ca3af !important;
}

.quill-editor .ql-toolbar {
    border: none !important;
    border-bottom: 1px solid #e5e7eb !important;
    border-radius: 6px 6px 0 0 !important;
    background-color: #f9fafb;
}

.quill-editor .ql-container {
    border: none !important;
    border-radius: 0 0 6px 6px !important;
    font-size: 14px;
}

.quill-editor .ql-editor {
    color: #374151;
    min-height: 120px;
    border: none !important;
}

.quill-editor .ql-editor:focus {
    outline: none;
    border: none !important;
}

// Error state
.quill-editor.border-red-500,
.quill-editor-container.error .quill-editor {
    border-color: #ef4444 !important;
}

.quill-editor.border-red-500 .ql-toolbar,
.quill-editor-container.error .quill-editor .ql-toolbar {
    border-bottom-color: #ef4444 !important;
}

.quill-editor .ql-toolbar {
    background-color: #f9fafb;
    /* Light gray toolbar background */
    border-bottom: 1px solid #e5e7eb;
    /* Toolbar border */
    border-radius: 8px 8px 0 0;
    /* Rounded corners for the top */
}

.quill-editor .ql-container {
    border: none;
    /* Remove inner border */
    border-radius: 0 0 8px 8px;
    /* Rounded corners for the bottom */
}

.quill-editor .ql-editor {
    color: #374151;
    /* Dark gray text */
}

.quill-editor .ql-editor:focus {
    outline: none;
    /* Remove focus outline */
    box-shadow: 0 0 0 2px #9ca3af;
    /* Blue focus ring */
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
