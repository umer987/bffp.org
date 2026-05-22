import type { NextRequest } from "next/server"
import { requireAuth } from "../../../../../backend/src/middleware/auth"
import { prisma } from "../../../../../backend/src/lib/prisma"
import { handleApiError, ok } from "../../../../../backend/src/utils/api"

export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request, ["TEACHER"])
    const courses = await prisma.teacherCourse.findMany({
      where: { teacherId: user.id },
      include: { course: { include: { resources: true, exams: true } } },
      orderBy: { createdAt: "desc" },
    })
    return ok(courses)
  } catch (error) {
    return handleApiError(error)
  }
}
