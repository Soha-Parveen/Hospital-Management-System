import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Activity, Mail, Lock, ArrowLeft } from "lucide-react";
import { login as loginApi } from "../lib/api";
import useAuthStore from "../store/authStore";

export default function Login() {
  const [phase, setPhase] = useState("form"); // form | loading | success
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setPhase("loading");
    try {
      const res = await loginApi(data.email, data.password);
      const { token, role, name } = res.data;
      setAuth({ token, role, name });
      setPhase("success");

      const dest = role === "Admin" ? "/admin" : role === "Doctor" ? "/doctor" : "/patient";
      setTimeout(() => navigate(dest), 650);
    } catch (err) {
      setPhase("form");
      toast.error(err?.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-bg text-fg flex items-center justify-center relative overflow-hidden px-4">
      {/* Animated ambient gradient background */}
      <motion.div
        className="fixed inset-0 -z-10 ambient-glow"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="fixed top-1/4 -left-24 w-80 h-80 bg-accent/15 rounded-full blur-[110px] -z-10 animate-floaty" />
      <div className="fixed bottom-1/4 -right-24 w-80 h-80 bg-accent-cyan/15 rounded-full blur-[110px] -z-10 animate-floaty" />

      <Link
        to="/"
        className="fixed top-6 left-6 flex items-center gap-2 text-sm text-muted hover:text-fg transition-colors"
      >
        <ArrowLeft size={16} /> Back to site
      </Link>

      <motion.div
        layout
        animate={{
          scale: phase === "loading" ? 0.92 : 1,
          opacity: phase === "loading" ? 0.85 : 1,
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card w-full max-w-md p-8 relative"
      >
        <AnimatePresence mode="wait">
          {phase !== "loading" && phase !== "success" && (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex flex-col items-center mb-8">
                <div className="h-12 w-12 rounded-2xl bg-accent/15 text-accent flex items-center justify-center shadow-glow mb-4">
                  <Activity size={22} strokeWidth={2} />
                </div>
                <h1 className="font-heading font-bold text-xl">Welcome back</h1>
                <p className="text-sm text-muted mt-1">
                  Sign in as Admin, Doctor, or Patient
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="label-field">Email</label>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                    />
                    <input
                      type="email"
                      className="input-field pl-11"
                      placeholder="you@quantum.example"
                      {...register("email", { required: true })}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-danger text-xs mt-1">Email is required</p>
                  )}
                </div>

                <div>
                  <label className="label-field">Password</label>
                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                    />
                    <input
                      type="password"
                      className="input-field pl-11"
                      placeholder="••••••••"
                      {...register("password", { required: true })}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-danger text-xs mt-1">Password is required</p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                  className="btn-primary w-full mt-2"
                >
                  Log In
                </motion.button>
              </form>
            </motion.div>
          )}

          {phase === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-10"
            >
              <motion.div
                className="h-12 w-12 rounded-full border-2 border-accent/20 border-t-accent"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
              />
              <motion.p
                className="text-sm text-muted mt-4"
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ repeat: Infinity, duration: 1.4 }}
              >
                Verifying credentials&hellip;
              </motion.p>
            </motion.div>
          )}

          {phase === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-10"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.5 }}
                className="h-14 w-14 rounded-full bg-accent/15 text-accent flex items-center justify-center shadow-glow"
              >
                <Activity size={26} />
              </motion.div>
              <p className="text-sm text-muted mt-4">Welcome back &mdash; loading dashboard&hellip;</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
