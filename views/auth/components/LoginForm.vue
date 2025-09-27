<script lang="ts" setup>
import AppInputField from '~/components/app-field/AppInputField.vue'
import { requiredValidator } from '~/services/validation'
import { Validator } from '~/services/validator'
import { findFirstAccessiblePage } from '~/utils/navigation-helpers'
import { useAuthStore } from '../store/auth'
import type { LoginBody } from '../types/index'

const body = ref<LoginBody>({
  email: '',
  password: '',
})
const isError = ref(false)
const isLoading = ref(false)
const validator = new Validator<LoginBody>(body.value, {
  email: {
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
    
    // Find first accessible page and navigate there
    const firstAccessiblePage = await findFirstAccessiblePage()
    await navigateTo(firstAccessiblePage)
  } catch (error) {
    isError.value = true
  } finally {
    isLoading.value = false
  }
}


onMounted(() => {})
</script>

<template>
  <form @submit.prevent="login">
    <div class="w-[100%] flex flex-col gap-3 !text-black">
      <AppInputField
        v-model="validator.validation.value.email.$model"
        :errors="validator.validation.value.email.$errors"
        rounded="lg"
        :placeholder="$t('fill-email')"
        :label="$t('email')"
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
