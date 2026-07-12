const express = require("express");

const router = express.Router();

const {
    createPrescription
} = require("../controllers/prescriptionController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

router.post(
    "/create",
    protect,
    authorize("Doctor"),
    createPrescription
);

module.exports = router;