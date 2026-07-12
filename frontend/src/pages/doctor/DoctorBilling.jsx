import { useEffect, useState } from "react";
import { Receipt, IndianRupee } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import DashboardShell from "../../components/DashboardShell.jsx";
import GlassCard from "../../components/GlassCard.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import { createBill, getMyPatients } from "../../lib/api.js";
import { doctorNavItems } from "./DoctorOverview.jsx";

export default function DoctorBilling() {
  const [patients, setPatients] = useState([]);
  const [bills, setBills] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: { consultationFee: 0, medicineCharges: 0, labCharges: 0 },
  });

  const consultationFee = Number(watch("consultationFee")) || 0;
  const medicineCharges = Number(watch("medicineCharges")) || 0;
  const labCharges = Number(watch("labCharges")) || 0;
  const total = consultationFee + medicineCharges + labCharges;

  useEffect(() => {
    getMyPatients()
      .then((res) => setPatients(res.data.patients))
      .catch((err) => toast.error(err?.response?.data?.message || "Failed to load patients"));
  }, []);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const res = await createBill(data);
      const patientName = patients.find((p) => p._id === data.patientId)?.fullName || "Patient";
      setBills((prev) => [{ ...res.data.bill, patientName }, ...prev]);
      toast.success("Bill generated successfully");
      reset({ patientId: "", consultationFee: 0, medicineCharges: 0, labCharges: 0 });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to generate bill");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardShell title="Billing" navItems={doctorNavItems}>
      <div className="grid lg:grid-cols-5 gap-6">
        <GlassCard className="lg:col-span-3" hover={false}>
          <h3 className="font-heading font-semibold mb-5">Generate Bill</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="label-field">Patient</label>
              <select className="input-field" {...register("patientId", { required: true })}>
                <option value="" className="bg-surface">Select patient</option>
                {patients.map((p) => (
                  <option key={p._id} value={p._id} className="bg-surface">{p.fullName}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="label-field">Consultation Fee</label>
                <input type="number" className="input-field" {...register("consultationFee")} />
              </div>
              <div>
                <label className="label-field">Medicine Charges</label>
                <input type="number" className="input-field" {...register("medicineCharges")} />
              </div>
              <div>
                <label className="label-field">Lab Charges</label>
                <input type="number" className="input-field" {...register("labCharges")} />
              </div>
            </div>

            <div className="rounded-xl border border-accent/20 bg-accent/5 p-4 flex items-center justify-between">
              <span className="text-sm text-muted">Total Amount</span>
              <span className="font-mono-num font-bold text-xl text-accent">₹{total.toLocaleString()}</span>
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? "Generating..." : "Generate Bill"}
            </button>
          </form>
        </GlassCard>

        <GlassCard className="lg:col-span-2" hover={false}>
          <h3 className="font-heading font-semibold mb-5">Generated This Session</h3>
          {bills.length === 0 ? (
            <EmptyState icon={Receipt} title="No bills yet" subtitle="Bills you generate will appear here." />
          ) : (
            <div className="space-y-3">
              {bills.map((b, i) => (
                <motion.div
                  key={b._id || i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-xl border border-glassBorder p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium">{b.patientName}</p>
                    <p className="text-xs text-muted">{b.paymentStatus}</p>
                  </div>
                  <p className="font-mono-num font-semibold text-accent flex items-center gap-1">
                    <IndianRupee size={14} />{Number(b.totalAmount).toLocaleString()}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </DashboardShell>
  );
}
