import type { BaseFilters } from "~/utils/types/ApiResponses";

export interface StudentTicket {
    ticketId:       string;
    examTitle:      string;
    examCenterName: string;
    duration:       number;
    instructions:   string;
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
    qrCode:         null;
    examDate:       string;
    checkedInDate:  string;
    usingDate:      string;
    exam:           null;
}


export type StudentTicketFilters = BaseFilters & {
    examId: string;
    status: StudentTicketStatus | null;
    studentId: string;
    studentName: string;
}


export enum StudentTicketStatus {
  UnPaid = 1,
  Paid = 2,
  Expired = 3,
}