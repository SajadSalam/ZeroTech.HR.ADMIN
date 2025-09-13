<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '~/views/auth/store/auth'
import { useExaminationCenters } from '~/views/examination-centers/store'
import ManagerSignature from '~/views/examination-centers/componets/ManagerSignature.vue'

const i18n = useI18n();

const changeLocale = () => {
    i18n.locale.value = i18n.locale.value === 'en' ? 'ar' : 'en';
    localStorage.setItem('locale', i18n.locale.value);
}
onMounted(() => {
    const locale = localStorage.getItem('locale')!;
    if (locale !== i18n.locale.value && locale != null) {
        i18n.locale.value = locale;
        // window.location.reload();
    }
})

const authStore = useAuthStore()
const examinationCentersStore = useExaminationCenters()
const openManagerSignatureDialog = () => {
    examinationCentersStore.isManagerSignatureDialogOpen = true
}
</script>

<template>
    <BaseButton color="muted" @click="changeLocale" variant="pastel" class="flex items-center gap-2">
        <Icon name="mdi-translate" size="20"></Icon>
        {{$i18n.locale === 'en' ? 'English' : 'العربية'}}
    </BaseButton>
    <BaseButton v-if="authStore.isLogged && authStore.userData.examCenter" color="muted"
        @click="openManagerSignatureDialog" variant="pastel" class="flex items-center gap-2">
        <Icon name="ph:signature-duotone" size="20"></Icon>
        {{ $t('manager-signature') }}
    </BaseButton>

    <ManagerSignature v-if="authStore.isLogged && authStore.userData.examCenter"
        :examCenterId="authStore.userData.examCenter.id" />
</template>

  <style>
  
  </style>