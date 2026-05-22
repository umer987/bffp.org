import { Prisma } from "@prisma/client"
import { prisma } from "../lib/prisma"
import type { Pagination } from "../utils/api"
import { ApiError } from "../utils/api"
import type { z } from "zod"
import type { courseSchema } from "../validations/schemas"

type CourseInput = z.infer<typeof courseSchema>

export async function listCourses(search: string | null, pagination: Pagination) {
  const where: Prisma.CourseWhereInput = search
    ? { title: { contains: search, mode: "insensitive" } }
    : {}

  const [items, total] = await Promise.all([
    prisma.course.findMany({
      where,
      include: { resources: true, teachers: true, exams: true },
      orderBy: { createdAt: "desc" },
      skip: pagination.skip,
      take: pagination.take,
    }),
    prisma.course.count({ where }),
  ])

  return { items, total }
}

export async function getCourse(id: string) {
  const course = await prisma.course.findUnique({ where: { id }, include: { resources: true, exams: true } })
  if (!course) throw new ApiError(404, "Course not found")
  return course
}

export async function createCourse(input: CourseInput) {
  return prisma.course.create({
    data: {
      title: input.title,
      description: input.description,
      status: input.status || "ACTIVE",
      resources: input.resources?.length ? { create: input.resources } : undefined,
    },
    include: { resources: true },
  })
}

export async function addCourseResource(courseId: string, input: {
  title: string
  type: string
  fileUrl: string
  storageKey?: string
  sizeBytes?: number
  mimeType?: string
}) {
  await getCourse(courseId)

  return prisma.courseResource.create({
    data: {
      title: input.title,
      type: input.type,
      fileUrl: input.fileUrl,
      storageKey: input.storageKey,
      sizeBytes: input.sizeBytes,
      mimeType: input.mimeType,
      course: { connect: { id: courseId } },
    },
  })
}

export async function updateCourse(id: string, input: CourseInput) {
  await getCourse(id)
  return prisma.course.update({
    where: { id },
    data: {
      title: input.title,
      description: input.description,
      status: input.status,
    },
    include: { resources: true },
  })
}

export async function deleteCourse(id: string) {
  await getCourse(id)
  await prisma.course.delete({ where: { id } })
}
