const {
  createScheduleService,
  listBookingsService,
} = require("../services/adminService");

const createSchedule = async (req, res) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Access denied" });
  }
  const { court, startTime, endTime } = req.body;
  if (!court || !startTime || !endTime) {
    return res.status(400).json({ error: "court, startTime and endTime are required" });
  }
  try {
    const schedule = await createScheduleService(court, startTime, endTime);
    res.status(201).json(schedule);
  } catch (error) {
    res.status(500).json({ error: "Error creating schedule" });
  }
};

const listBookings = async (req, res) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Access denied" });
  }
  try {
    const bookings = await listBookingsService();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Error fetching bookings" });
  }
};

module.exports = { createSchedule, listBookings };
