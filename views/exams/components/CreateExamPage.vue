<script lang="ts" setup>
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { useI18n } from 'vue-i18n'
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import { createValidator } from '~/services/validationWithI18n'
import { Validator } from '~/services/validator'
import { useExamStore } from '../store/index'
import { type ExamCreate } from '../types/index'
import ExamCardCreationResult from './ExamCardCreationResult.vue'
import AppInputField from '~/components/app-field/AppInputField.vue'



const examStore = useExamStore()
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
    title: null,
    examTemplateId: null,
    startAt: null,
    durationMinutes: null,
    allowEnterBeforeMinutes: null,
    allowEnterAfterMinutes: null,
    groupId: null,
    description: '',
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
        startAt: {
            required: createValidator(t, 'start-date', 'required'),
        },
        durationMinutes: {
            required: createValidator(t, 'duration', 'required'),
            minValue: createValidator(t, 'duration', 'minValue', 30),
        },
        allowEnterBeforeMinutes: {
            required: createValidator(t, 'enterance-time-allowed-before', 'required'),
            minValue: createValidator(t, 'enterance-time-allowed-before', 'minValue', 1),
        },
        allowEnterAfterMinutes: {
            required: createValidator(t, 'enterance-time-allowed-after', 'required'),
            minValue: createValidator(t, 'enterance-time-allowed-after', 'minValue', 1),
        },
    }
)

const body = validator.validation

const router = useRouter()
const submit = async () => {
    const isValid = await body.value.$validate()
    if (!isValid) {
        return
    }
    try {
        await examStore.createExam(validator.extractBody())
        validator.resetBody()
        router.push('/exams')
    } catch (error) {
        console.error(error)
    }
}

</script>

<template>
    <div class="w-full h-screen grid grid-cols-1 lg:grid-cols-3 gap-6  ">
        <div class="relative mb-6 col-span-2">
            <!-- Tabs -->
            <div class="flex gap-2 absolute -top-10 right-4">
                <button
                    class="px-4 py-1.5 text-lg font-bold rounded-t-lg border transition-all duration-200 bg-white border-gray-300 border-b-white text-primary
                    " >
                    {{ $t('create-exams') }}
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
                    <div class="flex flex-col gap-5 rounded-3xl p-3">
                        <AppInputField v-model="body.title.$model" :errors="body.title.$errors"
                            :label="$t('title')" :placeholder="$t('enter-title')" />
                        <div class="grid gap-5 md:grid-cols-1">
                            <AppAutoCompleteField v-model="body.examTemplateId.$model" fetch-on-search
                                search-key="search" :errors="body.examTemplateId.$errors" :label="$t('blueprint')"
                                :placeholder="$t('blueprint')" get-url="/exam-templates" item-label="title"
                                item-value="id" />
                                <AppAutoCompleteField 
                                    v-model="body.groupId.$model" fetch-on-search search-key="name"
                                    :errors="body.groupId.$errors" :label="$t('group')" :placeholder="$t('group')"
                                    get-url="/groups/lookup" without-data item-label="title" item-value="id"
                                    />

                        </div>
                    
                        <div class="grid gap-5 md:grid-cols-2">

                            <AppInputField v-model="body.startAt.$model" :errors="body.startAt.$errors"
                                :label="$t('start-date')" :placeholder="$t('enter-start-date')" type="datetime-local" />
                            <AppInputField v-model="body.durationMinutes.$model" :errors="body.durationMinutes.$errors"
                                :label="$t('duration-in-minutes')" :placeholder="$t('enter-duration')" type="number" />
                            <AppInputField v-model="body.allowEnterBeforeMinutes.$model"
                                :errors="body.allowEnterBeforeMinutes.$errors" :label="$t('enterance-time-allowed-before')"
                                :placeholder="$t('enterance-time-allowed-before')" type="number" />
                            <AppInputField v-model="body.allowEnterAfterMinutes.$model"
                                :errors="body.allowEnterAfterMinutes.$errors"
                                :label="$t('enterance-time-allowed-after')"
                                :placeholder="$t('enterance-time-allowed-after')" type="number" />
                        </div>

                        <div class="quill-editor-container bg-white p-4 ">
                            <label class="mb-2 block text-sm font-medium text-gray-700">
                                {{ $t('exam-instructions') }}
                            </label>
                            <QuillEditor :value="body.description.$model" content-type="html" theme="snow"
                                :toolbar="editorModules.toolbar" :clipboard="editorModules.clipboard"
                                class="quill-editor" />
                        </div>
                    </div>


                </div>

                <BaseButton color="primary" :loading="examStore.isLoading" :disabled="examStore.isLoading" class=" w-full " @click="submit">
                    <Icon name="ph:upload-simple-duotone" class="size-5 me-3" />
                    {{ $t('save-change') }}
                </BaseButton>
            </div>

        </div>
        <div class="flex flex-col gap-4">
            <ExamCardCreationResult
             :title="body.title.$model ?? ''"
                :description="body.description.$model ?? ''" :group="body.groupId.$model"
                :start-at="body.startAt.$model"
                :blueprint-id="body.examTemplateId.$model ?? 0"
                :duration-minutes="body.durationMinutes.$model ?? 0"
            />
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
    border-bottom-left-radius: 6px !important;
    border-bottom-right-radius: 6px !important;
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
