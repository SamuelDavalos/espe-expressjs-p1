const bookingService = require("../services/bookingService");

async function authorizeBooking(req, res, next) {
  try {
    const booking = await bookingService.findBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const isOwner = booking.userId === req.user.id;
    const isAdmin = req.user.role === "ADMIN";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    req.booking = booking;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = authorizeBooking;
