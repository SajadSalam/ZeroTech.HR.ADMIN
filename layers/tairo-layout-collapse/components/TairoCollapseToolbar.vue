<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    collapse?: boolean
    horizontalScroll?: boolean
  }>(),
  {
    collapse: true,
  }
)

const app = useAppConfig()

const route = useRoute()

const showNavBurger = computed(() => {
  return props.collapse && app.tairo?.collapse?.toolbar?.showNavBurger
})
</script>

<template>
  <div
    class="border-b-1 relative mb-5 flex h-20 items-center gap-2 bg-white m-5 rounded-lg"
    :class="props.horizontalScroll && 'px-4 xl:px-10'"
  >
    <TairoCollapseBurger v-if="showNavBurger" class="ms-3" />

    <div>
      <BaseHeading
        v-if="app.tairo?.collapse?.toolbar?.showTitle"
        as="h1"
        size="lg"
        class="hidden text-muted-800 dark:text-white md:block"
      >
        <slot name="title">
          {{ $t(route.meta.title ?? 'home-page') }}
        </slot>
      </BaseHeading>
      <span class="text-sm text-muted-500">
        {{ $t(route.meta.description ?? 'this-is-the-home-page') }}
      </span>
    </div>

    <div class="ms-auto" />
    <ChangeLocale />
    <template v-for="tool of app.tairo?.collapse?.toolbar?.tools">
      <component
        :is="resolveComponentOrNative(tool.component)"
        v-if="tool.component"
        :key="tool.component"
        v-bind="tool.props"
      />
    </template>
  </div>
</template>
