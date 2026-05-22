import type { NextRequest } from "next/server"
import { requireAuth } from "../../../../../backend/src/middleware/auth"
import { prisma } from "../../../../../backend/src/lib/prisma"
import { handleApiError, ok } from "../../../../../backend/src/utils/api"

export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request, ["TEACHER"])
    const certificates = await prisma.certificate.findMany({
      where: { teacherId: user.id },
      include: { course: true, teacher: true },
      orderBy: { issuedAt: "desc" },
    })
    return ok(certificates)
  } catch (error) {
    return handleApiError(error)
  }
}
