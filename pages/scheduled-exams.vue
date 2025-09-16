<script lang="ts" setup>
import { useI18n } from 'vue-i18n'

definePageMeta({
  title: 'scheduled-exams',
  description: 'this-is-the-scheduled-exams-page',
})
const currentDate = ref(new Date())
const showinDates = computed(() => {
  const dates = []
  for (let i = 0; i < 5; i++) {
    const date = new Date(currentDate.value)
    date.setDate(date.getDate() + i)
    dates.push(date)
  }
  return dates
})
const examCenter = ref([
  'Al-Mustafa University',
  'University of technology',
  'Al-Mustansiriyah University',
  'University of Baghdad',
  'Al-Nahrain University',
  'University of Kufa',
  'University of Basra',
  'University of Mosul',
  'University of Babylon',
])
const i18n = useI18n()
const dateToDay = (date: Date) => {
  const days = {
    ar: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
    en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  }
  return date.getDate() + 1 + ' ' + days[i18n.locale.value][date.getDay()]
}
const moveToNextFiveDays = () => {
  const date = currentDate.value
  date.setDate(date.getDate() + 5)
  currentDate.value = date
}
const previousFiveDays = () => {
  const date = currentDate.value
  date.setDate(date.getDate() - 5)
  currentDate.value = date
}
</script>

<template>
  <div>
    <div class="mb-4">
      <!-- current month -->
      <div class="flex items-center gap-3">
        <BaseButtonIcon color="none" @click="previousFiveDays()">
          <Icon :name="$i18n.locale == 'ar' ? 'tabler-chevron-right' : 'tabler-chevron-left'" />
        </BaseButtonIcon>

        <h1 class="text-2xl font-bold">
          {{
            currentDate.toLocaleString($i18n.locale, {
              month: 'long',
            })
          }}
        </h1>
        <BaseButtonIcon color="none" @click="moveToNextFiveDays()">
          <Icon :name="$i18n.locale == 'ar' ? 'tabler-chevron-left' : 'tabler-chevron-right'" />
        </BaseButtonIcon>
      </div>
    </div>
    <div class="flex items-stretch justify-between">
      <div class="w-full rounded-lg bg-white text-center">
        <div class="border-1 pa-3 border">{{ $t('exam-center') }}</div>
        <div v-for="exam in examCenter" :key="exam" class="border-1 pa-4 border">
          <BaseCard class="pa-3 cursor-pointer !border-0 text-start hover:bg-muted-100">
            <h4 class="font-bold">{{ exam }}</h4>
          </BaseCard>
        </div>
      </div>
      <div v-for="day in showinDates" :key="day" class="w-full bg-white text-center">
        <div class="border-1 pa-3 border">
          {{ dateToDay(day) }}
        </div>
        <div v-for="exam in examCenter" :key="exam" class="border-1 pa-3 border bg-transparent">
          <BaseCard
            class="border-1 pa-3 cursor-pointer !border-s-4 !border-primary-500 text-start hover:bg-muted-100"
          >
            <h1 class="font-bold">Final Exam</h1>
            <p class="text-xs text-muted-500">8:00 AM - 10:00 AM</p>
            <p class="text-xs text-muted-500">Room 101</p>
          </BaseCard>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
:root {
  --sx-color-primary: #2051e5;
  --sx-color-primary-container: #b2c3f6;
  --sx-color-on-primary-container: #2051e5;
}
.calendar-container {
  max-width: 100%;
  margin: 0 auto;
  border-radius: 16px;
}
</style>
