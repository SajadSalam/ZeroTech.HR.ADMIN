import { findFirstAccessiblePage, hasRouteAccess } from '~/utils/navigation-helpers'
import { useAuthStore } from '~/views/auth/store/auth'

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Skip middleware on login/register pages
  const isInAuthPages = to.path.includes('login') || to.path.includes('register')
  const isAuthentacited = !!localStorage.getItem('token')
    if (!isAuthentacited && !isInAuthPages) {
    return navigateTo('/login')
  }
  if (isInAuthPages) return

  const auth = useAuthStore()
  
  // Only proceed if user is authenticated
  if (!auth.isLogged) return

  // Ensure user privileges are loaded
  if (!auth.userPrivileges) {
    try {
      await auth.fetchUserPrivileges()
    } catch (error) {
      console.error('Failed to fetch user privileges:', error)
      return
    }
  }

  // If user is on root path and has no specific examCenter, redirect to first accessible page
  if (from.path === '/login' && to.path === '/') {
    const firstAccessiblePage = await findFirstAccessiblePage()
    return navigateTo(firstAccessiblePage)
  }

  // Check if user has access to the current page
  // Skip access check for fallback routes to prevent infinite redirects
  const isFallbackRoute = to.path === '/access-denied' || to.path === '/financial-dashboard'
  
  if (!isFallbackRoute) {
    const hasAccess = await hasRouteAccess(to.path)
    console.log(hasAccess)
    console.log(to.path)
    
    if (!hasAccess) {
      const firstAccessiblePage = await findFirstAccessiblePage()
      console.log(firstAccessiblePage)
      // Prevent infinite redirect by ensuring we don't redirect to the same page
      if (firstAccessiblePage !== to.path) {
        console.log(firstAccessiblePage)
        return navigateTo(firstAccessiblePage)
      }
    }
  }
})
