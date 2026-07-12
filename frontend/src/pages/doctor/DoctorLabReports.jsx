import { useEffect, useState, useRef } from "react";
import { UploadCloud, FlaskConical, CheckCircle2, File as FileIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import DashboardShell from "../../components/DashboardShell.jsx";
import GlassCard from "../../components/GlassCard.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import { uploadLabReport, getMyPatients } from "../../lib/api.js";
import { doctorNavItems } from "./DoctorOverview.jsx";

const reportTypes = ["Blood Test", "Urine Test", "X-Ray", "CT Scan", "MRI", "ECG", "Ultrasound", "Other"];

export default function DoctorLabReports() {
  const [patients, setPatients] = useState([]);
  const [uploaded, setUploaded] = useState([]);
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef(null);

  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: { reportType: "Blood Test" },
  });

  useEffect(() => {
    getMyPatients()
      .then((res) => setPatients(res.data.patients))
      .catch((err) => toast.error(err?.response?.data?.message || "Failed to load patients"));
  }, []);

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
  };

  const onSubmit = async (data) => {
    if (!file) {
      toast.error("Please attach a report file");
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => formData.append(k, v));
      formData.append("reportFile", file);

      const res = await uploadLabReport(formData);
      const patientName = patients.find((p) => p._id === data.patientId)?.fullName || "Patient";
      setUploaded((prev) => [{ ...res.data.report, patientName, fileName: file.name }, ...prev]);
      toast.success("Lab report uploaded successfully");
      reset({ reportType: "Blood Test" });
      setFile(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to upload report");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardShell title="Lab Reports" navItems={doctorNavItems}>
      <div className="grid lg:grid-cols-5 gap-6">
        <GlassCard className="lg:col-span-3" hover={false}>
          <h3 className="font-heading font-semibold mb-5">Upload Report</h3>
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-field">Report Title</label>
                <input className="input-field" {...register("reportTitle", { required: true })} />
              </div>
              <div>
                <label className="label-field">Report Type</label>
                <select className="input-field" {...register("reportType", { required: true })}>
                  {reportTypes.map((t) => (
                    <option key={t} value={t} className="bg-surface">{t}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="label-field">Report Date</label>
              <input type="date" className="input-field" {...register("reportDate", { required: true })} />
            </div>
            <div>
              <label className="label-field">Remarks</label>
              <textarea rows={2} className="input-field resize-none" {...register("remarks")} />
            </div>

            <div>
              <label className="label-field">Report File</label>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                onClick={() => inputRef.current?.click()}
                className={`rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-300 ${
                  dragOver ? "border-accent bg-accent/5 shadow-glow" : "border-fg/10 hover:border-fg/20"
                }`}
              >
                <input
                  ref={inputRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <AnimatePresence mode="wait">
                  {file ? (
                    <motion.div
                      key="file"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center gap-2"
                    >
                      <CheckCircle2 size={26} className="text-accent" />
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted">Click or drop to replace</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center gap-2"
                    >
                      <UploadCloud size={26} className="text-muted" />
                      <p className="text-sm text-muted">Drag & drop or click to attach a file</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? "Uploading..." : "Upload Report"}
            </button>
          </form>
        </GlassCard>

        <GlassCard className="lg:col-span-2" hover={false}>
          <h3 className="font-heading font-semibold mb-5">Uploaded This Session</h3>
          {uploaded.length === 0 ? (
            <EmptyState icon={FlaskConical} title="No uploads yet" subtitle="Reports you upload will appear here." />
          ) : (
            <div className="space-y-3">
              {uploaded.map((r, i) => (
                <motion.div
                  key={r._id || i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-xl border border-glassBorder p-4 flex items-center gap-3"
                >
                  <div className="h-9 w-9 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0">
                    <FileIcon size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{r.patientName}</p>
                    <p className="text-xs text-muted truncate">{r.reportType} &middot; {r.fileName}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </DashboardShell>
  );
}
