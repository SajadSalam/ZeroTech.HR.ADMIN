<script lang="ts" setup>
const props = defineProps<{
    label: string;
    color:
    | "default"
    | "muted"
    | "light"
    | "dark"
    | "black"
    | "primary"
    | "info"
    | "success"
    | "warning"
    | "danger"
    | "none";
    icon: string;
    value: string | number;
    noCounting?: boolean;
}>();

const displayValue = ref(typeof props.value === 'number' ? 0 : props.value);

function animateValue(target: number, duration = 3000) {
    const start = Math.floor(target * 0.6);
    const range = target - start;
    const startTime = performance.now();

    function easeOutCubic(t: number): number {
        return 1 - Math.pow(1 - t, 3);
    }

    function step(currentTime: number) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutCubic(progress);
        const current = Math.round(start + range * easedProgress);

        displayValue.value = current;

        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }

    requestAnimationFrame(step);
}

onMounted(() => {
    if (!props.noCounting && typeof props.value === 'number') {
        animateValue(props.value);
    } else {
        displayValue.value = props.value;
    }
});

// Optional: reactively animate if value changes
watch(
    () => props.value,
    (newVal) => {
        if (!props.noCounting && typeof newVal === 'number') {
            animateValue(newVal);
        } else {
            displayValue.value = newVal;
        }
    }
);
</script>

<template>
    <div class="bg-white p-4 gap-6 rounded-2xl flex items-center shadow-sm border-0" style="border-radius: 16px;">
        <!-- Icon Container -->
        <div class="flex-shrink-0 rounded-full p-4 flex items-center justify-center" style="background-color: rgba(117, 13, 2, 0.1);">
            <Icon :name="icon" class="size-8 text-[#750D02]" />
        </div>

        <!-- Content -->
        <div class="flex flex-col gap-1 flex-1 min-w-0">
            <p class="text-[#7B7B7B] text-base font-normal">{{ label }}</p>
            <h1 class="text-[#202020] text-[28px] font-bold leading-tight tracking-tight" :key="displayValue">
                {{ typeof displayValue === 'number' ? displayValue.toLocaleString() : displayValue }}
            </h1>
        </div>

        <!-- Actions Slot -->
        <div v-if="$slots.actions" class="flex-shrink-0">
            <slot name="actions"></slot>
        </div>
    </div>
</template>
