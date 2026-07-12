import { NavLink, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { LogOut, Menu, X, Plus } from "lucide-react";
import useAuthStore from "../store/authStore";
import NotificationBell from "./NotificationBell.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import clsx from "clsx";

export default function DashboardShell({ title, navItems, children }) {
  const { name, role, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = (name || role || "U").trim().charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-bg text-fg ambient-glow flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className={clsx(
          "fixed lg:sticky top-0 z-40 h-screen w-64 shrink-0 border-r border-glassBorder bg-surface/80 backdrop-blur-glass flex flex-col transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <Link to="/" className="flex items-center gap-2.5 px-6 py-6">
          <div className="h-10 w-10 rounded-full border-2 border-accent text-accent flex items-center justify-center relative shrink-0">
            <span className="absolute inset-0.5 rounded-full border border-accent/30" />
            <Plus size={16} strokeWidth={3} />
          </div>
          <div>
            <p className="font-heading font-bold text-sm leading-none">Quantum</p>
            <p className="text-[10px] text-muted mt-1 uppercase tracking-wider">{role} Desk</p>
          </div>
        </Link>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 relative",
                  isActive
                    ? "bg-accent/10 text-accent shadow-glow border border-accent/20"
                    : "text-muted hover:text-fg hover:bg-fg/5"
                )
              }
            >
              <item.icon size={17} strokeWidth={1.75} />
              {item.label}
              {item.badge > 0 && (
                <span className="ml-auto min-w-[18px] h-[18px] px-1 rounded-full bg-danger text-white text-[10px] font-bold flex items-center justify-center">
                  {item.badge > 9 ? "9+" : item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-glassBorder">
          <div className="px-3 py-2.5 mb-1 flex items-center gap-3">
            <div className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-accent-cyan to-accent text-white flex items-center justify-center text-sm font-bold font-heading">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{name}</p>
              <p className="text-[11px] text-muted truncate">{role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-muted hover:text-danger hover:bg-danger/10 transition-all duration-200"
          >
            <LogOut size={17} strokeWidth={1.75} />
            Log Out
          </button>
        </div>
      </motion.aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-30 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-4 px-6 py-4 border-b border-glassBorder bg-bg/70 backdrop-blur-glass">
          <button
            className="lg:hidden text-fg"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="font-heading font-bold text-lg">{title}</h1>
          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <NotificationBell />
          </div>
        </header>

        <main className="p-6 max-w-7xl mx-auto">{children}</main>
      </div>
    </div>
  );
}
