import type { NextRequest } from "next/server"
import { requireAuth } from "../../../../../../backend/src/middleware/auth"
import { addCourseResource } from "../../../../../../backend/src/services/course.service"
import { handleApiError, created } from "../../../../../../backend/src/utils/api"

export async function POST(request: NextRequest, context: RouteContext<"/api/courses/[id]/resources">) {
  try {
    requireAuth(request, ["ADMIN"])
    const { id } = await context.params
    const body = await request.json()

    const resource = await addCourseResource(id, {
      title: String(body.title),
      type:
        body.type === "GUIDE_BOOK" ||
        body.type === "STUDENT_BOOK" ||
        body.type === "LECTURE_MATERIAL"
          ? body.type
          : "PDF_BOOK",
      fileUrl: String(body.fileUrl),
      storageKey: typeof body.storageKey === "string" ? body.storageKey : undefined,
      sizeBytes: typeof body.sizeBytes === "number" ? body.sizeBytes : undefined,
      mimeType: typeof body.mimeType === "string" ? body.mimeType : undefined,
    })

    return created(resource)
  } catch (error) {
    return handleApiError(error)
  }
}
