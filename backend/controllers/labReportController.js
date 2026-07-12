const LabReport = require("../models/LabReport");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const uploadReport = async (req, res) => {
    try {

        const {
            patientId,
            reportTitle,
            reportType,
            reportDate,
            remarks
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

        const report = await LabReport.create({
            doctor: doctor._id,
            patient: patient._id,
            reportTitle,
            reportType,
            reportDate,
            remarks,
            reportFile: req.file.filename
        });

        res.status(201).json({
            success: true,
            message: "Lab Report Uploaded Successfully",
            report
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
module.exports = {
    uploadReport
};