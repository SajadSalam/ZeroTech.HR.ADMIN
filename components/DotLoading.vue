<script setup lang="ts">
interface Props {
    size?: 'sm' | 'md' | 'lg'
    color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info'
}

const props = withDefaults(defineProps<Props>(), {
    size: 'md',
    color: 'primary',
})

const sizeClasses: Record<'sm' | 'md' | 'lg', string> = {
    sm: 'size-2',
    md: 'size-3',
    lg: 'size-4',
}

const colorClasses: Record<string, string> = {
    primary: 'bg-primary-500',
    secondary: 'bg-secondary-500',
    success: 'bg-success-500',
    danger: 'bg-danger-500',
    warning: 'bg-warning-500',
    info: 'bg-info-500',
}

const dotSize = computed(() => {
    const size: 'sm' | 'md' | 'lg' = props.size || 'md'
    return sizeClasses[size]
})
const dotColor = computed(() => {
    const color = props.color || 'primary'
    return colorClasses[color] || colorClasses.primary
})
</script>

<template>
    <div class="flex items-center justify-center gap-1.5">
        <div v-for="i in 3" :key="i" :class="[
            dotSize,
            'rounded-full',
            dotColor,
            'animate-spin-dot',
        ]" :style="{
        animationDelay: `${(i - 1) * 0.15}s`,
    }" />
    </div>
</template>

<style scoped>
@keyframes spin-dot {

    0%,
    100% {
        transform: translateY(0) scale(1);
        opacity: 1;
    }

    50% {
        transform: translateY(-8px) scale(1.1);
        opacity: 0.7;
    }
}

.animate-spin-dot {
    animation: spin-dot 0.8s ease-in-out infinite;
}
</style>
