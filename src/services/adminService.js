const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
const userSummary = { id: true, name: true, email: true, role: true };

const createScheduleService = async (court, startTime, endTime) => {
  const schedule = await prisma.schedule.create({
    data: {
      court,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
    },
  });
  return schedule;
};

const listBookingsService = async () => {
  const bookings = await prisma.booking.findMany({
    include: {
      user: { select: userSummary },
      schedule: true,
    },
  });
  return bookings;
};

module.exports = { createScheduleService, listBookingsService };
