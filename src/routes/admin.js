const { Router } = require("express");
const {
  createSchedule,
  listBookings,
} = require("../controllers/adminController");
const authenticateToken = require("../middlewares/auth");
const router = Router();

router.post("/schedules", authenticateToken, createSchedule);
router.get("/bookings", authenticateToken, listBookings);

module.exports = router;
