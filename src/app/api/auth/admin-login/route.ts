import { adminLoginSchema } from "../../../../../backend/src/validations/schemas"
import { adminLogin } from "../../../../../backend/src/services/auth.service"
import { handleApiError } from "../../../../../backend/src/utils/api"

export async function POST(request: Request) {
  try {
    const body = adminLoginSchema.parse(await request.json())
    const result = await adminLogin(body.email, body.password)
    return Response.json(
      { success: true, data: { token: result.token, user: result.user } },
      { headers: { "Set-Cookie": result.cookie } },
    )
  } catch (error) {
    return handleApiError(error)
  }
}
