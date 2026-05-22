import type { NextRequest } from "next/server"
import { requireAuth } from "../../../../../backend/src/middleware/auth"
import { deleteStudent, getStudent, updateStudent } from "../../../../../backend/src/services/student.service"
import { handleApiError, noContent, ok } from "../../../../../backend/src/utils/api"
import { studentSchema } from "../../../../../backend/src/validations/schemas"

export async function GET(request: NextRequest, context: RouteContext<"/api/students/[id]">) {
  try {
    requireAuth(request, ["ADMIN"])
    const { id } = await context.params
    return ok(await getStudent(id))
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(request: NextRequest, context: RouteContext<"/api/students/[id]">) {
  try {
    requireAuth(request, ["ADMIN"])
    const { id } = await context.params
    const body = studentSchema.parse(await request.json())
    return ok(await updateStudent(id, body))
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(request: NextRequest, context: RouteContext<"/api/students/[id]">) {
  try {
    requireAuth(request, ["ADMIN"])
    const { id } = await context.params
    await deleteStudent(id)
    return noContent()
  } catch (error) {
    return handleApiError(error)
  }
}
