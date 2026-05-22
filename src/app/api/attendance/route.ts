import type { NextRequest } from "next/server"
import { requireAuth } from "../../../../backend/src/middleware/auth"
import { takeAttendance } from "../../../../backend/src/services/attendance.service"
import { handleApiError, created } from "../../../../backend/src/utils/api"
import { attendanceSchema } from "../../../../backend/src/validations/schemas"

export async function POST(request: NextRequest) {
  try {
    requireAuth(request, ["ADMIN"])
    const body = attendanceSchema.parse(await request.json())
    return created(await takeAttendance(body))
  } catch (error) {
    return handleApiError(error)
  }
}
