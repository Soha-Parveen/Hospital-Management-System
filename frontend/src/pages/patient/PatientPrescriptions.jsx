import { useEffect, useState } from "react";
import { FileText, Pill } from "lucide-react";
import { toast } from "sonner";
import DashboardShell from "../../components/DashboardShell.jsx";
import GlassCard from "../../components/GlassCard.jsx";
import Loader from "../../components/Loader.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import { getPatientPrescriptions } from "../../lib/api.js";
import { patientNavItems } from "./PatientOverview.jsx";

export default function PatientPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPatientPrescriptions()
      .then((res) => setPrescriptions(res.data.prescriptions))
      .catch((err) => toast.error(err?.response?.data?.message || "Failed to load prescriptions"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardShell title="My Prescriptions" navItems={patientNavItems}>
      {loading ? (
        <Loader label="Loading prescriptions" />
      ) : prescriptions.length === 0 ? (
        <GlassCard hover={false}>
          <EmptyState icon={FileText} title="No prescriptions yet" subtitle="Prescriptions from your doctor will appear here." />
        </GlassCard>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {prescriptions.map((rx, i) => (
            <GlassCard key={rx._id} delay={i * 0.05}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-heading font-semibold">Dr. {rx.doctor?.fullName}</p>
                  <p className="text-xs text-muted">{rx.doctor?.department}</p>
                </div>
                <p className="text-xs text-muted font-mono-num">
                  {new Date(rx.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="space-y-2 mb-3">
                {rx.medicines?.map((m, j) => (
                  <div key={j} className="flex items-center gap-2 text-sm rounded-lg bg-fg/5 px-3 py-2">
                    <Pill size={14} className="text-accent shrink-0" />
                    <span className="font-medium">{m.medicineName}</span>
                    <span className="text-muted text-xs ml-auto">{m.dosage} &middot; {m.duration}</span>
                  </div>
                ))}
              </div>
              {rx.dietPlan && (
                <p className="text-xs text-muted"><span className="text-fg/70 font-medium">Diet: </span>{rx.dietPlan}</p>
              )}
              {rx.notes && (
                <p className="text-xs text-muted mt-1"><span className="text-fg/70 font-medium">Notes: </span>{rx.notes}</p>
              )}
            </GlassCard>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
