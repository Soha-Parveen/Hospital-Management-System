const express = require("express");

const router = express.Router();

const {
    getMyProfile,
    getMyAppointments,
    getMyPrescriptions,
    getMyLabReports,
    getMyBills,
    getDashboardStats
} = require("../controllers/patientController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

router.get(
    "/profile",
    protect,
    authorize("Patient"),
    getMyProfile
);
router.get(
    "/appointments",
    protect,
    authorize("Patient"),
    getMyAppointments
);
router.get(
    "/prescriptions",
    protect,
    authorize("Patient"),
    getMyPrescriptions
);
router.get(
    "/lab-reports",
    protect,
    authorize("Patient"),
    getMyLabReports
);
router.get(
    "/bills",
    protect,
    authorize("Patient"),
    getMyBills
);
router.get(
    "/dashboard",
    protect,
    authorize("Patient"),
    getDashboardStats
);

module.exports = router;