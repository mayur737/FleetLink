const express = require("express");
const {
  addVehicle,
  checkAvailableVehicles,
} = require("../controllers/vehicle.controller");

const router = express.Router();

router.post("/", addVehicle);
router.get("/available", checkAvailableVehicles);

module.exports = router;
