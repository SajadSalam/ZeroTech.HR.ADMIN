<script lang="ts" setup>
import { Validator } from '~/services/validator'
import { useExamStore } from '../store/index'
import type { ScheduleExam } from '../types'
import AppInputField from '~/components/app-field/AppInputField.vue'

const examStore = useExamStore()

const validator = new Validator<ScheduleExam>(
    {
        startAt: undefined,
        durationMinutes: undefined,
    },
)
const isLoading = computed(() => examStore.isLoading)
const emit = defineEmits(['refresh'])
const updateSchedule = async () => {
    await examStore.updateSchedule(validator.extractBody())
    emit('refresh')
    examStore.isUpdateScheduleDialogOpen = false
}
watch(() => examStore.isUpdateScheduleDialogOpen, (value) => {
    if (value) {
        validator.fillBody({
            startAt: new Date(examStore.exam?.startAtUtc as string).toISOString().slice(0, 16),
            durationMinutes: examStore.exam?.durationMinutes,
        })
    } else {
        validator.resetBody()
    }
})
const body = validator.validation
</script>

<template>
    <AppDialog v-model="examStore.isUpdateScheduleDialogOpen" :title="$t('update-schedule')" size="md"
        overflow-y="visible">
        <div class="flex flex-col rounded-3xl p-3">
            <AppInputField v-model="body.startAt.$model" :label="$t('start-date')" :placeholder="$t('enter-start-date')" type="datetime-local" />
            <AppInputField v-model="body.durationMinutes.$model" :label="$t('duration')" :placeholder="$t('enter-duration')" type="number" />
        </div>
        <div class="flex justify-end w-full">
            <BaseButton class="mt-5" :loading="isLoading" color="primary" size="lg" @click="updateSchedule">
                {{ $t('update-schedule') }}
            </BaseButton>
        </div>
    </AppDialog>
</template>

<style></style>
