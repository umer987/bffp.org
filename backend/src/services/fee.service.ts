import { prisma } from "../lib/prisma"
import type { z } from "zod"
import type { feeCollectSchema } from "../validations/schemas"

export async function collectFee(input: z.infer<typeof feeCollectSchema>) {
  const fee = await prisma.fee.upsert({
    where: { studentId_month_year: { studentId: input.studentId, month: input.month, year: input.year } },
    update: { amount: input.amount, status: "PAID", paidAt: new Date() },
    create: {
      studentId: input.studentId,
      month: input.month,
      year: input.year,
      amount: input.amount,
      status: "PAID",
      paidAt: new Date(),
    },
  })

  const receipt = await prisma.receipt.upsert({
    where: { feeId: fee.id },
    update: { amountPaid: input.amount, paymentMethod: input.paymentMethod },
    create: {
      feeId: fee.id,
      amountPaid: input.amount,
      paymentMethod: input.paymentMethod,
      receiptNumber: `RCPT-${Date.now()}`,
    },
  })

  await prisma.student.update({ where: { id: input.studentId }, data: { feeStatus: "PAID" } })
  return { fee, receipt }
}

export async function listStudentFees(studentId: string) {
  return prisma.fee.findMany({ where: { studentId }, include: { receipt: true }, orderBy: [{ year: "desc" }, { month: "desc" }] })
}

export async function updateFeeStatus(id: string, status: "PAID" | "PENDING" | "OVERDUE") {
  return prisma.fee.update({ where: { id }, data: { status }, include: { receipt: true } })
}

export async function listFees() {
  return prisma.fee.findMany({
    include: {
      student: {
        include: {
          class: true,
        },
      },
      receipt: true,
    },
    orderBy: [{ year: "desc" }, { month: "desc" }, { createdAt: "desc" }],
  })
}
