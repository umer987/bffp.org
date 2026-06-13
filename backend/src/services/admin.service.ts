import { prisma } from "../lib/prisma"

export async function getDashboard() {
  const [
    teachers,
    activeTeachers,
    students,
    totalCourses,
    activeCourses,
    exams,
    certificates,
    pendingFees,
    paidFees,
    totalAttempts,
    passedAttempts,
    recentAttempts,
  ] = await Promise.all([
    prisma.teacher.count(),
    prisma.teacher.count({ where: { status: "ACTIVE" } }),
    prisma.student.count(),
    prisma.course.count(),
    prisma.course.count({ where: { status: "ACTIVE" } }),
    prisma.exam.count(),
    prisma.certificate.count(),
    prisma.fee.count({ where: { status: { in: ["PENDING", "OVERDUE"] } } }),
    prisma.fee.count({ where: { status: "PAID" } }),
    prisma.examAttempt.count(),
    prisma.examAttempt.count({ where: { status: "PASSED" } }),
    prisma.examAttempt.findMany({
      include: { teacher: true, exam: { include: { course: true } } },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ])

  const recentTeachers = await prisma.teacher.findMany({
    orderBy: { createdAt: "desc" },
    take: 4,
    include: {
      courses: {
        include: { course: true },
      },
    },
  })

  const averagePassRate = totalAttempts > 0 ? Math.round((passedAttempts / totalAttempts) * 100) : 0

  return {
    stats: {
      teachers,
      activeTeachers,
      students,
      totalCourses,
      activeCourses,
      exams,
      certificates,
      pendingFees,
      paidFees,
      averagePassRate,
    },
    recentActivities: recentAttempts.map((attempt) => ({
      id: attempt.id,
      type: "EXAM_ATTEMPT",
      title: `${attempt.teacher.fullName} scored ${attempt.score}% in ${attempt.exam.course.title}`,
      status: attempt.status,
      createdAt: attempt.createdAt,
    })),
    recentTeachers: recentTeachers.map((teacher) => ({
      id: teacher.teacherCode,
      name: teacher.fullName,
      course: teacher.courses?.[0]?.course?.title ?? "No course assigned",
      status: teacher.status,
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
