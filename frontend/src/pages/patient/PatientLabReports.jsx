import { useEffect, useState } from "react";
import { FlaskConical, Download } from "lucide-react";
import { toast } from "sonner";
import DashboardShell from "../../components/DashboardShell.jsx";
import GlassCard from "../../components/GlassCard.jsx";
import Loader from "../../components/Loader.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import { getPatientLabReports } from "../../lib/api.js";
import { patientNavItems } from "./PatientOverview.jsx";

export default function PatientLabReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPatientLabReports()
      .then((res) => setReports(res.data.reports))
      .catch((err) => toast.error(err?.response?.data?.message || "Failed to load lab reports"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardShell title="My Lab Reports" navItems={patientNavItems}>
      {loading ? (
        <Loader label="Loading lab reports" />
      ) : reports.length === 0 ? (
        <GlassCard hover={false}>
          <EmptyState icon={FlaskConical} title="No lab reports yet" subtitle="Reports uploaded by your doctor will appear here." />
        </GlassCard>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {reports.map((r, i) => (
            <GlassCard key={r._id} delay={i * 0.04}>
              <div className="h-10 w-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-3">
                <FlaskConical size={18} />
              </div>
              <p className="font-heading font-semibold">{r.reportType}</p>
              <p className="text-xs text-muted mt-1">Dr. {r.doctor?.fullName} &middot; {r.doctor?.department}</p>
              <p className="text-xs text-muted font-mono-num mt-1">
                {new Date(r.createdAt).toLocaleDateString()}
              </p>
              {r.remarks && <p className="text-xs text-muted italic mt-2">{r.remarks}</p>}
              <a
                href={`/uploads/reports/${r.reportFile}`}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-accent hover:underline"
              >
                <Download size={14} /> View file
              </a>
            </GlassCard>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
