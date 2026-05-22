import { randomUUID } from "crypto"
import { getSupabaseAdmin } from "../lib/supabase"
import { ApiError } from "../utils/api"

const maxPdfBytes = 15 * 1024 * 1024

export async function uploadPdf(file: File, folder = "course-resources") {
  if (file.type !== "application/pdf") {
    throw new ApiError(422, "Only PDF files are allowed")
  }

  if (file.size > maxPdfBytes) {
    throw new ApiError(422, "PDF file must be 15MB or smaller")
  }

  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "bffp-files"
  const storageKey = `${folder}/${randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`
  const supabase = getSupabaseAdmin()
  const bytes = await file.arrayBuffer()

  const { error } = await supabase.storage.from(bucket).upload(storageKey, bytes, {
    contentType: file.type,
    upsert: false,
  })

  if (error) {
    throw new ApiError(500, error.message)
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(storageKey)
  return {
    title: file.name,
    fileUrl: data.publicUrl,
    storageKey,
    sizeBytes: file.size,
    mimeType: file.type,
  }
}
