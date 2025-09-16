<script setup lang="ts">
import { useAuthStore } from '~/views/auth/store/auth'

const authStore = useAuthStore()
const fullName = computed(() => authStore.userData.name || 'Sajad Salam')
const role = computed(() => authStore.userData.roles.find(c=> c.slug.includes('ems'))?.name || 'SuperAdmin')
</script>
<template>
    <div>
        <div class="font-medium">
            {{ fullName }}
        </div>
        <div class='font-light text-sm'>
            {{ role }}
        </div>
    </div>
</template>
