const express = require("express");

const router = express.Router();

const {
    addPatient,
    getMyPatients,
    updatePatient,
    deletePatient,
    getPublicDoctors,
    getDashboardStats
} = require("../controllers/doctorController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

router.post(
    "/add-patient",
    protect,
    authorize("Doctor"),
    upload.uploadPatientPhoto.single("profileImage"),
    addPatient
);
router.get(
    "/patients",
    protect,
    authorize("Doctor"),
    getMyPatients
);
router.put(
    "/patient/:id",
    protect,
    authorize("Doctor"),
    upload.uploadPatientPhoto.single("profileImage"),
    updatePatient
);
router.delete(
    "/patient/:id",
    protect,
    authorize("Doctor"),
    deletePatient
);

// Any logged-in role (Patient searching for a doctor, Admin browsing, etc.)
router.get(
    "/public",
    protect,
    getPublicDoctors
);

router.get(
    "/dashboard",
    protect,
    authorize("Doctor"),
    getDashboardStats
);

module.exports = router;
