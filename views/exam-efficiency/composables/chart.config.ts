import { shallowRef, computed } from '@vue/reactivity'
import { useI18n } from 'vue-i18n'

import { useAttendanceRateReport } from './attendanceRate.config'
import { useStudentParticipationReport } from './studentParticipation.config'
import { useExamCenterSeatUsageReport } from './examCenterSeatUsage.config'
import { useRealTimeSeatAllocationReport } from './realTimeSeatAllocation.config'
import { useQuestionSuccessRateReport } from './questionSuccessRate.config'
import { useMostDifficultQuestionsReport } from './mostDifficultQuestions.config'

export {
  useAttendanceRateReport,
  useStudentParticipationReport,
  useExamCenterSeatUsageReport,
  useRealTimeSeatAllocationReport,
  useQuestionSuccessRateReport,
  useMostDifficultQuestionsReport,
}
