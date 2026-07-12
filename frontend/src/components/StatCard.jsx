import { useEffect, useState, useRef } from "react";
import { motion, useInView, animate } from "framer-motion";
import GlassCard from "./GlassCard";

function Counter({ value, prefix = "", suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.1,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref} className="font-mono-num tabular-nums">
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function StatCard({ icon: Icon, label, value, delay = 0, accent = "accent", prefix, suffix }) {
  const accentClasses = {
    accent: "text-accent shadow-glow",
    cyan: "text-accent-cyan shadow-glow-cyan",
    danger: "text-danger shadow-glow-danger",
    warning: "text-warning",
  };

  return (
    <GlassCard delay={delay} className="flex items-center gap-4">
      <div
        className={`h-12 w-12 shrink-0 rounded-xl bg-fg/5 border border-fg/10 flex items-center justify-center ${accentClasses[accent]}`}
      >
        {Icon && <Icon size={22} strokeWidth={1.75} />}
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-heading font-bold text-fg leading-tight">
          <Counter value={value} prefix={prefix} suffix={suffix} />
        </p>
        <p className="text-xs text-muted mt-0.5 truncate">{label}</p>
      </div>
    </GlassCard>
  );
}
