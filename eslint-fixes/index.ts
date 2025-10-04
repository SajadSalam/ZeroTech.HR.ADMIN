
export interface LoginBody {
  username: string
  password: string
}

export interface RegisterBody {
  username: string
  password: string
  fullName: string
  roleId: number
}

export interface AuthResponse {
  id: number
  name: string
  username: string
  deletedAt: null
  createdAt: Date
  token: string
  roles: Role[]
}

export interface Role {
  id: number
  name: string
  slug: string
  permissions?: string[]
}
export interface UserPrivilege {
  id: number
  userId: number
  osId: number
  roleId: number
  isActive: boolean
  role: Role
}
