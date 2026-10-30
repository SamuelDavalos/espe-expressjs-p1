const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const findBookingById = (id) => {
  return prisma.booking.findUnique({ where: { id } });
};

const findConflict = (date, scheduleId, excludedId) => {
  return prisma.booking.findFirst({
    where: {
      date,
      scheduleId,
      ...(excludedId ? { id: { not: excludedId } } : {}),
    },
  });
};

const createBooking = async ({ date, scheduleId, userId }) => {
  const conflict = await findConflict(date, scheduleId);
  if (conflict) return null;

  return prisma.booking.create({
    data: { date, scheduleId, userId },
  });
};

const updateBooking = async ({ id, date, scheduleId }) => {
  const conflict = await findConflict(date, scheduleId, id);
  if (conflict) return null;

  return prisma.booking.update({
    where: { id },
    data: { date, scheduleId },
  });
};

const deleteBooking = (id) => {
  return prisma.booking.delete({ where: { id } });
};

module.exports = {
  findBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
};
