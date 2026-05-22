import { prisma } from "../lib/prisma"

export async function getDashboard() {
  const [
    teachers,
    activeTeachers,
    students,
    courses,
    exams,
    certificates,
    pendingFees,
    paidFees,
    recentAttempts,
  ] = await Promise.all([
    prisma.teacher.count(),
    prisma.teacher.count({ where: { status: "ACTIVE" } }),
    prisma.student.count(),
    prisma.course.count(),
    prisma.exam.count(),
    prisma.certificate.count(),
    prisma.fee.count({ where: { status: { in: ["PENDING", "OVERDUE"] } } }),
    prisma.fee.count({ where: { status: "PAID" } }),
    prisma.examAttempt.findMany({
      include: { teacher: true, exam: { include: { course: true } } },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ])

  return {
    stats: { teachers, activeTeachers, students, courses, exams, certificates, pendingFees, paidFees },
    recentActivities: recentAttempts.map((attempt) => ({
      id: attempt.id,
      type: "EXAM_ATTEMPT",
      title: `${attempt.teacher.fullName} scored ${attempt.score}% in ${attempt.exam.course.title}`,
      status: attempt.status,
      createdAt: attempt.createdAt,
    })),
  }
}

export async function getAnalytics() {
  const [attendance, attemptsByStatus, feesByStatus] = await Promise.all([
    prisma.student.aggregate({ _avg: { attendancePercentage: true } }),
    prisma.examAttempt.groupBy({ by: ["status"], _count: { status: true } }),
    prisma.fee.groupBy({ by: ["status"], _count: { status: true }, _sum: { amount: true } }),
  ])

  return {
    averageAttendance: attendance._avg.attendancePercentage || 0,
    attemptsByStatus,
    feesByStatus,
  }
}
