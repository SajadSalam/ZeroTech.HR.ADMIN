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
    value: string | number | undefined | null;
    noCounting?: boolean;
    variant?: 'default' | 'gradient';
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
    // if (!props.noCounting && typeof props.value === 'number') {
    //     animateValue(props.value);
    // } else {
    //     displayValue.value = props.value;
    // }
    displayValue.value = props.value;

});

// Optional: reactively animate if value changes
watch(
    () => props.value,
    (newVal) => {
        // if (!props.noCounting && typeof newVal === 'number') {
        //     animateValue(newVal);
        // } else {
            displayValue.value = newVal;
        // }
    }
);

// Computed classes based on variant
const containerClasses = computed(() => {
    if (props.variant === 'gradient') {
        return 'p-4 gap-6 rounded-2xl flex items-center  border-0 bg-gradient-to-b from-[#A01E11] to-[#750D02]';
    }
    return 'bg-white p-4 gap-6 rounded-2xl flex items-center  border-0';
});

const iconBgClasses = computed(() => {
    if (props.variant === 'gradient') {
        return 'flex-shrink-0 rounded-full p-4 flex items-center justify-center bg-white bg-opacity-10';
    }
    return 'flex-shrink-0 rounded-full p-4 flex items-center justify-center bg-[rgba(117,13,2,0.1)]';
});

const iconClasses = computed(() => {
    if (props.variant === 'gradient') {
        return 'size-6 text-white';
    }
    return 'size-6 text-[#750D02]';
});

const labelClasses = computed(() => {
    if (props.variant === 'gradient') {
        return 'text-white text-base font-normal';
    }
    return 'text-[#7B7B7B] text-base font-normal';
});

const valueClasses = computed(() => {
    if (props.variant === 'gradient') {
        return 'text-white text-[28px] font-bold leading-tight tracking-tight';
    }
    return 'text-[#202020] text-[28px] font-bold leading-tight tracking-tight';
});
</script>

<template>
    <div :class="containerClasses" style="border-radius: 16px;">
        <!-- Icon Container -->
        <div :class="iconBgClasses">
            <Icon :name="icon" :class="iconClasses" />
        </div>

        <!-- Content -->
        <div class="flex flex-col gap-1 flex-1 min-w-0">
            <p :class="labelClasses">{{ label }}</p>
            <h1 :class="valueClasses" :key="displayValue">
                {{ typeof displayValue === 'string' ? displayValue : displayValue.toLocaleString() }}
            </h1>
        </div>

        <!-- Actions Slot -->
        <div v-if="$slots.actions" class="flex-shrink-0">
            <slot name="actions"></slot>
        </div>
    </div>
</template>