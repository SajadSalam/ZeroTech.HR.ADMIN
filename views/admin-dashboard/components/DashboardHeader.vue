<template>
  <div class="mb-6 flex flex-col justify-between md:flex-row md:items-center">
    <div
      class="flex max-w-[425px] flex-col items-center gap-4 text-center md:flex-row md:text-left lg:max-w-full ltablet:max-w-full"
    >
      <div>
        <BaseParagraph>
          <span class="text-muted-500">{{ $t(title) }}</span>
        </BaseParagraph>
        <BaseHeading as="h2" size="2xl" weight="light" lead="tight" class="dark:text-white">
          <span>{{ $t(subTitle) }}</span>
        </BaseHeading>
      </div>
    </div>
    <div class="mt-4 flex items-center justify-center gap-2 md:mt-0 md:justify-start">
      <BaseButton color="primary">
        <span>{{ $t(buttonText) }}</span>
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  title: {
    type: String,
    required: true,
  },
  subTitle: {
    type: String,
    required: true,
  },
  buttonText: {
    type: String,
    required: true,
  },
})
</script>
