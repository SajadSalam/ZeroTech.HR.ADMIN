<template>
  <div>
    <TairoContentWrapper>
      <template #left>
        <BaseHeading as="h1" size="3xl" weight="light" lead="tight" class="text-muted-800 dark:text-white">
          <Icon name="ph:house-duotone" class="me-2 size-8" />
          {{ $t('exam-center-home') }}
        </BaseHeading>
      </template>
      <template #right>
        <BaseText size="sm" class="text-muted-400">
          {{ $t('exam-center-id') }}: {{ route.params.examCenterId }}
        </BaseText>
      </template>
    </TairoContentWrapper>

    <TairoContentWrapperTabbed>
      <template #tab>
        <TairoTabs
          :model-value="activeTab"
          :tabs="tabs"
          @model-value="activeTab = $event"
        >
          <template #tab="{ activeValue }">
            <BaseText
              :class="[
                'text-xs uppercase tracking-wider transition-colors duration-300',
                activeValue ? 'text-primary-500' : 'text-muted-400 group-hover:text-muted-500',
              ]"
            >
              {{ activeValue }}
            </BaseText>
          </template>
        </TairoTabs>
      </template>
      <template #content>
        <div class="space-y-8">
          <!-- Overview Section -->
          <div v-if="activeTab === 'overview'">
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <!-- Active Exams Card -->
              <BaseCard class="p-6">
                <div class="flex items-center gap-4">
                  <div class="flex size-12 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/20">
                    <Icon name="ph:exam-duotone" class="size-6 text-primary-500" />
                  </div>
                  <div>
                    <BaseHeading as="h3" size="lg" weight="medium" class="text-muted-800 dark:text-white">
                      {{ activeExams }}
                    </BaseHeading>
                    <BaseText size="sm" class="text-muted-400">
                      {{ $t('active-exams') }}
                    </BaseText>
                  </div>
                </div>
              </BaseCard>

              <!-- Students Present Card -->
              <BaseCard class="p-6">
                <div class="flex items-center gap-4">
                  <div class="flex size-12 items-center justify-center rounded-lg bg-success-100 dark:bg-success-900/20">
                    <Icon name="ph:users-duotone" class="size-6 text-success-500" />
                  </div>
                  <div>
                    <BaseHeading as="h3" size="lg" weight="medium" class="text-muted-800 dark:text-white">
                      {{ studentsPresent }}
                    </BaseHeading>
                    <BaseText size="sm" class="text-muted-400">
                      {{ $t('students-present') }}
                    </BaseText>
                  </div>
                </div>
              </BaseCard>

              <!-- Total Capacity Card -->
              <BaseCard class="p-6">
                <div class="flex items-center gap-4">
                  <div class="flex size-12 items-center justify-center rounded-lg bg-info-100 dark:bg-info-900/20">
                    <Icon name="ph:building-duotone" class="size-6 text-info-500" />
                  </div>
                  <div>
                    <BaseHeading as="h3" size="lg" weight="medium" class="text-muted-800 dark:text-white">
                      {{ totalCapacity }}
                    </BaseHeading>
                    <BaseText size="sm" class="text-muted-400">
                      {{ $t('total-capacity') }}
                    </BaseText>
                  </div>
                </div>
              </BaseCard>
            </div>

            <!-- Recent Activity -->
            <BaseCard class="mt-6 p-6">
              <BaseHeading as="h3" size="lg" weight="medium" class="mb-4 text-muted-800 dark:text-white">
                {{ $t('recent-activity') }}
              </BaseHeading>
              <div class="space-y-4">
                <div v-for="activity in recentActivities" :key="activity.id" class="flex items-center gap-4 border-b border-muted-200 pb-4 last:border-b-0 dark:border-muted-700">
                  <div class="size-2 rounded-full bg-primary-500"></div>
                  <div class="flex-1">
                    <BaseText size="sm" class="text-muted-800 dark:text-white">
                      {{ activity.description }}
                    </BaseText>
                    <BaseText size="xs" class="text-muted-400">
                      {{ activity.timestamp }}
                    </BaseText>
                  </div>
                </div>
              </div>
            </BaseCard>
          </div>

          <!-- Scheduled Exams Section -->
          <div v-if="activeTab === 'scheduled'">
            <BaseCard class="p-6">
              <BaseHeading as="h3" size="lg" weight="medium" class="mb-4 text-muted-800 dark:text-white">
                {{ $t('scheduled-exams') }}
              </BaseHeading>
              <BaseText class="text-muted-400">
                {{ $t('scheduled-exams-content') }}
              </BaseText>
            </BaseCard>
          </div>

          <!-- Reports Section -->
          <div v-if="activeTab === 'reports'">
            <BaseCard class="p-6">
              <BaseHeading as="h3" size="lg" weight="medium" class="mb-4 text-muted-800 dark:text-white">
                {{ $t('reports') }}
              </BaseHeading>
              <BaseText class="text-muted-400">
                {{ $t('reports-content') }}
              </BaseText>
            </BaseCard>
          </div>
        </div>
      </template>
    </TairoContentWrapperTabbed>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Exam Center Home',
  preview: {
    title: 'Exam Center Manager Dashboard',
    description: 'Dashboard for exam center managers to monitor their center',
    categories: ['dashboards'],
    src: '/img/screens/dashboards-personal-1.png',
    srcDark: '/img/screens/dashboards-personal-1-dark.png',
  },
})

const route = useRoute()

// Tab management
const activeTab = ref('overview')
const tabs = [
  {
    label: 'Overview',
    value: 'overview',
  },
  {
    label: 'Scheduled',
    value: 'scheduled',
  },
  {
    label: 'Reports',
    value: 'reports',
  },
]

// Sample data - replace with actual API calls
const activeExams = ref(5)
const studentsPresent = ref(142)
const totalCapacity = ref(200)

const recentActivities = ref([
  {
    id: 1,
    description: 'Math Final Exam started',
    timestamp: '2 minutes ago',
  },
  {
    id: 2,
    description: 'Physics Midterm completed',
    timestamp: '15 minutes ago',
  },
  {
    id: 3,
    description: 'Chemistry Lab Exam scheduled',
    timestamp: '1 hour ago',
  },
])

// You can add API calls here to fetch exam center specific data
onMounted(() => {
  // Fetch exam center data using route.params.examCenterId
  console.log('Exam Center ID:', route.params.examCenterId)
})
</script>