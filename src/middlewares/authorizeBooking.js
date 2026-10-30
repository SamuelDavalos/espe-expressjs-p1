const bookingService = require("../services/bookingService");

const authorizeBooking = async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(404).json({ error: "Booking not found" });
  }

  try {
    const booking = await bookingService.findBookingById(id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.userId !== Number(req.user.id) && req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Forbidden" });
    }

    req.booking = booking;
    return next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = authorizeBooking;
