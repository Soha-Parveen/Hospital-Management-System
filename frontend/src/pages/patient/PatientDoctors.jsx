import { useEffect, useState } from "react";
import { Search, Stethoscope, Star, GraduationCap, Briefcase, CalendarPlus } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import DashboardShell from "../../components/DashboardShell.jsx";
import GlassCard from "../../components/GlassCard.jsx";
import TiltCard from "../../components/TiltCard.jsx";
import Modal from "../../components/Modal.jsx";
import Loader from "../../components/Loader.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import { searchDoctors, requestAppointment, resolveAssetUrl } from "../../lib/api.js";
import { patientNavItems } from "./PatientOverview.jsx";

export default function PatientDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [activeDoctor, setActiveDoctor] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const form = useForm();

  const fetchDoctors = (search) => {
    setLoading(true);
    searchDoctors(search ? { search } : {})
      .then((res) => setDoctors(res.data.doctors))
      .catch((err) => toast.error(err?.response?.data?.message || "Failed to load doctors"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchDoctors(query), 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const openRequest = (doc) => {
    setActiveDoctor(doc);
    form.reset();
  };

  const onSubmitRequest = async (data) => {
    setSubmitting(true);
    try {
      await requestAppointment({ doctorId: activeDoctor._id, ...data });
      toast.success(`Request sent to Dr. ${activeDoctor.fullName}`);
      setActiveDoctor(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardShell title="Find Doctors" navItems={patientNavItems}>
      <div className="relative w-full sm:w-96 mb-6">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input
          className="input-field pl-11"
          placeholder="Search by name, department or qualification..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <Loader label="Finding doctors" />
      ) : doctors.length === 0 ? (
        <GlassCard hover={false}>
          <EmptyState icon={Stethoscope} title="No doctors found" subtitle="Try a different search term." />
        </GlassCard>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {doctors.map((doc, i) => (
            <motion.div key={doc._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <TiltCard max={6}>
                <GlassCard hover={false} className="h-full flex flex-col">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-16 w-16 rounded-2xl overflow-hidden bg-gradient-to-br from-accent/20 to-accent-cyan/20 text-accent flex items-center justify-center text-xl font-bold font-heading shrink-0">
                      {doc.profileImage ? (
                        <img src={resolveAssetUrl(doc.profileImage)} alt={doc.fullName} className="h-full w-full object-cover" />
                      ) : (
                        doc.fullName?.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-heading font-semibold truncate">Dr. {doc.fullName}</p>
                      <p className="text-xs text-accent">{doc.department}</p>
                      <div className="flex items-center gap-1 mt-1 text-warning">
                        {Array.from({ length: 5 }).map((_, s) => (
                          <Star key={s} size={11} fill={s < Math.round(doc.rating || 4.5) ? "currentColor" : "none"} strokeWidth={1.5} />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-muted mb-4 flex-1">
                    <p className="flex items-center gap-1.5"><GraduationCap size={13} /> {doc.qualification}</p>
                    <p className="flex items-center gap-1.5"><Briefcase size={13} /> {doc.experience} years experience</p>
                    <span
                      className={`inline-flex mt-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        doc.availability === "Available" ? "bg-accent/10 text-accent" : "bg-warning/10 text-warning"
                      }`}
                    >
                      {doc.availability || "Available"}
                    </span>
                  </div>

                  <button onClick={() => openRequest(doc)} className="btn-primary w-full !py-2.5 text-xs">
                    <CalendarPlus size={14} /> Request Appointment
                  </button>
                </GlassCard>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={!!activeDoctor} onClose={() => setActiveDoctor(null)} title={`Request Appointment with Dr. ${activeDoctor?.fullName || ""}`}>
        <form onSubmit={form.handleSubmit(onSubmitRequest)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field">Date</label>
              <input type="date" min={new Date().toISOString().split("T")[0]} className="input-field" {...form.register("appointmentDate", { required: true })} />
            </div>
            <div>
              <label className="label-field">Time</label>
              <input type="time" className="input-field" {...form.register("appointmentTime", { required: true })} />
            </div>
          </div>
          <div>
            <label className="label-field">Reason for visit</label>
            <textarea rows={3} className="input-field resize-none" placeholder="Briefly describe your symptoms or reason..." {...form.register("reason")} />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full mt-2">
            {submitting ? "Sending request..." : "Send Request"}
          </button>
          <p className="text-xs text-muted text-center">The doctor will be notified and can accept or decline your request.</p>
        </form>
      </Modal>
    </DashboardShell>
  );
}
