const { Router } = require("express");
const authenticateToken = require("../middlewares/auth");
const {
  createSchedule,
  getBookings,
} = require("../controllers/adminController");

const router = Router();

router.post("/schedules", authenticateToken, createSchedule);
router.get("/bookings", authenticateToken, getBookings);

module.exports = router;
