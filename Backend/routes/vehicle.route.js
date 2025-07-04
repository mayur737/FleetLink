const express = require("express");
const {
  addVehicle,
  checkAvailableVehicles,
} = require("../controllers/vehicle.controller");

const router = express.Router();

router.post("/", addVehicle);
router.get("/", checkAvailableVehicles);

module.exports = router;
