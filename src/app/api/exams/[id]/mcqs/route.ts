import type { NextRequest } from "next/server"
import { requireAuth } from "../../../../../../backend/src/middleware/auth"
import { addExamMcq } from "../../../../../../backend/src/services/exam.service"
import { handleApiError, created } from "../../../../../../backend/src/utils/api"
import { mcqSchema } from "../../../../../../backend/src/validations/schemas"

function extractExamId(request: NextRequest) {
  const path = request.nextUrl.pathname
  const match = path.match(/^\/api\/exams\/([^/]+)\/mcqs\/?$/)
  return match?.[1]
}

export async function POST(request: NextRequest) {
  try {
    requireAuth(request, ["ADMIN"])
    const examId = extractExamId(request)
    if (!examId) {
      throw new Error("Missing exam ID in request path")
    }

    const body = mcqSchema.parse(await request.json())
    return created(await addExamMcq(examId, body))
  } catch (error) {
    return handleApiError(error)
  }
}
