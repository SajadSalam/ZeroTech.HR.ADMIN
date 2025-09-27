import { findFirstAccessiblePage } from '~/utils/navigation-helpers'
import { useAuthStore } from '~/views/auth/store/auth'

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Skip middleware on login/register pages
  const isInAuthPages = to.path.includes('login') || to.path.includes('register')
  if (isInAuthPages) return

  const auth = useAuthStore()
  
  // Only proceed if user is authenticated
  if (!auth.isLogged) return

  // Ensure user privileges are loaded
  if (auth.userPrivileges.length === 0) {
    try {
      await auth.fetchUserPrivileges()
    } catch (error) {
      console.error('Failed to fetch user privileges:', error)
      return
    }
  }

  // Route guard: redirect to examination center page if user has examCenter data and is not already on that route
  if (auth.userData.hall) {
    const expectedRoute = `/examination-centers/${auth.userData.hall.examCenterId}/hall/${auth.userData.hall.id}`
    // Only redirect if the current path doesn't match the expected route exactly
    if (!to.path.startsWith(expectedRoute)) {
      return navigateTo(expectedRoute)
    }
    return // Stop further processing if user has hall assignment
  }
  
  if (auth.userData.examCenter) {
    const expectedRoute = `/examination-centers/${auth.userData.examCenter.id}`
    // Only redirect if the current path doesn't match the expected route
    if (!to.path.startsWith(expectedRoute)) {
      return navigateTo(expectedRoute + '/exams')
    }
    return // Stop further processing if user has examCenter assignment
  }

  // If user is on root path and has no specific examCenter, redirect to first accessible page
  if (from.path === '/login' && to.path === '/') {
    const firstAccessiblePage = await findFirstAccessiblePage()
    return navigateTo(firstAccessiblePage)
  }
})
