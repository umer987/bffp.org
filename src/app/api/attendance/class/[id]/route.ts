import type { NextRequest } from "next/server"
import { requireAuth } from "../../../../../../backend/src/middleware/auth"
import { listClassAttendance } from "../../../../../../backend/src/services/attendance.service"
import { handleApiError, ok } from "../../../../../../backend/src/utils/api"

export async function GET(request: NextRequest, context: RouteContext<"/api/attendance/class/[id]">) {
  try {
    requireAuth(request, ["ADMIN"])
    const { id } = await context.params
    return ok(await listClassAttendance(id))
  } catch (error) {
    return handleApiError(error)
  }
}
