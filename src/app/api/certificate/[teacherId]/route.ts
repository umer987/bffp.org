import type { NextRequest } from "next/server"
import { requireAuth } from "../../../../../backend/src/middleware/auth"
import { prisma } from "../../../../../backend/src/lib/prisma"
import { handleApiError, ok } from "../../../../../backend/src/utils/api"

export async function GET(request: NextRequest, context: RouteContext<"/api/certificate/[teacherId]">) {
  try {
    requireAuth(request, ["ADMIN"])
    const { teacherId } = await context.params
    const certificates = await prisma.certificate.findMany({
      where: { teacherId },
      include: { teacher: true, course: true },
      orderBy: { issuedAt: "desc" },
    })
    return ok(certificates)
  } catch (error) {
    return handleApiError(error)
  }
}
