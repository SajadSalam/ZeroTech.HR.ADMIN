/**
 * Composable for avatar image preloading and caching
 */

export function useAvatarCache(avatarCount: number = 24, basePath: string = '/img/avatars') {
  const cache = ref<Map<number, HTMLImageElement>>(new Map())
  const isLoading = ref(false)
  const loadedCount = ref(0)

  /**
   * Preload all avatar images
   */
  const preloadAvatars = async (): Promise<void> => {
    isLoading.value = true
    loadedCount.value = 0
    const promises: Promise<void>[] = []

    for (let i = 1; i <= avatarCount; i++) {
      const promise = new Promise<void>((resolve) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        
        img.onload = () => {
          cache.value.set(i, img)
          loadedCount.value++
          resolve()
        }
        
        img.onerror = () => {
          // Continue even if image fails to load
          loadedCount.value++
          resolve()
        }
        
        img.src = `${basePath}/${i}.svg`
      })
      promises.push(promise)
    }

    await Promise.all(promises)
    isLoading.value = false
  }

  /**
   * Get avatar image by ID (cycles through available avatars)
   */
  const getAvatar = (id: number): HTMLImageElement | undefined => {
    const avatarNumber = ((id - 1) % avatarCount) + 1
    return cache.value.get(avatarNumber)
  }

  /**
   * Get avatar number for an ID
   */
  const getAvatarNumber = (id: number): number => {
    return ((id - 1) % avatarCount) + 1
  }

  /**
   * Check if a specific avatar is loaded
   */
  const hasAvatar = (id: number): boolean => {
    const avatarNumber = ((id - 1) % avatarCount) + 1
    return cache.value.has(avatarNumber)
  }

  /**
   * Clear the avatar cache
   */
  const clearCache = () => {
    cache.value.clear()
    loadedCount.value = 0
  }

  return {
    // State
    cache,
    isLoading,
    loadedCount,
    
    // Methods
    preloadAvatars,
    getAvatar,
    getAvatarNumber,
    hasAvatar,
    clearCache,
    
    // Computed
    progress: computed(() => (loadedCount.value / avatarCount) * 100)
  }
}
