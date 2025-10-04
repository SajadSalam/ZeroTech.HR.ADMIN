<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import axiosIns from '~/services/app-client/axios'
import { useAppToaster } from '~/services/toaster/toaster'
import { tableHeader } from '~/views/awards'
import AwardCreate from '~/views/awards/components/AwardCreate.vue'
import AwardEdit from '~/views/awards/components/AwardEdit.vue'
import LinkQuestions from '~/views/awards/components/LinkQuestions.vue'
import { useAwardStore } from '~/views/awards/store'
import { useAuthStore } from '~/views/auth/store/auth'
import { formatDateTime } from '~/services/formatters'
definePageMeta({
    title: 'awards',
    description: 'manage-awards',
    icon: 'heroicons:award',
})
const { t } = useI18n()
const awardStore = useAwardStore()
const authStore = useAuthStore()
const headers = computed(() => tableHeader(t))

const handleEdit = (item: any) => {
    awardStore.selectedAward = item
    awardStore.selectedAwardId = item.documentId
    awardStore.isEditDialogOpen = true
}

const openLinkQuestionsDialog = (item: any) => {
    awardStore.selectedAwardId = item.documentId
    awardStore.selectedAward = item
    awardStore.isLinkQuestionsDialogOpen = true
}


onMounted(() => {
    awardStore.getAwards()
})
const sendEmail = async (item: any) => {
    const res = await axiosIns.post(`/awards/${item.documentId}/send-exam-emails`, {
    })
    useAppToaster().show('success',res.data.message)
}

const copyExamUrl = async (item: any) => {
    const res = 'https://ums-awards-front-stg.mohesr.net/exam/' + item.documentId   
    navigator.clipboard.writeText(res)
    useAppToaster().show('success',t('exam-url-copied'))
}
</script>

<template>
    <!-- :hide-create="!authStore.hasPermission(['api::award.award.create'])" -->

    <AppCrud :title="$t('awards')" 
    :hide-create="true"    
    :add-btn-action="() => awardStore.isCreateDialogOpen = true">
        <AppTable :headers="headers" :items="awardStore.awards" :loading="awardStore.isLoading">
            <template #data-awardStatus="{ item }">
                <span :class="{
                    'bg-yellow-100 text-yellow-800': item.awardStatus === 'inprogress',
                    'bg-green-100 text-green-800': item.awardStatus === 'completed',
                }" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ item.awardStatus === 'inprogress' ? $t('in-progress') : $t('completed') }}
                </span>
            </template>

            <template #data-lunchDate="{ item }">
                {{ item.lunchDate ? new Date(item.lunchDate).toLocaleDateString() : '-' }}
            </template>

            <template #data-resultDate="{ item }">
                {{ item.resultDate ? new Date(item.resultDate).toLocaleDateString() : '-' }}
            </template>

            <template #data-applicationPeriod="{ item }">
                {{ item.applicationPeriod ? `${item.applicationPeriod} ${$t('days')}` : '-' }}
            </template>

            <template #data-evaluationPeriod="{ item }">
                {{ item.evaluationPeriod ? `${item.evaluationPeriod} ${$t('days')}` : '-' }}
            </template>

            <template #data-examTime="{ item }">
                {{ item.examTime ? `${item.examTime} ${$t('minutes')}` : '-' }}
            </template>

            <template #data-examDate="{ item }">
                {{ item.examDate ? formatDateTime(item.examDate) : '-' }}
            </template>

            <template #data-actions="{ item }">
                <div class="flex items-center gap-2">

                    <AppCrudComponentsAppCrudActions 
                    :hide-delete="!authStore.hasPermission(['api::award.award.delete'])"
                    :hide-edit="!authStore.hasPermission(['api::award.award.update'])"
                    :item="item" :edit-button-action="() => handleEdit(item)"
                        :delete-service="awardStore.deleteAward" />

                    <BaseButton @click="openLinkQuestionsDialog(item)" v-if="authStore.hasPermission(['api::link-award-question.link-award-question.update'])">
                        <Icon name="ph:link" class="me-2"></Icon>
                        {{ $t('link-questions') }}
                    </BaseButton>

                    <BaseButton @click="sendEmail(item)" color="primary"
                    v-if="authStore.hasPermission(['api::award.award.sendExamStartEmails'])"
                    >
                        <Icon name="ph:envelope" class="me-2"></Icon>
                        {{ $t('send-exam-emails') }}
                    </BaseButton>


                    <BaseButton @click="copyExamUrl(item)" variant="outline" color="primary">
                        <Icon name="ph:copy" class="me-2"></Icon>
                        {{ $t('copy-exam-url') }}
                    </BaseButton>
                </div>
            </template>
        </AppTable>
    </AppCrud>


    <AwardCreate />
    <AwardEdit />
    <LinkQuestions />
</template>