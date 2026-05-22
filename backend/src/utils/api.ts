import { ZodError } from "zod"

export type Pagination = {
  page: number
  pageSize: number
  skip: number
  take: number
}

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export function ok<T>(data: T, meta?: Record<string, unknown>) {
  return Response.json({ success: true, data, meta })
}

export function created<T>(data: T) {
  return Response.json({ success: true, data }, { status: 201 })
}

export function noContent() {
  return new Response(null, { status: 204 })
}

export function parsePagination(url: URL): Pagination {
  const page = Math.max(Number(url.searchParams.get("page") || 1), 1)
  const pageSize = Math.min(Math.max(Number(url.searchParams.get("pageSize") || 20), 1), 100)

  return {
    page,
    pageSize,
    skip: (page - 1) * pageSize,
    take: pageSize,
  }
}

export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    return Response.json(
      { success: false, error: "Validation failed", issues: error.issues },
      { status: 422 },
    )
  }

  if (error instanceof ApiError) {
    return Response.json({ success: false, error: error.message }, { status: error.status })
  }

  console.error(error)
  return Response.json({ success: false, error: "Internal server error" }, { status: 500 })
}
