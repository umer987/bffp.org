import type { NextRequest } from "next/server"
import { requireAuth } from "../../../../../backend/src/middleware/auth"
import { getMe } from "../../../../../backend/src/services/auth.service"
import { handleApiError, ok } from "../../../../../backend/src/utils/api"

export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request)
    return ok(await getMe(user.id, user.role))
  } catch (error) {
    return handleApiError(error)
  }
}
