const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure a destination folder exists before multer tries to write into it.
const ensureDir = (dir) => {
  const fullPath = path.join(__dirname, "..", dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
  return fullPath;
};

const makeStorage = (folder) =>
  multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, ensureDir(folder));
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname));
    },
  });

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"));
  }
};

// Lab / diagnostic reports (pdf, images, docs) — unchanged behaviour, kept for backwards compatibility.
const upload = multer({ storage: makeStorage("uploads/reports") });

// Doctor & patient profile photos — images only.
const uploadDoctorPhoto = multer({ storage: makeStorage("uploads/doctors"), fileFilter: imageFilter });
const uploadPatientPhoto = multer({ storage: makeStorage("uploads/patients"), fileFilter: imageFilter });

module.exports = upload;
module.exports.uploadDoctorPhoto = uploadDoctorPhoto;
module.exports.uploadPatientPhoto = uploadPatientPhoto;
