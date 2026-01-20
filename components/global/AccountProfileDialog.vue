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
  newPassword: null,
  username: '',
})

const isLoading = computed(() => userStore.isProfileUpdating)
const isPasswordChange = ref(false)
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
watch(isPasswordChange, () => {
    form.newPassword = null
})
</script>

<template>
  <AppDialog
    v-model="userStore.isProfileDialogOpen"
    title="تعديل معلومات الحساب"
    size="lg"
    overflow-y="visible"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      <AppInputField
        v-model="form.username"
        label="اسم المستخدم"
        placeholder="أدخل اسم المستخدم"
        :disabled="isLoading"
      />
      <BaseCheckbox
        v-model="isPasswordChange"
        label="تغيير كلمة المرور"
        :disabled="isLoading"
      />
      <AppInputField
        v-if="isPasswordChange"
        v-model="form.newPassword"
        label="كلمة المرور"
        placeholder="أدخل كلمة المرور"
        type="password"
        :disabled="isLoading"
        class="col-span-2"
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
