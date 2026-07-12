import { useEffect, useState } from "react";
import { Plus, CalendarCheck, Check, X, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import DashboardShell from "../../components/DashboardShell.jsx";
import GlassCard from "../../components/GlassCard.jsx";
import Modal from "../../components/Modal.jsx";
import Loader from "../../components/Loader.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import {
  getDoctorAppointments,
  createAppointment,
  updateAppointmentStatus,
  respondToAppointmentRequest,
  getMyPatients,
  resolveAssetUrl,
} from "../../lib/api.js";
import { doctorNavItems } from "./DoctorOverview.jsx";

const statusStyles = {
  Pending: "bg-warning/10 text-warning",
  Scheduled: "bg-accent-cyan/10 text-accent-cyan",
  Completed: "bg-accent/10 text-accent",
  Cancelled: "bg-danger/10 text-danger",
  Declined: "bg-danger/10 text-danger",
};

function Avatar({ patient }) {
  return (
    <div className="h-11 w-11 rounded-full overflow-hidden bg-accent-cyan/10 flex items-center justify-center text-accent-cyan font-semibold shrink-0">
      {patient?.profileImage ? (
        <img src={resolveAssetUrl(patient.profileImage)} alt={patient.fullName} className="h-full w-full object-cover" />
      ) : (
        patient?.fullName?.charAt(0).toUpperCase() || "?"
      )}
    </div>
  );
}

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [respondingId, setRespondingId] = useState(null);
  const form = useForm();

  const fetchAll = () => {
    setLoading(true);
    Promise.all([getDoctorAppointments(), getMyPatients()])
      .then(([apptRes, patRes]) => {
        setAppointments(apptRes.data.appointments);
        setPatients(patRes.data.patients);
      })
      .catch((err) => toast.error(err?.response?.data?.message || "Failed to load appointments"))
      .finally(() => setLoading(false));
  };

  useEffect(fetchAll, []);

  const onCreate = async (data) => {
    setSubmitting(true);
    try {
      await createAppointment(data);
      toast.success("Appointment created");
      setModalOpen(false);
      form.reset();
      fetchAll();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create appointment");
    } finally {
      setSubmitting(false);
    }
  };

  const onStatusChange = async (appt, status) => {
    try {
      await updateAppointmentStatus(appt._id, status);
      toast.success(`Marked as ${status}`);
      fetchAll();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update status");
    }
  };

  const onRespond = async (appt, action) => {
    setRespondingId(appt._id);
    try {
      await respondToAppointmentRequest(appt._id, action);
      toast.success(action === "accept" ? "Request accepted" : "Request declined");
      fetchAll();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to respond");
    } finally {
      setRespondingId(null);
    }
  };

  const pending = appointments.filter((a) => a.status === "Pending");
  const rest = appointments.filter((a) => a.status !== "Pending");

  return (
    <DashboardShell title="Appointments" navItems={doctorNavItems}>
      <div className="flex justify-end mb-6">
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ y: 0 }}
          className="btn-primary"
          onClick={() => {
            form.reset();
            setModalOpen(true);
          }}
        >
          <Plus size={16} /> New Appointment
        </motion.button>
      </div>

      {loading ? (
        <Loader label="Loading appointments" />
      ) : appointments.length === 0 ? (
        <GlassCard hover={false}>
          <EmptyState icon={CalendarCheck} title="No appointments yet" subtitle="Schedule your first patient appointment." />
        </GlassCard>
      ) : (
        <div className="space-y-8">
          {pending.length > 0 && (
            <div>
              <h3 className="font-heading font-semibold mb-3 flex items-center gap-2 text-warning">
                <Clock size={16} /> Pending Requests ({pending.length})
              </h3>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                <AnimatePresence>
                  {pending.map((a) => (
                    <motion.div
                      key={a._id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      <GlassCard className="border-warning/30">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Avatar patient={a.patient} />
                            <div>
                              <p className="font-heading font-semibold">{a.patient?.fullName}</p>
                              <p className="text-xs text-muted mt-0.5">{a.patient?.phone}</p>
                            </div>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[a.status]}`}>
                            {a.status}
                          </span>
                        </div>
                        <div className="text-sm text-muted space-y-1 mb-4">
                          <p className="font-mono-num">{new Date(a.appointmentDate).toLocaleDateString()} &middot; {a.appointmentTime}</p>
                          {a.reason && <p className="text-xs italic">&ldquo;{a.reason}&rdquo;</p>}
                        </div>
                        <div className="flex gap-2">
                          <button
                            disabled={respondingId === a._id}
                            onClick={() => onRespond(a, "accept")}
                            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium rounded-lg py-2 bg-accent/10 text-accent hover:bg-accent/20 transition disabled:opacity-50"
                          >
                            <Check size={13} /> Accept
                          </button>
                          <button
                            disabled={respondingId === a._id}
                            onClick={() => onRespond(a, "decline")}
                            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium rounded-lg py-2 bg-danger/10 text-danger hover:bg-danger/20 transition disabled:opacity-50"
                          >
                            <X size={13} /> Decline
                          </button>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          <div>
            {pending.length > 0 && <h3 className="font-heading font-semibold mb-3">All Appointments</h3>}
            {rest.length === 0 ? (
              <GlassCard hover={false}>
                <EmptyState icon={CalendarCheck} title="Nothing scheduled" subtitle="Confirmed appointments will appear here." />
              </GlassCard>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                {rest.map((a, i) => (
                  <GlassCard key={a._id} delay={i * 0.04}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar patient={a.patient} />
                        <div>
                          <p className="font-heading font-semibold">{a.patient?.fullName}</p>
                          <p className="text-xs text-muted mt-0.5">{a.patient?.phone}</p>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[a.status]}`}>
                        {a.status}
                      </span>
                    </div>
                    <div className="text-sm text-muted space-y-1 mb-4">
                      <p className="font-mono-num">{new Date(a.appointmentDate).toLocaleDateString()} &middot; {a.appointmentTime}</p>
                      {a.remarks && <p className="text-xs italic">{a.remarks}</p>}
                    </div>
                    {a.status === "Scheduled" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => onStatusChange(a, "Completed")}
                          className="flex-1 text-xs font-medium rounded-lg py-2 bg-accent/10 text-accent hover:bg-accent/20 transition"
                        >
                          Mark Completed
                        </button>
                        <button
                          onClick={() => onStatusChange(a, "Cancelled")}
                          className="flex-1 text-xs font-medium rounded-lg py-2 bg-danger/10 text-danger hover:bg-danger/20 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </GlassCard>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Appointment">
        <form onSubmit={form.handleSubmit(onCreate)} className="space-y-4">
          <div>
            <label className="label-field">Patient</label>
            <select className="input-field" {...form.register("patientId", { required: true })}>
              <option value="" className="bg-surface">Select patient</option>
              {patients.map((p) => (
                <option key={p._id} value={p._id} className="bg-surface">{p.fullName}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field">Date</label>
              <input type="date" className="input-field" {...form.register("appointmentDate", { required: true })} />
            </div>
            <div>
              <label className="label-field">Time</label>
              <input type="time" className="input-field" {...form.register("appointmentTime", { required: true })} />
            </div>
          </div>
          <div>
            <label className="label-field">Remarks</label>
            <textarea rows={3} className="input-field resize-none" {...form.register("remarks")} />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full mt-2">
            {submitting ? "Creating..." : "Create Appointment"}
          </button>
        </form>
      </Modal>
    </DashboardShell>
  );
}
