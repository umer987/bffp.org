import type { NextRequest } from "next/server"
import { requireAuth } from "../../../../../backend/src/middleware/auth"
import { listExamResults } from "../../../../../backend/src/services/exam.service"
import { handleApiError, ok } from "../../../../../backend/src/utils/api"

export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request)
    const teacherId = user.role === "TEACHER" ? user.id : request.nextUrl.searchParams.get("teacherId") || undefined
    return ok(await listExamResults(teacherId))
  } catch (error) {
    return handleApiError(error)
  }
}
