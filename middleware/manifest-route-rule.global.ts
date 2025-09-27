// Override for manifest-route-rule middleware to prevent warnings
export default defineNuxtRouteMiddleware((to, from) => {
  // This middleware overrides the conflicting manifest-route-rule middleware
  // from multiple layers to prevent duplicate middleware warnings
  return
})
