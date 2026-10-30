const { Router } = require("express");
const bookingController = require("../controllers/bookingController");
const authenticateToken = require("../middlewares/auth");
const authorizeBooking = require("../middlewares/authorizeBooking");

const router = Router();
router.post("/", authenticateToken, bookingController.createBooking);
router.get("/:id", authenticateToken, authorizeBooking, bookingController.getBooking);
router.put("/:id", authenticateToken, authorizeBooking, bookingController.updateBooking);
router.delete("/:id", authenticateToken, authorizeBooking, bookingController.deleteBooking);

module.exports = router;
