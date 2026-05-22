import type { NextRequest } from "next/server"
import { requireAuth } from "../../../../../backend/src/middleware/auth"
import { prisma } from "../../../../../backend/src/lib/prisma"
import { handleApiError, ok } from "../../../../../backend/src/utils/api"

export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request, ["TEACHER"])
    const courses = await prisma.teacherCourse.findMany({ where: { teacherId: user.id }, select: { courseId: true } })
    const exams = await prisma.exam.findMany({
      where: { courseId: { in: courses.map((course) => course.courseId) } },
      include: { course: true, mcqs: true, attempts: { where: { teacherId: user.id }, orderBy: { createdAt: "desc" } } },
    })
    return ok(exams)
  } catch (error) {
    return handleApiError(error)
  }
}
