const bookingService = require("../services/bookingService");

const parseBookingInput = (body) => {
  const date = new Date(body.date);
  const scheduleId = Number(body.scheduleId);
  if (
    !body.date ||
    Number.isNaN(date.getTime()) ||
    !Number.isInteger(scheduleId) ||
    scheduleId <= 0
  ) {
    return null;
  }
  return { date, scheduleId };
};

const createBooking = async (req, res) => {
  const input = parseBookingInput(req.body || {});
  if (!input) {
    return res.status(400).json({ error: "Invalid booking data" });
  }

  try {
    const booking = await bookingService.createBooking({
      ...input,
      userId: Number(req.user.id),
    });
    if (!booking) {
      return res.status(400).json({ error: "El horario ya está ocupado" });
    }
    return res.status(201).json(booking);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getBooking = (req, res) => {
  return res.status(200).json(req.booking);
};

const updateBooking = async (req, res) => {
  const input = parseBookingInput(req.body || {});
  if (!input) {
    return res.status(400).json({ error: "Invalid booking data" });
  }

  try {
    const booking = await bookingService.updateBooking({
      id: req.booking.id,
      ...input,
    });
    if (!booking) {
      return res.status(400).json({ error: "El horario ya está ocupado" });
    }
    return res.status(200).json(booking);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteBooking = async (req, res) => {
  try {
    await bookingService.deleteBooking(req.booking.id);
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { createBooking, getBooking, updateBooking, deleteBooking };
