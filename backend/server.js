const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const patientRoutes = require("./routes/patientRoutes");
const labReportRoutes = require("./routes/labReportRoutes");
const billingRoutes = require("./routes/billingRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/lab-reports", labReportRoutes);
app.use("/api/billing",billingRoutes);
app.use("/api/notifications", notificationRoutes);


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));


app.get("/", (req, res) => {
  res.send("Hospital Management System Backend Running...");
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});