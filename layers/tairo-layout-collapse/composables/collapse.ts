import type { RouteLocationRaw } from 'vue-router'

export interface TairoCollapseResolvedConfig {
  name: string
  divider?: boolean
  icon: {
    name: string
    class?: string
  }
  children?: any[]
  component?: {
    name: string
    props?: any
  }
  to?: RouteLocationRaw
  click?: () => void | Promise<void>
  activePath?: string
  /**
   * @default 'start'
   */
  position?: 'start' | 'end'
}

/**
 * Composable to manage navigation of the sidebar layout
 *
 * You can define sidebar items in your app.config.ts
 *
 * ```ts
 * export default defineAppConfig({
 *   tairo: {
 *     sidebar: {
 *       items: {
 *           name: 'Dashboards',
 *
 *           // You can define an active path to highlight the item
 *           activePath: '/dashboards',
 *
 *           // You can define an icon to display in the sidebar
 *           icon: { name: 'ph:sidebar-duotone', class: 'w-5 h-5' },
 *
 *           // Or use a component
 *           // It should be registered in the app as a global component (in components/global)
 *           component: { name: 'AppThemeToggle', props: {} },
 *
 *           // You can chose to display a subsidebar by defining a component name
 *           // It should be registered in the app as a global component
 *           subsidebar: { name: 'SidebarMenuDashboards', props: {} },
 *
 *           // Or you can define a route to navigate to
 *           to: '/dashboards',
 *
 *           // Or you can define a click handler (eg. to open a panel)
 *           click: () => {
 *             const { open } = usePanels()
 *             open('panel-name')
 *           },
 *         },
 *       ],
 *     },
 *   },
 * })
 * ```
 */
export function useCollapse() {
  const app = useAppConfig()
  const route = useRoute()

  const menuItems = computed(() => {
    if (((app.tairo as any)?.collapse?.navigation?.enabled as boolean) === false) {
      return []
    }

    // Check if we need dynamic navigation
    let navigationItems = ((app.tairo as any)?.collapse?.navigation?.items as any[]) || []
    
    // Check if we're in exam center detail view and use dynamic navigation
    if (route.path.startsWith('/examination-centers/') && route.params.id) {
      const { getExamCenterNavigation } = useDynamicNavigation()
      const examCenterId = route.params.id as string
      navigationItems = getExamCenterNavigation(examCenterId)
    }

    if (navigationItems.length === 0) {
      return []
    }

    return navigationItems.map(
      (navigation: any) =>
        <TairoCollapseResolvedConfig>{
          ...navigation,
          position: navigation.position ?? 'start',
        }
    )
  })

  const isOpen = useState('collapse-open', () => true)
  const isMobileOpen = useState('collapse-mobile-open', () => false)

  const header = computed(() => {
    return (app.tairo as any)?.collapse?.navigation?.header
  })

  const footer = computed(() => {
    return (app.tairo as any)?.collapse?.navigation?.footer
  })

  function toggle() {
    // If no sidebar item is selected, open the first one
    const { lg } = useTailwindBreakpoints()
    if (lg.value) {
      isOpen.value = !isOpen.value
    } else {
      isMobileOpen.value = !isMobileOpen.value
    }
  }

  if (process.client) {
    const { lg } = useTailwindBreakpoints()
    watch(lg, (isLg) => {
      if (isLg) {
        isMobileOpen.value = false
      }
    })
    watch(
      () => route.fullPath,
      () => {
        if (!lg.value) {
          isMobileOpen.value = false
        }
      }
    )
  }

  return {
    toggle,
    menuItems,
    isOpen,
    isMobileOpen,
    header,
    footer,
  }
}
