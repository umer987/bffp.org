import path from "path"
import type { NextRequest } from "next/server"
import sharp from "sharp"
import { prisma, requireAuth, ApiError, handleApiError } from "@/lib/backend"

function escapeSvgText(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

export async function GET(request: NextRequest, context: { params: Promise<{ certificateId: string }> }) {
  try {
    const user = requireAuth(request, ["ADMIN", "TEACHER"])
    const { certificateId } = await context.params

    const certificate = await prisma.certificate.findUnique({
      where: { id: certificateId },
      include: { teacher: true, course: true, examAttempt: true },
    })

    if (!certificate) {
      throw new ApiError(404, "Certificate not found")
    }

    if (user.role === "TEACHER" && user.id !== certificate.teacherId) {
      throw new ApiError(403, "You do not have access to this certificate")
    }

    const formattedDate = new Intl.DateTimeFormat("en-US", {
      dateStyle: "long",
      timeStyle: "short",
    }).format(certificate.issuedAt)

    const backgroundPath = path.join(process.cwd(), "public", "final_2.png")
    const overlaySvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="2398" height="1792" viewBox="0 0 2398 1792" xmlns="http://www.w3.org/2000/svg">
  <style>
    .teacher { font: 86px Inter, system-ui, sans-serif; font-weight: 700; fill: #111827; }
    .course { font: 52px Inter, system-ui, sans-serif; fill: #1e293b; }
    .meta { font: 36px Inter, system-ui, sans-serif; fill: #0f172a; }
    .label { font: 24px Inter, system-ui, sans-serif; fill: #475569; }
  </style>
  <text x="1199" y="845" text-anchor="middle" class="teacher">${escapeSvgText(certificate.teacher.fullName)}</text>
  <text x="1199" y="1115" text-anchor="middle" class="course">Program: ${escapeSvgText(certificate.course.title)}</text>
  <text x="295" y="1339" class="meta">Date: ${escapeSvgText(formattedDate)}</text>
  <text x="295" y="1484" class="meta">STEM ID: ${escapeSvgText(certificate.certificateNo)}</text>
</svg>`

    const buffer = await sharp(backgroundPath)
      .composite([{ input: Buffer.from(overlaySvg), top: 0, left: 0 }])
      .png()
      .toBuffer()

    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=60, stale-while-revalidate=120",
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}
