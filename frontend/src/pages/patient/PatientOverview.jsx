import { useEffect, useState } from "react";
import {
  LayoutDashboard, CalendarCheck, FileText, FlaskConical, Receipt, Stethoscope, CalendarClock, Search, Clock,
} from "lucide-react";
import DashboardShell from "../../components/DashboardShell.jsx";
import StatCard from "../../components/StatCard.jsx";
import GlassCard from "../../components/GlassCard.jsx";
import Loader from "../../components/Loader.jsx";
import { getPatientDashboard, resolveAssetUrl } from "../../lib/api.js";
import { toast } from "sonner";

export const patientNavItems = [
  { to: "/patient", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/patient/doctors", label: "Find Doctors", icon: Search },
  { to: "/patient/appointments", label: "Appointments", icon: CalendarCheck },
  { to: "/patient/prescriptions", label: "Prescriptions", icon: FileText },
  { to: "/patient/lab-reports", label: "Lab Reports", icon: FlaskConical },
  { to: "/patient/billing", label: "Billing", icon: Receipt },
];

export default function PatientOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPatientDashboard()
      .then((res) => setData(res.data.dashboard))
      .catch((err) => toast.error(err?.response?.data?.message || "Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardShell title="My Dashboard" navItems={patientNavItems}>
      {loading || !data ? (
        <Loader label="Loading dashboard" />
      ) : (
        <div className="space-y-6">
          {data.assignedDoctor && (
            <GlassCard className="flex items-center gap-4" hover={false}>
              <div className="h-12 w-12 rounded-xl overflow-hidden bg-accent/10 text-accent flex items-center justify-center shrink-0">
                {data.assignedDoctor.profileImage ? (
                  <img src={resolveAssetUrl(data.assignedDoctor.profileImage)} alt={data.assignedDoctor.fullName} className="h-full w-full object-cover" />
                ) : (
                  <Stethoscope size={22} />
                )}
              </div>
              <div>
                <p className="text-xs text-muted uppercase tracking-wide">Your Doctor</p>
                <p className="font-heading font-semibold">
                  Dr. {data.assignedDoctor.fullName} &middot; {data.assignedDoctor.department}
                </p>
              </div>
            </GlassCard>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <StatCard icon={CalendarClock} label="Upcoming Appointments" value={data.upcomingAppointments} delay={0} accent="cyan" />
            <StatCard icon={CalendarCheck} label="Total Appointments" value={data.totalAppointments} delay={0.05} />
            <StatCard icon={Clock} label="Pending Requests" value={data.pendingAppointmentRequests} delay={0.07} accent="warning" />
            <StatCard icon={FileText} label="Prescriptions" value={data.totalPrescriptions} delay={0.1} accent="cyan" />
            <StatCard icon={FlaskConical} label="Lab Reports" value={data.totalLabReports} delay={0.15} />
            <StatCard icon={Receipt} label="Pending Bills" value={data.pendingBills} delay={0.2} accent="warning" />
            <StatCard icon={Receipt} label="Paid Bills" value={data.paidBills} delay={0.25} accent="cyan" />
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
