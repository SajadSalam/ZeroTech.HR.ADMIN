<script lang="ts" setup>
import AppCrudCustom from '~/components/app-crud/AppCrudCustom.vue';
import CreateExamPage from '~/views/exams/components/CreateExamPage.vue';


definePageMeta({
  title: 'create-exams',
  description: 'create-and-manage-exams',
})
</script>

<template>
  <div>
    <AppCrudCustom
      :hideCreate="true"
    >
      <CreateExamPage />
    </AppCrudCustom>
  </div>
  
</template>
<style></style>
