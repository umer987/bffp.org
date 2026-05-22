import type { NextRequest } from "next/server"
import { requireAuth } from "../../../../../../backend/src/middleware/auth"
import { listStudentFees } from "../../../../../../backend/src/services/fee.service"
import { handleApiError, ok } from "../../../../../../backend/src/utils/api"

export async function GET(request: NextRequest, context: RouteContext<"/api/fees/student/[id]">) {
  try {
    requireAuth(request, ["ADMIN"])
    const { id } = await context.params
    return ok(await listStudentFees(id))
  } catch (error) {
    return handleApiError(error)
  }
}
