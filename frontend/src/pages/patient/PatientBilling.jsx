import { useEffect, useState } from "react";
import { Receipt, IndianRupee, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import DashboardShell from "../../components/DashboardShell.jsx";
import GlassCard from "../../components/GlassCard.jsx";
import Loader from "../../components/Loader.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import { getPatientBills, payBill } from "../../lib/api.js";
import { patientNavItems } from "./PatientOverview.jsx";

export default function PatientBilling() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);

  const fetchBills = () => {
    setLoading(true);
    getPatientBills()
      .then((res) => setBills(res.data.bills))
      .catch((err) => toast.error(err?.response?.data?.message || "Failed to load bills"))
      .finally(() => setLoading(false));
  };

  useEffect(fetchBills, []);

  const handlePay = async (id) => {
    setPayingId(id);
    try {
      await payBill(id);
      toast.success("Payment successful");
      fetchBills();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Payment failed");
    } finally {
      setPayingId(null);
    }
  };

  return (
    <DashboardShell title="My Bills" navItems={patientNavItems}>
      {loading ? (
        <Loader label="Loading bills" />
      ) : bills.length === 0 ? (
        <GlassCard hover={false}>
          <EmptyState icon={Receipt} title="No bills yet" subtitle="Bills from your doctor will appear here." />
        </GlassCard>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {bills.map((b, i) => (
            <GlassCard key={b._id} delay={i * 0.05}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-heading font-semibold">Dr. {b.doctor?.fullName}</p>
                  <p className="text-xs text-muted">{b.doctor?.department}</p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    b.paymentStatus === "Paid" ? "bg-accent/10 text-accent" : "bg-warning/10 text-warning"
                  }`}
                >
                  {b.paymentStatus}
                </span>
              </div>
              <div className="space-y-1.5 text-sm text-muted mb-4">
                <div className="flex justify-between"><span>Consultation</span><span className="font-mono-num">₹{b.consultationFee}</span></div>
                <div className="flex justify-between"><span>Medicines</span><span className="font-mono-num">₹{b.medicineCharges}</span></div>
                <div className="flex justify-between"><span>Lab Charges</span><span className="font-mono-num">₹{b.labCharges}</span></div>
                <div className="flex justify-between font-semibold text-fg pt-2 border-t border-glassBorder">
                  <span>Total</span>
                  <span className="font-mono-num flex items-center gap-1"><IndianRupee size={13} />{b.totalAmount}</span>
                </div>
              </div>
              {b.paymentStatus === "Pending" ? (
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                  disabled={payingId === b._id}
                  onClick={() => handlePay(b._id)}
                  className="btn-primary w-full"
                >
                  {payingId === b._id ? "Processing..." : "Pay Now"}
                </motion.button>
              ) : (
                <div className="flex items-center justify-center gap-2 text-accent text-sm font-medium py-2">
                  <CheckCircle2 size={16} /> Paid
                </div>
              )}
            </GlassCard>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
