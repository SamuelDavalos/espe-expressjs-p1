const bookingService = require("../services/bookingService");

exports.createBooking = async (req, res) => {
  const { date, scheduleId } = req.body;
  if (!date || !scheduleId) {
    return res.status(400).json({ message: "date and scheduleId are required" });
  }

  try {
    const booking = await bookingService.createBooking({
      date,
      scheduleId,
      userId: req.user.id,
    });
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getBooking = (req, res) => res.json(req.booking);

exports.updateBooking = async (req, res) => {
  const { date, scheduleId } = req.body;
  if (!date || !scheduleId) {
    return res.status(400).json({ message: "date and scheduleId are required" });
  }

  try {
    const booking = await bookingService.updateBooking(req.params.id, {
      date,
      scheduleId,
    });
    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    await bookingService.deleteBooking(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
