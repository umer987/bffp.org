import type { NextRequest } from "next/server"
import { requireAuth } from "../../../../backend/src/middleware/auth"
import { createStudent, listStudents } from "../../../../backend/src/services/student.service"
import { handleApiError, created, ok, parsePagination } from "../../../../backend/src/utils/api"
import { studentSchema } from "../../../../backend/src/validations/schemas"

export async function GET(request: NextRequest) {
  try {
    requireAuth(request, ["ADMIN"])
    const pagination = parsePagination(request.nextUrl)
    const result = await listStudents(
      request.nextUrl.searchParams.get("classId"),
      request.nextUrl.searchParams.get("search"),
      pagination,
    )
    return ok(result.items, { total: result.total, page: pagination.page, pageSize: pagination.pageSize })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    requireAuth(request, ["ADMIN"])
    const body = studentSchema.parse(await request.json())
    return created(await createStudent(body))
  } catch (error) {
    return handleApiError(error)
  }
}
