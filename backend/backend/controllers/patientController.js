const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const Prescription = require("../models/Prescription");
const LabReport = require("../models/LabReport");
const Bill = require("../models/Bill");

const getMyProfile = async (req, res) => {
  try {

    const patient = await Patient.findOne({
      user: req.user._id
    })
      .populate("assignedDoctor", "fullName department profileImage")
      .populate("user", "name email");

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found"
      });
    }

    res.status(200).json({
      success: true,
      patient
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

    const patient = await Patient.findOne({
      user: req.user._id
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found"
      });
    }

    const appointments = await Appointment.find({
      patient: patient._id
    })
      .populate("doctor", "fullName department profileImage")
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
const getMyPrescriptions = async (req, res) => {
  try {

    const patient = await Patient.findOne({
      user: req.user._id
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found"
      });
    }

    const prescriptions = await Prescription.find({
      patient: patient._id
    })
      .populate("doctor", "fullName department profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: prescriptions.length,
      prescriptions
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};
const getMyLabReports = async (req, res) => {
  try {

    const patient = await Patient.findOne({
      user: req.user._id
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found"
      });
    }


    const reports = await LabReport.find({
      patient: patient._id
    })
      .populate("doctor", "fullName department")
      .sort({ createdAt: -1 });


    res.status(200).json({
      success: true,
      count: reports.length,
      reports
    });


  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};
const getMyBills = async (req, res) => {
  try {

    const patient = await Patient.findOne({
      user: req.user._id
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found"
      });
    }

    const bills = await Bill.find({
      patient: patient._id
    })
      .populate("doctor", "fullName department profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bills.length,
      bills
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};
const getDashboardStats = async (req, res) => {
  try {

    const patient = await Patient.findOne({
      user: req.user._id
    }).populate("assignedDoctor", "fullName department");

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found"
      });
    }

    const totalAppointments = await Appointment.countDocuments({
      patient: patient._id
    });

    const upcomingAppointments = await Appointment.countDocuments({
      patient: patient._id,
      status: "Scheduled"
    });

    const totalPrescriptions = await Prescription.countDocuments({
      patient: patient._id
    });

    const totalLabReports = await LabReport.countDocuments({
      patient: patient._id
    });

    const pendingBills = await Bill.countDocuments({
      patient: patient._id,
      paymentStatus: "Pending"
    });

    const pendingAppointmentRequests = await Appointment.countDocuments({
      patient: patient._id,
      status: "Pending"
    });

    const paidBills = await Bill.countDocuments({
      patient: patient._id,
      paymentStatus: "Paid"
    });

    res.status(200).json({
      success: true,
      dashboard: {
        assignedDoctor: patient.assignedDoctor,
        totalAppointments,
        upcomingAppointments,
        pendingAppointmentRequests,
        totalPrescriptions,
        totalLabReports,
        pendingBills,
        paidBills
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
    getMyProfile,
    getMyAppointments,
    getMyPrescriptions,
    getMyLabReports,
    getMyBills,
    getDashboardStats
};