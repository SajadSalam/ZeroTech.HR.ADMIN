<script lang="ts" setup>
import AppInputField from '~/components/app-field/AppInputField.vue'
import { requiredValidator } from '~/services/validation'
import { Validator } from '~/services/validator'
import type { LoginBody, MeResponse } from '../types/index'
import { useAuthStore } from '../store/auth'
import { useI18n } from 'vue-i18n'

const body = ref<LoginBody>({
  loginIdentifier: '',
  password: '',
  rememberMe: false,
})
const isError = ref(false)
const isLoading = ref(false)
const validator = new Validator<LoginBody>(body.value, {
  loginIdentifier: {
    required: requiredValidator(''),
  },
  password: {
    required: requiredValidator(''),
  },
})
const authStore = useAuthStore()

const login = async () => {
  const validate = await validator.validation.value.$validate()
  if (!validate) return
  try {
    isLoading.value = true
    isError.value = false
    await authStore.login(body.value)

    const userDataStr = localStorage.getItem('userData')
    if (userDataStr) {
      const userData = JSON.parse(userDataStr) as MeResponse
      // Check roles array for navigation
      const userRoles = userData.roles?.map((role: any) => role.name) || []
      
      if (userRoles.includes('SuperAdmin')) {
        window.location.href = '/'
      } else if(userRoles.includes('Award Manager')) {
        window.location.href = '/awards'
      } else if(userRoles.includes('Award Audit Committee')) {
        window.location.href = '/applicants'
      } else {
        window.location.href = '/applicants'
      }
    }
  } catch (error) {
    isError.value = true
  } finally {
    isLoading.value = false
  }
}

const i18n = useI18n()

onMounted(() => {})
</script>

<template>
  <form @submit.prevent="login">
    <div class="w-[100%] flex flex-col gap-3 !text-black">
      <AppInputField
        v-model="validator.validation.value.loginIdentifier.$model"
        :errors="validator.validation.value.loginIdentifier.$errors"
        rounded="lg"
        :placeholder="$t('fill-username')"
        :label="$t('username')"
        class="rounded-full"
      />
      <AppInputField
        v-model="validator.validation.value.password.$model"
        :errors="validator.validation.value.password.$errors"
        type="password"
        rounded="lg"
        :placeholder="$t('password')"
        :label="$t('password')"
        class="rounded-full"
      />
      
      <div class="flex items-center gap-2">
        <input
          id="rememberMe"
          v-model="body.rememberMe"
          type="checkbox"
          class="rounded border-gray-300 text-primary focus:ring-primary"
        />
        <label for="rememberMe" class="text-sm text-gray-700">
          {{ $t('remember-me') }}
        </label>
      </div>
      
      <p v-if="isError" class="text-red text-sm">
        {{ $t('username-or-password-is-incorrect') }}
      </p>

      <div class="flex w-full flex-col items-center gap-3">
        <BaseButton :loading="isLoading" type="submit" class="w-full" color="primary">
          {{ $t('login') }}
        </BaseButton>
      </div>
    </div>
  </form>
</template>
