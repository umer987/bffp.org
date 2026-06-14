import type { NextRequest } from "next/server"
import { prisma } from "../../../../../backend/src/lib/prisma"
import { ApiError, handleApiError, ok } from "../../../../../backend/src/utils/api"

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const stemId = url.searchParams.get("stemId")?.trim() || ""

    if (!stemId) {
      throw new ApiError(400, "STEM ID is required")
    }

    const certificate = await prisma.certificate.findUnique({
      where: { certificateNo: stemId },
      include: {
        teacher: true,
        course: true,
        examAttempt: true,
      },
    })

    if (!certificate) {
      throw new ApiError(404, "Certificate not found")
    }

    return ok({
      certificateNo: certificate.certificateNo,
      teacherName: certificate.teacher.fullName,
      courseTitle: certificate.course.title,
      issuedAt: certificate.issuedAt.toISOString(),
      examStatus: certificate.examAttempt.status,
      qrPayload: certificate.qrPayload,
      certificateId: certificate.id,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
