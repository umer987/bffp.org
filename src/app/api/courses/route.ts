import type { NextRequest } from "next/server"
import { requireAuth } from "../../../../backend/src/middleware/auth"
import { createCourse, listCourses } from "../../../../backend/src/services/course.service"
import { handleApiError, created, ok, parsePagination } from "../../../../backend/src/utils/api"
import { courseSchema } from "../../../../backend/src/validations/schemas"

export async function GET(request: NextRequest) {
  try {
    requireAuth(request)
    const pagination = parsePagination(request.nextUrl)
    const result = await listCourses(request.nextUrl.searchParams.get("search"), pagination)
    return ok(result.items, { total: result.total, page: pagination.page, pageSize: pagination.pageSize })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    requireAuth(request, ["ADMIN"])
    const body = courseSchema.parse(await request.json())
    return created(await createCourse(body))
  } catch (error) {
    return handleApiError(error)
  }
}
