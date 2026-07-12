const Appointment = require("../models/Appointment");
const Prescription = require("../models/Prescription");
const LabReport = require("../models/LabReport");
const Bill = require("../models/Bill");

const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");

const addPatient = async (req, res) => {
  try {

    const {
      fullName,
      age,
      gender,
      phone,
      address,
      email,
      password
    } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists"
      });
    }

    // Logged in doctor
    const doctor = await Doctor.findOne({
      user: req.user._id
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name: fullName,
      email,
      password: hashedPassword,
      role: "Patient"
    });

    const patient = await Patient.create({
      user: newUser._id,
      fullName,
      age,
      gender,
      phone,
      address,
      assignedDoctor: doctor._id,
      profileImage: req.file ? `/uploads/patients/${req.file.filename}` : ""
    });

    res.status(201).json({
      success: true,
      message: "Patient Added Successfully",
      patient
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};
const getMyPatients = async (req, res) => {
  try {

    // Find logged-in doctor
    const doctor = await Doctor.findOne({
      user: req.user._id,
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Get only this doctor's patients
    const patients = await Patient.find({
      assignedDoctor: doctor._id,
    })
      .populate("user", "email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: patients.length,
      patients,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
const updatePatient = async (req, res) => {
  try {

    // Find logged-in doctor
    const doctor = await Doctor.findOne({
      user: req.user._id,
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Find patient assigned to this doctor
    const patient = await Patient.findOne({
      _id: req.params.id,
      assignedDoctor: doctor._id,
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found or access denied",
      });
    }

    patient.fullName = req.body.fullName || patient.fullName;
    patient.age = req.body.age || patient.age;
    patient.gender = req.body.gender || patient.gender;
    patient.phone = req.body.phone || patient.phone;
    patient.address = req.body.address || patient.address;
    if (req.file) {
      patient.profileImage = `/uploads/patients/${req.file.filename}`;
    }

    await patient.save();

    res.status(200).json({
      success: true,
      message: "Patient Updated Successfully",
      patient,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
const deletePatient = async (req, res) => {
  try {

    // Find logged-in doctor
    const doctor = await Doctor.findOne({
      user: req.user._id,
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Find patient assigned to this doctor
    const patient = await Patient.findOne({
      _id: req.params.id,
      assignedDoctor: doctor._id,
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found or access denied",
      });
    }

    // Delete patient's login account
    await User.findByIdAndDelete(patient.user);

    // Delete patient profile
    await Patient.findByIdAndDelete(patient._id);

    res.status(200).json({
      success: true,
      message: "Patient Deleted Successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// =============================
// Public / cross-role doctor directory — used by Patients (to search &
// request appointments) and Admins. Any authenticated role can call this.
// =============================
const getPublicDoctors = async (req, res) => {
  try {

    const { search, department } = req.query;

    const filter = {};

    if (department) {
      filter.department = department;
    }

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { department: { $regex: search, $options: "i" } },
        { qualification: { $regex: search, $options: "i" } },
      ];
    }

    const doctors = await Doctor.find(filter)
      .select("fullName department qualification experience availability rating profileImage bio")
      .sort({ fullName: 1 });

    res.status(200).json({
      success: true,
      count: doctors.length,
      doctors,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

const getDashboardStats = async (req, res) => {
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

    const totalPatients = await Patient.countDocuments({
      assignedDoctor: doctor._id
    });

    const totalAppointments = await Appointment.countDocuments({
      doctor: doctor._id
    });

    const pendingRequests = await Appointment.countDocuments({
      doctor: doctor._id,
      status: "Pending"
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const todaysAppointments = await Appointment.countDocuments({
      doctor: doctor._id,
      appointmentDate: {
        $gte: today,
        $lt: tomorrow
      }
    });

    const totalPrescriptions = await Prescription.countDocuments({
      doctor: doctor._id
    });

    const totalLabReports = await LabReport.countDocuments({
      doctor: doctor._id
    });

    const totalBills = await Bill.countDocuments({
      doctor: doctor._id
    });

    res.status(200).json({
      success: true,
      dashboard: {
        totalPatients,
        todaysAppointments,
        totalAppointments,
        pendingRequests,
        totalPrescriptions,
        totalLabReports,
        totalBills
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
    addPatient,
    getMyPatients,
    updatePatient,
    deletePatient,
    getPublicDoctors,
    getDashboardStats
};
