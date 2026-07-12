
const express = require("express");

const router = express.Router();

const {
    addDoctor,
    getAllDoctors,
    updateDoctor,
    deleteDoctor,
    getDashboardStats
} = require("../controllers/adminController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

router.post(
    "/add-doctor",
    protect,
    authorize("Admin"),
    upload.uploadDoctorPhoto.single("profileImage"),
    addDoctor
);
router.get(
    "/doctors",
    protect,
    authorize("Admin"),
    getAllDoctors
);

router.put(
    "/doctor/:id",
    protect,
    authorize("Admin"),
    upload.uploadDoctorPhoto.single("profileImage"),
    updateDoctor
);

router.delete(
    "/doctor/:id",
    protect,
    authorize("Admin"),
    deleteDoctor
);
router.get(
    "/dashboard",
    protect,
    authorize("Admin"),
    getDashboardStats
);

module.exports = router;
