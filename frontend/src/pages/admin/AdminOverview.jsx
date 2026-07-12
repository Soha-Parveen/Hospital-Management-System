import { useEffect, useState } from "react";
import { LayoutDashboard, Stethoscope, Users, CalendarCheck, FileText, FlaskConical, Receipt, IndianRupee } from "lucide-react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import DashboardShell from "../../components/DashboardShell.jsx";
import StatCard from "../../components/StatCard.jsx";
import GlassCard from "../../components/GlassCard.jsx";
import Loader from "../../components/Loader.jsx";
import { getAdminDashboard } from "../../lib/api.js";
import { toast } from "sonner";

const navItems = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/doctors", label: "Doctors", icon: Stethoscope },
];

export default function AdminOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminDashboard()
      .then((res) => setData(res.data.dashboard))
      .catch((err) => toast.error(err?.response?.data?.message || "Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  const chartData = data
    ? [
        { name: "Doctors", value: data.totalDoctors },
        { name: "Patients", value: data.totalPatients },
        { name: "Appts", value: data.totalAppointments },
        { name: "Rx", value: data.totalPrescriptions },
        { name: "Labs", value: data.totalLabReports },
        { name: "Bills", value: data.totalBills },
      ]
    : [];

  return (
    <DashboardShell title="Admin Overview" navItems={navItems}>
      {loading || !data ? (
        <Loader label="Loading dashboard" />
      ) : (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard icon={Stethoscope} label="Total Doctors" value={data.totalDoctors} delay={0} />
            <StatCard icon={Users} label="Total Patients" value={data.totalPatients} delay={0.05} accent="cyan" />
            <StatCard icon={CalendarCheck} label="Appointments" value={data.totalAppointments} delay={0.1} />
            <StatCard icon={IndianRupee} label="Total Revenue" value={data.totalRevenue} prefix="₹" delay={0.15} accent="cyan" />
            <StatCard icon={FileText} label="Prescriptions" value={data.totalPrescriptions} delay={0.2} />
            <StatCard icon={FlaskConical} label="Lab Reports" value={data.totalLabReports} delay={0.25} accent="cyan" />
            <StatCard icon={Receipt} label="Bills Generated" value={data.totalBills} delay={0.3} />
          </div>

          <GlassCard delay={0.35} hover={false} className="p-6">
            <h3 className="font-heading font-semibold mb-6">System Activity</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(17,24,39,0.95)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="value" fill="#10B981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>
        </div>
      )}
    </DashboardShell>
  );
}
