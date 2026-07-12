import { useEffect, useState } from "react";
import { Plus, Trash2, FileText, Pill } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import DashboardShell from "../../components/DashboardShell.jsx";
import GlassCard from "../../components/GlassCard.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import { createPrescription, getMyPatients } from "../../lib/api.js";
import { doctorNavItems } from "./DoctorOverview.jsx";

export default function DoctorPrescriptions() {
  const [patients, setPatients] = useState([]);
  const [issued, setIssued] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const { register, control, handleSubmit, reset } = useForm({
    defaultValues: {
      patientId: "",
      medicines: [{ medicineName: "", dosage: "", duration: "" }],
      dietAdvice: "",
      notes: "",
    },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "medicines" });

  useEffect(() => {
    getMyPatients()
      .then((res) => setPatients(res.data.patients))
      .catch((err) => toast.error(err?.response?.data?.message || "Failed to load patients"));
  }, []);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const res = await createPrescription(data);
      const patientName = patients.find((p) => p._id === data.patientId)?.fullName || "Patient";
      setIssued((prev) => [{ ...res.data.prescription, patientName }, ...prev]);
      toast.success("Prescription issued successfully");
      reset({
        patientId: "",
        medicines: [{ medicineName: "", dosage: "", duration: "" }],
        dietAdvice: "",
        notes: "",
      });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to issue prescription");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardShell title="Prescriptions" navItems={doctorNavItems}>
      <div className="grid lg:grid-cols-5 gap-6">
        <GlassCard className="lg:col-span-3" hover={false}>
          <h3 className="font-heading font-semibold mb-5">Issue Prescription</h3>
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

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="label-field mb-0">Medicines</label>
                <button
                  type="button"
                  onClick={() => append({ medicineName: "", dosage: "", duration: "" })}
                  className="text-xs text-accent flex items-center gap-1 hover:underline"
                >
                  <Plus size={14} /> Add medicine
                </button>
              </div>
              <div className="space-y-3">
                <AnimatePresence initial={false}>
                  {fields.map((field, index) => (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center"
                    >
                      <input
                        className="input-field"
                        placeholder="Medicine"
                        {...register(`medicines.${index}.medicineName`, { required: true })}
                      />
                      <input
                        className="input-field"
                        placeholder="Dosage"
                        {...register(`medicines.${index}.dosage`, { required: true })}
                      />
                      <input
                        className="input-field"
                        placeholder="Duration"
                        {...register(`medicines.${index}.duration`, { required: true })}
                      />
                      <button
                        type="button"
                        onClick={() => fields.length > 1 && remove(index)}
                        className="h-10 w-10 flex items-center justify-center rounded-lg text-muted hover:text-danger hover:bg-danger/10 transition"
                      >
                        <Trash2 size={15} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <div>
              <label className="label-field">Diet Advice</label>
              <textarea rows={2} className="input-field resize-none" {...register("dietAdvice")} />
            </div>
            <div>
              <label className="label-field">Notes</label>
              <textarea rows={2} className="input-field resize-none" {...register("notes")} />
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? "Issuing..." : "Issue Prescription"}
            </button>
          </form>
        </GlassCard>

        <GlassCard className="lg:col-span-2" hover={false}>
          <h3 className="font-heading font-semibold mb-5">Issued This Session</h3>
          {issued.length === 0 ? (
            <EmptyState icon={FileText} title="Nothing issued yet" subtitle="Prescriptions you create will appear here." />
          ) : (
            <div className="space-y-4">
              {issued.map((rx, i) => (
                <motion.div
                  key={rx._id || i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-xl border border-glassBorder p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Pill size={14} className="text-accent" />
                    <p className="font-medium text-sm">{rx.patientName}</p>
                  </div>
                  <ul className="text-xs text-muted space-y-1">
                    {rx.medicines?.map((m, j) => (
                      <li key={j}>{m.medicineName} &middot; {m.dosage} &middot; {m.duration}</li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </DashboardShell>
  );
}
