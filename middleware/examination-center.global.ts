import { findFirstAccessiblePage } from '~/utils/navigation-helpers'
import { useAuthStore } from '~/views/auth/store/auth'

export default defineNuxtRouteMiddleware(async (to) => {
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
    if (!to.path.includes(expectedRoute)) {
      return navigateTo(expectedRoute)
    }
  }
  
  if (auth.userData.examCenter) {
    const expectedRoute = `/examination-centers/${auth.userData.examCenter.id}`
    if (!to.path.includes(expectedRoute)) {
      return navigateTo(expectedRoute + '/exams')
    }
  }

  // If user is on root path and has no specific examCenter, redirect to first accessible page
  if (to.path === '/') {
    const firstAccessiblePage = await findFirstAccessiblePage()
    return navigateTo(firstAccessiblePage)
  }
})
