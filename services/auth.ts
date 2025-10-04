import type { User } from '~/views/auth/types'

export const hasRole = (role: string | string[]) => {
  const userData = JSON.parse(localStorage.getItem('userData')!) as User
  if (!userData.roles || userData.roles.length === 0) return false
  
  const userRoles = userData.roles.map(r => r.name)
  
  if (Array.isArray(role)) {
    return role.some(r => userRoles.includes(r))
  }
  
  return userRoles.includes(role)
}
