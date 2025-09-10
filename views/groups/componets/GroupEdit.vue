<script setup lang="ts">
import AppInputField from '~/components/app-field/AppInputField.vue'
import { useGroupStore } from '../store'
import type { GroupCreate } from '../types'
import OrganizationTree from '~/views/orgaization/OrganizationTree.vue'
import type { Organization } from '~/views/orgaization/types'
import { Validator } from '~/services/validator'
import { createValidator } from '~/services/validationWithI18n'
import { useI18n } from 'vue-i18n'

const groupStore = useGroupStore()
const { t } = useI18n()

const validator = new Validator<GroupCreate>(
  {
    name: '',
    organizationalStructureIds: [],
  },
  {
    name: {
      required: createValidator(t, 'name', 'required'),
    },
  }
)

const body = validator.validation
const selectedOrgs = ref<Organization[]>([])
const isLoading = computed(() => {
  return groupStore.isLoading
})

const updateGroup = async () => {
  const isValid = await body.value.$validate()
  if (!isValid) return
  
  const groupData = validator.extractBody()
  groupData.organizationalStructureIds = selectedOrgs.value.map((x) => x.id)
  await groupStore.updateGroup(groupData)
  validator.resetBody()
  groupStore.isEditDialogOpen = false
}

watchDeep(
  () => groupStore.selectedGroup,
  (val) => {
    if (val) {
      validator.fillBody({
        name: val.name,
        organizationalStructureIds: val.organizationalStructures?.map((x: Organization) => x.id) || []
      })
      selectedOrgs.value = val.organizationalStructures as Organization[] || []
    }
  }
)

watch(
  () => groupStore.isEditDialogOpen,
  (val: boolean) => {
    if (!val) {
      validator.resetBody()
      selectedOrgs.value = []
    }
  }
)
const removeOrg = (id: number) => {
  selectedOrgs.value = selectedOrgs.value.filter((x) => x.id !== id)
}
</script>
<template>
  <AppDialog
    v-model="groupStore.isEditDialogOpen"
    :title="$t('create-group')"
    size="3xl"
    overflow-y="visible"
  >
    <div class="rounded-3xl p-3">
      <div class="flex flex-col gap-4">
        <AppInputField 
          v-model="body.name.$model" 
          :errors="body.name.$errors"
          size="md" 
          :label="$t('name')" 
        />

        <div class="grid grid-cols-1 gap-5 md:grid-cols-4">
          <div class="col-span-2">
            <h1 class="mb-2 text-xl font-bold">
              {{ $t('select-organizational-structure') }}
            </h1>
            <OrganizationTree
              :model-value="selectedOrgs.map((x) => x.id)"
              multiple
              @item-added="(item) => selectedOrgs.unshift(item)"
              @item-removed="(item) => removeOrg(item.id)"
            />
          </div>
          <div class="max-h-100vh sticky top-0 col-span-2 overflow-y-auto">
            <h1 class="mb-2 text-xl font-bold">
              {{ $t('selected-organizational-structure') }}
            </h1>
            <BaseTag
              v-for="org in selectedOrgs"
              :key="org.id"
              color="primary"
              variant="pastel"
              class="mb-2 items-center"
            >
              <Icon class="cursor-pointer" name="ph:x" @click="removeOrg(org.id)" />
              {{ org.fullNameAr }}
            </BaseTag>
          </div>
        </div>
      </div>
    </div>
    <template #actions>
      <BaseButton color="primary" class="gap-1" :loading="isLoading" @click="updateGroup">
        <Icon name="ph:upload-simple-duotone" class="size-5" />
        {{ $t('create-group') }}
      </BaseButton>
    </template>
  </AppDialog>
</template>
