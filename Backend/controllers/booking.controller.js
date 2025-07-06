const Booking = require("../models/Booking.model");
const Vehicle = require("../models/Vehicle.model");

const createBooking = async (req, res, next) => {
  try {
    const { vehicleId, fromPincode, toPincode, startTime, customerId } =
      req.body;

    if (!vehicleId || !fromPincode || !toPincode || !startTime || !customerId) {
      return next({ st: 400, error: "All fields are required." });
    }

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return next({ st: 404, error: "Vehicle not found" });
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
        error: "Vehicle is already booked for the selected time slot",
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
      data: { message: "Booking confirmed", booking: newBooking },
    });
  } catch (error) {
    console.log("Booking error:", error);
    next({
      st: 500,
      error: error.message || "Internal Server Error",
    });
  }
};

const getBookings = async (req, res, next) => {
  try {
    const { customerId } = req.params;
    const bookings = await Booking.find({ customerId: customerId });

    if (!bookings || bookings.length === 0) {
      return next({ st: 404, error: "No bookings found for this customer" });
    }

    res.status(200).json({ data: { bookings } });
  } catch (error) {
    console.log("Error fetching bookings:", error);
    next({
      st: 500,
      error: error.message || "Internal Server Error",
    });
  }
};

const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return next({ st: 404, error: "Booking not found" });
    }

    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.log(error);
    next({ st: 500, error: error.message || "Server Error" });
  }
};

module.exports = {
  createBooking,
  getBookings,
  cancelBooking,
};
