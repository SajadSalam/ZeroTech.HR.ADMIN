<script setup lang="ts">
import DetailCardsGrid, { type DetailCard } from '~/components/DetailCardsGrid.vue'
import EmployeeTrackingMap from '~/views/attendance/components/EmployeeTrackingMap.vue'
import { useEmployeeStore } from '~/views/employees/store'
import { zoneService } from '~/views/zones/service'
import type { AttendanceRecord } from '../types'
import type { LocationTimestampDto, MapZoneDisplay } from '../types'
import { formatDate } from '~/services/formatters'

const props = defineProps<{
  modelValue: boolean
  record: AttendanceRecord | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const employeeStore = useEmployeeStore()
const zonesToDisplay = ref<MapZoneDisplay[]>([])
const isLoadingZone = ref(false)

const employeesToDisplay = computed<LocationTimestampDto[]>(() => {
  const r = props.record
  if (!r) return []

  const points: LocationTimestampDto[] = []
  if (r.checkInLatitude != null && r.checkInLongitude != null) {
    points.push({
      id: 1,
      employeeId: r.employeeId,
      latitude: r.checkInLatitude,
      longitude: r.checkInLongitude,
      recordedAt: r.checkInTime || '',
      clientTimestamp: '',
    })
  }
  if (r.checkOutLatitude != null && r.checkOutLongitude != null) {
    points.push({
      id: 2,
      employeeId: r.employeeId,
      latitude: r.checkOutLatitude,
      longitude: r.checkOutLongitude,
      recordedAt: r.checkOutTime || '',
      clientTimestamp: '',
    })
  }
  return points
})

const hasLocationData = computed(() => {
  const r = props.record
  if (!r) return false
  const hasCheckIn = r.checkInLatitude != null && r.checkInLongitude != null
  const hasCheckOut = r.checkOutLatitude != null && r.checkOutLongitude != null
  return hasCheckIn || hasCheckOut
})

const detailCards = computed<DetailCard[]>(() => {
  const r = props.record
  if (!r) return []

  const formatTime = (t: string) => {
    if (!t) return '—'
    return new Date(t).toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' })
  }

  return [
    {
      title: 'معلومات الموظف',
      icon: 'ph:user',
      iconColor: 'primary',
      items: [
        { label: 'اسم الموظف', value: r.employeeName },
        { label: 'الرقم الوظيفي', value: r.employeeNumber },
        { label: 'تاريخ الحضور', value: formatDate(r.attendanceDate) },
        { label: 'وقت الدخول', value: formatTime(r.checkInTime) },
        { label: 'وقت الخروج', value: formatTime(r.checkOutTime) },
      ],
    },
    {
      title: 'تفاصيل الحضور',
      icon: 'ph:clock',
      iconColor: 'emerald',
      items: [
        { label: 'الشفت', value: r.workScheduleShiftName || '—' },
        { label: 'ساعات العمل', value: `${r.hoursWorked?.toFixed(2) || 0}` },
        { label: 'ساعات إضافية', value: `${r.overtimeHours?.toFixed(2) || 0}` },
        {
          label: 'تأخير دخول',
          value: r.isLateCheckIn ? 'نعم' : 'لا',
          badgeVariant: r.isLateCheckIn ? 'danger' : 'success',
        },
        {
          label: 'خروج مبكر',
          value: r.isEarlyCheckOut ? 'نعم' : 'لا',
          badgeVariant: r.isEarlyCheckOut ? 'danger' : 'success',
        },
      ],
    },
  ]
})

const loadZone = async () => {
  const r = props.record
  if (!r?.employeeId) return

  try {
    isLoadingZone.value = true
    const emp = await employeeStore.getEmployeeById(r.employeeId)
    if (emp?.zone?.id) {
      const zone = await zoneService.getById(emp.zone.id)
      zonesToDisplay.value = [{
        id: zone.id,
        name: zone.name,
        polygonCoordinates: zone.polygonCoordinates,
        color: zone.color,
        opacity: zone.opacity,
        isOperational: zone.isOperational,
      }]
    } else {
      zonesToDisplay.value = []
    }
  } catch (e) {
    console.error('Error loading employee zone:', e)
    zonesToDisplay.value = []
  } finally {
    isLoadingZone.value = false
  }
}

watch(() => [props.modelValue, props.record], async ([open, record]) => {
  if (open && record) {
    await loadZone()
  } else {
    zonesToDisplay.value = []
  }
}, { immediate: true })
</script>

<template>
  <AppDialog v-model="isOpen" title="عرض الخريطة" size="3xl" overflow-y="auto">
    <div v-if="record" class="space-y-6">
      <!-- Employee & Record Data -->
      <DetailCardsGrid :cards="detailCards" />

      <!-- Map -->
      <div class="rounded-2xl border border-muted-200 dark:border-muted-700 overflow-hidden">
        <div class="flex items-center gap-2 p-4 bg-muted-50 dark:bg-muted-800/50 border-b border-muted-200 dark:border-muted-700">
          <Icon name="ph:map-trifold" class="size-5 text-primary-500" />
          <h3 class="font-semibold text-muted-800 dark:text-white">مواقع الدخول والخروج</h3>
        </div>

        <div v-if="hasLocationData" class="relative">
          <EmployeeTrackingMap
            :employees-to-display="employeesToDisplay"
            :zones-to-display="zonesToDisplay"
            :show-details-button="false"
            :show-stats-header="false"
            height="450px"
            :refresh-interval="0"
          />
        </div>

        <div
          v-else
          class="flex items-center justify-center py-20 bg-muted-50/80 dark:bg-muted-900/80"
        >
          <div class="text-center">
            <Icon name="ph:map-pin-line" class="size-12 text-muted-400 mx-auto mb-3" />
            <p class="text-muted-600 dark:text-muted-400">لا تتوفر بيانات موقع (دخول/خروج) لهذا السجل</p>
          </div>
        </div>
      </div>
    </div>
  </AppDialog>
</template>
