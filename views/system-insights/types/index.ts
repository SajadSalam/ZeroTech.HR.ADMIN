import type { BaseDto } from '~/utils/types/base-dto'

export interface SystemInsightStateData {
  label: string
  value: string
}

export type systemInsightStateDataDto = SystemInsightStateData &
  BaseDto & {
    label: string
    value: string
  }
