import type { NextRequest } from "next/server"
import { requireAuth } from "../../../../../backend/src/middleware/auth"
import { submitExam } from "../../../../../backend/src/services/exam.service"
import { handleApiError, ok } from "../../../../../backend/src/utils/api"
import { examSubmitSchema } from "../../../../../backend/src/validations/schemas"

export async function POST(request: NextRequest) {
  try {
    const user = requireAuth(request)
    const body = examSubmitSchema.parse(await request.json())
    return ok(await submitExam(body, user.role === "TEACHER" ? user.id : body.teacherId))
  } catch (error) {
    return handleApiError(error)
  }
}
