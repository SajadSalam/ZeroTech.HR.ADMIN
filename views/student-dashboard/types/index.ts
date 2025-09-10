import type { BaseDto } from '~/utils/types/base-dto'

export interface StudentDashboardHeader {
  title: string
  subTitle: string
  buttonText: string
}

export type ExamsCard = {
  id: number
  tag: string
  tagColor: 'primary' | 'success' | 'danger'
  time: string
  address: string
  progress: number
  description: string
  date: string
}

export type studentDashboardHeaderDto = StudentDashboardHeader &
  BaseDto & {
    title: string
    subTitle: string
    buttonText: string
  }

export type todaysExamsDto = ExamsCard &
  BaseDto & {
    id: number
    tag: string
    tagColor: 'primary' | 'success' | 'danger'
    time: string
    address: string
    progress: number
    description: string
    date: string
  }

export type notPerformedExamsDto = ExamsCard &
  BaseDto & {
    id: number
    tag: string
    tagColor: 'primary' | 'success' | 'danger'
    time: string
    address: string
    progress: number
    description: string
    date: string
  }

export type performedExamsDto = ExamsCard &
  BaseDto & {
    id: number
    tag: string
    tagColor: 'primary' | 'success' | 'danger'
    time: string
    address: string
    progress: number
    description: string
    date: string
  }
