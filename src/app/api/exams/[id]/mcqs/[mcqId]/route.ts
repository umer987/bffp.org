import type { NextRequest } from "next/server"
import { requireAuth } from "../../../../../../../backend/src/middleware/auth"
import { deleteExamMcq } from "../../../../../../../backend/src/services/exam.service"
import { handleApiError, noContent } from "../../../../../../../backend/src/utils/api"

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; mcqId: string } },
) {
  try {
    requireAuth(request, ["ADMIN"])
    await deleteExamMcq(params.mcqId)
    return noContent()
  } catch (error) {
    return handleApiError(error)
  }
}
