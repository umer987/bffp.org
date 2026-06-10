import type { NextRequest } from "next/server"
import { requireAuth, handleApiError, ok } from "@/lib/backend"
import { listClassAttendance } from "../../../../../../backend/src/services/attendance.service"

export async function GET(request: NextRequest, context: RouteContext<"/api/attendance/class/[id]">) {
  try {
    requireAuth(request, ["ADMIN"])
    const { id } = await context.params
    return ok(await listClassAttendance(id))
  } catch (error) {
    return handleApiError(error)
  }
}
