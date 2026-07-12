import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import useThemeStore from "./store/themeStore.js";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import AdminOverview from "./pages/admin/AdminOverview.jsx";
import AdminDoctors from "./pages/admin/AdminDoctors.jsx";

import DoctorOverview from "./pages/doctor/DoctorOverview.jsx";
import DoctorPatients from "./pages/doctor/DoctorPatients.jsx";
import DoctorAppointments from "./pages/doctor/DoctorAppointments.jsx";
import DoctorPrescriptions from "./pages/doctor/DoctorPrescriptions.jsx";
import DoctorLabReports from "./pages/doctor/DoctorLabReports.jsx";
import DoctorBilling from "./pages/doctor/DoctorBilling.jsx";

import PatientOverview from "./pages/patient/PatientOverview.jsx";
import PatientDoctors from "./pages/patient/PatientDoctors.jsx";
import PatientAppointments from "./pages/patient/PatientAppointments.jsx";
import PatientPrescriptions from "./pages/patient/PatientPrescriptions.jsx";
import PatientLabReports from "./pages/patient/PatientLabReports.jsx";
import PatientBilling from "./pages/patient/PatientBilling.jsx";

export default function App() {
  const { theme } = useThemeStore();

  return (
    <>
      <Toaster
        theme={theme}
        position="top-right"
        toastOptions={{
          style: {
            background: "rgb(var(--color-surface))",
            border: "1px solid var(--color-glass-border)",
            color: "rgb(var(--color-fg))",
            backdropFilter: "blur(18px)",
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="Admin">
              <AdminOverview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/doctors"
          element={
            <ProtectedRoute role="Admin">
              <AdminDoctors />
            </ProtectedRoute>
          }
        />

        {/* Doctor */}
        <Route
          path="/doctor"
          element={
            <ProtectedRoute role="Doctor">
              <DoctorOverview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/patients"
          element={
            <ProtectedRoute role="Doctor">
              <DoctorPatients />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/appointments"
          element={
            <ProtectedRoute role="Doctor">
              <DoctorAppointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/prescriptions"
          element={
            <ProtectedRoute role="Doctor">
              <DoctorPrescriptions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/lab-reports"
          element={
            <ProtectedRoute role="Doctor">
              <DoctorLabReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/billing"
          element={
            <ProtectedRoute role="Doctor">
              <DoctorBilling />
            </ProtectedRoute>
          }
        />

        {/* Patient */}
        <Route
          path="/patient"
          element={
            <ProtectedRoute role="Patient">
              <PatientOverview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/doctors"
          element={
            <ProtectedRoute role="Patient">
              <PatientDoctors />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/appointments"
          element={
            <ProtectedRoute role="Patient">
              <PatientAppointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/prescriptions"
          element={
            <ProtectedRoute role="Patient">
              <PatientPrescriptions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/lab-reports"
          element={
            <ProtectedRoute role="Patient">
              <PatientLabReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/billing"
          element={
            <ProtectedRoute role="Patient">
              <PatientBilling />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
}
