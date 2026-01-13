<script setup lang="ts">
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import AppInputField from '~/components/app-field/AppInputField.vue'
import AppTextAreaField from '~/components/app-field/AppTextAreaField.vue'
import { requiredValidator } from '~/services/validation'
import { Validator } from '~/services/validator'
import { useRequestStore } from '../store'
import type { RequestCreateDto } from '../types'

const requestStore = useRequestStore()

const validator = new Validator<RequestCreateDto>(
    {
        employeeId: 0,
        requestTypeId: 0,
        startDate: '',
        endDate: '',
        description: '',
        requestData: null,
        affectsBalance: false,
        balanceDeduction: 0,
    },
    {
        employeeId: {
            required: requiredValidator('الموظف'),
        },
        requestTypeId: {
            required: requiredValidator('نوع الطلب'),
        },
        startDate: {
            required: requiredValidator('تاريخ البداية'),
        },
        endDate: {
            required: requiredValidator('تاريخ النهاية'),
        },
        description: {
            required: requiredValidator('الوصف'),
        },
    }
)

const body = validator.validation

const isLoading = computed(() => {
    return requestStore.isLoading
})

const createRequest = async () => {
    // const isValid = await body.value.$validate()

    // if (!isValid) return
    await requestStore.createRequest(validator.extractBody())
    validator.resetBody()
    requestStore.isCreateDialogOpen = false
}

watch(
    () => requestStore.isCreateDialogOpen,
    (val: boolean) => {
        if (val) {
            validator.resetBody()
        }
    }
)
</script>

<template>
    <AppDialog
        v-model="requestStore.isCreateDialogOpen"
        title="إنشاء طلب جديد"
        size="xl"
        overflow-y="visible"
    >
        <div class="rounded-3xl p-3">
            <div class="flex flex-col gap-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AppAutoCompleteField
                        v-model="body.employeeId.$model"
                        fetch-on-search
                        search-key="fullName"
                        :errors="body.employeeId.$errors"
                        size="md"
                        label="الموظف"
                        get-url="/Employee"
                        item-label="fullName"
                        item-value="id"
                        required
                    />
                    <AppAutoCompleteField
                        v-model="body.requestTypeId.$model"
                        fetch-on-search
                        search-key="name"
                        :errors="body.requestTypeId.$errors"
                        size="md"
                        label="نوع الطلب"
                        get-url="/RequestType"
                        item-label="name"
                        item-value="id"
                        required
                    />
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AppInputField
                        v-model="body.startDate.$model"
                        :errors="body.startDate.$errors"
                        size="md"
                        label="تاريخ البداية"
                        type="date"
                        required
                    />
                    <AppInputField
                        v-model="body.endDate.$model"
                        :errors="body.endDate.$errors"
                        size="md"
                        label="تاريخ النهاية"
                        type="date"
                        required
                    />
                </div>

                <AppTextAreaField
                    v-model="body.description.$model"
                    :errors="body.description.$errors"
                    size="md"
                    label="الوصف"
                    rows="4"
                    required
                />

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="flex items-center gap-2">
                        <input
                            id="affectsBalance"
                            v-model="body.affectsBalance.$model"
                            type="checkbox"
                            class="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <label
                            for="affectsBalance"
                            class="text-sm font-medium text-gray-700"
                        >
                            يؤثر على الرصيد
                        </label>
                    </div>

                    <AppInputField
                        v-if="body.affectsBalance.$model"
                        v-model="body.balanceDeduction.$model"
                        :errors="body.balanceDeduction.$errors"
                        size="md"
                        label="خصم الرصيد"
                        type="number"
                        :step="0.01"
                        :min="0"
                    />
                </div>
            </div>
        </div>
        <template #actions>
            <BaseButton
                color="primary"
                class="gap-1"
                :loading="isLoading"
                @click="createRequest"
            >
                <Icon name="ph:upload-simple-duotone" class="size-5" />
                إنشاء طلب جديد
            </BaseButton>
        </template>
    </AppDialog>
</template>

