import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import useThemeStore from "../store/themeStore.js";

export default function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme } = useThemeStore();
  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle day / night theme"
      title={isLight ? "Switch to night mode" : "Switch to day mode"}
      className={`relative inline-flex items-center h-9 w-16 rounded-full border border-glassBorder bg-fg/5 px-1 transition-colors duration-300 shrink-0 ${className}`}
    >
      <span className="absolute left-2 text-warning">
        <Sun size={13} strokeWidth={2} />
      </span>
      <span className="absolute right-2 text-accent-cyan">
        <Moon size={13} strokeWidth={2} />
      </span>
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="relative z-10 h-7 w-7 rounded-full bg-surface shadow-glow flex items-center justify-center text-fg"
        style={{ marginLeft: isLight ? 0 : "auto" }}
      >
        {isLight ? (
          <Sun size={14} className="text-warning" strokeWidth={2.25} />
        ) : (
          <Moon size={14} className="text-accent-cyan" strokeWidth={2.25} />
        )}
      </motion.span>
    </button>
  );
}
