import type { BaseFilters } from '~/utils/types/ApiResponses'
import type { BaseDto } from '~/utils/types/base-dto' 

export interface Exam {
  title: string;
  description: string;
  examTemplateId: string;
  examTemplateTitle: string;
  totalQuestionsGrade: number;
  fullGrade: number;
  successGrade: number;
  startAtUtc: string;
  endAtUtc: string;
  durationMinutes: number;
  allowEnterBeforeMinutes: number;
  allowEnterAfterMinutes: number;
  displayResult: boolean;
  moveBetweenQuestion: boolean;
  randomizeAnswer: boolean;
  randomizeChoices: boolean;
  groupId: string;
  groupTitle: string;
}

export type ExamDto = Exam &
  BaseDto
  
  export interface ExamCreate {
    title: string | null;
    examTemplateId: string | null;
    startAt: string | null;
    durationMinutes: number | null;
    allowEnterBeforeMinutes: number | null;
    allowEnterAfterMinutes: number | null;
    groupId: string | null;
    description: string | null;
  }
  export type ExamFilters = {
    examTemplateId: string | null
    groupId: string | null
    StartDateFrom: string | null
    StartDateTo: string | null
  } & BaseFilters

  export interface ScheduleExam {
    startAt?: string;
    durationMinutes?: number;
  }