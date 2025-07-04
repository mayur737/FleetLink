const Booking = require("../models/Booking.model");
const Vehicle = require("../models/Vehicle.model");

const addVehicle = async (req, res, next) => {
  try {
    const { name, capacity, tyres } = req.body;
    if (!name || !capacity || !tyres) {
      return next({
        st: 400,
        ms: "Please provide all required fields: name, capacity, tyres",
      });
    }
    const vehicle = new Vehicle({
      name,
      capacity,
      tyres,
    });
    await vehicle.save();
    res.status(201).json({
      data: { message: "Vehicle added successfully" },
    });
  } catch (error) {
    console.log(error);
    next({
      st: 500,
      ms: error.message || "Internal Server Error",
    });
  }
};

const checkAvailableVehicles = async (req, res, next) => {
  try {
    const { capacityRequired, fromPincode, toPincode, startTime } = req.query;

    if (!capacityRequired || !fromPincode || !toPincode || !startTime) {
      return next({
        st: 400,
        ms: "Missing query parameters: capacityRequired, fromPincode, toPincode, startTime",
      });
    }

    const capacity = parseInt(capacityRequired);
    const from = parseInt(fromPincode);
    const to = parseInt(toPincode);
    const start = new Date(startTime);

    if (isNaN(capacity) || isNaN(from) || isNaN(to) || isNaN(start.getTime())) {
      return next({
        st: 400,
        ms: "Invalid parameter types. Ensure all parameters are in correct format.",
      });
    }

    const estimatedRideDurationHours = Math.abs(to - from) % 24;

    const endTime = new Date(start);
    endTime.setHours(endTime.getHours() + estimatedRideDurationHours);

    const allVehicles = await Vehicle.find({ capacity: { $gte: capacity } });

    const vehicleIds = allVehicles.map((v) => v._id);

    const conflictingBookings = await Booking.find({
      vehicleId: { $in: vehicleIds },
      $or: [{ startTime: { $lt: endTime }, endTime: { $gt: start } }],
    });

    const bookedVehicleIds = conflictingBookings.map((b) =>
      b.vehicleId.toString()
    );

    const availableVehicles = allVehicles.filter(
      (v) => !bookedVehicleIds.includes(v._id.toString())
    );

    res.status(200).json({
      data: { estimatedRideDurationHours, availableVehicles },
    });
  } catch (error) {
    console.error("Availability Check Error:", error);
    next({
      st: 500,
      ms: error.message || "Internal Server Error",
    });
  }
};

module.exports = {
  addVehicle,
  checkAvailableVehicles,
};
