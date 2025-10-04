<script lang="ts" setup>
import { computed, ref } from 'vue'
import AppFileUploaderButton from '../../../components/app-field/AppFileUploaderButton.vue'
import axios from '~/services/app-client/axios'

interface Props {
    modelValue: string | null
    placeholder?: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
    label?: string
    disabled?: boolean
    accept?: string
    error?: string | null
}

const props = withDefaults(defineProps<Props>(), {
    placeholder: '',
    size: 'md',
    disabled: false,
    accept: '*',
})

const emit = defineEmits<{
    'update:modelValue': [value: string | null]
}>()

const fileModel = computed({
    get: () => props.modelValue,
    set: (value: string | null) => emit('update:modelValue', value),
})

const file = ref<string | null>(null)

const isUploading = ref(false)
const progress = ref(0)
const uploadUrl = ref<string | null>(null)
const uploadFile = async () => {
    try {
        isUploading.value = true
        const formData = new FormData()
        formData.append('files', file.value as unknown as File)
        const response = await axios.post<{ url: string }[]>('/upload', formData, {
            onUploadProgress: (progressEvent: { loaded: number; total: number }) => {
                progress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            },
        })
        uploadUrl.value = response.data[0].url
        console.log(response.data)
        fileModel.value = uploadUrl.value as unknown as string
        isUploading.value = false
    } catch (error) {
        console.error(error)
    } finally {
        isUploading.value = false
    }
}

watch(file, () => {
    if (file.value) {
        uploadFile()
    }
})
</script>

<template>
    <div class="space-y-2">
        <p v-if="label" class="text-sm">
            {{ label }}
        </p>
        
        <div class="flex w-full items-center gap-2">
            <AppFileUploaderButton v-model="file" :accept="accept" :disabled="disabled || isUploading">
                <BaseButtonIcon :disabled="disabled || isUploading" variant="outline">
                    <Icon :name="isUploading ? 'tabler:loader' : 'tabler:file-upload'" class="text-primary-500"
                        :class="{ 'animate-spin': isUploading }" size="18" />

                </BaseButtonIcon>
                <span v-if="isUploading">
                    جاري الرفع
                </span>
                <span v-else>
                    رفع ملف الاسئلة المطلوب استيرادها
                </span>
            </AppFileUploaderButton>

        </div>
        <div v-if="isUploading" class="flex items-center gap-2 my-3">
            <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div class="bg-blue-600 h-2.5 rounded-full" :style="{ width: `${progress}%` }" />
                <p class="text-sm">{{ progress }}%</p>
            </div>
        </div>
        <div v-if="fileModel" class="flex items-center gap-2">
            <p>
                {{ $t('selected-file') }}:
                <span class="font-bold">{{ fileModel.split('/').pop() }}</span>
            </p>
            <Icon name="tabler:trash" class="cursor-pointer text-red-500" size="18" @click="fileModel = null" />
        </div>

        <p v-if="error" class="text-sm text-red-500">
            {{ error }}
        </p>
    </div>
</template>
