<script setup lang="ts">
import { useBlueprintForm } from '~/views/blueprint/composables/useBlueprintForm'

const {
    body,
} = useBlueprintForm()


const settings: { key: string; name: string }[] = [
    {
        key: 'displayResult',
        name: 'display-result',
    },
    {
        key: 'moveBetweenQuestion',
        name: 'move-between-questions',
    },
    {
        key: 'randomizeAnswer',
        name: 'randomize-answers',
    },
    {
        key: 'randomizeChoices',
        name: 'randomize-choices',
    },
]
</script>

<template>
    <h2 class="mt-5 text-lg font-bold">
        {{ $t('more-settings') }}
    </h2>
    <p class="text-sm text-muted-500">
        {{ $t('select-the-options-of-the-exam') }}
    </p>
    <div class="my-3 grid gap-5 md:grid-cols-6">
        <BaseTag
            v-for="setting in settings"
            :key="setting.key"
            :color="body[setting.key].$model ? 'primary' : 'muted'"
            variant="pastel"
            size="md"
            class="pa-3 flex cursor-pointer items-center gap-2 text-lg"
            @click="body[setting.key].$model = !body[setting.key].$model"
        >
            <div
                class="h-2 w-2 rounded-full"
                :class="{
                    'bg-primary-500': body[setting.key].$model,
                    'bg-muted-300': !body[setting.key].$model,
                }"
            />
            {{ $t(setting.name) }}
        </BaseTag>
    </div>
</template>