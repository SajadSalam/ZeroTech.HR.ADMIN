<script setup lang="ts">
import ShowBlueprint from '~/views/blueprint/components/ShowBlueprint.vue'

definePageMeta({
  title: 'blueprint_details',
  description: 'blueprint_details_description',
})
const route = useRoute()
const blueprintId = computed(() => route.params.id)

</script>
<template>
  <div>
    <ShowBlueprint :blueprint-id="blueprintId" />
  </div>
</template>

<style></style>
