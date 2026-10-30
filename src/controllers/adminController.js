const adminService = require("../services/adminService");

const isAdmin = (req, res) => {
  if (req.user?.role !== "ADMIN") {
    res.status(403).json({ error: "Forbidden: admin role required" });
    return false;
  }
  return true;
};

const createSchedule = async (req, res) => {
  if (!isAdmin(req, res)) return;

  const { court, startTime, endTime } = req.body;
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (
    typeof court !== "string" ||
    !court.trim() ||
    !startTime ||
    !endTime ||
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    start >= end
  ) {
    return res.status(400).json({ error: "Invalid schedule data" });
  }

  try {
    const schedule = await adminService.createSchedule({
      court: court.trim(),
      startTime: start,
      endTime: end,
    });
    return res.status(201).json(schedule);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getBookings = async (req, res) => {
  if (!isAdmin(req, res)) return;

  try {
    const bookings = await adminService.getBookings();
    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { createSchedule, getBookings };
