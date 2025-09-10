<script lang="ts" setup>
import type { ApexOptions } from 'apexcharts'
interface Props {
  title: string
  count: number | string
  icon: string
  chartOptions: ApexOptions
}

const props = defineProps<Props>()
</script>

<template>
  <div class="col-span-12 sm:col-span-3 ptablet:col-span-6">
    <BaseCard class="p-6">
      <div class="flex items-center justify-between">
        <Icon :name="icon" class="size-7 text-primary-500" />
        <BaseHeading as="h3" size="xl" weight="semibold" lead="tight" class="mb-1 text-muted-600">
          <span>{{ $t(title) }}</span>
        </BaseHeading>
      </div>
      <div class="flex items-center justify-between gap-6 pt-4">
        <div class="grow">
          <span class="font-sans text-xl font-semibold text-muted-800 dark:text-muted-100">
            {{ count }}
          </span>
        </div>
        <div class="grow">
          <AddonApexcharts v-bind="chartOptions" />
        </div>
      </div>
    </BaseCard>
  </div>
</template>
