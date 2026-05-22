import { Prisma } from "@prisma/client"
import { prisma } from "../lib/prisma"
import type { Pagination } from "../utils/api"
import { ApiError } from "../utils/api"
import { generatePassword, generateTeacherCode, generateTeacherUsername } from "../utils/credentials"
import { hashPassword } from "../utils/auth"
import type { z } from "zod"
import type { teacherSchema } from "../validations/schemas"

type TeacherInput = z.infer<typeof teacherSchema>

const teacherSelect = {
  id: true,
  teacherCode: true,
  fullName: true,
  email: true,
  cnic: true,
  phone: true,
  qualification: true,
  address: true,
  username: true,
  status: true,
  courses: { include: { course: true } },
  createdAt: true,
  updatedAt: true,
}

export async function listTeachers(search: string | null, pagination: Pagination) {
  const where: Prisma.TeacherWhereInput = search
    ? {
        OR: [
          { fullName: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { teacherCode: { contains: search, mode: "insensitive" } },
        ],
      }
    : {}

  const [items, total] = await Promise.all([
    prisma.teacher.findMany({
      where,
      select: teacherSelect,
      orderBy: { createdAt: "desc" },
      skip: pagination.skip,
      take: pagination.take,
    }),
    prisma.teacher.count({ where }),
  ])

  return { items, total }
}

export async function getTeacher(id: string) {
  const teacher = await prisma.teacher.findUnique({ where: { id }, select: teacherSelect })
  if (!teacher) throw new ApiError(404, "Teacher not found")
  return teacher
}

export async function createTeacher(input: TeacherInput) {
  const plainPassword = input.password || generatePassword()
  const username = input.username || generateTeacherUsername(input.fullName)

  const teacher = await prisma.teacher.create({
    data: {
      teacherCode: generateTeacherCode(),
      fullName: input.fullName,
      email: input.email,
      cnic: input.cnic,
      phone: input.phone,
      qualification: input.qualification,
      address: input.address,
      username,
      passwordHash: await hashPassword(plainPassword),
      status: input.status || "ACTIVE",
      courses: input.courseIds?.length
        ? {
            create: input.courseIds.map((courseId) => ({ courseId })),
          }
        : undefined,
    },
    select: teacherSelect,
  })

  return { teacher, credentials: { username, password: plainPassword } }
}

export async function updateTeacher(id: string, input: TeacherInput) {
  await getTeacher(id)

  return prisma.$transaction(async (tx) => {
    if (input.courseIds) {
      await tx.teacherCourse.deleteMany({ where: { teacherId: id } })
    }

    return tx.teacher.update({
      where: { id },
      data: {
        fullName: input.fullName,
        email: input.email,
        cnic: input.cnic,
        phone: input.phone,
        qualification: input.qualification,
        address: input.address,
        username: input.username,
        passwordHash: input.password ? await hashPassword(input.password) : undefined,
        status: input.status,
        courses: input.courseIds?.length
          ? { create: input.courseIds.map((courseId) => ({ courseId })) }
          : undefined,
      },
      select: teacherSelect,
    })
  })
}

export async function deleteTeacher(id: string) {
  await getTeacher(id)
  await prisma.teacher.delete({ where: { id } })
}
