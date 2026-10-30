require("dotenv").config();
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const studentName = process.env.STUDENT_NAME;
const studentEmail = process.env.STUDENT_EMAIL;

async function main() {
  if (!studentName || !studentEmail) {
    throw new Error(
      "Define STUDENT_NAME y STUDENT_EMAIL en .env antes de ejecutar el seed.",
    );
  }

  await prisma.booking.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await bcrypt.hash("admin123", 10);
  const studentPassword = await bcrypt.hash("user123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Paulo Galarza",
      email: "paulo.galarza@example.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  const student = await prisma.user.create({
    data: {
      name: studentName,
      email: studentEmail,
      password: studentPassword,
      role: "USER",
    },
  });

  const scheduleOne = await prisma.schedule.create({
    data: {
      court: "Pádel 3",
      startTime: new Date("2026-11-23T08:00:00.000Z"),
      endTime: new Date("2026-11-23T10:00:00.000Z"),
    },
  });
  const scheduleTwo = await prisma.schedule.create({
    data: {
      court: "Ecuavóley 3",
      startTime: new Date("2026-11-23T10:00:00.000Z"),
      endTime: new Date("2026-11-23T12:00:00.000Z"),
    },
  });

  await prisma.booking.create({
    data: {
      date: new Date("2026-11-23T08:00:00.000Z"),
      user: { connect: { id: admin.id } },
      schedule: { connect: { id: scheduleOne.id } },
    },
  });
  await prisma.booking.create({
    data: {
      date: new Date("2026-11-23T10:00:00.000Z"),
      user: { connect: { id: student.id } },
      schedule: { connect: { id: scheduleTwo.id } },
    },
  });

  console.log("Seed listo: administrador, usuario, horarios y reservas creados.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
