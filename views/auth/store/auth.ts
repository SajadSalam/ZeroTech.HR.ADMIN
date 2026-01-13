import { AuthService } from '../service'
import type { LoginBody, MeResponse, Token } from '../types'

const authService = new AuthService()


export const useAuthStore = defineStore('auth-store', () => {
  const isLoading = ref(false)

  const token = computed({
    get: () => typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '',
    set: (value: string) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', value)
      }
    },
  })

  const tokenData = computed({
    get: () => {
      if (typeof window === 'undefined') return {} as Token
      const stored = localStorage.getItem('tokenData')
      return stored ? JSON.parse(stored) as Token : {} as Token
    },
    set: (value: Token) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('tokenData', JSON.stringify(value))
      }
    },
  })

  const userData = computed({
    get: () => {
      if (typeof window === 'undefined') return {} as MeResponse
      const stored = localStorage.getItem('userData')
      return stored ? JSON.parse(stored) as MeResponse : {} as MeResponse
    },
    set: (value: MeResponse) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('userData', JSON.stringify(value))
      }
    },
  })

  const isLogged = computed(() => !!token.value)


  const login = async (body: LoginBody) => {
    try {
      isLoading.value = true
      const response = await authService.login(body)
      
      if (response.isSuccess) {
        token.value = response.token.accessToken
        tokenData.value = response.token
        userData.value = response.user
        navigateTo('/')
      } else {
        throw new Error(response.message || 'Login failed')
      }
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const me = async  (): Promise<MeResponse | false> => {
    try {
      isLoading.value = true
      const response = await authService.me()
      userData.value = response
      
      // Check if user has valid roles
      if (!response.roles || response.roles.length === 0) {
        logout()
        return false;
      }

      return response
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const hasPermission = (permissions: string[]) => {
    if (!userData.value) return false
    if (!userData.value.permissions) return false
    return permissions.some(permission => 
      userData.value.permissions.some(userPerm => 
        typeof userPerm === 'string' ? userPerm === permission : userPerm.name === permission
      )
    )
  }

  const hasRole = (roleName: string) => {
    if (!userData.value || !userData.value.roles) return false
    return userData.value.roles.some(role => role.name === roleName)
  }

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('tokenData')
      localStorage.removeItem('userData')
    }
    navigateTo('/login')
  }

  return {
    isLoading,
    token,
    tokenData,
    userData,
    login,
    logout,
    isLogged,
    me,
    hasPermission,
    hasRole,
  }
})
