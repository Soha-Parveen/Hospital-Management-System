import { useEffect, useState } from "react";
import {
  LayoutDashboard, Users, CalendarCheck, FileText, FlaskConical, Receipt, CalendarClock, Bell,
} from "lucide-react";
import DashboardShell from "../../components/DashboardShell.jsx";
import StatCard from "../../components/StatCard.jsx";
import Loader from "../../components/Loader.jsx";
import { getDoctorDashboard } from "../../lib/api.js";
import { toast } from "sonner";

export const doctorNavItems = [
  { to: "/doctor", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/doctor/patients", label: "Patients", icon: Users },
  { to: "/doctor/appointments", label: "Appointments", icon: CalendarCheck },
  { to: "/doctor/prescriptions", label: "Prescriptions", icon: FileText },
  { to: "/doctor/lab-reports", label: "Lab Reports", icon: FlaskConical },
  { to: "/doctor/billing", label: "Billing", icon: Receipt },
];

export default function DoctorOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDoctorDashboard()
      .then((res) => setData(res.data.dashboard))
      .catch((err) => toast.error(err?.response?.data?.message || "Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardShell title="Doctor Overview" navItems={doctorNavItems}>
      {loading || !data ? (
        <Loader label="Loading dashboard" />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <StatCard icon={Users} label="My Patients" value={data.totalPatients} delay={0} />
          <StatCard icon={CalendarClock} label="Today's Appointments" value={data.todaysAppointments} delay={0.05} accent="cyan" />
          <StatCard icon={CalendarCheck} label="Total Appointments" value={data.totalAppointments} delay={0.1} />
          <StatCard icon={Bell} label="Pending Requests" value={data.pendingRequests} delay={0.12} accent="cyan" />
          <StatCard icon={FileText} label="Prescriptions Issued" value={data.totalPrescriptions} delay={0.15} accent="cyan" />
          <StatCard icon={FlaskConical} label="Lab Reports Uploaded" value={data.totalLabReports} delay={0.2} />
          <StatCard icon={Receipt} label="Bills Generated" value={data.totalBills} delay={0.25} accent="cyan" />
        </div>
      )}
    </DashboardShell>
  );
}
