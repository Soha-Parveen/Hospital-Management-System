const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const { notify } = require("../services/notificationService");

// =============================
// Doctor creates a scheduled appointment directly for one of their patients
// =============================
const createAppointment = async (req, res) => {
  try {

    const {
      patientId,
      appointmentDate,
      appointmentTime,
      remarks
    } = req.body;

    // Find logged-in doctor
    const doctor = await Doctor.findOne({
      user: req.user._id
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    // Check patient belongs to doctor
    const patient = await Patient.findOne({
      _id: patientId,
      assignedDoctor: doctor._id
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found"
      });
    }

    const appointment = await Appointment.create({
      doctor: doctor._id,
      patient: patient._id,
      appointmentDate,
      appointmentTime,
      remarks,
      status: "Scheduled",
      requestedBy: "Doctor"
    });

    await notify({
      userId: patient.user,
      type: "AppointmentScheduled",
      title: "New appointment scheduled",
      message: `Dr. ${doctor.fullName} scheduled an appointment for ${new Date(appointmentDate).toLocaleDateString()} at ${appointmentTime}.`,
      link: "/patient/appointments"
    });

    res.status(201).json({
      success: true,
      message: "Appointment Created Successfully",
      appointment
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

// =============================
// Patient requests an appointment with any doctor (not necessarily their assigned one)
// =============================
const requestAppointment = async (req, res) => {
  try {

    const {
      doctorId,
      appointmentDate,
      appointmentTime,
      reason
    } = req.body;

    const patient = await Patient.findOne({
      user: req.user._id
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found"
      });
    }

    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    const appointment = await Appointment.create({
      doctor: doctor._id,
      patient: patient._id,
      appointmentDate,
      appointmentTime,
      reason,
      status: "Pending",
      requestedBy: "Patient"
    });

    await notify({
      userId: doctor.user,
      type: "AppointmentRequested",
      title: "New appointment request",
      message: `${patient.fullName} requested an appointment on ${new Date(appointmentDate).toLocaleDateString()} at ${appointmentTime}.`,
      link: "/doctor/appointments"
    });

    res.status(201).json({
      success: true,
      message: "Appointment request sent to the doctor",
      appointment
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

// =============================
// Doctor accepts or declines a patient-initiated request
// =============================
const respondToRequest = async (req, res) => {
  try {

    const { action } = req.body; // "accept" | "decline"

    const doctor = await Doctor.findOne({
      user: req.user._id
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      doctor: doctor._id,
      status: "Pending"
    }).populate("patient", "fullName user");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Pending request not found"
      });
    }

    appointment.status = action === "accept" ? "Scheduled" : "Declined";
    await appointment.save();

    await notify({
      userId: appointment.patient.user,
      type: action === "accept" ? "AppointmentAccepted" : "AppointmentDeclined",
      title: action === "accept" ? "Appointment confirmed" : "Appointment request declined",
      message:
        action === "accept"
          ? `Dr. ${doctor.fullName} confirmed your appointment on ${new Date(appointment.appointmentDate).toLocaleDateString()} at ${appointment.appointmentTime}.`
          : `Dr. ${doctor.fullName} was unable to accept your requested appointment. Please try another slot or doctor.`,
      link: "/patient/appointments"
    });

    res.status(200).json({
      success: true,
      message: `Request ${action === "accept" ? "accepted" : "declined"}`,
      appointment
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

const getMyAppointments = async (req, res) => {
  try {

    // Find logged-in doctor
    const doctor = await Doctor.findOne({
      user: req.user._id
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    const appointments = await Appointment.find({
      doctor: doctor._id
    })
      .populate("patient", "fullName phone profileImage")
      .sort({ appointmentDate: 1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

const updateAppointmentStatus = async (req, res) => {
  try {

    const doctor = await Doctor.findOne({
      user: req.user._id
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      doctor: doctor._id
    }).populate("patient", "fullName user");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    appointment.status = req.body.status;

    await appointment.save();

    if (appointment.patient?.user) {
      await notify({
        userId: appointment.patient.user,
        type: appointment.status === "Completed" ? "AppointmentCompleted" : "AppointmentCancelled",
        title: `Appointment ${appointment.status.toLowerCase()}`,
        message: `Your appointment with Dr. ${doctor.fullName} was marked as ${appointment.status.toLowerCase()}.`,
        link: "/patient/appointments"
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointment Status Updated",
      appointment
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

module.exports = {
    createAppointment,
    requestAppointment,
    respondToRequest,
    getMyAppointments,
    updateAppointmentStatus
};
