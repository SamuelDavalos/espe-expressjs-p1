require("dotenv").config();
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required.");

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function ensureSchedule(court, startTime, endTime) {
  const start = new Date(startTime);
  const existing = await prisma.schedule.findFirst({
    where: { court, startTime: start },
  });
  if (existing) return existing;
  return prisma.schedule.create({
    data: { court, startTime: start, endTime: new Date(endTime) },
  });
}

async function ensureBooking(date, userId, scheduleId) {
  const bookingDate = new Date(date);
  const existing = await prisma.booking.findFirst({
    where: { date: bookingDate, userId, scheduleId },
  });
  if (existing) return existing;
  return prisma.booking.create({
    data: { date: bookingDate, userId, scheduleId },
  });
}

async function main() {
  const studentName = process.env.STUDENT_NAME?.trim();
  const studentEmail = process.env.STUDENT_EMAIL?.trim().toLowerCase();
  const studentPassword = process.env.STUDENT_PASSWORD;
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!studentName || !studentEmail || !studentPassword || !adminEmail || !adminPassword) {
    throw new Error(
      "Set STUDENT_NAME, STUDENT_EMAIL, STUDENT_PASSWORD, ADMIN_EMAIL, and ADMIN_PASSWORD.",
    );
  }

  const [adminHash, studentHash] = await Promise.all([
    bcrypt.hash(adminPassword, 10),
    bcrypt.hash(studentPassword, 10),
  ]);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { name: "Paulo Galarza", role: "ADMIN" },
    create: {
      name: "Paulo Galarza",
      email: adminEmail,
      password: adminHash,
      role: "ADMIN",
    },
  });
  const student = await prisma.user.upsert({
    where: { email: studentEmail },
    update: { name: studentName, role: "USER" },
    create: {
      name: studentName,
      email: studentEmail,
      password: studentHash,
      role: "USER",
    },
  });

  const scheduleOne = await ensureSchedule(
    "Pádel 3",
    "2026-11-23T08:00:00.000Z",
    "2026-11-23T10:00:00.000Z",
  );
  const scheduleTwo = await ensureSchedule(
    "Ecuavóley 3",
    "2026-11-23T10:00:00.000Z",
    "2026-11-23T12:00:00.000Z",
  );

  await ensureBooking("2026-11-23T08:00:00.000Z", admin.id, scheduleOne.id);
  await ensureBooking("2026-11-23T10:00:00.000Z", student.id, scheduleTwo.id);
  console.log("Render seed ready; existing records were preserved.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
