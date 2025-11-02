import type { BaseFilters } from '~/utils/types/ApiResponses'
import type { BaseDto } from '~/utils/types/base-dto'
import type { BlueprintDto } from '~/views/blueprint/types'
import type { ExaminationCenterDto } from '~/views/examination-centers/types'
import ExamEdit from '~/views/exams/components/ExamEdit.vue'
import type { QuestionDto } from '~/views/question-bank/types/question'
import type { Student } from '~/views/students/types'

export interface Exam {
  title: string | null
  examType: ExamType | null
  examTemplateId: string | null
  startDate: string | null
  endDate: string | null
  startTime: string | null
  endTime: string | null
  duration: number | null
  enterTimeAllowed: number | null
  examCenters: string[] | null
  instructions: string | null
  // EvaluationProficiency specific fields
  price: number | null
  retryPrice: number | null
  proficiencyExamGroupId: ProficiencyExamGroup | null
}
export enum AvailableDays {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
}
export type ExamDto = Exam &
  BaseDto & {
    orgnaizations: string[]
    examTemplate: BlueprintDto
    time?: string
    attendance?: number
    pass?: number
    fail?: number
    templateName?: string
    availableDays?: AvailableDays[]
  }
export type ExamDetailed = ExamDto & {
  questions: QuestionDto[]
}

export type ExamCreate = Exam & {
  examGroups: string[] | null
  availableDays: AvailableDays[]
}
export type ExamFilters = {
  search: string | null
  type: ExamType | null
  status: ExamStatus | null
  examTemplateId: string | null
} & BaseFilters
export enum ExamType {
  Quarterly = 0,
  SemiAnnual = 1,
  Final = 2,
  Postgraduate = 3,
  EvaluationProficiency = 4,
  Mock = 5,
}

export enum ProficiencyExamGroup {
  English = 1,      // اللغة الانجليزية
  Arabic = 2,       // اللغة العربية
  Computer = 3      // الحاسوب
}

export interface LinkedExam {
  id: number
  name: string
  emsExamId: string
  sisCourseId: number
  studyProgramId: number
  gradeTermId: number
  students: Student[]
}
export const availableDaysOptions = (t: (key: string) => string) => {

  return [
    { label: t('sunday'), value: AvailableDays.Sunday },
    { label: t('monday'), value: AvailableDays.Monday },
    { label: t('tuesday'), value: AvailableDays.Tuesday },
    { label: t('wednesday'), value: AvailableDays.Wednesday },
    { label: t('thursday'), value: AvailableDays.Thursday },
    { label: t('friday'), value: AvailableDays.Friday },
    { label: t('saturday'), value: AvailableDays.Saturday },
  ]
}

export const examTypesOptions = (t: (key: string) => string) => {
  return [
    { 
        label: t('final'),
         value: ExamType.Final,
         description:t('final-description')
    },
    // { 
    //     label: t('evaulation-proficiency'),
    //      value: ExamType.EvaluationProficiency,
    //     description:t('evaulation-proficiency-description')
    //  },
  ]
}

export const proficiencyExamGroupOptions = (t: (key: string) => string) => {
  return [
    { label: t('english'), value: ProficiencyExamGroup.English },
    { label: t('arabic'), value: ProficiencyExamGroup.Arabic },
    { label: t('computer'), value: ProficiencyExamGroup.Computer },
  ]
}

export enum ExamStatus {
  Pending = 1,
  Expired = 2,
  Completed = 3,
}

export enum ExamGradeTypes {
  Curve = 0,
  ClassAverage = 1,
}
export const examGradeTypesOptions = (t: (key: string) => string) => {
  return [
    { label: t('curve'), value: ExamGradeTypes.Curve },
    { label: t('class-average'), value: ExamGradeTypes.ClassAverage },
  ]
}
export const examStatusOptions = (t: (key: string) => string) => {
  return [
    { label: t('Pending'), value: ExamStatus.Pending },
    { label: t('expired'), value: ExamStatus.Expired },
    { label: t('completed'), value: ExamStatus.Completed },
  ]
}

export type ExamDetail = ExamDto & {
  questions: QuestionDto[]
  examGroups: string[] | null
  examCenters: ExaminationCenterDto[]
}

export type ExamEdit = Exam & {
  startDate: string | null
  endDate: string | null
  startTime: string | null
  endTime: string | null
  enterTimeAllowed: number | null
}
