import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})
const prisma = new PrismaClient({ adapter })

async function main() {
  const passwordHash = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD || "password123", 12)

  await prisma.admin.upsert({
    where: { email: process.env.SEED_ADMIN_EMAIL || "admin@bffp.org" },
    update: {},
    create: {
      name: "BFFP Admin",
      email: process.env.SEED_ADMIN_EMAIL || "admin@bffp.org",
      passwordHash,
    },
  })

  const classes = ["Nursery", "KG1", "KG2", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
  for (const name of classes) {
    const klass = await prisma.class.upsert({
      where: { name },
      update: {},
      create: { name },
    })

    for (const sectionName of ["A", "B"]) {
      await prisma.section.upsert({
        where: { name_classId: { name: sectionName, classId: klass.id } },
        update: {},
        create: { name: sectionName, classId: klass.id },
      })
    }
  }
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
