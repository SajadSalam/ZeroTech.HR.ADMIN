import type { BaseFilters } from '~/utils/types/ApiResponses'
import type { BaseDto } from '~/utils/types/base-dto'

export interface Employee {
  employeeId: number;
  id: number | null;
  empArFirstName: string;
  empArSecondName: string;
  empArThirdName: string;
  empArFourthName: string;
  academicRank: string;
  collegeId: number;
  position: string;
}

export interface BlacklistEntry {
  id: number;
  ticketId: string;
  externalStudentId: number;
  ticketNumber: string;
  externalStudentName: string;
  externalStudentNationalId: string;
  examCenterName: string;
  hallName: string;
  reason: string;
  unblacklistReason: string | null;
  blacklistedAt: string; // ISO date string
  unblacklistedAt: string | null;
  assignedBy: Employee;
  discoveredBy: Employee;
  unblacklistedBy: Employee | null;
  isUnblacklisted: boolean;
}

export type BlacklistDto = BlacklistEntry

export type BlacklistFilters = BaseFilters & {
  externalStudentName: string | null;
  examCenterName: string | null;
  isUnblacklisted: boolean | null;
}

export type UnblacklistRequest = {
  unblacklistReason: string;
}