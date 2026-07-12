import { HeartPulse, Pill, Stethoscope, Syringe, Activity, Plus, ShieldCheck } from "lucide-react";

const ICONS = [Plus, HeartPulse, Pill, Stethoscope, Syringe, Activity, ShieldCheck];

/**
 * Purely decorative field of slowly floating/drifting medical icons.
 * Positioned absolutely, so the parent must be `relative` (or fixed/absolute
 * itself). Ignored by pointer/assistive tech.
 */
export default function FloatingIcons({ count = 10, className = "" }) {
  const items = Array.from({ length: count }, (_, i) => {
    const Icon = ICONS[i % ICONS.length];
    const size = 22 + ((i * 7) % 5) * 8;
    const top = (i * 37) % 100;
    const left = (i * 53) % 100;
    const duration = 5 + (i % 5);
    const delay = (i % 6) * 0.4;
    const anim = i % 2 === 0 ? "animate-floaty" : "animate-floatySlow";

    return (
      <div
        key={i}
        className={`deco-icon ${anim}`}
        style={{
          top: `${top}%`,
          left: `${left}%`,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
        }}
      >
        <Icon size={size} strokeWidth={1.5} />
      </div>
    );
  });

  return (
    <div aria-hidden className={`absolute inset-0 overflow-hidden ${className}`}>
      {items}
    </div>
  );
}
