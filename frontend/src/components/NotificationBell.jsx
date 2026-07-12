import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  CalendarCheck,
  CalendarX,
  CalendarClock,
  FileText,
  Receipt,
  FlaskConical,
  CheckCheck,
  BellOff,
} from "lucide-react";
import { getMyNotifications, markNotificationRead, markAllNotificationsRead } from "../lib/api.js";

const ICONS = {
  AppointmentRequested: CalendarClock,
  AppointmentAccepted: CalendarCheck,
  AppointmentDeclined: CalendarX,
  AppointmentScheduled: CalendarCheck,
  AppointmentCompleted: CalendarCheck,
  AppointmentCancelled: CalendarX,
  PrescriptionIssued: FileText,
  BillGenerated: Receipt,
  BillPaid: Receipt,
  LabReportUploaded: FlaskConical,
  General: Bell,
};

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const wrapRef = useRef(null);
  const navigate = useNavigate();

  const fetchNotifications = () => {
    getMyNotifications()
      .then((res) => {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
        setLoaded(true);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleOpen = () => {
    setOpen((o) => !o);
  };

  const handleClickItem = async (n) => {
    if (!n.isRead) {
      try {
        await markNotificationRead(n._id);
        setNotifications((prev) => prev.map((x) => (x._id === n._id ? { ...x, isRead: true } : x)));
        setUnreadCount((c) => Math.max(0, c - 1));
      } catch {
        // non-fatal
      }
    }
    setOpen(false);
    if (n.link) navigate(n.link);
  };

  const handleMarkAll = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((x) => ({ ...x, isRead: true })));
      setUnreadCount(0);
    } catch {
      // non-fatal
    }
  };

  return (
    <div className="relative" ref={wrapRef}>
      <button
        onClick={handleOpen}
        aria-label="Notifications"
        className="relative btn-icon"
      >
        <Bell size={17} strokeWidth={1.85} />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-danger text-[10px] font-bold text-white flex items-center justify-center shadow-glow-danger"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 mt-3 w-80 max-h-[26rem] overflow-y-auto rounded-2xl border border-glassBorder bg-surface shadow-glow-lg z-50"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-glassBorder sticky top-0 bg-surface">
              <p className="font-heading font-semibold text-sm">Notifications</p>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAll}
                  className="text-xs text-accent hover:underline flex items-center gap-1"
                >
                  <CheckCheck size={13} /> Mark all read
                </button>
              )}
            </div>

            {!loaded ? (
              <div className="py-10 text-center text-xs text-muted">Loading&hellip;</div>
            ) : notifications.length === 0 ? (
              <div className="py-10 flex flex-col items-center gap-2 text-muted">
                <BellOff size={22} />
                <p className="text-xs">You're all caught up</p>
              </div>
            ) : (
              <ul>
                {notifications.map((n) => {
                  const Icon = ICONS[n.type] || Bell;
                  return (
                    <li key={n._id}>
                      <button
                        onClick={() => handleClickItem(n)}
                        className={`w-full text-left flex gap-3 px-4 py-3 border-b border-glassBorder/50 hover:bg-fg/5 transition-colors ${
                          !n.isRead ? "bg-accent/[0.04]" : ""
                        }`}
                      >
                        <div className="h-8 w-8 shrink-0 rounded-lg bg-accent/10 text-accent flex items-center justify-center mt-0.5">
                          <Icon size={14} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-xs font-semibold leading-snug">{n.title}</p>
                            {!n.isRead && <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0 mt-1" />}
                          </div>
                          {n.message && (
                            <p className="text-xs text-muted mt-0.5 leading-snug line-clamp-2">{n.message}</p>
                          )}
                          <p className="text-[10px] text-muted/70 mt-1 font-mono-num">{timeAgo(n.createdAt)}</p>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
