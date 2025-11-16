<script setup lang="ts">
import OrganizationalStructureDialog from '~/views/groups/componets/OrganizationalStructureDialog.vue'
import DialogBlueprint from './DialogBlueprint.vue'

interface Props {
  title?: string
  description?: string
  groups?: null | string[]
  startTime?: string
  endTime?: string
  startDate?: string | Date
  endDate?: string | Date
  blueprintId?: null | number
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  title: '---',
  description: 'No description added yet.',
  groups: null,
  startTime: '--:--',
  endTime: '--:--',
  startDate: '',
  endDate: '',
  blueprintId:null
})

const isDialogGroupOpen = ref(false)
const isDialogBlueprint = ref(false)


const formatDate = (date: string | Date) => {
  if (!date) return '-- / -- / ----'
  const d = new Date(date)
  return `${d.getFullYear()} / ${d.getMonth() + 1} / ${d.getDate()}`
}
</script>

<template>
    <div class="w-full bg-white rounded-xl shadow-sm border border-gray-300 border-solid p-6 font-sans">
      <!-- Header Section -->
      <div class="flex items-start gap-3 mb-4">
        <div>
          <h2 class="text-lg font-semibold text-[#96A0B6] mb-1">تفاصيل الامتحان</h2>
          <h2 class="text-lg font-semibold text-gray-900 mb-1">{{ title }}</h2>
          <p class="text-sm text-gray-600 leading-relaxed">{{ description }}</p>
        </div>
      </div>
  
      <!-- Content Items -->
      <div class="space-y-5">
        <!-- Groups -->
        <div v-if="groups" class="flex items-start gap-3 rounded-xl border border-[#E2E8F0] border-solid p-4">
            <div class="flex-1">
                <div class="w-10 h-10 bg-[#F3F3F3] rounded-full flex items-center justify-center mb-3">
                    <Icon name="majesticons:box" class="text-[#9F9E9E] w-5 h-5" />
                </div>
                <h1 class="text-lg font-bold text-[#0F172A] mb-1">{{$t('groups')}}</h1>
                <p v-if="groups?.length" class="text-sm text-[#64748B] mb-3">
                    <span v-for="(group, index) in groups.slice(0, 2)" :key="index">
                        {{ group.name }}<span v-if="index < 1 && groups.length > 2">, </span>
                    </span>

                    <span
                        v-if="groups.length > 2"
                        class="text-primary "
                    >
                        ... (+{{ groups.length - 2 }})
                    </span>
                </p>
                <p v-else class="text-sm text-gray-400 ">{{ $t('no-groups-selected') }}</p>

                <div class="w-full flex justify-end">
                    <button @click="isDialogGroupOpen = true" class="bg-[#2C64E31C] text-primary px-4 rounded-2xl text-sm font-bold h-[28px] text-left">
                        {{ $t('see-more') }}
                    </button>
                </div>

                <!-- Dialog for viewing all structures -->
                <OrganizationalStructureDialog
                    v-if="groups && groups?.length > 0"
                    v-model="isDialogGroupOpen"
                    :title="$t('groups')"
                    :groups="groups"
                />
            </div>
        </div>
  
        <!-- Exam Centers -->
        <div class="flex items-start gap-3 rounded-xl border border-[#E2E8F0] border-solid p-4">
            <div class="flex-1">
                <div class="w-10 h-10 bg-[#F3F3F3] rounded-full flex items-center justify-center mb-3">
                    <Icon name="majesticons:list-box" class="text-[#9F9E9E] w-5 h-5" />
                </div>
                <h1 class="text-lg font-bold text-[#0F172A] mb-1">{{$t('blueprint')}}</h1>

                
                <p class="text-sm text-gray-400 ">{{ blueprintId ? "يوجد نموذج محدد انقر للعرض" : $t('no-blueprint') }}</p>

                <div class="w-full flex justify-end">
                    <button @click="isDialogBlueprint = true" class="bg-[#2C64E31C] text-primary px-4 rounded-2xl text-sm h-[28px]  font-bold text-left">
                      {{ $t('see-more') }}
                    </button>
                </div>

                <DialogBlueprint
                v-if="blueprintId"
                    v-model="isDialogBlueprint"
                    :blueprint-id="blueprintId"
                    

                />

                
            </div>
        </div>

        <!-- Time Cards in Same Row -->
        <div v-if="startTime || endTime" class="grid grid-cols-2 gap-4">
          <!-- Start Time Card -->
          <div class="rounded-xl border border-[#E2E8F0] border-solid p-4">
            <div class="flex flex-col">
              <div class="w-10 h-10 bg-[#F3F3F3] rounded-full flex items-center justify-center mb-3">
                <Icon name="ph:clock-duotone" class="text-[#9F9E9E] w-5 h-5" />
              </div>
              <h1 class="text-lg font-bold text-gray-800 mb-2">{{ $t('start-time') }}</h1>
              <span class="inline-block py-1.5 text-blue-600 text-sm font-bold">
                {{ startTime || '--:--' }}
              </span>
            </div>
          </div>

          <!-- End Time Card -->
          <div class="rounded-xl border border-[#E2E8F0] border-solid p-4">
            <div class="flex flex-col">
              <div class="w-10 h-10 bg-[#F3F3F3] rounded-full flex items-center justify-center mb-3">
                <Icon name="ph:clock-duotone" class="text-[#9F9E9E] w-5 h-5" />
              </div>
              <h1 class="text-lg font-bold text-gray-800 mb-2">{{ $t('end-time') }}</h1>
              <span class="inline-block py-1.5 text-blue-600 text-sm font-bold">
                {{ endTime || '--:--' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Date Cards in Same Row -->
        <div v-if="startDate || endDate" class="grid grid-cols-2 gap-4">
          <!-- Start Date Card -->
          <div class="rounded-xl border border-[#E2E8F0] border-solid p-4">
            <div class="flex flex-col">
              <div class="w-10 h-10 bg-[#F3F3F3] rounded-full flex items-center justify-center mb-3">
                <Icon name="ph:calendar-blank-duotone" class="text-[#9F9E9E] w-5 h-5" />
              </div>
              <h1 class="text-lg font-bold text-gray-800 mb-2">{{ $t('start-date') }}</h1>
              <span class="inline-block py-1.5 text-blue-600 text-sm font-bold">
                {{ startDate ? formatDate(startDate) : '--/--/----' }}
              </span>
            </div>
          </div>

          <!-- End Date Card -->
          <div class="rounded-xl border border-[#E2E8F0] border-solid p-4">
            <div class="flex flex-col">
              <div class="w-10 h-10 bg-[#F3F3F3] rounded-full flex items-center justify-center mb-3">
                <Icon name="ph:calendar-blank-duotone" class="text-[#9F9E9E] w-5 h-5" />
              </div>
              <h1 class="text-lg font-bold text-gray-800 mb-2">{{ $t('duration') }}</h1>
              <span class="inline-block py-1.5 text-blue-600 text-sm font-bold">
                {{ duration }} {{ $t('minute') }}
              </span>
            </div>
          </div>
        </div>

        
      </div>

      
    </div>
</template>