const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
const userSummary = { id: true, name: true, email: true, role: true };

const parseId = (id) => {
  const parsed = Number.parseInt(id, 10);
  if (!Number.isInteger(parsed) || parsed < 1) throw new Error("Invalid booking id");
  return parsed;
};

const parseDate = (date) => {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) throw new Error("Invalid booking date");
  return parsed;
};

const parseScheduleId = (scheduleId) => {
  const parsed = Number.parseInt(scheduleId, 10);
  if (!Number.isInteger(parsed) || parsed < 1) throw new Error("Invalid scheduleId");
  return parsed;
};

exports.findBookingById = (id) => {
  let bookingId;
  try {
    bookingId = parseId(id);
  } catch {
    return null;
  }
  return prisma.booking.findUnique({
    where: { id: bookingId },
    include: { user: { select: userSummary }, schedule: true },
  });
};

exports.listUserBookings = (userId) =>
  prisma.booking.findMany({
    where: { userId: parseId(userId) },
    include: { schedule: true },
  });

exports.createBooking = async ({ date, scheduleId, userId }) => {
  const parsedDate = parseDate(date);
  const parsedScheduleId = parseScheduleId(scheduleId);
  const conflict = await prisma.booking.findFirst({
    where: { date: parsedDate, scheduleId: parsedScheduleId },
  });
  if (conflict) throw new Error("El horario ya está ocupado");

  return prisma.booking.create({
    data: { date: parsedDate, scheduleId: parsedScheduleId, userId },
    include: { user: { select: userSummary }, schedule: true },
  });
};

exports.updateBooking = async (id, { date, scheduleId }) => {
  const bookingId = parseId(id);
  const parsedDate = parseDate(date);
  const parsedScheduleId = parseScheduleId(scheduleId);
  const conflict = await prisma.booking.findFirst({
    where: {
      date: parsedDate,
      scheduleId: parsedScheduleId,
      id: { not: bookingId },
    },
  });
  if (conflict) throw new Error("El horario ya está ocupado");

  return prisma.booking.update({
    where: { id: bookingId },
    data: { date: parsedDate, scheduleId: parsedScheduleId },
    include: { user: { select: userSummary }, schedule: true },
  });
};

exports.deleteBooking = (id) =>
  prisma.booking.delete({ where: { id: parseId(id) } });
