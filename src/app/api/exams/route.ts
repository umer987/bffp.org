import type { NextRequest } from "next/server"
import { requireAuth } from "../../../../backend/src/middleware/auth"
import { createExam } from "../../../../backend/src/services/exam.service"
import { handleApiError, created, ok } from "../../../../backend/src/utils/api"
import { examSchema } from "../../../../backend/src/validations/schemas"
import { prisma } from "../../../../backend/src/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    requireAuth(request, ["ADMIN"])
    const exams = await prisma.exam.findMany({
      include: { course: true, mcqs: true },
      orderBy: { createdAt: "desc" },
    })
    return ok(exams)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    requireAuth(request, ["ADMIN"])
    const body = examSchema.parse(await request.json())
    return created(await createExam(body))
  } catch (error) {
    return handleApiError(error)
  }
}
