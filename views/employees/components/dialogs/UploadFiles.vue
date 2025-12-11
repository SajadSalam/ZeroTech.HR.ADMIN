<script setup lang="ts">
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import AppInputField from '~/components/app-field/AppInputField.vue'
import AppFileField from '~/components/app-field/AppFileField.vue'
import { requiredValidator } from '~/services/validation'
import { Validator } from '~/services/validator'
import { useEmployeeStore } from '../../store'
import axios from '~/services/app-client/axios'

const employeeStore = useEmployeeStore()
const employeeId = useRoute().params.id
const isLoading = ref(false)

const body = ref({
    file: [] as (string | File)[],
    attachmentType: "",
    description: '',
})

const uploadFiles = async () => {
    if (!employeeId) {
        console.error('No employee selected')
        return
    }

    if (!body.value.file || body.value.file.length === 0) {
        console.error('No file selected')
        return
    }

    try {
        isLoading.value = true
        
        // Upload each file separately
        for (const file of body.value.file) {
            if (file instanceof File) {
                const formData = new FormData()
                formData.append('file', file)
                formData.append('attachmentType', body.value.attachmentType)
                formData.append('description', body.value.description)

                await axios.post(
                    `/Employee/${employeeId}/attachments`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                )
            }
        }

        // Reset form and close dialog
        body.value = {
            file: [],
            attachmentType: "",
            description: '',
        }
        employeeStore.isCreateDialogOpen = false
    } catch (error) {
        console.error('Error uploading files:', error)
        throw error
    } finally {
        isLoading.value = false
    }
}

watch(
  () => employeeStore.isCreateDialogOpen,
  (val: boolean) => {
    if (val) {
      body.value = {
        file: [],
        attachmentType: "",
        description: '',
      }
    }
  }
)

</script>

<template>
  <AppDialog
    v-model="employeeStore.isCreateDialogOpen"
    title="رفع الوثائق"
    size="xl"
    overflow-y="visible"
  >
    <div class="rounded-3xl p-3">
      <div class="flex flex-col gap-4">
        <AppInputField v-model="body.attachmentType" label="نوع الوثيقة" placeholder="نوع الوثيقة" />
            <AppInputField
                v-model="body.description"
                label="وصف الوثيقة"
                placeholder="وصف الوثيقة"
            />
            <div>
                <div class="mb-2 text-sm font-medium text-gray-700">الملف</div>
                <AppFileField
                    v-model="body.file"
                    accept="*"
                    :multiple="true"
                />
            </div>
        </div>
    </div>
    <template #actions>
      <BaseButton 
        color="primary" 
        class="gap-1" 
        :loading="isLoading"
        :disabled="isLoading"
        @click="uploadFiles"
      >
        <Icon name="ph:upload-simple-duotone" class="size-5" />
        رفع الوثائق
      </BaseButton>
    </template>
  </AppDialog>
</template>
