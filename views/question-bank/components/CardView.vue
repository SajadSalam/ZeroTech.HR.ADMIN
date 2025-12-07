<script lang="ts" setup>
import type { QuestionBankDto } from '../types'
import { useAuthStore } from '~/views/auth/store/auth'
import { useQuestionBankStore } from '~/views/question-bank/store/index'
import AppCrudActions from '~/components/app-crud/components/AppCrudActions.vue'

const { hasPrivilege } = useAuthStore()
const questionBankStore = useQuestionBankStore()

defineProps<{
  questionBank: QuestionBankDto
}>()

const emits = defineEmits<{
  (event: 'update:openEdit', questionBank: QuestionBankDto): void
  (event: 'update:openAssignAuditor', questionBank: QuestionBankDto): void
  (event: 'update:openAssignCreator', questionBank: QuestionBankDto): void
}>()

// Check user privileges
const canUpdate = computed(() => hasPrivilege('ums:ems:question-bank:update'))
const canDelete = computed(() => hasPrivilege('ums:ems:question-bank:delete'))
const canManage = computed(() => canUpdate.value || canDelete.value)

// Emit openEdit event
const openEdit = (questionBank: QuestionBankDto) => {
  emits('update:openEdit', questionBank)
}
</script>

<template>
  <div class="pa-3 rounded-xl bg-white border">
    <!-- Header with group name and actions -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <BaseIconBox color="primary" variant="pastel">
          <Icon name="tabler-packages" size="18" />
        </BaseIconBox>
        <span class="text-lg font-semibold">{{ questionBank.title }}</span>
        
      </div>
      <div class="flex items-center ">
        <AppCrudActions
        v-if="canManage"
        :item="questionBank"
        :delete-service="questionBankStore.deleteQuestionBank"
        :edit-button-action="() => openEdit(questionBank)"
        :hide-delete="!canDelete"
        :hide-update="!canUpdate"
        />
        <slot name="actions" />
      </div>
    </div>

    <!-- Question Bank Details -->
    <div class="flex flex-col items-center justify-center text-center">
      <h1 class="my-10 text-3xl font-semibold">
        {{ questionBank.subject.name }}
        
      </h1>
      
      <div class="flex items-center gap-3">
      
        <BaseButton
          v-if="hasPrivilege('ums:ems:question-bank:assign-auditors')"
          size="md"
          class="pa-3 flex items-center gap-1 text-lg"
          color="primary"
          variant="pastel"
          @click="emits('update:openAssignAuditor', questionBank)"
        >
          <Icon name="ph-seal-check-duotone" size="18" class="text-primary" />
          <span class="text-[14px]">{{ $t('auditors') }}</span>
        </BaseButton>
        <BaseButton
          v-if="hasPrivilege('ums:ems:question-bank:assign-creators')"
          size="md"
          class="pa-3 flex items-center gap-1 text-lg"
          color="primary"
          variant="pastel"
          @click="emits('update:openAssignCreator', questionBank)"
        >
          <Icon name="ph-question-duotone" size="18" class="text-primary" />
          <span class="text-[14px]">{{ $t('creators') }}</span>
        </BaseButton>
      </div>
    </div>

    <!-- Open Button -->
    <BaseButton
      color="primary"
      :to="`/question-bank/questions/${questionBank.id}`"
      class="mt-5 w-full"
    >
      {{ $t('open') }}
    </BaseButton>
  </div>
</template>

<style scoped>
/* Add any scoped styles here if needed */
</style>
