import { motion } from "framer-motion";
import clsx from "clsx";

export default function GlassCard({
  children,
  className,
  as: Component = motion.div,
  delay = 0,
  hover = true,
  ...props
}) {
  return (
    <Component
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={
        hover
          ? { y: -4, boxShadow: "0 20px 50px rgba(16,185,129,.18)" }
          : undefined
      }
      className={clsx("glass-card p-6", className)}
      {...props}
    >
      {children}
    </Component>
  );
}
