const { Router } = require("express");
const authenticateToken = require("../middlewares/auth");
const authorizeUser = require("../middlewares/authorizeUser");
const { getUserBookings } = require("../controllers/userController");

const router = Router();

router.get("/:id/bookings", authenticateToken, authorizeUser, getUserBookings);

module.exports = router;
