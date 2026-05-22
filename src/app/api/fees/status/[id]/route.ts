import type { NextRequest } from "next/server"
import { z } from "zod"
import { requireAuth } from "../../../../../../backend/src/middleware/auth"
import { updateFeeStatus } from "../../../../../../backend/src/services/fee.service"
import { handleApiError, ok } from "../../../../../../backend/src/utils/api"

const schema = z.object({ status: z.enum(["PAID", "PENDING", "OVERDUE"]) })

export async function PUT(request: NextRequest, context: RouteContext<"/api/fees/status/[id]">) {
  try {
    requireAuth(request, ["ADMIN"])
    const { id } = await context.params
    const body = schema.parse(await request.json())
    return ok(await updateFeeStatus(id, body.status))
  } catch (error) {
    return handleApiError(error)
  }
}
