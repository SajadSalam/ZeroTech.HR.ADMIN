<script setup lang="ts">
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import AppInputField from '~/components/app-field/AppInputField.vue'
import AppTextAreaField from '~/components/app-field/AppTextAreaField.vue'
import { requiredValidator } from '~/services/validation'
import { Validator } from '~/services/validator'
import { useRequestTypeStore } from '../store'
import type { RequestTypeCreateDto } from '../types'

const requestTypeStore = useRequestTypeStore()

const validator = new Validator<RequestTypeCreateDto>(
    {
        name: '',
        description: '',
        code: '',
        categoryId: 0,
        isEnabled: false,
        requiresApproval: false,
        allowsAttachments: false,
        requiresAttachments: false,
        maxAdvanceDays: undefined,
        minAdvanceDays: undefined,
        maxDurationDays: undefined,
        minDurationHours: undefined,
        affectsAttendance: false,
        affectsPayroll: false,
        isPaidTime: false,
        validationRules: '',
        customFields: '',
        notificationSettings: '',
        displayOrder: undefined,
        colorCode: '',
        iconClass: '',
        allowedDepartmentIds: [],
        allowedRoleIds: [],
    },
    {
        name: {
            required: requiredValidator('اسم نوع الطلب'),
        },
        code: {
            required: requiredValidator('رمز نوع الطلب'),
        },
        categoryId: {
            required: requiredValidator('الفئة'),
        },
    }
)

const body = validator.validation

const isLoading = computed(() => {
    return requestTypeStore.isLoading
})

const createRequestType = async () => {
    const isValid = await body.value.$validate()

    if (!isValid) return
    await requestTypeStore.createRequestType(validator.extractBody())
    validator.resetBody()
    requestTypeStore.isCreateDialogOpen = false
}

watch(
    () => requestTypeStore.isCreateDialogOpen,
    (val: boolean) => {
        if (!val) {
            validator.resetBody()
        }
    }
)
</script>

<template>
    <AppDialog
        v-model="requestTypeStore.isCreateDialogOpen"
        title="إنشاء نوع طلب جديد"
        size="3xl"
        overflow-y="visible"
    >
        <div class="rounded-3xl p-3">
            <div class="flex flex-col gap-4">
                <!-- Basic Information -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AppInputField
                        v-model="body.name.$model"
                        :errors="body.name.$errors"
                        size="md"
                        label="اسم نوع الطلب"
                        required
                    />
                    <AppInputField
                        v-model="body.code.$model"
                        :errors="body.code.$errors"
                        size="md"
                        label="رمز نوع الطلب"
                        required
                    />
                </div>

                <AppTextAreaField
                    v-model="body.description.$model"
                    :errors="body.description.$errors"
                    size="md"
                    label="الوصف"
                    rows="3"
                />

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AppAutoCompleteField
                        v-model="body.categoryId.$model"
                        fetch-on-search
                        search-key="name"
                        :errors="body.categoryId.$errors"
                        size="md"
                        label="الفئة"
                        get-url="/RequestCategory/enabled"
                        item-label="name"
                        item-value="id"
                        required
                    />
                    <AppInputField
                        v-model="body.displayOrder.$model"
                        :errors="body.displayOrder.$errors"
                        size="md"
                        label="ترتيب العرض"
                        type="number"
                        min="1"
                    />
                </div>

                <!-- Settings -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="flex items-center gap-2">
                        <input
                            id="isEnabled"
                            v-model="body.isEnabled.$model"
                            type="checkbox"
                            class="rounded border-gray-300"
                        />
                        <label
                            for="isEnabled"
                            class="text-sm font-medium text-gray-700"
                            >مفعل</label
                        >
                    </div>
                    <div class="flex items-center gap-2">
                        <input
                            id="requiresApproval"
                            v-model="body.requiresApproval.$model"
                            type="checkbox"
                            class="rounded border-gray-300"
                        />
                        <label
                            for="requiresApproval"
                            class="text-sm font-medium text-gray-700"
                            >يتطلب موافقة</label
                        >
                    </div>
                    <div class="flex items-center gap-2">
                        <input
                            id="allowsAttachments"
                            v-model="body.allowsAttachments.$model"
                            type="checkbox"
                            class="rounded border-gray-300"
                        />
                        <label
                            for="allowsAttachments"
                            class="text-sm font-medium text-gray-700"
                            >يسمح بالمرفقات</label
                        >
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="flex items-center gap-2">
                        <input
                            id="requiresAttachments"
                            v-model="body.requiresAttachments.$model"
                            type="checkbox"
                            class="rounded border-gray-300"
                        />
                        <label
                            for="requiresAttachments"
                            class="text-sm font-medium text-gray-700"
                            >يتطلب مرفقات</label
                        >
                    </div>
                    <div class="flex items-center gap-2">
                        <input
                            id="affectsAttendance"
                            v-model="body.affectsAttendance.$model"
                            type="checkbox"
                            class="rounded border-gray-300"
                        />
                        <label
                            for="affectsAttendance"
                            class="text-sm font-medium text-gray-700"
                            >يؤثر على الحضور</label
                        >
                    </div>
                    <div class="flex items-center gap-2">
                        <input
                            id="affectsPayroll"
                            v-model="body.affectsPayroll.$model"
                            type="checkbox"
                            class="rounded border-gray-300"
                        />
                        <label
                            for="affectsPayroll"
                            class="text-sm font-medium text-gray-700"
                            >يؤثر على الراتب</label
                        >
                    </div>
                </div>

                <div class="flex items-center gap-2">
                    <input
                        id="isPaidTime"
                        v-model="body.isPaidTime.$model"
                        type="checkbox"
                        class="rounded border-gray-300"
                    />
                    <label
                        for="isPaidTime"
                        class="text-sm font-medium text-gray-700"
                        >وقت مدفوع</label
                    >
                </div>

                <!-- Duration Settings -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AppInputField
                        v-model="body.maxAdvanceDays.$model"
                        :errors="body.maxAdvanceDays.$errors"
                        size="md"
                        label="أقصى عدد أيام مسبقة"
                        type="number"
                        min="0"
                    />
                    <AppInputField
                        v-model="body.minAdvanceDays.$model"
                        :errors="body.minAdvanceDays.$errors"
                        size="md"
                        label="أقل عدد أيام مسبقة"
                        type="number"
                        min="0"
                    />
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AppInputField
                        v-model="body.maxDurationDays.$model"
                        :errors="body.maxDurationDays.$errors"
                        size="md"
                        label="أقصى مدة بالأيام"
                        type="number"
                        min="1"
                    />
                    <AppInputField
                        v-model="body.minDurationHours.$model"
                        :errors="body.minDurationHours.$errors"
                        size="md"
                        label="أقل مدة بالساعات"
                        type="number"
                        step="0.5"
                        min="0.5"
                    />
                </div>

                <!-- Visual Settings -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AppInputField
                        v-model="body.colorCode.$model"
                        :errors="body.colorCode.$errors"
                        size="md"
                        label="رمز اللون"
                        type="color"
                    />
                    <AppInputField
                        v-model="body.iconClass.$model"
                        :errors="body.iconClass.$errors"
                        size="md"
                        label="فئة الأيقونة"
                        placeholder="fas fa-calendar-alt"
                    />
                </div>

                <!-- Restrictions -->
                <div class="border-t pt-4">
                    <h4
                        class="text-lg font-medium text-gray-900 dark:text-white mb-4"
                    >
                        القيود والصلاحيات
                    </h4>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AppAutoCompleteField
                            v-model="body.allowedDepartmentIds.$model"
                            label="الأقسام المسموحة"
                            placeholder="اختر الأقسام..."
                            get-url="/Department"
                            item-label="name"
                            item-value="id"
                            fetch-on-search
                            search-key="name"
                            multiple
                        />
                        <!-- <AppAutoCompleteField
              v-model="body.allowedRoleIds.$model"
              label="الأدوار المسموحة"
              placeholder="اختر الأدوار..."
              get-url="/role"
              item-label="name"
              item-value="id"
              fetch-on-search
              search-key="name"
              multiple
            /> -->
                    </div>

                    <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        إذا لم يتم تحديد أي قيود، سيكون نوع الطلب متاحاً لجميع
                        المستخدمين
                    </p>
                </div>

                <!-- JSON Fields -->
                <div class="border-t pt-4">
                    <h4
                        class="text-lg font-medium text-gray-900 dark:text-white mb-4"
                    >
                        الإعدادات المتقدمة
                    </h4>

                    <AppTextAreaField
                        v-model="body.validationRules.$model"
                        :errors="body.validationRules.$errors"
                        size="md"
                        label="قواعد التحقق (JSON)"
                        rows="3"
                        placeholder='{"maxConsecutiveDays": 14}'
                    />

                    <AppTextAreaField
                        v-model="body.customFields.$model"
                        :errors="body.customFields.$errors"
                        size="md"
                        label="الحقول المخصصة (JSON)"
                        rows="3"
                        placeholder='[{"name":"reason","type":"text","required":true}]'
                    />

                    <AppTextAreaField
                        v-model="body.notificationSettings.$model"
                        :errors="body.notificationSettings.$errors"
                        size="md"
                        label="إعدادات الإشعارات (JSON)"
                        rows="3"
                        placeholder='{"notifyManager": true, "notifyHR": false}'
                    />
                </div>
            </div>
        </div>
        <template #actions>
            <BaseButton
                color="primary"
                class="gap-1"
                :loading="isLoading"
                @click="createRequestType"
            >
                <Icon name="ph:upload-simple-duotone" class="size-5" />
                إنشاء نوع طلب جديد
            </BaseButton>
        </template>
    </AppDialog>
</template>
