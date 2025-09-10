import { shallowRef, computed } from '@vue/reactivity'
import { useI18n } from 'vue-i18n'
import { useAttendanceRateReport } from './attendanceRate.config'
import { useLiveExamCount } from './liveExamCount.config'
import { useCheatingFraudDetectionLogs } from './cheatingFraudDetectionLogs.config'
import { useExamProgressOverview } from './examProgressOverview.config'
import { useStudentParticipationChart } from './studentParticipation.config'
import { useSuccessRateExamChart } from './successRateExam.config'
import { useStudentOnlineStatus } from './studentOnlineStatus.config'

export {
  useAttendanceRateReport,
  useLiveExamCount,
  useCheatingFraudDetectionLogs,
  useExamProgressOverview,
  useStudentParticipationChart,
  useSuccessRateExamChart,
  useStudentOnlineStatus,
}
