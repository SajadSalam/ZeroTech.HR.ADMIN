import type { BaseDto } from '~/utils/types/base-dto'
import type { Organization } from '~/views/orgaization/types'


/*
"surveillanceDevices": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "deviceURL": "string",
      "deviceUserName": "string",
      "devicePassword": "string"
    }
  ],
  "longitude": 0,
  "latitude": 0
  */
export interface ExaminationCenter {
  name: string
  isActive: boolean
  collegeId: number
  governorateId: number
  maxCapacity: number
  surveillanceDevices: {
    id: string
    deviceURL: string
    deviceUserName: string
    devicePassword: string
  }[]
  longitude: number
  latitude: number
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