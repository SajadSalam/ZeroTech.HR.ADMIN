import defaultNavigation from '~/navigation/index'
import { useAuthStore } from '~/views/auth/store/auth'

/**
 * Helper function to check if user has access to a navigation item
 * @param item Navigation item with optional privilege or role
 * @param authStore Auth store instance
 * @returns boolean indicating if user has access
 */
export const hasNavigationAccess = (item: any, authStore: any): boolean => {
  if (!item.privilege && !item.role) return true // No privilege required
  if (item.privilege && authStore.hasPrivilege(item.privilege)) return true
  if (item.role && authStore.hasRole(item.role)) return true
  return false
}

/**
 * Find the first accessible page for the current user based on their privileges
 * @returns Promise<string> The first accessible page route
 */
export const findFirstAccessiblePage = async (): Promise<string> => {
  const authStore = useAuthStore()
  
  // Ensure user privileges are loaded
  if (authStore.userPrivileges.length === 0) {
    await authStore.fetchUserPrivileges()
  }
  
  // Check all navigation items and find first accessible one
  for (const item of defaultNavigation) {
    if (hasNavigationAccess(item, authStore)) {
      if (item.to) {
        return item.to
      } else if (item.children) {
        // Check children for nested navigation
        for (const child of item.children) {
          if (hasNavigationAccess(child, authStore) && child.to) {
            return child.to
          }
        }
      }
    }
  }
  
  // Fallback - if no navigation items are accessible, return a safe default
  // This could be an access denied page or a minimal dashboard
  return '/access-denied'
}

/**
 * Check if user has access to a specific route
 * @param route The route path to check
 * @returns Promise<boolean> Whether user has access to the route
 */
export const hasRouteAccess = async (route: string): Promise<boolean> => {
  const authStore = useAuthStore()
  
  // Ensure user privileges are loaded
  if (authStore.userPrivileges.length === 0) {
    await authStore.fetchUserPrivileges()
  }
  
  // Check all navigation items to find matching route
  const checkRoute = (items: any[]): boolean => {
    for (const item of items) {
      // Check children first - children don't need parent access
      if (item.children) {
        for (const child of item.children) {
          // Check direct child route match
          if (child.to === route) {
            return hasNavigationAccess(child, authStore)
          }
          
          // Check if route starts with child.to (for nested child routes)
          if (child.to && route.startsWith(child.to)) {
            return hasNavigationAccess(child, authStore)
          }
          
          // Recursively check grandchildren if any
          if (child.children) {
            const grandchildResult = checkRoute(child.children)
            if (grandchildResult) return true
          }
        }
      }
    
      // Check direct route match for parent items
      if (item.to === route) {
        return hasNavigationAccess(item, authStore)
      }
      
      // Check if route starts with item.to (for nested routes)
      // But avoid matching single "/" which would match everything
      if (item.to && item.to !== '/' && route.startsWith(item.to)) {
        return hasNavigationAccess(item, authStore)
      }
    }
    
    return false
  }

  
  return checkRoute(defaultNavigation)
}

/**
 * Navigate to the first page the user has access to
 * @returns Promise<void>
 */
export const navigateToFirstAccessiblePage = async (): Promise<void> => {
  const firstAccessiblePage = await findFirstAccessiblePage()
  await navigateTo(firstAccessiblePage)
}
