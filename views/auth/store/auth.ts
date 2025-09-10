import { AuthService } from '../service'
import type { AuthResponse, LoginBody, RegisterBody, UserPrivilege } from '../types'

const authService = new AuthService()
export const useAuthStore = defineStore('auth-store', () => {
  const isLoading = ref(false)
  const userPrivileges = ref<UserPrivilege[]>([])

  const token = computed({
    get: () => localStorage.getItem('token') || '',
    set: (value: string) => localStorage.setItem('token', value),
  })
  const userData = computed({
    get: () => JSON.parse(localStorage.getItem('userData')!) as AuthResponse,
    set: (value: AuthResponse) => localStorage.setItem('userData', JSON.stringify(value)),
  })

  const isLogged = computed(() => !!token.value)

  const hasRole = (role: string | string[]) => {
    if (!userData.value.roles || userData.value.roles.length < 1) return false
    if (Array.isArray(role))
      return role.some((r) => userData.value.roles.findIndex((rl) => rl.slug === r) != -1)
    return userData.value.roles.findIndex((r) => r.slug === role) != -1
  }

  const login = async (body: LoginBody) => {
    try {
      isLoading.value = true
      let response
      response = await authService.login(body)
      token.value = response.token
      userData.value = response
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const fetchUserPrivileges = async () => {
    try {
      userPrivileges.value = await authService.userPrivileges()
    } catch (error) {
      throw error
    }
  }
  const hasPrivilege = (privilege: string) => {
    return userPrivileges.value.some((p) => p.role.permissions?.includes(privilege))
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userData')
    navigateTo('/login')
  }

  return {
    isLoading,
    token,
    userData,
    login,
    logout,
    hasRole,
    userPrivileges,
    fetchUserPrivileges,
    hasPrivilege,
    isLogged,
  }
})
