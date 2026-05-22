import type { NextRequest } from "next/server"
import { requireAuth } from "../../../../../backend/src/middleware/auth"
import { deleteTeacher, getTeacher, updateTeacher } from "../../../../../backend/src/services/teacher.service"
import { handleApiError, noContent, ok } from "../../../../../backend/src/utils/api"
import { teacherSchema } from "../../../../../backend/src/validations/schemas"

export async function GET(request: NextRequest, context: RouteContext<"/api/teachers/[id]">) {
  try {
    requireAuth(request, ["ADMIN"])
    const { id } = await context.params
    return ok(await getTeacher(id))
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(request: NextRequest, context: RouteContext<"/api/teachers/[id]">) {
  try {
    requireAuth(request, ["ADMIN"])
    const { id } = await context.params
    const body = teacherSchema.parse(await request.json())
    return ok(await updateTeacher(id, body))
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(request: NextRequest, context: RouteContext<"/api/teachers/[id]">) {
  try {
    requireAuth(request, ["ADMIN"])
    const { id } = await context.params
    await deleteTeacher(id)
    return noContent()
  } catch (error) {
    return handleApiError(error)
  }
}
