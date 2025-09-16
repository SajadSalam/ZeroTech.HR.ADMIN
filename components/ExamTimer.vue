<template>
    <div class="flex flex-col items-center gap-4">
        <!-- Timer Title -->
        <h3 class="text-center text-gray-600 font-medium text-sm">
            {{ !isStartExam ? $t('time-remaining-for-exam') : $t('time-remaining-for-start-exam') }}
        </h3>

        <!-- Timer Display -->
        <div class="flex items-center gap-3">
            <!-- Seconds -->
            <div class="flex flex-col items-center gap-2">
                <div class="text-3xl font-bold text-orange-500 min-w-[45px] text-center">
                    {{ timeRemaining.seconds.toString().padStart(2, '0') }}
                </div>
                <div class="text-xs text-gray-500 font-normal">
                    {{ $t('second') }}
                </div>
            </div>
            <div class="flex flex-col gap-1 pb-4">
                <div class="w-1 h-1 bg-orange-500 rounded-full"></div>
                <div class="w-1 h-1 bg-orange-500 rounded-full"></div>
            </div>

            <!-- Minutes -->
            <div class="flex flex-col items-center gap-2">
                <div class="text-3xl font-bold text-orange-500 min-w-[45px] text-center">
                    {{ timeRemaining.minutes.toString().padStart(2, '0') }}
                </div>
                <div class="text-xs text-gray-500 font-normal">
                    {{ $t('minute') }}
                </div>
            </div>
            <div class="flex flex-col gap-1 pb-4">
                <div class="w-1 h-1 bg-orange-500 rounded-full"></div>
                <div class="w-1 h-1 bg-orange-500 rounded-full"></div>
            </div>

            <!-- Hours -->
            <div class="flex flex-col items-center gap-2">
                <div class="text-3xl font-bold text-orange-500 min-w-[45px] text-center">
                    {{ timeRemaining.hours.toString().padStart(2, '0') }}
                </div>
                <div class="text-xs text-gray-500 font-normal">
                    {{ $t('hour') }}
                </div>
            </div>


        </div>

        <!-- Timer Expired Message (optional) -->
        <div v-if="isExpired" class="text-red-500 text-sm font-medium">
            {{ $t('exam-time-expired') }}
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
  /**
   * The end datetime for the timer countdown
   * Can be a Date object, ISO string, or timestamp
   */
  endTime: Date | string | number
  /**
   * Whether to show expired message when timer reaches zero
   */
  showExpiredMessage?: boolean
  isStartExam: boolean
}

interface Emits {
  /**
   * Emitted when the timer reaches zero
   */
  (event: 'expired'): void
  /**
   * Emitted every second with the remaining time
   */
  (event: 'tick', timeRemaining: { hours: number; minutes: number; seconds: number }): void
}

const props = withDefaults(defineProps<Props>(), {
  showExpiredMessage: true
})

const emit = defineEmits<Emits>()

// Timer state
const timeRemaining = ref({ hours: 0, minutes: 0, seconds: 0 })
const timerInterval = ref<NodeJS.Timeout | null>(null)
const isExpired = ref(false)

// Convert prop to Date object
const examEndTime = computed(() => {
  if (props.endTime instanceof Date) {
    return props.endTime
  }
  return new Date(props.endTime)
})

// Calculate time remaining
const updateTimer = () => {
  const now = new Date().getTime()
  const endTime = examEndTime.value.getTime()
  const difference = endTime - now

  if (difference > 0) {
    const hours = Math.floor(difference / (1000 * 60 * 60))
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((difference % (1000 * 60)) / 1000)
    
    timeRemaining.value = { hours, minutes, seconds }
    isExpired.value = false
    
    // Emit tick event
    emit('tick', timeRemaining.value)
  } else {
    timeRemaining.value = { hours: 0, minutes: 0, seconds: 0 }
    isExpired.value = true
    
    // Stop timer and emit expired event
    if (timerInterval.value) {
      clearInterval(timerInterval.value)
      timerInterval.value = null
    }
    
    emit('expired')
  }
}

// Start timer on component mount
onMounted(() => {
  updateTimer()
  timerInterval.value = setInterval(updateTimer, 1000)
})

// Clean up timer on component unmount
onUnmounted(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
  }
})

// Watch for changes in endTime prop
watch(() => props.endTime, () => {
  // Restart timer when endTime changes
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
  }
  
  updateTimer()
  timerInterval.value = setInterval(updateTimer, 1000)
}, { immediate: true })
</script>