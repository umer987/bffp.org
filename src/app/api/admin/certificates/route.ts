import type { NextRequest } from "next/server"
import { prisma, requireAuth, handleApiError, ok } from "@/lib/backend"

export async function GET(request: NextRequest) {
  try {
    requireAuth(request, ["ADMIN"])

    const certificates = await prisma.certificate.findMany({
      include: {
        teacher: true,
        course: true,
      },
      orderBy: { issuedAt: "desc" },
      take: 50,
    })

    return ok(certificates)
  } catch (error) {
    return handleApiError(error)
  }
}
