<script setup lang="ts">
defineProps<{
  label: string
  value: string | number | undefined
  icon?: string
}>()
</script>

<template>
  <div class="flex w-fit items-center gap-4 p-4 shadow-sm">
    <Icon :name="icon || 'ph:thumbs-up-duotone'" class="size-7 text-primary-500" />
    <div>
      <BaseHeading tag="h2" weight="medium" class="text-sm text-muted-600 dark:text-muted-100">
        {{ $t(label) }}
      </BaseHeading>
      <BaseParagraph size="xl" lead="none" class="text-800 text-sm font-semibold dark:text-white">
        <span>{{ value ?? '-' }}</span>
      </BaseParagraph>
    </div>
  </div>
</template>
