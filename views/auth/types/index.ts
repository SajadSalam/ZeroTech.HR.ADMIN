
export interface LoginBody {
  loginIdentifier: string
  password: string
  rememberMe?: boolean
}

export interface AuthResponse {
  isSuccess: boolean
  message: string
  errorCode: string | null
  user: User
  token: Token
}

export interface User {
  employeeId: number
  username: string
  email: string
  firstName: string
  lastName: string
  fullName: string
  phoneNumber: string
  emailVerified: boolean
  lastLoginAt: string
  isLockedOut: boolean
  roles: Role[]
  permissions: Permission[]
  id: number
  createdAt: string
  createdByUserId: number | null
  createdBy: string
  createdByUserName: string | null
  updatedAt: string | null
  updatedByUserId: number | null
  updatedBy: string | null
  updatedByUserName: string | null
  isActive: boolean
}

export interface Role {
  name: string
  description: string
  isSystemRole: boolean
  permissions: Permission[]
  id: number
  createdAt: string
  createdByUserId: number | null
  createdBy: string
  createdByUserName: string | null
  updatedAt: string | null
  updatedByUserId: number | null
  updatedBy: string | null
  updatedByUserName: string | null
  isActive: boolean
}

export interface Permission {
  // Add permission properties as needed
  [key: string]: any
}

export interface Token {
  accessToken: string
  refreshToken: string
  expiresAt: string
  tokenType: string
  expiresInSeconds: number
}

// Keep MeResponse as User for backward compatibility
export type MeResponse = User

