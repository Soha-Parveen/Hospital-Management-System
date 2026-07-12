import { useEffect, useState } from "react";
import { LayoutDashboard, Stethoscope, Plus, Pencil, Trash2, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import DashboardShell from "../../components/DashboardShell.jsx";
import GlassCard from "../../components/GlassCard.jsx";
import Modal from "../../components/Modal.jsx";
import Loader from "../../components/Loader.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import { getAllDoctors, addDoctor, updateDoctor, deleteDoctor, resolveAssetUrl } from "../../lib/api.js";
import ImageUploadField from "../../components/ImageUploadField.jsx";

const navItems = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/doctors", label: "Doctors", icon: Stethoscope },
];

const departments = [
  "General Medicine", "Cardiology", "Orthopedics", "Neurology", "Pediatrics",
  "Dermatology", "ENT", "Gynecology", "Ophthalmology", "Dentistry",
];

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(null); // 'add' | 'edit' | null
  const [activeDoctor, setActiveDoctor] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [addPhoto, setAddPhoto] = useState(null);
  const [editPhoto, setEditPhoto] = useState(null);

  const addForm = useForm();
  const editForm = useForm();

  const fetchDoctors = () => {
    setLoading(true);
    getAllDoctors()
      .then((res) => setDoctors(res.data.doctors))
      .catch((err) => toast.error(err?.response?.data?.message || "Failed to load doctors"))
      .finally(() => setLoading(false));
  };

  useEffect(fetchDoctors, []);

  const onAdd = async (data) => {
    setSubmitting(true);
    try {
      await addDoctor({ ...data, experience: Number(data.experience), profileImage: addPhoto || undefined });
      toast.success("Doctor added successfully");
      setModal(null);
      addForm.reset();
      setAddPhoto(null);
      fetchDoctors();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add doctor");
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = (doc) => {
    setActiveDoctor(doc);
    editForm.reset({
      fullName: doc.fullName,
      phone: doc.phone,
      department: doc.department,
      qualification: doc.qualification,
      experience: doc.experience,
      availability: doc.availability,
    });
    setEditPhoto(null);
    setModal("edit");
  };

  const onEdit = async (data) => {
    setSubmitting(true);
    try {
      await updateDoctor(activeDoctor._id, { ...data, experience: Number(data.experience), profileImage: editPhoto || undefined });
      toast.success("Doctor updated successfully");
      setModal(null);
      fetchDoctors();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update doctor");
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async (doc) => {
    if (!confirm(`Remove Dr. ${doc.fullName}? This will also delete their login.`)) return;
    try {
      await deleteDoctor(doc._id);
      toast.success("Doctor removed");
      fetchDoctors();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to remove doctor");
    }
  };

  const filtered = doctors.filter((d) =>
    d.fullName.toLowerCase().includes(query.toLowerCase()) ||
    d.department.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <DashboardShell title="Doctors" navItems={navItems}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            className="input-field pl-11"
            placeholder="Search doctors..."
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
          <Plus size={16} /> Add Doctor
        </motion.button>
      </div>

      {loading ? (
        <Loader label="Loading doctors" />
      ) : filtered.length === 0 ? (
        <GlassCard hover={false}>
          <EmptyState icon={Stethoscope} title="No doctors found" subtitle="Add your first doctor to get started." />
        </GlassCard>
      ) : (
        <GlassCard hover={false} className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-glassBorder text-muted text-xs uppercase tracking-wide">
                  <th className="text-left px-6 py-4 font-medium">Photo</th>
                  <th className="text-left px-6 py-4 font-medium">Name</th>
                  <th className="text-left px-6 py-4 font-medium">Department</th>
                  <th className="text-left px-6 py-4 font-medium">Email</th>
                  <th className="text-left px-6 py-4 font-medium">Experience</th>
                  <th className="text-left px-6 py-4 font-medium">Status</th>
                  <th className="text-right px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((doc, i) => (
                  <motion.tr
                    key={doc._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-glassBorder/50 hover:bg-fg/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="h-10 w-10 rounded-full overflow-hidden bg-accent/10 flex items-center justify-center text-accent font-semibold shrink-0">
                        {doc.profileImage ? (
                          <img src={resolveAssetUrl(doc.profileImage)} alt={doc.fullName} className="h-full w-full object-cover" />
                        ) : (
                          doc.fullName?.charAt(0).toUpperCase()
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">Dr. {doc.fullName}</td>
                    <td className="px-6 py-4 text-muted">{doc.department}</td>
                    <td className="px-6 py-4 text-muted">{doc.user?.email}</td>
                    <td className="px-6 py-4 font-mono-num text-muted">{doc.experience} yrs</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          doc.availability === "Available"
                            ? "bg-accent/10 text-accent"
                            : "bg-warning/10 text-warning"
                        }`}
                      >
                        {doc.availability}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(doc)}
                          className="h-8 w-8 flex items-center justify-center rounded-lg text-muted hover:text-accent hover:bg-accent/10 transition"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => onDelete(doc)}
                          className="h-8 w-8 flex items-center justify-center rounded-lg text-muted hover:text-danger hover:bg-danger/10 transition"
                        >
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

      {/* Add Doctor Modal */}
      <Modal open={modal === "add"} onClose={() => setModal(null)} title="Add Doctor">
        <form onSubmit={addForm.handleSubmit(onAdd)} className="space-y-4">
          <ImageUploadField label="Doctor Photo" onChange={setAddPhoto} />
          <div>
            <label className="label-field">Full Name</label>
            <input className="input-field" {...addForm.register("fullName", { required: true })} />
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field">Phone</label>
              <input className="input-field" {...addForm.register("phone", { required: true })} />
            </div>
            <div>
              <label className="label-field">Experience (yrs)</label>
              <input type="number" className="input-field" {...addForm.register("experience", { required: true })} />
            </div>
          </div>
          <div>
            <label className="label-field">Department</label>
            <select className="input-field" {...addForm.register("department", { required: true })}>
              {departments.map((d) => (
                <option key={d} value={d} className="bg-surface">{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-field">Qualification</label>
            <input className="input-field" {...addForm.register("qualification", { required: true })} />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full mt-2">
            {submitting ? "Adding..." : "Add Doctor"}
          </button>
        </form>
      </Modal>

      {/* Edit Doctor Modal */}
      <Modal open={modal === "edit"} onClose={() => setModal(null)} title={`Edit Dr. ${activeDoctor?.fullName || ""}`}>
        <form onSubmit={editForm.handleSubmit(onEdit)} className="space-y-4">
          <ImageUploadField label="Doctor Photo" existingUrl={activeDoctor?.profileImage} onChange={setEditPhoto} />
          <div>
            <label className="label-field">Full Name</label>
            <input className="input-field" {...editForm.register("fullName", { required: true })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field">Phone</label>
              <input className="input-field" {...editForm.register("phone", { required: true })} />
            </div>
            <div>
              <label className="label-field">Experience (yrs)</label>
              <input type="number" className="input-field" {...editForm.register("experience", { required: true })} />
            </div>
          </div>
          <div>
            <label className="label-field">Department</label>
            <select className="input-field" {...editForm.register("department", { required: true })}>
              {departments.map((d) => (
                <option key={d} value={d} className="bg-surface">{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-field">Qualification</label>
            <input className="input-field" {...editForm.register("qualification", { required: true })} />
          </div>
          <div>
            <label className="label-field">Availability</label>
            <select className="input-field" {...editForm.register("availability")}>
              <option value="Available" className="bg-surface">Available</option>
              <option value="Unavailable" className="bg-surface">Unavailable</option>
            </select>
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full mt-2">
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </Modal>
    </DashboardShell>
  );
}
