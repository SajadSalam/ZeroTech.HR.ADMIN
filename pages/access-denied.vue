<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50">
    <div class="max-w-md w-full space-y-8 p-8">
      <div class="text-center">
        <div class="mx-auto h-12 w-12 text-red-400">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
        </div>
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          {{ $t('access-denied') }}
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          {{ $t('access-denied-message') }}
        </p>
        <div class="mt-6">
          <button
            @click="handleLogout"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            {{ $t('logout') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/views/auth/store/auth'

const auth = useAuthStore()

const handleLogout = async () => {
  await auth.logout()
  await navigateTo('/login')
}

// Set page meta
definePageMeta({
  layout: false
})
</script>
