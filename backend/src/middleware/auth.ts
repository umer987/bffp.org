import type { NextRequest } from "next/server"
import { ApiError } from "../utils/api"
import { AuthRole, readBearerToken, verifyToken } from "../utils/auth"

export function requireAuth(request: NextRequest, roles?: AuthRole[]) {
  const token = readBearerToken(request) || request.cookies.get("bffp_token")?.value
  if (!token) {
    throw new ApiError(401, "Authentication required")
  }

  const user = verifyToken(token)
  if (roles?.length && !roles.includes(user.role)) {
    throw new ApiError(403, "You do not have permission to access this resource")
  }

  return user
}
