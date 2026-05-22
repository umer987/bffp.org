import { prisma } from "../lib/prisma"
import { ApiError } from "../utils/api"
import type { z } from "zod"
import type { examSchema, examSubmitSchema } from "../validations/schemas"

type ExamInput = z.infer<typeof examSchema>
type ExamSubmitInput = z.infer<typeof examSubmitSchema>

export type McqCreateInput = {
  question: string
  options: string[]
  correctOptionIndex: number
  marks?: number
}

export async function createExam(input: ExamInput) {
  return prisma.exam.create({
    data: {
      courseId: input.courseId,
      title: input.title,
      durationMin: input.durationMin,
      passMarks: input.passMarks,
      maxAttempts: input.maxAttempts,
      mcqs: { create: input.mcqs },
    },
    include: { mcqs: true, course: true },
  })
}

export async function addExamMcq(examId: string, input: McqCreateInput) {
  const exam = await prisma.exam.findUnique({ where: { id: examId } })
  if (!exam) throw new ApiError(404, "Exam not found")

  return prisma.mCQ.create({
    data: {
      examId,
      question: input.question,
      options: input.options,
      correctOptionIndex: input.correctOptionIndex,
      marks: input.marks ?? 1,
    },
  })
}

export async function deleteExamMcq(mcqId: string) {
  return prisma.mCQ.delete({ where: { id: mcqId } })
}

export async function getCourseExams(courseId: string) {
  return prisma.exam.findMany({
    where: { courseId },
    include: { mcqs: true },
    orderBy: { createdAt: "desc" },
  })
}

export async function submitExam(input: ExamSubmitInput, authenticatedTeacherId?: string) {
  const teacherId = authenticatedTeacherId || input.teacherId
  if (!teacherId) throw new ApiError(400, "Teacher id is required")

  const exam = await prisma.exam.findUnique({ where: { id: input.examId }, include: { mcqs: true, course: true } })
  if (!exam) throw new ApiError(404, "Exam not found")

  const previousAttempts = await prisma.examAttempt.findMany({
    where: { examId: exam.id, teacherId },
    orderBy: { createdAt: "desc" },
  })

  if (previousAttempts.some((attempt) => attempt.status === "PASSED")) {
    throw new ApiError(409, "Exam already passed")
  }

  if (previousAttempts.length >= exam.maxAttempts) {
    throw new ApiError(423, "Maximum attempts reached. Please complete the course again before reattempting.")
  }

  const totalMarks = exam.mcqs.reduce((sum, mcq) => sum + mcq.marks, 0)
  const obtainedMarks = exam.mcqs.reduce((sum, mcq) => {
    return input.answers[mcq.id] === mcq.correctOptionIndex ? sum + mcq.marks : sum
  }, 0)
  const score = totalMarks > 0 ? Math.round((obtainedMarks / totalMarks) * 100) : 0
  const isPassed = score >= exam.passMarks
  const attemptNumber = previousAttempts.length + 1
  const status = isPassed ? "PASSED" : attemptNumber >= exam.maxAttempts ? "LOCKED" : "FAILED"

  const attempt = await prisma.examAttempt.create({
    data: {
      teacherId,
      examId: exam.id,
      score,
      totalMarks,
      obtainedMarks,
      status,
      answers: input.answers,
      attemptNumber,
    },
  })

  let certificate = null
  if (isPassed) {
    certificate = await prisma.certificate.create({
      data: {
        certificateNo: `BFFP-${Date.now()}-${teacherId.slice(-4).toUpperCase()}`,
        teacherId,
        courseId: exam.courseId,
        examAttemptId: attempt.id,
        qrPayload: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/verify-certificate/${attempt.id}`,
      },
    })
  }

  if (status === "LOCKED") {
    await prisma.teacherCourse.updateMany({
      where: { teacherId, courseId: exam.courseId },
      data: { progress: 0, completedAt: null },
    })
  }

  return { attempt, certificate, attemptsRemaining: Math.max(exam.maxAttempts - attemptNumber, 0) }
}

export async function listExamResults(teacherId?: string) {
  return prisma.examAttempt.findMany({
    where: teacherId ? { teacherId } : {},
    include: { exam: { include: { course: true } }, teacher: true, certificate: true },
    orderBy: { createdAt: "desc" },
  })
}
