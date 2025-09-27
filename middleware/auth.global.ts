export default defineNuxtRouteMiddleware((to) => {
  const isInAuthPages = to.path.includes('login') || to.path.includes('register')
  const isAuthentacited = !!localStorage.getItem('token')
  
  if (isAuthentacited && isInAuthPages) {
    // When user is authenticated and tries to access login, redirect to root
    // The examination-center middleware will handle the specific redirection
    return navigateTo('/')
  } else if (!isAuthentacited && !isInAuthPages) {
    return navigateTo('/login')
  }
  return
})
