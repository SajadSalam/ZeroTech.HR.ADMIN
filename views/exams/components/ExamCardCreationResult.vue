<script setup lang="ts">
import OrganizationalStructureDialog from '~/views/groups/componets/OrganizationalStructureDialog.vue'
import DialogBlueprint from './DialogBlueprint.vue'
import { useGroupStore } from '~/views/groups/store'
import { formatDate } from '~/services/formatters'

interface Props {
  title?: string
  description?: string
  group: string
  startAt?: string
  blueprintId?: null | number
  durationMinutes?: number
}
const groupStore = useGroupStore()
const props = withDefaults(defineProps<Props>(), {
  title: '---',
  description: 'No description added yet.',
  group: undefined,
  startAt: undefined,
  blueprintId: undefined,
  durationMinutes: undefined,
})
  
const isDialogGroupOpen = ref(false)
const isDialogBlueprint = ref(false)
const handleGroupDialogOpen = async () => {
  await groupStore.getGroupById(props.group)
  isDialogGroupOpen.value = true
}
</script>

<template>
    <div class="w-full bg-white rounded-xl shadow-sm border border-gray-300 border-solid p-6 font-sans">
      <!-- Header Section -->
      <div class="flex items-start gap-3 mb-4">
        <div>
          <h2 class="text-lg font-semibold text-[#96A0B6] mb-1">{{ $t('exam-details') }}</h2>
          <h2 class="text-lg font-semibold text-gray-900 mb-1">{{ title }}</h2>
          <p class="text-sm text-gray-600 leading-relaxed">{{ description }}</p>
        </div>
      </div>
  
      <!-- Content Items -->
      <div class="space-y-5">
        <!-- Groups -->
        <div class="flex items-start gap-3 rounded-xl border border-[#E2E8F0] border-solid p-4">
            <div class="flex-1">
                <div class="w-10 h-10 bg-[#F3F3F3] rounded-full flex items-center justify-center mb-3">
                    <Icon name="majesticons:box" class="text-[#9F9E9E] w-5 h-5" />
                </div>
                <h1 class="text-lg font-bold text-[#0F172A] mb-1">{{$t('groups')}}</h1>
                <p v-if="group" class="text-sm text-[#64748B] mb-3">
                    {{ $t("one-group-selected") }}
                </p>
                <p v-else class="text-sm text-gray-400 ">{{ $t('no-group-selected') }}</p>

                <div class="w-full flex justify-end">
                    <BaseButton color="primary" variant="pastel" size="sm" :disabled="!group || groupStore.isLoading" :loading="groupStore.isLoading" @click="handleGroupDialogOpen" class="font-bold">
                        <Icon name="tabler-eye" class="mr-2" />
                        {{ $t('see-organizational-structure') }}
                    </BaseButton>
                </div>

                <!-- Dialog for viewing all structures -->
                <OrganizationalStructureDialog
                    v-if="group"
                    v-model="isDialogGroupOpen"
                    :title="$t('see-organizational-structure')"
                    :structures="groupStore.selectedGroup?.organizationalStructureGroups"
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

                
                <p class="text-sm text-gray-400 ">{{ blueprintId ? $t('see-blueprint') : $t('no-blueprint') }}</p>

                <div class="w-full flex justify-end">
                    <BaseButton :disabled="!blueprintId" color="primary" variant="pastel" size="sm" @click="isDialogBlueprint = true" class="font-bold">
                      {{ $t('see-more') }}
                    </BaseButton>
                </div>

                <DialogBlueprint
                v-if="blueprintId"
                    v-model="isDialogBlueprint"
                    :blueprint-id="blueprintId"
                />
            </div>
        </div>

        <!-- Time Cards in Same Row -->
        <div class="grid grid-cols-2 gap-4">
          <!-- Start Time Card -->
          <div class="rounded-xl border border-[#E2E8F0] border-solid p-4">
            <div class="flex flex-col">
              <div class="w-10 h-10 bg-[#F3F3F3] rounded-full flex items-center justify-center mb-3">
                <Icon name="ph:clock-duotone" class="text-[#9F9E9E] w-5 h-5" />
              </div>
              <h1 class="text-lg font-bold text-gray-800 mb-2">{{ $t('start-time') }}</h1>
              <span class="inline-block py-1.5 text-blue-600 text-sm font-bold">
                {{ startAt ? formatDate(startAt) : '--/--/----' }}
              </span>
            </div>
          </div>
          <div class="rounded-xl border border-[#E2E8F0] border-solid p-4">
          <div class="flex flex-col">
            <div class="w-10 h-10 bg-[#F3F3F3] rounded-full flex items-center justify-center mb-3">
              <Icon name="ph:calendar-blank-duotone" class="text-[#9F9E9E] w-5 h-5" />
            </div>
            <h1 class="text-lg font-bold text-gray-800 mb-2">{{ $t('duration') }}</h1>
            <span class="inline-block py-1.5 text-blue-600 text-sm font-bold">
              {{ durationMinutes }} {{ $t('minute') }}
            </span>
          </div>
        </div>
        </div>
      </div>
    </div>
</template>