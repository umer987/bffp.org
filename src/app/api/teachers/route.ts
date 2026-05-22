import type { NextRequest } from "next/server"
import { requireAuth } from "../../../../backend/src/middleware/auth"
import { createTeacher, listTeachers } from "../../../../backend/src/services/teacher.service"
import { handleApiError, created, ok, parsePagination } from "../../../../backend/src/utils/api"
import { teacherSchema } from "../../../../backend/src/validations/schemas"

export async function GET(request: NextRequest) {
  try {
    requireAuth(request, ["ADMIN"])
    const pagination = parsePagination(request.nextUrl)
    const result = await listTeachers(request.nextUrl.searchParams.get("search"), pagination)
    return ok(result.items, { total: result.total, page: pagination.page, pageSize: pagination.pageSize })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    requireAuth(request, ["ADMIN"])
    const body = teacherSchema.parse(await request.json())
    return created(await createTeacher(body))
  } catch (error) {
    return handleApiError(error)
  }
}
