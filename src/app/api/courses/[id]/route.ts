import type { NextRequest } from "next/server"
import { requireAuth } from "../../../../../backend/src/middleware/auth"
import { deleteCourse, getCourse, updateCourse } from "../../../../../backend/src/services/course.service"
import { handleApiError, noContent, ok } from "../../../../../backend/src/utils/api"
import { courseSchema } from "../../../../../backend/src/validations/schemas"

export async function GET(request: NextRequest, context: RouteContext<"/api/courses/[id]">) {
  try {
    requireAuth(request)
    const { id } = await context.params
    return ok(await getCourse(id))
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(request: NextRequest, context: RouteContext<"/api/courses/[id]">) {
  try {
    requireAuth(request, ["ADMIN"])
    const { id } = await context.params
    const body = courseSchema.parse(await request.json())
    return ok(await updateCourse(id, body))
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(request: NextRequest, context: RouteContext<"/api/courses/[id]">) {
  try {
    requireAuth(request, ["ADMIN"])
    const { id } = await context.params
    await deleteCourse(id)
    return noContent()
  } catch (error) {
    return handleApiError(error)
  }
}
