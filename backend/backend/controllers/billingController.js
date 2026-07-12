const Bill = require("../models/Bill");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const { notify } = require("../services/notificationService");

const createBill = async (req, res) => {

  try {

    const {
      patientId,
      consultationFee,
      medicineCharges,
      labCharges
    } = req.body;

    const doctor = await Doctor.findOne({
      user: req.user._id
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

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

    const totalAmount =
      Number(consultationFee) +
      Number(medicineCharges) +
      Number(labCharges);

    const bill = await Bill.create({
      patient: patient._id,
      doctor: doctor._id,
      consultationFee,
      medicineCharges,
      labCharges,
      totalAmount
    });

    await notify({
      userId: patient.user,
      type: "BillGenerated",
      title: "New bill generated",
      message: `Dr. ${doctor.fullName} generated a bill of ₹${totalAmount.toLocaleString()} for you.`,
      link: "/patient/billing"
    });

    res.status(201).json({
      success: true,
      message: "Bill Created Successfully",
      bill
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

const payBill = async (req, res) => {
  try {

    // Find logged-in patient
    const patient = await Patient.findOne({
      user: req.user._id
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found"
      });
    }

    // Find patient's bill
    const bill = await Bill.findOne({
      _id: req.params.id,
      patient: patient._id
    }).populate("doctor", "fullName user");

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: "Bill not found"
      });
    }

    if (bill.paymentStatus === "Paid") {
      return res.status(400).json({
        success: false,
        message: "Bill is already paid"
      });
    }

    bill.paymentStatus = "Paid";

    await bill.save();

    if (bill.doctor?.user) {
      await notify({
        userId: bill.doctor.user,
        type: "BillPaid",
        title: "Bill paid",
        message: `${patient.fullName} paid their bill of ₹${Number(bill.totalAmount).toLocaleString()}.`,
        link: "/doctor/billing"
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment Successful",
      bill
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

module.exports = {
    createBill,
    payBill
};
