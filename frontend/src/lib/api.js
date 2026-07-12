import axios from "axios";

// Vite dev server proxies /api and /uploads to the Express backend (see vite.config.js).
// In production, set VITE_API_URL to the deployed backend origin.
const baseURL = import.meta.env.VITE_API_URL || "";

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("hms_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("hms_token");
      localStorage.removeItem("hms_role");
      localStorage.removeItem("hms_name");
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

// Turns a plain object into FormData — used whenever a profile image file
// might be attached alongside regular fields.
const toFormData = (payload) => {
  const formData = new FormData();
  Object.entries(payload || {}).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    formData.append(key, value);
  });
  return formData;
};

const multipart = { headers: { "Content-Type": "multipart/form-data" } };

// Resolves a relative /uploads/... path returned by the backend into a
// fully-qualified URL when the frontend is served from a different origin
// than the API (e.g. in production). In dev, Vite proxies /uploads so a
// relative path already works.
export const resolveAssetUrl = (path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${baseURL}${path}`;
};

// ---------- Auth ----------
export const login = (email, password) =>
  api.post("/api/auth/login", { email, password });

// ---------- Admin ----------
// `payload` may include a `profileImage` File — if present we send multipart,
// otherwise a plain JSON post (keeps things fast when no photo is chosen).
export const addDoctor = (payload) =>
  payload?.profileImage instanceof File
    ? api.post("/api/admin/add-doctor", toFormData(payload), multipart)
    : api.post("/api/admin/add-doctor", payload);

export const getAllDoctors = () => api.get("/api/admin/doctors");

export const updateDoctor = (id, payload) =>
  payload?.profileImage instanceof File
    ? api.put(`/api/admin/doctor/${id}`, toFormData(payload), multipart)
    : api.put(`/api/admin/doctor/${id}`, payload);

export const deleteDoctor = (id) => api.delete(`/api/admin/doctor/${id}`);
export const getAdminDashboard = () => api.get("/api/admin/dashboard");

// ---------- Doctor ----------
export const addPatient = (payload) =>
  payload?.profileImage instanceof File
    ? api.post("/api/doctor/add-patient", toFormData(payload), multipart)
    : api.post("/api/doctor/add-patient", payload);

export const getMyPatients = () => api.get("/api/doctor/patients");

export const updatePatient = (id, payload) =>
  payload?.profileImage instanceof File
    ? api.put(`/api/doctor/patient/${id}`, toFormData(payload), multipart)
    : api.put(`/api/doctor/patient/${id}`, payload);

export const deletePatient = (id) => api.delete(`/api/doctor/patient/${id}`);
export const getDoctorDashboard = () => api.get("/api/doctor/dashboard");

// Doctor directory — searchable by any logged-in role (Patient, Doctor, Admin)
export const searchDoctors = (params) => api.get("/api/doctor/public", { params });

// ---------- Appointments ----------
export const createAppointment = (payload) => api.post("/api/appointments/create", payload);
export const requestAppointment = (payload) => api.post("/api/appointments/request", payload);
export const respondToAppointmentRequest = (id, action) =>
  api.put(`/api/appointments/${id}/respond`, { action });
export const getDoctorAppointments = () => api.get("/api/appointments/my-appointments");
export const updateAppointmentStatus = (id, status) =>
  api.put(`/api/appointments/${id}/status`, { status });

// ---------- Prescriptions ----------
export const createPrescription = (payload) => api.post("/api/prescriptions/create", payload);

// ---------- Lab Reports ----------
export const uploadLabReport = (formData) =>
  api.post("/api/lab-reports/upload", formData, multipart);

// ---------- Billing ----------
export const createBill = (payload) => api.post("/api/billing/create", payload);
export const payBill = (id) => api.put(`/api/billing/pay/${id}`);

// ---------- Patient ----------
export const getMyProfile = () => api.get("/api/patient/profile");
export const getPatientAppointments = () => api.get("/api/patient/appointments");
export const getPatientPrescriptions = () => api.get("/api/patient/prescriptions");
export const getPatientLabReports = () => api.get("/api/patient/lab-reports");
export const getPatientBills = () => api.get("/api/patient/bills");
export const getPatientDashboard = () => api.get("/api/patient/dashboard");

// ---------- Notifications ----------
export const getMyNotifications = () => api.get("/api/notifications");
export const markNotificationRead = (id) => api.put(`/api/notifications/${id}/read`);
export const markAllNotificationsRead = () => api.put("/api/notifications/read-all");

export default api;
