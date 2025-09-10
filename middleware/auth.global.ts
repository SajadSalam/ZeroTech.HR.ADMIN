export default defineNuxtRouteMiddleware((to, from) => {
  const isInAuthPages = to.path.includes('login') || to.path.includes('register')
  const isAuthentacited = !!localStorage.getItem('token')
  if (isAuthentacited && isInAuthPages) {
    return navigateTo('/')
  } else if (!isAuthentacited && !isInAuthPages) {
    return navigateTo('/login')
  }
  return
})
