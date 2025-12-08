import type { Organization } from '~/views/orgaization/types';
interface GovernorateDto {
  id: number
  name: string
}

export interface Hall {
    id: number
    name: string
    examCenterId: number
    examCenter: ExamCenter
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

export interface Token {
  accessToken: string;
  expiryMinutes: number;
  refreshToken: string;
  refreshTokenExpiryDays: number;
}
export interface Permission {
  id: number;
  name: string;
  slug: string;
  group: string;
}
export interface Role {
  id: number;
  name: string;
  slug: string;
  permissions?: Permission[];
  description?: string;
}

export interface OrganizationalStructure {
  id: number;
  arabicName: string;
  englishName: string;
  parentId: number;
  uniteTypeId: number;
  fullNameAr: string;
  fullNameEn: string;
}

export interface AuthResponse {
  id: number;
  email: string;
  name: string;
  username: string;
  ownerId: number;
  token: Token;
  roles: Role[];
  organizationalStructure: OrganizationalStructure;
}

export interface UserPrivilege {
  roles: Role[];
}
