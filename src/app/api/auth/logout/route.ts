import { logoutCookie } from "../../../../../backend/src/services/auth.service"

export async function POST() {
  return Response.json(
    { success: true, data: { message: "Logged out" } },
    { headers: { "Set-Cookie": logoutCookie() } },
  )
}
