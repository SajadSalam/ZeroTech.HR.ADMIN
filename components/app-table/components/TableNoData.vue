<script setup lang="ts">
const props = defineProps({
  cols: Number,
  title: {
    type: String,
    default: 'no-data-found',
  },
  subtitle: {
    type: String,
    default: 'no-data-found-subtitle',
  },
})
</script>

<template>
  <TairoTableRow :hoverable="false">
    <TairoTableCell class="!rounded" :colspan="props.cols">
      <BasePlaceholderPage :title="$t(props.title)" :subtitle="$t(props.subtitle)" />
    </TairoTableCell>
  </TairoTableRow>
</template>
