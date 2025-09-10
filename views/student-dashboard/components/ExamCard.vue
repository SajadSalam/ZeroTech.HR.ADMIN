<template>
  <div class="relative lg:w-1/3">
    <BaseCard :rounded="'md'">
      <div class="flex flex-col items-center p-6 pb-0 sm:flex-row">
        <div class="full flex items-center gap-2">
          <BaseAvatar :text="String(avatarText)" size="xs" :class="avatarClass" />
          <h4 class="font-size-[22px] font-sans text-base">{{ $t(title) }}</h4>
          <span :class="statusClass" />
        </div>
      </div>
      <div class="flex flex-col items-center justify-between p-6 sm:flex-row">
        <div :class="`border-t-3 w-full ${borderClass}`">
          <div class="mt-6 max-h-[500px] min-h-[500px] overflow-y-auto">
            <BaseCard
              v-for="(item, index) in items"
              :key="index"
              :rounded="'md'"
              class="mb-4 shadow-lg"
            >
              <div class="flex flex-col items-center p-6">
                <div class="flex w-full items-center gap-2">
                  <BaseTag variant="pastel" :color="item.tagColor" size="md">
                    {{ item.tag }}
                  </BaseTag>
                  <span class="ml-auto text-primary">{{ item.time }}</span>
                </div>
                <span class="font-size-[20px] mt-4 w-full text-left">{{ item.address }}</span>
                <BaseProgress class="mt-4" :value="item.progress" size="sm" color="primary" />
                <span class="font-size-[14px] mt-4 w-full text-left font-bold">{{
                  item.description
                }}</span>
                <span class="w-full text-left text-muted-600">{{ item.date }}</span>
              </div>
            </BaseCard>
          </div>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
interface CardItem {
  tag: string
  tagColor: 'primary' | 'success' | 'danger'
  time: string
  address: string
  progress: number
  description: string
  date: string
}

defineProps({
  avatarText: {
    type: [String, Number],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  statusClass: {
    type: String,
    required: true,
  },
  borderClass: {
    type: String,
    required: true,
  },
  avatarClass: {
    type: String,
    required: true,
  },
  items: {
    type: Array as unknown as PropType<CardItem[]>,
    required: true,
  },
})
</script>
