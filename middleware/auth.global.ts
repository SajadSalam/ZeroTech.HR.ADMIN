export default defineNuxtRouteMiddleware((to) => {
  const isInAuthPages = to.path.includes('login') || to.path.includes('register')
  const isAuthentacited = !!localStorage.getItem('token')
  
  if (isAuthentacited && isInAuthPages) {
    // When user is authenticated and tries to access login, redirect to financial dashboard
    // The specific privilege-based redirection will be handled in app.vue
    return navigateTo('/financial-dashboard')
  } else if (!isAuthentacited && !isInAuthPages) {
    return navigateTo('/login')
  }
  return
})
