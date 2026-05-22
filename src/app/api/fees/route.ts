import type { NextRequest } from "next/server"
import { requireAuth } from "../../../../backend/src/middleware/auth"
import { listFees } from "../../../../backend/src/services/fee.service"
import { handleApiError, ok } from "../../../../backend/src/utils/api"

export async function GET(request: NextRequest) {
  try {
    requireAuth(request, ["ADMIN"])
    return ok(await listFees())
  } catch (error) {
    return handleApiError(error)
  }
}
