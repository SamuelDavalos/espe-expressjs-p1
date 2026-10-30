const bookingService = require("../services/bookingService");

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await bookingService.listUserBookings(req.params.id);
    res.json(bookings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
