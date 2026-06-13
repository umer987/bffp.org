import type { NextRequest } from "next/server"
import { requireAuth } from "../../../../../backend/src/middleware/auth"
import { changeAdminPassword } from "../../../../../backend/src/services/auth.service"
import { adminChangePasswordSchema } from "../../../../../backend/src/validations/schemas"
import { handleApiError, ok } from "../../../../../backend/src/utils/api"

export async function PUT(request: NextRequest) {
  try {
    const user = requireAuth(request, ["ADMIN"])
    const body = adminChangePasswordSchema.parse(await request.json())
    await changeAdminPassword(user.id, body.currentPassword, body.newPassword)
    return ok({ success: true })
  } catch (error) {
    return handleApiError(error)
  }
}
