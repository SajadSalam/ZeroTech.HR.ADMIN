<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '~/views/auth/store/auth'
import { useExaminationCenters } from '~/views/examination-centers/store'
import ManagerSignature from '~/views/examination-centers/componets/ManagerSignature.vue'

const i18n = useI18n();



const showManagerSignature = computed(() => {
    return authStore.isLogged && authStore.userData.examCenter
})
const authStore = useAuthStore()
const examinationCentersStore = useExaminationCenters()
const openManagerSignatureDialog = () => {
    examinationCentersStore.isManagerSignatureDialogOpen = true
}
</script>

<template>
    <BaseButton v-if="showManagerSignature" color="muted" @click="openManagerSignatureDialog" variant="pastel"
        class="flex items-center gap-2">
        <Icon name="ph:signature-duotone" size="20"></Icon>
        {{ $t('manager-signature') }}
    </BaseButton>

    <ManagerSignature v-if="showManagerSignature" :examCenterId="authStore.userData.examCenter.id" />
</template>

<style></style>