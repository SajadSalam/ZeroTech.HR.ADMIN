import type { AuthResponse, LoginBody, RegisterBody, UserPrivilege } from '../types'
import axios from '~/services/app-client/axios'

interface IAuthService {
  login: (body: LoginBody) => Promise<AuthResponse>
  employeeLogin: (body: LoginBody) => Promise<AuthResponse>
  register: (body: RegisterBody) => Promise<AuthResponse>
}

export class AuthService implements IAuthService {
  async login(body: LoginBody): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>('/auth/login', body)

    return response.data
  }

  async userPrivileges(): Promise<UserPrivilege> {
    const response = await axios.get<UserPrivilege>('/ums/privileges')

    return response.data
  }

  async employeeLogin(body: LoginBody): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>('/login/employee', body)

    return response.data
  }

  async register(body: RegisterBody): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>('/create-provider', body)
    return response.data
  }
}
