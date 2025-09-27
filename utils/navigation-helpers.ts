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
  
  // Fallback - if no specific privilege found, return financial dashboard (no privilege required)
  return '/financial-dashboard'
}

/**
 * Navigate to the first page the user has access to
 * @returns Promise<void>
 */
export const navigateToFirstAccessiblePage = async (): Promise<void> => {
  const firstAccessiblePage = await findFirstAccessiblePage()
  await navigateTo(firstAccessiblePage)
}
