<script setup lang="ts">
import AppInputField from '~/components/app-field/AppInputField.vue'
import type { ApiError } from '~/utils/types/ApiResponses'
import type { UserProfileUpdateDto } from '~/views/users/types'
import { useUserStore } from '~/views/users/store'
import { useAuthStore } from '~/views/auth/store/auth'

const userStore = useUserStore()
const authStore = useAuthStore()

const form = reactive<UserProfileUpdateDto>({
  firstName: '',
  lastName: '',
  phoneNumber: '',
})

const isLoading = computed(() => userStore.isProfileUpdating)

const fillFromUserData = () => {
  const data = authStore.userData
  form.firstName = data?.firstName ?? ''
  form.lastName = data?.lastName ?? ''
  form.phoneNumber = data?.phoneNumber ?? ''
}

const submit = async () => {
  try {
    await userStore.updateProfile({ ...form })
    userStore.isProfileDialogOpen = false
  } catch (error) {
    useToast({
      message:
        (error as ApiError).response?.data.title ||
        'حدث خطأ أثناء تحديث معلومات الحساب',
      isError: true,
    })
  }
}

watch(
  () => userStore.isProfileDialogOpen,
  (isOpen) => {
    if (isOpen) {
      fillFromUserData()
    }
  }
)
</script>

<template>
  <AppDialog
    v-model="userStore.isProfileDialogOpen"
    title="تعديل معلومات الحساب"
    size="md"
    overflow-y="visible"
  >
    <div class="space-y-4">
      <AppInputField
        v-model="form.firstName"
        label="الاسم الأول"
        placeholder="أدخل الاسم الأول"
        :disabled="isLoading"
      />
      <AppInputField
        v-model="form.lastName"
        label="الاسم الأخير"
        placeholder="أدخل الاسم الأخير"
        :disabled="isLoading"
      />
      <AppInputField
        v-model="form.phoneNumber"
        label="رقم الهاتف"
        placeholder="أدخل رقم الهاتف"
        :disabled="isLoading"
      />
    </div>

    <template #actions>
      <BaseButton color="muted" @click="userStore.isProfileDialogOpen = false">
        إلغاء
      </BaseButton>
      <BaseButton color="primary" :loading="isLoading" @click="submit">
        حفظ
      </BaseButton>
    </template>
  </AppDialog>
</template>
