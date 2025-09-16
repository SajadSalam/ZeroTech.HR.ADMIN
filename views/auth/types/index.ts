import type { Organization } from '~/views/orgaization/types';
interface GovernorateDto {
  id: number
  name: string
}

export interface ExamCenter {
    name:                    string;
    isActive:                boolean;
    collegeId:               number;
    college:                 Organization;
    governorateId:           number;
    governorate:             GovernorateDto;
    longitude:               string | null;
    latitude:                string | null;
    managerId:               number;
    managerName:             string;
    managerSignatureFileKey: string | null;
    managerSignatureFileUrl: string | null;
    surrogateManagerId:      number;
    surrogateManagerName:    string;
    maxCapacity:             number;
}

export interface LoginBody {
  email: string
  password: string
}

export interface RegisterBody {
  userName: string
  password: string
  fullName: string
  role: string
}

export interface AuthResponse {
  id: number
  email: string
  name: string
  username: null
  usernameType: null
  ownerType: string
  ownerId: number
  deletedAt: null
  createdAt: Date
  token: string
  roles: Role[]
  systems: number[]
  organizationalStructure: Organization
  examCenter: ExamCenter
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
