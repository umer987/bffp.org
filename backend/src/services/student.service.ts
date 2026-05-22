import { prisma } from "../lib/prisma"
import type { Pagination } from "../utils/api"
import { ApiError } from "../utils/api"
import type { z } from "zod"
import type { classSchema, studentSchema } from "../validations/schemas"

export async function createClass(input: z.infer<typeof classSchema>) {
  return prisma.class.create({
    data: {
      name: input.name,
      sections: input.sections?.length ? { create: input.sections.map((name) => ({ name })) } : undefined,
    },
    include: { sections: true },
  })
}

export async function listClasses() {
  return prisma.class.findMany({ include: { sections: true, _count: { select: { students: true } } }, orderBy: { name: "asc" } })
}

export async function updateClass(id: string, input: z.infer<typeof classSchema>) {
  return prisma.class.update({ where: { id }, data: { name: input.name }, include: { sections: true } })
}

export async function deleteClass(id: string) {
  await prisma.class.delete({ where: { id } })
}

export async function createStudent(input: z.infer<typeof studentSchema>) {
  return prisma.student.create({ data: input, include: { class: true, section: true } })
}

export async function listStudents(classId: string | null, search: string | null, pagination: Pagination) {
  const where = {
    ...(classId ? { classId } : {}),
    ...(search
      ? {
          OR: [
            { fullName: { contains: search, mode: "insensitive" as const } },
            { rollNumber: { contains: search, mode: "insensitive" as const } },
            { fatherName: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  }

  const [items, total] = await Promise.all([
    prisma.student.findMany({
      where,
      include: { class: true, section: true },
      orderBy: { createdAt: "desc" },
      skip: pagination.skip,
      take: pagination.take,
    }),
    prisma.student.count({ where }),
  ])

  return { items, total }
}

export async function getStudent(id: string) {
  const student = await prisma.student.findUnique({
    where: { id },
    include: { class: true, section: true, attendance: true, fees: { include: { receipt: true } } },
  })
  if (!student) throw new ApiError(404, "Student not found")
  return student
}

export async function updateStudent(id: string, input: z.infer<typeof studentSchema>) {
  await getStudent(id)
  return prisma.student.update({ where: { id }, data: input, include: { class: true, section: true } })
}

export async function deleteStudent(id: string) {
  await getStudent(id)
  await prisma.student.delete({ where: { id } })
}
