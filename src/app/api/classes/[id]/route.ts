import type { NextRequest } from "next/server"
import { requireAuth } from "../../../../../backend/src/middleware/auth"
import { deleteClass, updateClass } from "../../../../../backend/src/services/student.service"
import { handleApiError, noContent, ok } from "../../../../../backend/src/utils/api"
import { classSchema } from "../../../../../backend/src/validations/schemas"

export async function PUT(request: NextRequest, context: RouteContext<"/api/classes/[id]">) {
  try {
    requireAuth(request, ["ADMIN"])
    const { id } = await context.params
    const body = classSchema.parse(await request.json())
    return ok(await updateClass(id, body))
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(request: NextRequest, context: RouteContext<"/api/classes/[id]">) {
  try {
    requireAuth(request, ["ADMIN"])
    const { id } = await context.params
    await deleteClass(id)
    return noContent()
  } catch (error) {
    return handleApiError(error)
  }
}
