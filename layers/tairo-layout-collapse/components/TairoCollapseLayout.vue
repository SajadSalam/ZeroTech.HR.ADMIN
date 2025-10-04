<script setup lang="ts">
import { useCollapse } from '../composables/collapse'

const props = withDefaults(
  defineProps<{
    collapse?: boolean
    toolbar?: boolean
    circularMenu?: boolean
    condensed?: boolean
    horizontalScroll?: boolean
  }>(),
  {
    collapse: true,
    toolbar: true,
    circularMenu: true,
  }
)

const app = useAppConfig()
const { isOpen, isMobileOpen, toggle } = useCollapse()

const collapseEnabled = computed(() => {
  return (app.tairo?.collapse?.navigation?.enabled as boolean) !== false && props.collapse !== false
})
const toolbarEnabled = computed(() => {
  return (app.tairo?.collapse?.toolbar?.enabled as boolean) !== false && props.toolbar !== false
})
const circularMenuEnabled = computed(() => {
  return (
    (app.tairo?.collapse?.circularMenu?.enabled as boolean) !== false &&
    props.circularMenu !== false
  )
})
const mainClass = computed(() => {
  if (props.condensed) {
    return 'bg-white dark:bg-muted-900 relative min-h-screen w-full overflow-x-hidden'
  }

  if (!collapseEnabled.value) {
    return 'bg-white dark:bg-muted-900 relative min-h-screen w-full overflow-x-hidden transition-all duration-300 xl:ps-6'
  }

  const list = [
    'bg-white dark:bg-muted-900 relative min-h-screen w-full overflow-x-hidden transition-all duration-300 xl:ps-6 bg',
  ]

  if (isOpen.value) {
    list.push('lg:max-w-[calc(100%_-_225px)] lg:ms-[225px]')
  } else {
    list.push('lg:max-w-[calc(100%_-_80px)] lg:ms-[80px] xl:!ps-0')
  }

  if (props.horizontalScroll) {
    list.push('!pe-0 xl:!pe-0')
  }

  return list
})
</script>

<template>
  <div class="bg-white dark:bg-muted-900" dir="rtl">
    <slot name="navigation">
      <TairoCollapseNavigation v-if="collapseEnabled" />
      <div
role="button" tabindex="0"
        class="fixed start-0 top-0 z-[59] block size-full bg-muted-800 transition-opacity duration-300 dark:bg-muted-900 lg:hidden"
        :class="isMobileOpen ? 'opacity-50 dark:opacity-75' : 'pointer-events-none opacity-0'" @click="toggle" />
    </slot>

    <div :class="mainClass">
      <div
:class="[
        props.condensed && !props.horizontalScroll && 'w-full',
        !props.condensed && props.horizontalScroll && 'w-full',
        !props.condensed && !props.horizontalScroll && 'w-full',
      ]">
        <slot name="toolbar">
          <TairoCollapseToolbar
v-if="toolbarEnabled" :collapse="props.collapse"
            :horizontal-scroll="props.horizontalScroll">
            <template #title>
              <slot name="toolbar-title" />
            </template>
          </TairoCollapseToolbar>
        </slot>
        <div class="px-5">
          <slot />
        </div>
      </div>
    </div>

    <TairoPanels />

    <TairoCollapseCircularMenu v-if="circularMenuEnabled" />
  </div>
</template>
<style lang="scss">
.bg {
  background-color: rgba(237, 240, 242, 1);
  position: relative;
  z-index: 1;
}
</style>
