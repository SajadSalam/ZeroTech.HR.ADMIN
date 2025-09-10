import type { BaseDto } from '~/utils/types/base-dto'

export interface QuestionDashboardStatCard {
  label: string
  value: string
}

export interface QuestionDashboardHeader {
  title: string
  subTitle: string
  buttonText: string
}

export type questionDashboardStatCardDto = QuestionDashboardStatCard &
  BaseDto & {
    label: string
    value: string
  }

export type questionDashboardHeaderDto = QuestionDashboardHeader &
  BaseDto & {
    title: string
    subTitle: string
    buttonText: string
  }
