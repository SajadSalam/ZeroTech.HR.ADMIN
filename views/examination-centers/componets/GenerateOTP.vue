<script setup lang="ts">
import { QrcodeStream } from 'vue-qrcode-reader'
import { useExaminationCenters } from '../store/index'
import type { OtpResponse } from '../types'

const examinationCentersStore = useExaminationCenters()

// QR Code Scanner state
const isLoading = ref(false)
const isScanning = ref(false)
const scannedResult = ref('')
const errorMessage = ref('')
const otpResult = ref<OtpResponse | null>(null)
const isError = ref(false)
// QR Code Scanner methods
const onDetect = async (detectedCodes: any[]) => {
    if (detectedCodes.length > 0) {
        scannedResult.value = detectedCodes[0].rawValue
        isScanning.value = false
        
        try {
            isLoading.value = true
            isError.value = false
            errorMessage.value = ''
            otpResult.value = await examinationCentersStore.checkIn(scannedResult.value || '')
        } catch (error) {
            isError.value = true
            errorMessage.value = error.message || 'لم يتم التحقق من الرمز  QR'
        } finally {
            isLoading.value = false
        }
    }
}

const onError = (error: any) => {
    console.error('QR Scanner Error:', error)
    errorMessage.value = error.message || 'Camera access failed'
}

const startScanning = () => {
    isScanning.value = true
    errorMessage.value = ''
    scannedResult.value = ''
    otpResult.value = null
}

const stopScanning = () => {
    isScanning.value = false
}

watch(examinationCentersStore.isGenerateOTPDialogOpen, (newVal) => {
    if (newVal) {
        isLoading.value = false
        otpResult.value = null
        scannedResult.value = ''
        isError.value = false
        errorMessage.value = ''
    }
})
</script>

<template>
    <AppDialog v-model="examinationCentersStore.isGenerateOTPDialogOpen" :title="$t('generate-otp')" size="2xl"
        overflow-y="visible">
        <!-- QR Code Scanner Section -->
        <div class="flex flex-col items-center justify-center space-y-6 p-6">
            <!-- Instruction Text -->
            <div class="text-center">
                <div class="mb-2 flex items-center justify-center">
                    <div class="rounded-full bg-primary-100 p-3 dark:bg-primary-900/20">
                        <Icon name="material-symbols:qr-code-scanner"
                            class="size-8 text-primary-600 dark:text-primary-400" />
                    </div>
                </div>
                <h3 class="text-lg font-semibold text-muted-900 dark:text-white">
                    {{ $t('scan-qr-code-instruction') }}
                </h3>
                <p class="mt-1 text-sm text-muted-500 dark:text-muted-400">
                    {{ $t('scan-qr-code-description') }}
                </p>
            </div>

            <!-- Scanner Container -->
            <div v-if="!isLoading" class="relative w-full max-w-md">
                <div v-if="!isScanning && !scannedResult" class="flex flex-col items-center space-y-4">
                    <!-- Scanner Preview Placeholder -->
                    <div
                        class="flex h-64 w-full items-center justify-center rounded-xl border-2 border-dashed border-muted-300 bg-muted-50 dark:border-muted-600 dark:bg-muted-800">
                        <div class="text-center">
                            <Icon name="material-symbols:qr-code-scanner-outline"
                                class="mx-auto size-12 text-muted-400" />
                            <p class="mt-2 text-sm text-muted-500">{{ $t('camera-preview') }}</p>
                        </div>
                    </div>

                    <!-- Start Scanning Button -->

                </div>

                <!-- Active Scanner -->
                <div v-else class="relative">
                    <div v-if="!scannedResult"
                        class="overflow-hidden border-2 border-primary-200 dark:border-primary-800">
                        <QrcodeStream class="w-full" @detect="onDetect" @error="onError" />
                    </div>

                    <!-- Scanner Overlay -->
                    <div v-if="!scannedResult" class="absolute inset-0 flex items-center justify-center">
                        <div class="h-32 w-32 rounded-lg border-2 border-primary-500 bg-transparent">
                            <div class="absolute -left-1 -top-1 h-6 w-6 border-l-4 border-t-4 border-primary-500"></div>
                            <div class="absolute -right-1 -top-1 h-6 w-6 border-r-4 border-t-4 border-primary-500">
                            </div>
                            <div class="absolute -bottom-1 -left-1 h-6 w-6 border-b-4 border-l-4 border-primary-500">
                            </div>
                            <div class="absolute -bottom-1 -right-1 h-6 w-6 border-b-4 border-r-4 border-primary-500">
                            </div>
                        </div>
                    </div>


                </div>
                <!-- Stop Scanning Button -->
                <div class="mt-4 text-center flex items-center justify-center flex-col gap-2 my-3">
                    <BaseButton color="muted"  v-if="isScanning" variant="outline" @click="stopScanning">
                        <Icon name="material-symbols:stop" class="me-2 size-4" />
                        {{ $t('stop-scanning') }}
                    </BaseButton>
                    
                <BaseButton v-if="!isScanning" color="primary" class="w-full" @click="startScanning">
                    <Icon name="material-symbols:qr-code-scanner" class="me-2 size-4" />
                    {{ $t('start-scanning') }}
                </BaseButton>
                </div>
                <!-- Error Message -->
                <div v-if="errorMessage" class="mt-4 rounded-lg bg-danger-50 p-3 dark:bg-danger-900/20">
                    <div class="flex items-center">
                        <Icon name="material-symbols:error" class="size-5 text-danger-500" />
                        <p class="ml-2 text-sm text-danger-600 dark:text-danger-400">
                            {{ errorMessage }}
                        </p>
                    </div>
                </div>

                <!-- Success Result -->
                <div v-if="otpResult && !isLoading" class="mt-4 rounded-lg bg-success-50 p-4 dark:bg-success-900/20">
                    <div class="flex items-center text-center">
                        <Icon name="material-symbols:check-circle" class="size-5 text-success-500" />
                        <p class="ml-2 text-lg font-medium text-success-700 dark:text-success-400 text-center">
                            {{ $t('qr-code-scanned-successfully') }}
                        </p>
                    </div>
                    <div class="mt-2 rounded text-center font-bold bg-white p-2 text-xl text-muted-600 dark:bg-muted-800 dark:text-muted-300">
                        {{ otpResult?.otp }}
                    </div>
                </div>
                <div v-if="isLoading" class="mt-4 rounded-lg bg-success-50 p-4 dark:bg-success-900/20">
                    <div class="flex items-center text-center">
                        <Icon name="ph:spinner-gap" class="size-5 text-success-500 animate-spin" />
                        <p class="ml-2 text-lg font-medium text-success-700 dark:text-success-400 text-center">
                            {{ $t('qr-code-scanned-successfully') }}
                        </p>
                    </div>
                </div>
            </div>
            <div v-if="isLoading" class="mt-4 rounded-lg bg-primary-50 p-4 dark:bg-primary-900/20">
                <div class="flex items-center text-center gap-5">
                    <Icon name="ph:spinner-gap" class="size-5 text-primary-500 animate-spin" />
                    <p class="ml-2 text-lg font-medium text-primary-700 dark:text-primary-400 text-center">
                        {{ $t('loading-otp') }}
                    </p>
                </div>
            </div>
        </div>

        <!-- Dialog Actions -->
        <template #actions>
            <BaseButton color="muted" variant="outline"
                @click="examinationCentersStore.isGenerateOTPDialogOpen = false">
                {{ $t('cancel') }}
            </BaseButton>
            <BaseButton v-if="scannedResult" color="primary" @click="() => {
                // TODO: Generate OTP from scanned data
                console.log('Generate OTP for:', scannedResult)
            }">
                <Icon name="material-symbols:vpn-key" class="me-2 size-4" />
                {{ $t('generate-otp') }}
            </BaseButton>
        </template>
    </AppDialog>
</template>