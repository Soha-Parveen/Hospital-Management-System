const express = require("express");

const router = express.Router();

const {
    createAppointment,
    requestAppointment,
    respondToRequest,
    getMyAppointments,
    updateAppointmentStatus
} = require("../controllers/appointmentController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

router.post(
    "/create",
    protect,
    authorize("Doctor"),
    createAppointment
);

router.post(
    "/request",
    protect,
    authorize("Patient"),
    requestAppointment
);

router.put(
    "/:id/respond",
    protect,
    authorize("Doctor"),
    respondToRequest
);

router.get(
    "/my-appointments",
    protect,
    authorize("Doctor"),
    getMyAppointments
);

router.put(
    "/:id/status",
    protect,
    authorize("Doctor"),
    updateAppointmentStatus
);

module.exports = router;
