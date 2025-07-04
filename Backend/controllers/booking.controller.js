const Booking = require("../models/Booking.model");
const Vehicle = require("../models/Vehicle.model");

const createBooking = async (req, res, next) => {
  try {
    const { vehicleId, fromPincode, toPincode, startTime, customerId } =
      req.body;

    if (!vehicleId || !fromPincode || !toPincode || !startTime || !customerId) {
      return next({ st: 400, ms: "All fields are required." });
    }

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return next({ st: 404, ms: "Vehicle not found" });
    }

    const start = new Date(startTime);
    const from = parseInt(fromPincode);
    const to = parseInt(toPincode);

    const estimatedRideDurationHours = Math.abs(to - from) % 24;

    const endTime = new Date(start);
    endTime.setHours(endTime.getHours() + estimatedRideDurationHours);

    const isBooked = await Booking.findOne({
      vehicleId,
      $or: [
        {
          startTime: { $lt: endTime },
          endTime: { $gt: start },
        },
      ],
    });

    if (isBooked) {
      return next({
        st: 409,
        ms: "Vehicle is already booked for the selected time slot",
      });
    }

    const newBooking = new Booking({
      vehicleId,
      fromPincode,
      toPincode,
      startTime,
      endTime,
      customerId,
    });

    await newBooking.save();

    res.status(201).json({
      message: "Booking confirmed",
      booking: newBooking,
    });
  } catch (error) {
    console.error("Booking error:", error);
    next({
      st: 500,
      ms: error.message || "Internal Server Error",
    });
  }
};

const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return next({ st: 404, ms: "Booking not found" });
    }

    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (err) {
    next({ st: 500, ms: err.message || "Server Error" });
  }
};

module.exports = {
  createBooking,
  cancelBooking,
};
