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
    <div class="bg-white p-5 gap-4 rounded-lg flex border">
        <div :class="`h-full rounded-2xl p-3 bg-${color}-500/20 flex items-center justify-center`">
            <Icon :name="icon" :class="`size-7 text-${color}-500`" :color="color" />
        </div>

        <div class="flex items-center justify-between w-full">
            <div class="flex flex-col justify-between">
                <p class="text-gray text-sm">{{ label }}</p>

                <h1 class="text-lg font-bold" :key="displayValue">
                    {{ displayValue.toLocaleString() }}
                </h1>
            </div>
        </div>

        <div class="w-[25%]">
            <slot name="actions"></slot>
        </div>
    </div>
</template>
