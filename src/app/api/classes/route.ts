import type { NextRequest } from "next/server"
import { requireAuth } from "../../../../backend/src/middleware/auth"
import { createClass, listClasses } from "../../../../backend/src/services/student.service"
import { handleApiError, created, ok } from "../../../../backend/src/utils/api"
import { classSchema } from "../../../../backend/src/validations/schemas"

export async function GET(request: NextRequest) {
  try {
    requireAuth(request, ["ADMIN"])
    return ok(await listClasses())
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    requireAuth(request, ["ADMIN"])
    const body = classSchema.parse(await request.json())
    return created(await createClass(body))
  } catch (error) {
    return handleApiError(error)
  }
}
