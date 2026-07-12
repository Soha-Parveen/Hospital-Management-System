const Appointment = require("../models/Appointment");
const Prescription = require("../models/Prescription");
const LabReport = require("../models/LabReport");
const Bill = require("../models/Bill");
const Patient = require("../models/Patient");

const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Doctor = require("../models/Doctor");

// =============================
// Add Doctor
// =============================
const addDoctor = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      phone,
      department,
      qualification,
      experience,
    } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name: fullName,
      email,
      password: hashedPassword,
      role: "Doctor",
    });

    const doctor = await Doctor.create({
      user: newUser._id,
      fullName,
      phone,
      department,
      qualification,
      experience,
      profileImage: req.file ? `/uploads/doctors/${req.file.filename}` : "",
    });

    res.status(201).json({
      success: true,
      message: "Doctor Added Successfully",
      doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Get All Doctors
// =============================
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .populate("user", "email role")
      .sort({ createdAt: -1 });

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

// =============================
// Update Doctor
// =============================
const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    doctor.fullName = req.body.fullName || doctor.fullName;
    doctor.phone = req.body.phone || doctor.phone;
    doctor.department = req.body.department || doctor.department;
    doctor.qualification =
      req.body.qualification || doctor.qualification;
    doctor.experience =
      req.body.experience || doctor.experience;
    doctor.availability =
      req.body.availability || doctor.availability;
    doctor.bio = req.body.bio ?? doctor.bio;
    if (req.file) {
      doctor.profileImage = `/uploads/doctors/${req.file.filename}`;
    }

    await doctor.save();

    res.status(200).json({
      success: true,
      message: "Doctor Updated Successfully",
      doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Delete Doctor
// =============================
const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    await User.findByIdAndDelete(doctor.user);

    await Doctor.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Doctor Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Dashboard Statistics
// =============================
const getDashboardStats = async (req, res) => {
  try {
    const totalDoctors = await Doctor.countDocuments();
    const totalPatients = await Patient.countDocuments();
    const totalAppointments = await Appointment.countDocuments();
    const totalPrescriptions = await Prescription.countDocuments();
    const totalLabReports = await LabReport.countDocuments();
    const totalBills = await Bill.countDocuments();

    const revenue = await Bill.aggregate([
      {
        $match: {
          paymentStatus: "Paid",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      dashboard: {
        totalDoctors,
        totalPatients,
        totalAppointments,
        totalPrescriptions,
        totalLabReports,
        totalBills,
        totalRevenue:
          revenue.length > 0 ? revenue[0].totalRevenue : 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addDoctor,
  getAllDoctors,
  updateDoctor,
  deleteDoctor,
  getDashboardStats,
};