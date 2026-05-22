import type { NextRequest } from "next/server"
import { z } from "zod"
import { requireAuth } from "../../../../../backend/src/middleware/auth"
import { prisma } from "../../../../../backend/src/lib/prisma"
import { ApiError, handleApiError, created } from "../../../../../backend/src/utils/api"

const schema = z.object({ examAttemptId: z.string() })

export async function POST(request: NextRequest) {
  try {
    requireAuth(request, ["ADMIN"])
    const { examAttemptId } = schema.parse(await request.json())
    const attempt = await prisma.examAttempt.findUnique({ where: { id: examAttemptId }, include: { exam: true } })
    if (!attempt) throw new ApiError(404, "Exam attempt not found")
    if (attempt.status !== "PASSED") throw new ApiError(400, "Certificate can only be generated for passed attempts")

    const certificate = await prisma.certificate.upsert({
      where: { examAttemptId },
      update: {},
      create: {
        certificateNo: `BFFP-${Date.now()}-${attempt.teacherId.slice(-4).toUpperCase()}`,
        teacherId: attempt.teacherId,
        courseId: attempt.exam.courseId,
        examAttemptId,
        qrPayload: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/verify-certificate/${examAttemptId}`,
      },
    })

    return created(certificate)
  } catch (error) {
    return handleApiError(error)
  }
}
