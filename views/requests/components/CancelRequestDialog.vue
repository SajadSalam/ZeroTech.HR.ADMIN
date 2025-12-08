<script setup lang="ts">
import AppTextAreaField from '~/components/app-field/AppTextAreaField.vue'
import { requiredValidator } from '~/services/validation'
import { Validator } from '~/services/validator'
import { useRequestStore } from '../store'

const requestStore = useRequestStore()
const isCancelDialogOpen = ref(false)

const validator = new Validator<{ requestId: number; reason: string }>(
    {
        requestId: 0,
        reason: '',
    },
    {
        reason: {
            required: requiredValidator('سبب الإلغاء'),
        },
    }
)

const body = validator.validation

const isLoading = computed(() => requestStore.isLoading)

const cancelRequest = async () => {
    const isValid = await body.value.$validate()
    if (!isValid) return

    await requestStore.cancelRequest(validator.extractBody())
    validator.resetBody()
    isCancelDialogOpen.value = false
}

const openDialog = (requestId: number) => {
    body.value.requestId.$model = requestId
    isCancelDialogOpen.value = true
}

defineExpose({ openDialog })

watch(isCancelDialogOpen, (val: boolean) => {
    if (val) {
        validator.resetBody()
    }
})
</script>

<template>
    <AppDialog v-model="isCancelDialogOpen" title="إلغاء الطلب" size="md">
        <div class="rounded-3xl p-3">
            <p class="text-gray-700 mb-4">هل أنت متأكد من إلغاء هذا الطلب؟</p>

            <AppTextAreaField
                v-model="body.reason.$model"
                :errors="body.reason.$errors"
                size="md"
                label="سبب الإلغاء"
                rows="3"
                required
            />
        </div>
        <template #actions>
            <div class="flex gap-2">
                <BaseButton color="muted" @click="isCancelDialogOpen = false">
                    إلغاء
                </BaseButton>
                <BaseButton
                    color="danger"
                    class="gap-1"
                    :loading="isLoading"
                    @click="cancelRequest"
                >
                    <Icon name="ph:x-circle-duotone" class="size-5" />
                    إلغاء الطلب
                </BaseButton>
            </div>
        </template>
    </AppDialog>
</template>

