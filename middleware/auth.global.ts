
export default defineNuxtRouteMiddleware((to) => {
      // Skip middleware during SSR/SSG
      if (typeof window === 'undefined') {
        return
      }
      
      const isInAuthPages = to.path.includes('login') || to.path.includes('register')
      const isAuthentacited = !!localStorage.getItem('token')
      if (!isAuthentacited && !isInAuthPages) {
        return navigateTo('/login')
      }


    return
})
