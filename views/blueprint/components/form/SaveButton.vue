<script setup lang="ts">
import type { BlueprintCreate } from '~/views/blueprint/types'
import { useBlueprintForm } from '~/views/blueprint/composables/useBlueprintForm'

interface Props {
    blueprintCardsRef?: { exceedsLimit: (qbIndex: number, topicIndex: number) => boolean } | null
}

const props = defineProps<Props>()
const route = useRoute()
const blueprintId = computed(() => route.params.id == 'create' ? undefined : route.params.id as string)

const {
    isLoading,
    submit,
} = useBlueprintForm()

const handleSubmit = () => {
    const exceedsLimitFn = props.blueprintCardsRef?.exceedsLimit 
    submit(blueprintId.value, exceedsLimitFn)
}
</script>

<template>
    <BaseButton :loading="isLoading" :disabled="isLoading" color="primary" class="w-full mb-10 gap-1" @click="handleSubmit">
        <Icon name="ph:check-circle-duotone" class="size-5" />
        {{ $t('save-change') }}
    </BaseButton>
</template>