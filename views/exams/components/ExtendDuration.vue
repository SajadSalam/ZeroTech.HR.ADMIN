<script lang="ts" setup>
import { useExamStore } from '../store/index'
import AppInputField from '~/components/app-field/AppInputField.vue'

const examStore = useExamStore()

const durationMinutes = ref<number>(0)
const isLoading = computed(() => examStore.isLoading)
const emit = defineEmits(['refresh'])
const extendDuration = async () => {
    await examStore.extendDuration(durationMinutes.value)
    emit('refresh')
    examStore.isExtendDurationDialogOpen = false
}
watch(() => examStore.isExtendDurationDialogOpen, () => {
    durationMinutes.value = 0
})
</script>

<template>
    <AppDialog v-model="examStore.isExtendDurationDialogOpen" :title="$t('extend-duration')" size="md"
        overflow-y="visible">
        <div class="flex flex-col rounded-3xl p-3">
            <AppInputField v-model="durationMinutes" :label="$t('duration')" :placeholder="$t('enter-duration')" type="number" />
        </div>
        <div class="flex justify-end w-full">
            <BaseButton class="mt-5" :loading="isLoading" color="primary" size="lg" @click="extendDuration">
                {{ $t('extend-duration') }}
            </BaseButton>
        </div>
    </AppDialog>
</template>

<style></style>
