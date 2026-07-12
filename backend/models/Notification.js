const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      // The User (Admin/Doctor/Patient) who should see this notification
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: [
        "AppointmentRequested",
        "AppointmentAccepted",
        "AppointmentDeclined",
        "AppointmentScheduled",
        "AppointmentCompleted",
        "AppointmentCancelled",
        "PrescriptionIssued",
        "BillGenerated",
        "BillPaid",
        "LabReportUploaded",
        "General",
      ],
      default: "General",
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      default: "",
    },

    link: {
      // Frontend route the notification should deep-link to, e.g. /patient/appointments
      type: String,
      default: "",
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", notificationSchema);
