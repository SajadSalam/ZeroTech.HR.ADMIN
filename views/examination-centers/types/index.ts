import type { BaseDto } from '~/utils/types/base-dto'
import type { Organization } from '~/views/orgaization/types'



export interface ExaminationCenter {
  name: string
  isActive: boolean
  collegeId: number
  governorateId: number
  maxCapacity: number
}
export type ExaminationCenterDto = ExaminationCenter &
  BaseDto & {
    college: Organization
    collegeName: string
  }
export interface OtpResponse {
    otp:            string;
    ticketId:       string;
    examTitle:      string;
    examCenterName: string;
    duration:       number;
    studentId:      number;
    studentName:    string;
    studentEmail:   string;
    documentNumber: string;
    collegeName:    string;
    ticketNumber:   string;
    status:         number;
    paymentDate:    string;
    amount:         number;
    notes:          string;
    examDate:       string;
}



export interface ExamCenterStatistics {
  numberOfHall: number
  numberOfExams: number
  numberOfStudents: number
  amount: number
}

export interface DeactivationRequest {
  reason: string
  deactivationDate: string
}

export interface DeactivationResponse {
  message: string
  deactivationPeriodId: string
  affectedTickets: number
  freeTakePointsGranted: number
  studentsAffected: number
  deactivationDate: string
  reason: string
}

export interface DeactivationPeriod {
  id: string
  examCenterId: string
  examCenterName: string
  deactivationDate: string
  deactivationReason: string
  status: 'Active' | 'Completed' | 'Reactivated'
  affectedTicketsCount: number
  totalFreeTakePointsGranted: number
  affectedStudentsCount: number
  deactivatedByEmployeeName: string
  reactivatedDate: string | null
  creationDate: string
}