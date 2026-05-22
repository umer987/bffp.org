import { z } from "zod"

export const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const teacherLoginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
})

export const teacherSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  cnic: z.string().optional(),
  phone: z.string().optional(),
  qualification: z.string().optional(),
  address: z.string().optional(),
  username: z.string().min(3).optional(),
  password: z.string().min(8).optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "PENDING"]).optional(),
  courseIds: z.array(z.string()).optional(),
})

export const courseSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "PENDING"]).optional(),
  resources: z
    .array(
      z.object({
        title: z.string().min(2),
        type: z.enum(["PDF_BOOK", "GUIDE_BOOK", "STUDENT_BOOK", "LECTURE_MATERIAL"]),
        fileUrl: z.string().url(),
        storageKey: z.string().optional(),
        sizeBytes: z.number().int().positive().optional(),
        mimeType: z.string().optional(),
      }),
    )
    .optional(),
})

export const mcqSchema = z.object({
  question: z.string().min(5),
  options: z.array(z.string().min(1)).min(2).max(6),
  correctOptionIndex: z.number().int().min(0),
  marks: z.number().int().positive().default(1),
})

export const examSchema = z.object({
  courseId: z.string(),
  title: z.string().min(2),
  durationMin: z.number().int().positive().default(30),
  passMarks: z.number().int().min(1).max(100).default(60),
  maxAttempts: z.number().int().min(1).max(10).default(3),
  mcqs: z.array(mcqSchema).default([]),
})

export const examSubmitSchema = z.object({
  examId: z.string(),
  teacherId: z.string().optional(),
  answers: z.record(z.string(), z.number().int().min(0)),
})

export const classSchema = z.object({
  name: z.string().min(1),
  sections: z.array(z.string().min(1)).optional(),
})

export const studentSchema = z.object({
  fullName: z.string().min(2),
  rollNumber: z.string().min(1),
  fatherName: z.string().min(2),
  classId: z.string(),
  sectionId: z.string().optional(),
  contact: z.string().optional(),
  address: z.string().optional(),
  feeStatus: z.enum(["PAID", "PENDING", "OVERDUE"]).optional(),
  admissionDate: z.coerce.date(),
})

export const attendanceSchema = z.object({
  classId: z.string(),
  date: z.coerce.date(),
  records: z.array(
    z.object({
      studentId: z.string(),
      status: z.enum(["PRESENT", "ABSENT", "LEAVE", "LATE"]),
      note: z.string().optional(),
    }),
  ),
})

export const feeCollectSchema = z.object({
  studentId: z.string(),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000),
  amount: z.number().positive(),
  paymentMethod: z.enum(["CASH", "BANK_TRANSFER", "CARD", "OTHER"]).default("CASH"),
})
