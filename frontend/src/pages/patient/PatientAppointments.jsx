import { useEffect, useState } from "react";
import { CalendarCheck } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import DashboardShell from "../../components/DashboardShell.jsx";
import GlassCard from "../../components/GlassCard.jsx";
import Loader from "../../components/Loader.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import { getPatientAppointments, resolveAssetUrl } from "../../lib/api.js";
import { patientNavItems } from "./PatientOverview.jsx";

const statusStyles = {
  Pending: "bg-warning/10 text-warning",
  Scheduled: "bg-accent-cyan/10 text-accent-cyan",
  Completed: "bg-accent/10 text-accent",
  Cancelled: "bg-danger/10 text-danger",
  Declined: "bg-danger/10 text-danger",
};

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPatientAppointments()
      .then((res) => setAppointments(res.data.appointments))
      .catch((err) => toast.error(err?.response?.data?.message || "Failed to load appointments"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardShell title="My Appointments" navItems={patientNavItems}>
      {loading ? (
        <Loader label="Loading appointments" />
      ) : appointments.length === 0 ? (
        <GlassCard hover={false}>
          <EmptyState icon={CalendarCheck} title="No appointments yet" subtitle="Your doctor will schedule appointments here." />
        </GlassCard>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {appointments.map((a, i) => (
            <GlassCard key={a._id} delay={i * 0.04}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-full overflow-hidden bg-accent/10 text-accent flex items-center justify-center font-semibold shrink-0">
                    {a.doctor?.profileImage ? (
                      <img src={resolveAssetUrl(a.doctor.profileImage)} alt={a.doctor.fullName} className="h-full w-full object-cover" />
                    ) : (
                      a.doctor?.fullName?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <p className="font-heading font-semibold">Dr. {a.doctor?.fullName}</p>
                    <p className="text-xs text-muted mt-0.5">{a.doctor?.department}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${statusStyles[a.status]}`}>
                  {a.status}
                </span>
              </div>
              <p className="text-sm text-muted font-mono-num">
                {new Date(a.appointmentDate).toLocaleDateString()} &middot; {a.appointmentTime}
              </p>
              {a.reason && <p className="text-xs text-muted italic mt-2">&ldquo;{a.reason}&rdquo;</p>}
              {a.remarks && <p className="text-xs text-muted italic mt-2">{a.remarks}</p>}
            </GlassCard>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
