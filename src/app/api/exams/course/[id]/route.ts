import type { NextRequest } from "next/server"
import { requireAuth } from "../../../../../../backend/src/middleware/auth"
import { getCourseExams } from "../../../../../../backend/src/services/exam.service"
import { handleApiError, ok } from "../../../../../../backend/src/utils/api"

export async function GET(request: NextRequest, context: RouteContext<"/api/exams/course/[id]">) {
  try {
    requireAuth(request)
    const { id } = await context.params
    return ok(await getCourseExams(id))
  } catch (error) {
    return handleApiError(error)
  }
}
