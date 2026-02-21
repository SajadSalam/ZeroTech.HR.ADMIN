<script setup lang="ts">
import DetailCardsGrid, { type DetailCard } from '~/components/DetailCardsGrid.vue'
import EmployeeTrackingMap from '~/views/attendance/components/EmployeeTrackingMap.vue'
import { useAttendanceStore } from '~/views/attendance/store'
import { useEmployeeStore } from '~/views/employees/store'
import { zoneService } from '~/views/zones/service'
import type { EmployeeDto } from '~/views/employees/types'
import type { LocationTimestampDto, MapZoneDisplay } from '~/views/attendance/types'
import { formatDate } from '~/services/formatters'

definePageMeta({
    title: 'تفاصيل تتبع الموظف',
    description: 'عرض تفاصيل موقع الموظف',
})

const route = useRoute()
const router = useRouter()
const employeeId = computed(() => Number(route.params.id))

const attendanceStore = useAttendanceStore()
const employeeStore = useEmployeeStore()

const employee = ref<EmployeeDto | null>(null)
const employeeLocation = computed(() => attendanceStore.employeeLocation)
const zonesToDisplay = ref<MapZoneDisplay[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

const employeesToDisplay = computed<LocationTimestampDto[]>(() => {
    const loc = employeeLocation.value
    if (!loc) return []

    const points: LocationTimestampDto[] = []
    if (loc.checkInLatitude != null && loc.checkInLongitude != null) {
        points.push({
            id: 1,
            employeeId: employeeId.value,
            latitude: loc.checkInLatitude,
            longitude: loc.checkInLongitude,
            recordedAt: '',
            clientTimestamp: '',
        })
    }
    if (loc.checkOutLatitude != null && loc.checkOutLongitude != null) {
        points.push({
            id: 2,
            employeeId: employeeId.value,
            latitude: loc.checkOutLatitude,
            longitude: loc.checkOutLongitude,
            recordedAt: '',
            clientTimestamp: '',
        })
    }
    return points
})

const hasLocationData = computed(() => {
    const loc = employeeLocation.value
    if (!loc) return false
    const hasCheckIn = loc.checkInLatitude != null && loc.checkInLongitude != null
    const hasCheckOut = loc.checkOutLatitude != null && loc.checkOutLongitude != null
    return hasCheckIn || hasCheckOut
})

const loadData = async () => {
    try {
        isLoading.value = true
        error.value = null

        const [emp] = await Promise.all([
            employeeStore.getEmployeeById(employeeId.value),
            attendanceStore.getEmployeeLocationTimestamp(employeeId.value),
        ])

        employee.value = emp as EmployeeDto

        if (emp?.zone?.id) {
            try {
                const zone = await zoneService.getById(emp.zone.id)
                zonesToDisplay.value = [{
                    id: zone.id,
                    name: zone.name,
                    polygonCoordinates: zone.polygonCoordinates,
                    color: zone.color,
                    opacity: zone.opacity,
                    isOperational: zone.isOperational,
                }]
            } catch (zoneError) {
                console.error('Error loading employee zone:', zoneError)
                zonesToDisplay.value = []
            }
        } else {
            zonesToDisplay.value = []
        }
    } catch (e) {
        console.error('Error loading employee tracking data:', e)
        error.value = 'حدث خطأ أثناء تحميل بيانات الموظف'
    } finally {
        isLoading.value = false
    }
}

onMounted(loadData)


const detailCards = computed<DetailCard[]>(() => {
    const emp = employee.value
    const loc = employeeLocation.value
    if (!emp) return []

    const cards: DetailCard[] = [
        {
            title: 'المعلومات الشخصية',
            icon: 'ph:user',
            iconColor: 'primary',
            items: [
                { label: 'الاسم الكامل', value: emp.fullName },
                { label: 'رقم الموظف', value: emp.employeeNumber },
                { label: 'البريد الإلكتروني', value: emp.email },
                { label: 'رقم الهاتف', value: emp.phone, valueClass: 'dir-ltr' },
                { label: 'الجنس', value: emp.genderDisplay },
            ],
        },
        {
            title: 'معلومات العمل',
            icon: 'ph:briefcase',
            iconColor: 'emerald',
            items: [
                { label: 'المسمى الوظيفي', value: emp.jobTitle },
                { label: 'القسم', value: emp.department?.name || '—' },
                { label: 'نوع العقد', value: emp.contractTypeDisplay },
                { label: 'تاريخ التعيين', value: formatDate(emp.hireDate) },
                { label: 'سنوات الخدمة', value: emp.yearsOfService },
            ],
        },
    ]

    // if (loc) {
    //     const locationItems: DetailCard['items'] = []
    //     if (loc.checkInLatitude != null && loc.checkInLongitude != null) {
    //         locationItems.push(
    //             { label: 'موقع الدخول', value: `${loc.checkInLatitude.toFixed(6)}, ${loc.checkInLongitude.toFixed(6)}` },
    //         )
    //     }
    //     if (loc.checkOutLatitude != null && loc.checkOutLongitude != null) {
    //         locationItems.push(
    //             { label: 'موقع الخروج', value: `${loc.checkOutLatitude.toFixed(6)}, ${loc.checkOutLongitude.toFixed(6)}` },
    //         )
    //     }
    //     if (locationItems.length > 0) {
    //         cards.push({
    //             title: 'مواقع الحضور',
    //             icon: 'ph:map-pin',
    //             iconColor: 'amber',
    //             items: locationItems,
    //         })
    //     }
    // }

    return cards
})
</script>

<template>
    <div class="flex flex-col gap-6 p-4">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
                <button
                    class="flex items-center gap-1 text-sm text-muted-500 hover:text-primary-500 transition-colors"
                    @click="router.push('/tracking')"
                >
                    <Icon name="ph:arrow-right" class="size-5" />
                    العودة للخريطة
                </button>
                <span class="text-muted-300">|</span>
                <h1 class="text-xl font-bold text-muted-800 dark:text-white">
                    تفاصيل تتبع الموظف
                </h1>
            </div>
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="flex items-center justify-center py-20">
            <div class="text-center">
                <div class="animate-spin rounded-full h-10 w-10 border-4 border-primary-600 border-t-transparent mx-auto mb-3" />
                <p class="text-sm text-muted-500">جاري تحميل البيانات...</p>
            </div>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="flex items-center justify-center py-20">
            <div class="bg-red-50 dark:bg-red-900/20 rounded-2xl p-8 text-center max-w-md">
                <Icon name="ph:warning-circle" class="size-12 text-red-400 mx-auto mb-3" />
                <p class="text-red-600 dark:text-red-400">{{ error }}</p>
                <BaseButton size="sm" color="danger" class="mt-4" @click="loadData">
                    إعادة المحاولة
                </BaseButton>
            </div>
        </div>

        <!-- Content -->
        <template v-else-if="employee">
            <DetailCardsGrid :cards="detailCards" />

            <!-- Employee Location Map -->
            <div class="bg-white dark:bg-muted-800 rounded-2xl border border-muted-200 dark:border-muted-700 p-5">
                <div class="flex items-center gap-2 mb-4">
                    <div class="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <Icon name="ph:map-trifold" class="size-5 text-blue-500" />
                    </div>
                    <h3 class="font-semibold text-muted-800 dark:text-white">موقع الموظف على الخريطة</h3>
                </div>

                <div v-if="hasLocationData" class="rounded-xl overflow-hidden">
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
                    v-else-if="!isLoading"
                    class="flex items-center justify-center rounded-xl border border-muted-200 dark:border-muted-700 bg-muted-50/80 dark:bg-muted-900/80 py-20"
                >
                    <div class="text-center">
                        <Icon name="ph:map-pin-line" class="size-12 text-muted-400 mx-auto mb-3" />
                        <p class="text-muted-600 dark:text-muted-400">لا تتوفر بيانات موقع (دخول/خروج) لهذا الموظف</p>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>
