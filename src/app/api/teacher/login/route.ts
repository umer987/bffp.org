import { teacherLoginSchema } from "../../../../../backend/src/validations/schemas"
import { teacherLogin } from "../../../../../backend/src/services/auth.service"
import { handleApiError } from "../../../../../backend/src/utils/api"

export async function POST(request: Request) {
  try {
    const body = teacherLoginSchema.parse(await request.json())
    const result = await teacherLogin(body.username, body.password)
    return Response.json(
      { success: true, data: { token: result.token, user: result.user } },
      { headers: { "Set-Cookie": result.cookie } },
    )
  } catch (error) {
    return handleApiError(error)
  }
}
