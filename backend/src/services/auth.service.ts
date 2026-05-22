import { prisma } from "../lib/prisma"
import { ApiError } from "../utils/api"
import { authCookie, clearAuthCookie, comparePassword, signToken } from "../utils/auth"

export async function adminLogin(email: string, password: string) {
  const admin = await prisma.admin.findUnique({ where: { email } })
  if (!admin || !(await comparePassword(password, admin.passwordHash))) {
    throw new ApiError(401, "Invalid admin email or password")
  }

  const token = signToken({ id: admin.id, email: admin.email, role: "ADMIN" })
  return {
    token,
    cookie: authCookie(token),
    user: { id: admin.id, name: admin.name, email: admin.email, role: "ADMIN" as const },
  }
}

export async function teacherLogin(username: string, password: string) {
  const teacher = await prisma.teacher.findUnique({ where: { username } })
  if (!teacher || !(await comparePassword(password, teacher.passwordHash))) {
    throw new ApiError(401, "Invalid teacher username or password")
  }

  if (teacher.status !== "ACTIVE") {
    throw new ApiError(403, "Teacher account is not active")
  }

  const token = signToken({ id: teacher.id, username: teacher.username, role: "TEACHER" })
  return {
    token,
    cookie: authCookie(token),
    user: {
      id: teacher.id,
      teacherCode: teacher.teacherCode,
      fullName: teacher.fullName,
      username: teacher.username,
      role: "TEACHER" as const,
    },
  }
}

export function logoutCookie() {
  return clearAuthCookie()
}

export async function getMe(id: string, role: "ADMIN" | "TEACHER") {
  if (role === "ADMIN") {
    const admin = await prisma.admin.findUnique({ where: { id }, select: { id: true, name: true, email: true, role: true } })
    if (!admin) throw new ApiError(404, "Admin not found")
    return admin
  }

  const teacher = await prisma.teacher.findUnique({
    where: { id },
    select: { id: true, teacherCode: true, fullName: true, email: true, username: true, status: true },
  })
  if (!teacher) throw new ApiError(404, "Teacher not found")
  return { ...teacher, role: "TEACHER" }
}
