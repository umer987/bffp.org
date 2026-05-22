import { prisma } from "../lib/prisma"
import type { z } from "zod"
import type { attendanceSchema } from "../validations/schemas"

export async function takeAttendance(input: z.infer<typeof attendanceSchema>) {
  const records = await prisma.$transaction(
    input.records.map((record) =>
      prisma.attendance.upsert({
        where: { studentId_date: { studentId: record.studentId, date: input.date } },
        update: { status: record.status, note: record.note, classId: input.classId },
        create: { ...record, classId: input.classId, date: input.date },
      }),
    ),
  )

  await Promise.all(input.records.map((record) => recalculateAttendance(record.studentId)))
  return records
}

export async function listClassAttendance(classId: string) {
  return prisma.attendance.findMany({ where: { classId }, include: { student: true }, orderBy: { date: "desc" } })
}

export async function listStudentAttendance(studentId: string) {
  return prisma.attendance.findMany({ where: { studentId }, orderBy: { date: "desc" } })
}

async function recalculateAttendance(studentId: string) {
  const records = await prisma.attendance.findMany({ where: { studentId } })
  const counted = records.filter((record) => record.status !== "LEAVE")
  const present = counted.filter((record) => record.status === "PRESENT" || record.status === "LATE")
  const attendancePercentage = counted.length ? Math.round((present.length / counted.length) * 10000) / 100 : 0
  await prisma.student.update({ where: { id: studentId }, data: { attendancePercentage } })
}
