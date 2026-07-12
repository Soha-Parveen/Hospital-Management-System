const mongoose = require("mongoose");

const labReportSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    reportType: {
      type: String,
      enum: [
        "Blood Test",
        "Urine Test",
        "X-Ray",
        "CT Scan",
        "MRI",
        "ECG",
        "Ultrasound",
        "Other",
      ],
      required: true,
    },

    reportFile: {
      type: String,
      required: true,
    },

    remarks: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("LabReport", labReportSchema);