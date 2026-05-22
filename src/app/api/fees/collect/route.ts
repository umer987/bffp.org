import type { NextRequest } from "next/server"
import { requireAuth } from "../../../../../backend/src/middleware/auth"
import { collectFee } from "../../../../../backend/src/services/fee.service"
import { handleApiError, created } from "../../../../../backend/src/utils/api"
import { feeCollectSchema } from "../../../../../backend/src/validations/schemas"

export async function POST(request: NextRequest) {
  try {
    requireAuth(request, ["ADMIN"])
    const body = feeCollectSchema.parse(await request.json())
    return created(await collectFee(body))
  } catch (error) {
    return handleApiError(error)
  }
}
