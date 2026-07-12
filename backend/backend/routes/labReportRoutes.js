const express = require("express");

const router = express.Router();

const upload = require("../middleware/uploadMiddleware");

const {
    uploadReport
} = require("../controllers/labReportController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

router.post(
    "/upload",
    protect,
    authorize("Doctor"),
    upload.single("reportFile"),
    uploadReport
);

module.exports = router;