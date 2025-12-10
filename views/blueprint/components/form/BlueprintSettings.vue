<script setup lang="ts">
import { useBlueprintForm } from '~/views/blueprint/composables/useBlueprintForm'

const {
    body,
} = useBlueprintForm()

type SettingKey = 'displayResult' | 'moveBetweenQuestion' | 'randomizeAnswer' | 'randomizeChoices'

const settings: Array<{ key: SettingKey; translationKey: string }> = [
    {
        key: 'displayResult',
        translationKey: 'display-result',
    },
    {
        key: 'moveBetweenQuestion',
        translationKey: 'move-between-questions',
    },
    {
        key: 'randomizeAnswer',
        translationKey: 'randomize-answers',
    },
    {
        key: 'randomizeChoices',
        translationKey: 'randomize-choices',
    },
]

const getValue = (key: SettingKey) => {
    return body.value[key].$model
}

const toggleValue = (key: SettingKey) => {
    body.value[key].$model = !body.value[key].$model
}
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
            :color="getValue(setting.key) ? 'primary' : 'muted'"
            variant="pastel"
            size="md"
            class="pa-3 flex cursor-pointer items-center gap-2 text-lg"
            @click="toggleValue(setting.key)"
        >
            <div
                class="h-2 w-2 rounded-full"
                :class="{
                    'bg-primary-500': getValue(setting.key),
                    'bg-muted-300': !getValue(setting.key),
                }"
            />
            {{ $t(setting.translationKey) }}
        </BaseTag>
    </div>
</template>