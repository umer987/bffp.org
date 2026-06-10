const { PrismaClient } = require('@prisma/client')

async function main() {
  const prisma = new PrismaClient()
  try {
    const certs = await prisma.certificate.findMany({
      take: 5,
      include: { teacher: true, course: true },
    })
    console.log(JSON.stringify(certs, null, 2))
  } catch (err) {
    console.error(err)
  } finally {
    await prisma.$disconnect()
  }
}

main()
