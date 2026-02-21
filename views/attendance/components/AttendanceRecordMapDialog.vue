<script setup lang="ts">
import DetailCardsGrid, { type DetailCard } from '~/components/DetailCardsGrid.vue'
import EmployeeTrackingMap from '~/views/attendance/components/EmployeeTrackingMap.vue'
import { useEmployeeStore } from '~/views/employees/store'
import { zoneService } from '~/views/zones/service'
import type { AttendanceRecord, TimeSpan } from '../types'
import type { LocationTimestampDto, MapZoneDisplay } from '../types'
import { formatDate } from '~/services/formatters'

const props = defineProps<{
  modelValue: boolean
  record: AttendanceRecord | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

/** Set to true to use mock data when record is null (open dialog to preview) */
const USE_MOCK_DATA = true

const emptyTimeSpan: TimeSpan = {
  ticks: 0, days: 0, hours: 0, milliseconds: 0, microseconds: 0, nanoseconds: 0,
  minutes: 0, seconds: 0, totalDays: 0, totalHours: 0, totalMilliseconds: 0,
  totalMicroseconds: 0, totalNanoseconds: 0, totalMinutes: 0, totalSeconds: 0,
}

const MOCK_RECORD: AttendanceRecord = {
  id: 1,
  createdAt: '2025-02-20T08:00:00Z',
  createdByUserId: 1,
  createdBy: 'admin',
  createdByUserName: 'مدير النظام',
  updatedAt: '2025-02-20T17:30:00Z',
  updatedByUserId: 1,
  updatedBy: 'admin',
  updatedByUserName: 'مدير النظام',
  isActive: true,
  employeeId: 101,
  employeeName: 'أحمد محمد علي',
  employeeNumber: 'EMP-001',
  attendanceDate: '2025-02-20',
  checkInTime: '2025-02-20T08:15:00',
  checkOutTime: '2025-02-20T17:30:00',
  workScheduleShiftId: 1,
  workScheduleShiftName: 'الشفت الصباحي',
  isLateCheckIn: true,
  isEarlyCheckOut: false,
  lateMinutes: 15,
  earlyMinutes: 0,
  hoursWorked: 8.25,
  overtimeHours: 1.5,
  notes: '',
  isProcessedForPayroll: false,
  payrollProcessedAt: '',
  isCheckedIn: false,
  isComplete: true,
  totalWorkingTime: { ...emptyTimeSpan, totalHours: 9, hours: 9 },
  netWorkingTime: { ...emptyTimeSpan, totalHours: 8.25, hours: 8 },
  checkInLatitude: 33.3152,
  checkInLongitude: 44.3661,
  checkOutLatitude: 33.318,
  checkOutLongitude: 44.37,
}

const MOCK_ZONES: MapZoneDisplay[] = [
  {
    id: 'mock-zone-1',
    name: 'منطقة المكتب الرئيسي',
    polygonCoordinates: JSON.stringify({
      type: 'Polygon',
      coordinates: [[
        [44.35, 33.30],
        [44.39, 33.30],
        [44.39, 33.34],
        [44.35, 33.34],
        [44.35, 33.30],
      ]],
    }),
    color: '#10B981',
    opacity: 0.25,
    isOperational: true,
  },
]

/** Use mock record when USE_MOCK_DATA and no real record (e.g. for preview) */
const recordToUse = computed<AttendanceRecord | null>(() =>
  props.record ?? (USE_MOCK_DATA ? MOCK_RECORD : null),
)

const isOpen = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const employeeStore = useEmployeeStore()
const zonesToDisplay = ref<MapZoneDisplay[]>([])
const isLoadingZone = ref(false)

const employeesToDisplay = computed<LocationTimestampDto[]>(() => {
  const r = recordToUse.value
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
  const r = recordToUse.value
  if (!r) return false
  const hasCheckIn = r.checkInLatitude != null && r.checkInLongitude != null
  const hasCheckOut = r.checkOutLatitude != null && r.checkOutLongitude != null
  return hasCheckIn || hasCheckOut
})

const detailCards = computed<DetailCard[]>(() => {
  const r = recordToUse.value
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
  const r = recordToUse.value
  if (!r?.employeeId) return

  /** Use mock zones when displaying mock record (no real record passed) */
  if (USE_MOCK_DATA && !props.record) {
    zonesToDisplay.value = MOCK_ZONES
    return
  }

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

watch([() => props.modelValue, recordToUse], async ([open, record]) => {
  if (open && record) {
    await loadZone()
  } else {
    zonesToDisplay.value = []
  }
}, { immediate: true })
</script>

<template>
  <AppDialog v-model="isOpen" title="عرض الخريطة" size="3xl" overflow-y="auto">
    <div v-if="recordToUse" class="space-y-6">
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
