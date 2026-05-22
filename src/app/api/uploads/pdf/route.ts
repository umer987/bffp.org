import type { NextRequest } from "next/server"
import { requireAuth } from "../../../../../backend/src/middleware/auth"
import { uploadPdf } from "../../../../../backend/src/services/upload.service"
import { handleApiError, created } from "../../../../../backend/src/utils/api"

export async function POST(request: NextRequest) {
  try {
    requireAuth(request, ["ADMIN"])
    const formData = await request.formData()
    const file = formData.get("file")
    const folder = formData.get("folder")

    if (!(file instanceof File)) {
      return Response.json({ success: false, error: "file is required" }, { status: 422 })
    }

    return created(await uploadPdf(file, typeof folder === "string" ? folder : undefined))
  } catch (error) {
    return handleApiError(error)
  }
}
