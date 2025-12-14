<script setup lang="ts">
import { useBlueprintForm } from '~/views/blueprint/composables/useBlueprintForm'

const route = useRoute()
const blueprintId = computed(() => route.params.id == 'create' ? undefined : route.params.id as string)

const {
    isLoading,
    submit,
} = useBlueprintForm()

const handleSubmit = () => {
    submit(blueprintId.value)
}
</script>

<template>
    <BaseButton :loading="isLoading" :disabled="isLoading" color="primary" class="w-full mb-10 gap-1" @click="handleSubmit">
        <Icon name="ph:check-circle-duotone" class="size-5" />
        {{ $t('save-change') }}
    </BaseButton>
</template>