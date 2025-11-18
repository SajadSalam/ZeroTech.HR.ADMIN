import type { Counts } from "../types/counts";

interface IHomeService {
  getCounts: () => Promise<Counts>
}

export class HomeService implements IHomeService {
  async getCounts(): Promise<Counts> {
    // Returning fake data instead of API call
    return {
      totalUpcomingExams: 15,
      currentActiveExams: 8,
      totalGroups: 25,
      totalExaminedStudents: 2850,
      totalAbsentStudents: 650,

      registeredStudentsStatistics: {
        totalRegisteredStudents: 3500,
        totalStudentsBookedExams: 3200,
        totalStudentsPresencedInExams: 2850,
        totalStudentsAbsencedInExams: 650,
        totalStudentsBookedExamsRatio: 91.4,
        totalStudentsPresencedInExamsRatio: 81.4,
        totalStudentsAbsencedInExamsRatio: 18.6
      },
      passFailChartData: {
        data: [
          { groupId: 1, groupName: 'المجموعة الأولى', subjectId: 1, subjectName: 'الرياضيات', passed: 180, failed: 20 },
          { groupId: 1, groupName: 'المجموعة الأولى', subjectId: 2, subjectName: 'الفيزياء', passed: 165, failed: 35 },
          { groupId: 1, groupName: 'المجموعة الأولى', subjectId: 3, subjectName: 'الكيمياء', passed: 170, failed: 30 },
          { groupId: 2, groupName: 'المجموعة الثانية', subjectId: 1, subjectName: 'الرياضيات', passed: 190, failed: 10 },
          { groupId: 2, groupName: 'المجموعة الثانية', subjectId: 2, subjectName: 'الفيزياء', passed: 175, failed: 25 },
          { groupId: 2, groupName: 'المجموعة الثانية', subjectId: 3, subjectName: 'الكيمياء', passed: 185, failed: 15 },
          { groupId: 3, groupName: 'المجموعة الثالثة', subjectId: 1, subjectName: 'الرياضيات', passed: 160, failed: 40 },
          { groupId: 3, groupName: 'المجموعة الثالثة', subjectId: 2, subjectName: 'الفيزياء', passed: 155, failed: 45 },
          { groupId: 3, groupName: 'المجموعة الثالثة', subjectId: 3, subjectName: 'الكيمياء', passed: 150, failed: 50 },
          { groupId: 4, groupName: 'المجموعة الرابعة', subjectId: 4, subjectName: 'الأحياء', passed: 195, failed: 5 },
          { groupId: 4, groupName: 'المجموعة الرابعة', subjectId: 5, subjectName: 'اللغة العربية', passed: 188, failed: 12 },
          { groupId: 5, groupName: 'المجموعة الخامسة', subjectId: 4, subjectName: 'الأحياء', passed: 172, failed: 28 },
          { groupId: 5, groupName: 'المجموعة الخامسة', subjectId: 5, subjectName: 'اللغة العربية', passed: 180, failed: 20 }
        ],
        groups: [
          { id: 1, name: 'المجموعة الأولى' },
          { id: 2, name: 'المجموعة الثانية' },
          { id: 3, name: 'المجموعة الثالثة' },
          { id: 4, name: 'المجموعة الرابعة' },
          { id: 5, name: 'المجموعة الخامسة' }
        ],
        subjects: [
          { id: 1, name: 'الرياضيات' },
          { id: 2, name: 'الفيزياء' },
          { id: 3, name: 'الكيمياء' },
          { id: 4, name: 'الأحياء' },
          { id: 5, name: 'اللغة العربية' }
        ]
      },
      groupStudentCounts: [
        { groupId: 1, groupName: 'المجموعة الأولى', studentCount: 680 },
        { groupId: 2, groupName: 'المجموعة الثانية', studentCount: 720 },
        { groupId: 3, groupName: 'المجموعة الثالثة', studentCount: 590 },
        { groupId: 4, groupName: 'المجموعة الرابعة', studentCount: 810 },
        { groupId: 5, groupName: 'المجموعة الخامسة', studentCount: 650 }
      ],
      collegeStudentCounts: [
        { collegeId: 1, collegeName: 'كلية الطب', studentCount: 450 },
        { collegeId: 2, collegeName: 'كلية الهندسة', studentCount: 620 },
        { collegeId: 3, collegeName: 'كلية العلوم', studentCount: 530 },
        { collegeId: 4, collegeName: 'كلية الآداب', studentCount: 380 },
        { collegeId: 5, collegeName: 'كلية الحقوق', studentCount: 290 },
        { collegeId: 6, collegeName: 'كلية التربية', studentCount: 510 },
        { collegeId: 7, collegeName: 'كلية الإدارة والاقتصاد', studentCount: 470 },
        { collegeId: 8, collegeName: 'كلية الصيدلة', studentCount: 340 }
      ]
    }
  }

}
