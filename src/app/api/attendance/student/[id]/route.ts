import type { NextRequest } from "next/server"
import { requireAuth } from "../../../../../../backend/src/middleware/auth"
import { listStudentAttendance } from "../../../../../../backend/src/services/attendance.service"
import { handleApiError, ok } from "../../../../../../backend/src/utils/api"

export async function GET(request: NextRequest, context: RouteContext<"/api/attendance/student/[id]">) {
  try {
    requireAuth(request, ["ADMIN"])
    const { id } = await context.params
    return ok(await listStudentAttendance(id))
  } catch (error) {
    return handleApiError(error)
  }
}
