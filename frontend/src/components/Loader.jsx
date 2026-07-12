import { motion } from "framer-motion";

export default function Loader({ label = "Loading" }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <div className="relative h-10 w-10">
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-accent/20 border-t-accent"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
        />
      </div>
      <p className="text-xs text-muted tracking-wide uppercase animate-pulseSoft">{label}</p>
    </div>
  );
}
