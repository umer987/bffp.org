import type { NextRequest } from "next/server"
import { requireAuth } from "../../../../../backend/src/middleware/auth"
import { deleteExam } from "../../../../../backend/src/services/exam.service"
import { handleApiError, noContent } from "../../../../../backend/src/utils/api"

export async function DELETE(request: NextRequest, context: RouteContext<"/api/exams/[id]">) {
  try {
    requireAuth(request, ["ADMIN"])
    const { id } = await context.params
    await deleteExam(id)
    return noContent()
  } catch (error) {
    return handleApiError(error)
  }
}
