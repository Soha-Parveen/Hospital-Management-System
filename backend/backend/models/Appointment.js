const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
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

    appointmentDate: {
      type: Date,
      required: true,
    },

    appointmentTime: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Scheduled", "Completed", "Cancelled", "Declined"],
      default: "Scheduled",
    },

    // Who initiated the appointment — a doctor scheduling directly for a
    // patient they manage, or a patient requesting a slot with any doctor.
    requestedBy: {
      type: String,
      enum: ["Doctor", "Patient"],
      default: "Doctor",
    },

    reason: {
      type: String,
      default: "",
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

module.exports = mongoose.model("Appointment", appointmentSchema);