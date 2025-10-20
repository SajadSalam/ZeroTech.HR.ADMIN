<script setup lang="ts">
import AppTextAreaField from '~/components/app-field/AppTextAreaField.vue'
import { Validator } from '~/services/validator'
import { useRequestStore } from '../store'

const requestStore = useRequestStore()
const isApproveDialogOpen = ref(false)

const validator = new Validator<{
    approvalId: number
    isApproved: boolean
    comments: string
}>(
    {
        approvalId: 0,
        isApproved: true,
        comments: '',
    },
    {}
)

const body = validator.validation

const isLoading = computed(() => requestStore.isLoading)

const approveRequest = async () => {
    await requestStore.approveRequest(validator.extractBody())
    validator.resetBody()
    isApproveDialogOpen.value = false
}

const openDialog = (approvalId: number) => {
    body.value.approvalId.$model = approvalId
    body.value.isApproved.$model = true
    isApproveDialogOpen.value = true
}

defineExpose({ openDialog })

watch(isApproveDialogOpen, (val: boolean) => {
    if (val) {
        validator.resetBody()
    }
})
</script>

<template>
    <AppDialog
        v-model="isApproveDialogOpen"
        title="الموافقة على الطلب"
        size="md"
    >
        <div class="rounded-3xl p-3">
            <p class="text-gray-700 mb-4">
                هل أنت متأكد من الموافقة على هذا الطلب؟
            </p>

            <AppTextAreaField
                v-model="body.comments.$model"
                :errors="body.comments.$errors"
                size="md"
                label="تعليقات (اختياري)"
                rows="3"
            />
        </div>
        <template #actions>
            <div class="flex gap-2">
                <BaseButton color="muted" @click="isApproveDialogOpen = false">
                    إلغاء
                </BaseButton>
                <BaseButton
                    color="success"
                    class="gap-1"
                    :loading="isLoading"
                    @click="approveRequest"
                >
                    <Icon name="ph:check-circle-duotone" class="size-5" />
                    موافقة
                </BaseButton>
            </div>
        </template>
    </AppDialog>
</template>

