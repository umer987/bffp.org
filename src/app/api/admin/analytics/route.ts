import type { NextRequest } from "next/server"
import { requireAuth } from "../../../../../backend/src/middleware/auth"
import { getAnalytics } from "../../../../../backend/src/services/admin.service"
import { handleApiError, ok } from "../../../../../backend/src/utils/api"

export async function GET(request: NextRequest) {
  try {
    requireAuth(request, ["ADMIN"])
    return ok(await getAnalytics())
  } catch (error) {
    return handleApiError(error)
  }
}
