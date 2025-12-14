<script setup lang="ts">
import BlueprintFormHeader from '~/views/blueprint/components/form/BlueprintFormHeader.vue'
import BlueprintCards from '~/views/blueprint/components/form/BlueprintCards.vue'
import BlueprintSummary from '~/views/blueprint/components/form/BlueprintSummary.vue'
import BlueprintSettings from '~/views/blueprint/components/form/BlueprintSettings.vue'
import SaveButton from '~/views/blueprint/components/form/SaveButton.vue'
import { useBlueprintStore } from '~/views/blueprint/store'
import { useBlueprintForm } from '~/views/blueprint/composables/useBlueprintForm'

definePageMeta({
    title: 'blueprints',
    description: 'create-and-manage-blueprints',
})
const route = useRoute()
const blueprintStore = useBlueprintStore()
const blueprintId = computed(() => route.params.id == 'create' ? undefined : route.params.id as string)

const { populateFormFromBlueprint } = useBlueprintForm()

onMounted(async () => {
    if (blueprintId.value) {
        const blueprint = await blueprintStore.getById(blueprintId.value)
        if (blueprint) {
            await populateFormFromBlueprint(blueprint)
        }
    }
})
</script>
<template>
    <div class="mb-2 rounded-3xl bg-white p-3">
        <BlueprintFormHeader />
        <BlueprintCards />
        <BlueprintSummary />
        <BlueprintSettings />
        <SaveButton />
    </div>
</template>
