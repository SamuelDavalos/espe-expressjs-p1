const { Router } = require("express");
const userController = require("../controllers/userController");
const authenticateToken = require("../middlewares/auth");
const authorizeUser = require("../middlewares/authorizeUser");

const router = Router();
router.get(
  "/:id/bookings",
  authenticateToken,
  authorizeUser,
  userController.getUserBookings,
);

module.exports = router;
