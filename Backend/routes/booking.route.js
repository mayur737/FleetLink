const express = require("express");
const {
  createBooking,
  cancelBooking,
  getBookings,
} = require("../controllers/booking.controller");
const router = express.Router();

router.post("/", createBooking);
router.get("/:customerId", getBookings);
router.delete("/:id", cancelBooking);

module.exports = router;
