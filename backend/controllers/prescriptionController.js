const Prescription = require("../models/Prescription");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const { notify } = require("../services/notificationService");

const createPrescription = async (req, res) => {
  try {

    const {
      patientId,
      medicines,
      dietAdvice,
      notes
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

    // Verify patient belongs to doctor
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

    const prescription = await Prescription.create({
      doctor: doctor._id,
      patient: patient._id,
      medicines,
      dietPlan: dietAdvice,
      notes
    });

    await notify({
      userId: patient.user,
      type: "PrescriptionIssued",
      title: "New prescription issued",
      message: `Dr. ${doctor.fullName} issued a new prescription for you.`,
      link: "/patient/prescriptions"
    });

    res.status(201).json({
      success: true,
      message: "Prescription Created Successfully",
      prescription
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};
module.exports = {
    createPrescription
};
