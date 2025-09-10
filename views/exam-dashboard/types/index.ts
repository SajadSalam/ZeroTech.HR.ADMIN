import type { BaseDto } from '~/utils/types/base-dto'

export interface ExamDashboardStatCard {
  label: string
  value: string
}

export interface ExamDashboardHeader {
  title: string
  subTitle: string
  buttonText: string
}

export type examDashboardStatCardDto = ExamDashboardStatCard &
  BaseDto & {
    label: string
    value: string
  }

export type examDashboardHeaderDto = ExamDashboardHeader &
  BaseDto & {
    title: string
    subTitle: string
    buttonText: string
  }
