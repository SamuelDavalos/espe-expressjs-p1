const { Router } = require("express");
const authenticateToken = require("../middlewares/auth");
const authorizeBooking = require("../middlewares/authorizeBooking");
const {
  createBooking,
  getBooking,
  updateBooking,
  deleteBooking,
} = require("../controllers/bookingController");

const router = Router();

router.post("/", authenticateToken, createBooking);
router.get("/:id", authenticateToken, authorizeBooking, getBooking);
router.put("/:id", authenticateToken, authorizeBooking, updateBooking);
router.delete("/:id", authenticateToken, authorizeBooking, deleteBooking);

module.exports = router;
