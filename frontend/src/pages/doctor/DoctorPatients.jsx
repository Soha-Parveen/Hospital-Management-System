import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import DashboardShell from "../../components/DashboardShell.jsx";
import GlassCard from "../../components/GlassCard.jsx";
import Modal from "../../components/Modal.jsx";
import Loader from "../../components/Loader.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import { getMyPatients, addPatient, updatePatient, deletePatient, resolveAssetUrl } from "../../lib/api.js";
import ImageUploadField from "../../components/ImageUploadField.jsx";
import { doctorNavItems } from "./DoctorOverview.jsx";

export default function DoctorPatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(null);
  const [active, setActive] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [addPhoto, setAddPhoto] = useState(null);
  const [editPhoto, setEditPhoto] = useState(null);

  const addForm = useForm();
  const editForm = useForm();

  const fetchPatients = () => {
    setLoading(true);
    getMyPatients()
      .then((res) => setPatients(res.data.patients))
      .catch((err) => toast.error(err?.response?.data?.message || "Failed to load patients"))
      .finally(() => setLoading(false));
  };

  useEffect(fetchPatients, []);

  const onAdd = async (data) => {
    setSubmitting(true);
    try {
      await addPatient({ ...data, age: Number(data.age), profileImage: addPhoto || undefined });
      toast.success("Patient added successfully");
      setModal(null);
      addForm.reset();
      setAddPhoto(null);
      fetchPatients();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add patient");
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = (p) => {
    setActive(p);
    editForm.reset({
      fullName: p.fullName,
      age: p.age,
      gender: p.gender,
      phone: p.phone,
      address: p.address,
    });
    setEditPhoto(null);
    setModal("edit");
  };

  const onEdit = async (data) => {
    setSubmitting(true);
    try {
      await updatePatient(active._id, { ...data, age: Number(data.age), profileImage: editPhoto || undefined });
      toast.success("Patient updated successfully");
      setModal(null);
      fetchPatients();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update patient");
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async (p) => {
    if (!confirm(`Remove ${p.fullName} from your patient list?`)) return;
    try {
      await deletePatient(p._id);
      toast.success("Patient removed");
      fetchPatients();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to remove patient");
    }
  };

  const filtered = patients.filter((p) => p.fullName.toLowerCase().includes(query.toLowerCase()));

  return (
    <DashboardShell title="My Patients" navItems={doctorNavItems}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            className="input-field pl-11"
            placeholder="Search patients..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ y: 0 }}
          className="btn-primary shrink-0"
          onClick={() => {
            addForm.reset();
            setModal("add");
          }}
        >
          <Plus size={16} /> Add Patient
        </motion.button>
      </div>

      {loading ? (
        <Loader label="Loading patients" />
      ) : filtered.length === 0 ? (
        <GlassCard hover={false}>
          <EmptyState icon={Users} title="No patients yet" subtitle="Add a patient once they approach you for care." />
        </GlassCard>
      ) : (
        <GlassCard hover={false} className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-glassBorder text-muted text-xs uppercase tracking-wide">
                  <th className="text-left px-6 py-4 font-medium">Photo</th>
                  <th className="text-left px-6 py-4 font-medium">Name</th>
                  <th className="text-left px-6 py-4 font-medium">Age / Gender</th>
                  <th className="text-left px-6 py-4 font-medium">Phone</th>
                  <th className="text-left px-6 py-4 font-medium">Email</th>
                  <th className="text-right px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <motion.tr
                    key={p._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-glassBorder/50 hover:bg-fg/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="h-10 w-10 rounded-full overflow-hidden bg-accent-cyan/10 flex items-center justify-center text-accent-cyan font-semibold shrink-0">
                        {p.profileImage ? (
                          <img src={resolveAssetUrl(p.profileImage)} alt={p.fullName} className="h-full w-full object-cover" />
                        ) : (
                          p.fullName?.charAt(0).toUpperCase()
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">{p.fullName}</td>
                    <td className="px-6 py-4 text-muted font-mono-num">{p.age} / {p.gender}</td>
                    <td className="px-6 py-4 text-muted">{p.phone}</td>
                    <td className="px-6 py-4 text-muted">{p.user?.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(p)} className="h-8 w-8 flex items-center justify-center rounded-lg text-muted hover:text-accent hover:bg-accent/10 transition">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => onDelete(p)} className="h-8 w-8 flex items-center justify-center rounded-lg text-muted hover:text-danger hover:bg-danger/10 transition">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      <Modal open={modal === "add"} onClose={() => setModal(null)} title="Add Patient">
        <form onSubmit={addForm.handleSubmit(onAdd)} className="space-y-4">
          <ImageUploadField label="Patient Photo" onChange={setAddPhoto} />
          <div>
            <label className="label-field">Full Name</label>
            <input className="input-field" {...addForm.register("fullName", { required: true })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field">Age</label>
              <input type="number" className="input-field" {...addForm.register("age", { required: true })} />
            </div>
            <div>
              <label className="label-field">Gender</label>
              <select className="input-field" {...addForm.register("gender", { required: true })}>
                <option value="Male" className="bg-surface">Male</option>
                <option value="Female" className="bg-surface">Female</option>
                <option value="Other" className="bg-surface">Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label-field">Phone</label>
            <input className="input-field" {...addForm.register("phone", { required: true })} />
          </div>
          <div>
            <label className="label-field">Address</label>
            <input className="input-field" {...addForm.register("address", { required: true })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field">Email</label>
              <input type="email" className="input-field" {...addForm.register("email", { required: true })} />
            </div>
            <div>
              <label className="label-field">Password</label>
              <input type="password" className="input-field" {...addForm.register("password", { required: true })} />
            </div>
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full mt-2">
            {submitting ? "Adding..." : "Add Patient"}
          </button>
        </form>
      </Modal>

      <Modal open={modal === "edit"} onClose={() => setModal(null)} title={`Edit ${active?.fullName || ""}`}>
        <form onSubmit={editForm.handleSubmit(onEdit)} className="space-y-4">
          <ImageUploadField label="Patient Photo" existingUrl={active?.profileImage} onChange={setEditPhoto} />
          <div>
            <label className="label-field">Full Name</label>
            <input className="input-field" {...editForm.register("fullName", { required: true })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field">Age</label>
              <input type="number" className="input-field" {...editForm.register("age", { required: true })} />
            </div>
            <div>
              <label className="label-field">Gender</label>
              <select className="input-field" {...editForm.register("gender", { required: true })}>
                <option value="Male" className="bg-surface">Male</option>
                <option value="Female" className="bg-surface">Female</option>
                <option value="Other" className="bg-surface">Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label-field">Phone</label>
            <input className="input-field" {...editForm.register("phone", { required: true })} />
          </div>
          <div>
            <label className="label-field">Address</label>
            <input className="input-field" {...editForm.register("address", { required: true })} />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full mt-2">
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </Modal>
    </DashboardShell>
  );
}
