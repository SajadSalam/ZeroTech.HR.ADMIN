<script setup lang="ts">
import { useAppCrudStore } from '~/components/app-crud/store/AppCrudStore';
import { useEmployeeStore } from '../store';
import type { EmployeeDto } from '../types';
import DeleteModal from '~/components/app-crud/components/DeleteModal.vue';

defineProps<{
  profileData: EmployeeDto;
}>();
const employeeId = useRoute().params.id
const appCrudStore = useAppCrudStore()
const employeeStore = useEmployeeStore()
const openUploadDialog = () => {
  employeeStore.isCreateDialogOpen = true
}
const openDeleteDialog = () => {
  appCrudStore.setDeleteService(() => employeeStore.deleteEmployee(employeeId as string))
  appCrudStore.setItemId(employeeId as string)
  appCrudStore.isDeleteModalOpen = true
}
</script>

<template>
  <div class="bg-white rounded-2xl b b-#E9EAF0 overflow-hidden mb-4">
    <!-- Background Header -->
    <div class="h-34 relative">
        <img
            src="/assets/images/Banner.png"
            class="w-full h-full object-cover"
        />
        <div class="absolute top-4 left-4">
            <div class="bg-#ECF9F3 text-#239823 rounded-full px-8 flex items-center justify-center">
               نشط   
            </div>
        </div>
    </div>

    <!-- Profile Content -->
    <div class="px-6 relative flex gap-2">
      <!-- Profile Image -->
      <div class="flex justify-start -mt-16 mb-4">
        <div class="relative">
          <img
            src="/img/avatars/2.svg"
            alt="profile image"
            class="w-32 h-32 rounded-full border-8 border-white object-cover"
          />
        </div>
      </div> 
      <div class="mt-2">
        <h1 class="text-xl font-600">
          {{ profileData?.fullName }}
        </h1>
        <p class="text-sm font-600 text-#687296"> {{ profileData?.employeeNumber }} </p>
      </div>
      <div class="flex-1"></div>
      <div class="mt-4 flex items-start justify-center gap-1">
        <BaseButton
          variant="outline"
          class="!size-9"
          color="danger"
          size="sm"
          rounded="full"
          @click="openDeleteDialog()"
        >
          <span class="flex size-9 items-center justify-center rounded-full">
            <Icon name="i-hugeicons-delete-02" class="text-danger-500 size-5" />
          </span>
        </BaseButton>
         <BaseButton
          variant="outline"
          class="!size-9"
          color="info"
          size="sm"
          rounded="full"
          @click="openUploadDialog()"
        >
          <span class="flex size-9 items-center justify-center rounded-full">
            <Icon name="solar-file-download-linear" class="text-info-500 size-5" />
          </span>
        </BaseButton>
      </div>
    </div>
    <DeleteModal />
  </div>
</template>
