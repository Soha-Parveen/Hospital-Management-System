const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema(
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

    medicines: [
      {
        medicineName: {
          type: String,
          required: true,
        },

        dosage: {
          type: String,
          required: true,
        },

        duration: {
          type: String,
          required: true,
        },
      },
    ],

    dietPlan: {
      type: String,
      default: "",
    },

    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Prescription", prescriptionSchema);