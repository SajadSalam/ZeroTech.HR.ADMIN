<script setup lang="ts">
import AppInputField from '~/components/app-field/AppInputField.vue'
import type { MatchingItem, Question } from '~/views/question-bank/types/question'
import * as d3 from 'd3'

const leftItems = computed(() => {
  const items = modelValue.value!.matchingPairs!.map((pair: MatchingItem) => pair.left)
  return items.sort(() => Math.random() - 0.5)
})
const rightItems = computed(() => {
  const items = modelValue.value!.matchingPairs!.map((pair: MatchingItem) => pair.right)
  return items.sort(() => Math.random() - 0.5)
})

const selectedLeft = ref(null)
const selectedRight = ref(null)
const matches = ref([])
const svg = ref(null)

const selectLeft = (item, index) => {
  selectedLeft.value = { ...item, index }
  if (selectedRight.value) {
    selectMatch(item, index)
  }
}
const selectMatch = async () => {
  const leftIndex = selectedLeft.value.index
  const rightIndex = selectedRight.value.index

  const existingMatchIndex = matches.value.findIndex(
    (match) => match.left.index === leftIndex || match.right.index === rightIndex
  )

  if (existingMatchIndex !== -1) {
    matches.value.splice(existingMatchIndex, 1)
  } else {
    matches.value.push({
      left: { ...selectedLeft.value },
      right: { ...selectedRight.value, index: rightIndex },
    })
  }

  selectedLeft.value = null
  selectedRight.value = null
  await nextTick()
  drawLines()
}

const selectRight = async (item, index) => {
  selectedRight.value = { ...item, index }

  if (selectedLeft.value) {
    selectMatch(item, index)
  }
}

const drawLines = () => {
  d3.select(svg.value).selectAll('line').remove()

  matches.value.forEach(({ left, right }) => {
    const leftEl = document.querySelector(`[data-index='${left.index}']`).getBoundingClientRect()
    const rightEl = document.querySelector(`[data-index='${right.index}']`).getBoundingClientRect()

    const svgRect = svg.value.getBoundingClientRect()

    d3.select(svg.value)
      .append('line')
      .attr('x1', '100')
      .attr('y1', leftEl.top + leftEl.height / 2 - svgRect.top)
      .attr('x2', '80%')
      .attr('y2', rightEl.top + rightEl.height / 2 - svgRect.top)
      .attr('stroke', 'black')
      .attr('stroke-width', 2)
  })
}

onMounted(() => {
  svg.value = d3.select('svg')
  // randomize the order of the right items
  rightItems.value = rightItems.value.sort(() => Math.random() - 0.5)
  leftItems.value = leftItems.value.sort(() => Math.random() - 0.5)
})
const modelValue = defineModel<Question>({
  default: {} as Question,
})
</script>

<template>
  <div dir="ltr">
    <h1 class="my-3" :dir="$i18n.locale == 'ar' ? 'rtl' : 'ltr'">
      {{ $t('question-answers') }}
    </h1>

    <div class="z-2 relative flex w-full items-end justify-between gap-5 p-6" dir="ltr">
      <!-- Left Column -->
      <div>
        <div
          v-for="(item, index) in rightItems"
          :key="index"
          class="z-2 relative my-1 cursor-pointer rounded bg-blue-200 p-4 text-center"
          :class="{ 'bg-blue-500 text-white': selectedLeft === item }"
          :data-index="index"
          @click="selectLeft(item, index)"
        >
          {{ item }}
        </div>
      </div>

      <!-- SVG for Drawing Lines -->
      <svg ref="svg" class="z-1 pointer-events-none absolute start-0 top-0 h-full w-full" />

      <!-- Right Column -->
      <div>
        <div
          v-for="(item, index) in leftItems"
          :key="index"
          class="z-2 relative my-1 cursor-pointer rounded bg-green-200 p-4 text-center"
          :class="{
            'bg-green-500 text-white': selectedRight === item,
          }"
          :data-index="index + leftItems.length"
          @click="selectRight(item, index)"
        >
          {{ item }}
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.relative {
  position: relative;
}
svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
