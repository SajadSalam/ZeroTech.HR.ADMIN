import type { BaseDto } from '~/utils/types/base-dto'

export interface ExamEfficiencyStatCard {
  label: string
  value: string
}

export interface ExamEfficiencyHeader {
  title: string
  subTitle: string
  buttonText: string
}

export type examEfficiencyStatCardDto = ExamEfficiencyStatCard &
  BaseDto & {
    label: string
    value: string
  }

export type examEfficiencyHeaderDto = ExamEfficiencyHeader &
  BaseDto & {
    title: string
    subTitle: string
    buttonText: string
  }
