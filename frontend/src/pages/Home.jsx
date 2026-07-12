import { motion, useInView, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  HeartPulse,
  Bone,
  Brain,
  Baby,
  Sparkles,
  Ear,
  Eye,
  ScanFace,
  Stethoscope,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  ShieldCheck,
  Star,
  Quote,
  GraduationCap,
  Award,
  Users,
  CalendarClock,
  Menu,
  X,
  Plus,
  Clock,
} from "lucide-react";
import ThemeToggle from "../components/ThemeToggle.jsx";
import FloatingIcons from "../components/FloatingIcons.jsx";
import TiltCard from "../components/TiltCard.jsx";
import MapEmbed from "../components/MapEmbed.jsx";

const departments = [
  { name: "General Medicine", icon: Stethoscope, desc: "Everyday care, checkups, and chronic condition management.", img: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&h=320&fit=crop&auto=format&q=80&crop=faces" },
  { name: "Cardiology", icon: HeartPulse, desc: "Heart health, diagnostics, and long-term cardiac care.", img: "https://images.unsplash.com/photo-1637059824899-a441006a6875?w=500&h=320&fit=crop&auto=format&q=80&crop=faces" },
  { name: "Orthopedics", icon: Bone, desc: "Bone, joint, and movement recovery treatment.", img: "https://images.unsplash.com/photo-1712215544003-af10130f8eb3?w=500&h=320&fit=crop&auto=format&q=80&crop=faces" },
  { name: "Neurology", icon: Brain, desc: "Brain and nervous system diagnosis and care.", img: "https://images.unsplash.com/photo-1642975967602-653d378f3b5b?w=500&h=320&fit=crop&auto=format&q=80&crop=faces" },
  { name: "Pediatrics", icon: Baby, desc: "Dedicated care for infants, children, and teens.", img: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=500&h=320&fit=crop&auto=format&q=80&crop=faces" },
  { name: "Dermatology", icon: Sparkles, desc: "Skin, hair, and nail health for every age.", img: "https://images.unsplash.com/photo-1673865641073-4479f93a7776?w=500&h=320&fit=crop&auto=format&q=80&crop=faces" },
  { name: "ENT", icon: Ear, desc: "Ear, nose, and throat specialist treatment.", img: "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?w=500&h=320&fit=crop&auto=format&q=80&crop=faces" },
  { name: "Gynecology", icon: ScanFace, desc: "Women's health across every stage of life.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5pry5zjHvFdHzp8uw9TRgqX3ljIyr2iL2TS5dWYzC1g&s=10" },
  { name: "Ophthalmology", icon: Eye, desc: "Vision care from routine exams to surgery.", img: "https://images.unsplash.com/photo-1643297654416-05795d62e39c?w=500&h=320&fit=crop&auto=format&q=80&crop=faces" },
];

const stats = [
  { label: "Patients Treated", value: 10000, suffix: "+" },
  { label: "Specialist Doctors", value: 120 },
  { label: "Procedures Yearly", value: 650 },
  { label: "Years of Care", value: 18 },
];

// Showcase content for the public marketing page — independent of live
// backend data so the homepage always looks great, even on a fresh install
// before any doctors have been added by an admin.
const featuredDoctors = [
  { name: "Aditi Rao", dept: "Cardiology", exp: 14, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmYB0b1iSijJOZicvmVYnpOgU_69IOL97Rh9b49Ls10Q&s=10" },
  { name: "Karan Mehta", dept: "Neurology", exp: 11, img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=500&fit=crop&auto=format&q=80&crop=faces" },
  { name: "Sara Thomas", dept: "Pediatrics", exp: 9, img: "https://images.unsplash.com/photo-1643297654416-05795d62e39c?w=400&h=500&fit=crop&auto=format&q=80&crop=faces" },
  { name: "Vikram Nair", dept: "Orthopedics", exp: 16, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8xrI7Osj8jMFl5_dSEDxZ1XB_OOFvYTbDMC13lF7SrA&s=10" },
];

const reviews = [
  {
    name: "Priya Sharma",
    role: "Cardiology patient",
    text: "From booking to billing, everything happened inside one clean dashboard. My doctor even messaged me the moment my reports were ready.",
    img: "https://images.unsplash.com/photo-1584367034980-8ba72c175f4f?w=150&h=150&fit=crop&auto=format&q=80&crop=faces",
    rating: 5,
  },
  {
    name: "Rohan Verma",
    role: "Orthopedics patient",
    text: "I requested an appointment in under a minute and got confirmed the same afternoon. The whole experience felt genuinely modern.",
    img: "https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?w=150&h=150&fit=crop&auto=format&q=80&crop=faces",
    rating: 5,
  },
  {
    name: "Anjali Iyer",
    role: "Pediatrics parent",
    text: "Prescriptions, bills, notifications — I never have to call the front desk to ask what's going on with my son's care anymore.",
    img: "https://images.unsplash.com/photo-1654436200209-de489ed205df?w=150&h=150&fit=crop&auto=format&q=80&crop=faces",
    rating: 4,
  },
];

function Counter({ value, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref} className="font-mono-num tabular-nums">
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

function Section({ children, className = "", id }) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

function Stars({ count, size = 12 }) {
  return (
    <div className="flex items-center gap-0.5 text-warning">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={size} fill={i < count ? "currentColor" : "none"} strokeWidth={1.5} />
      ))}
    </div>
  );
}

export default function Home() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg text-fg overflow-x-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 -z-10 ambient-glow" />
      <div className="fixed top-1/3 -left-32 w-96 h-96 bg-accent/10 rounded-full blur-[120px] -z-10 animate-drift" />
      <div className="fixed bottom-0 -right-32 w-96 h-96 bg-accent-cyan/10 rounded-full blur-[120px] -z-10 animate-drift" />

      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-glassBorder bg-bg/70 backdrop-blur-glass">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-full border-2 border-accent text-accent flex items-center justify-center relative shrink-0">
              <span className="absolute inset-0.5 rounded-full border border-accent/30" />
              <Plus size={18} strokeWidth={3} />
            </div>
            <div className="leading-none">
              <span className="font-heading font-bold tracking-tight block">Quantum</span>
              <span className="text-[10px] text-muted uppercase tracking-[0.15em]">Hospital &amp; Research Centre</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted">
            <a href="#departments" className="hover:text-fg transition-colors">Departments</a>
            <a href="#doctors" className="hover:text-fg transition-colors">Doctors</a>
            <a href="#reviews" className="hover:text-fg transition-colors">Reviews</a>
            <a href="#contact" className="hover:text-fg transition-colors">Contact</a>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle className="hidden sm:inline-flex" />
            <Link to="/login">
              <motion.button whileHover={{ y: -2 }} whileTap={{ y: 0 }} className="btn-primary !py-2.5 !px-5 text-sm">
                Log In
              </motion.button>
            </Link>
            <button
              className="md:hidden btn-icon"
              onClick={() => setNavOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {navOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {navOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="md:hidden border-t border-glassBorder px-6 py-4 flex flex-col gap-4 text-sm text-muted"
          >
            <a href="#departments" onClick={() => setNavOpen(false)}>Departments</a>
            <a href="#doctors" onClick={() => setNavOpen(false)}>Doctors</a>
            <a href="#reviews" onClick={() => setNavOpen(false)}>Reviews</a>
            <a href="#contact" onClick={() => setNavOpen(false)}>Contact</a>
            <ThemeToggle className="sm:hidden" />
          </motion.div>
        )}
      </header>

      {/* Hero */}
      <section className="relative max-w-7xl mx-auto px-6 pt-20 pb-28">
        <FloatingIcons count={12} />

        <div className="relative grid lg:grid-cols-2 gap-14 items-center">
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-glassBorder bg-glass px-4 py-1.5 text-xs text-muted mb-8"
            >
              <ShieldCheck size={14} className="text-accent" />
              NABH-accredited &middot; 18 years serving the community
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-heading font-extrabold text-5xl md:text-6xl leading-[1.08] tracking-tight"
            >
              Good care shouldn&rsquo;t
              <br />
              feel <span className="text-accent">complicated.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-7 text-muted text-lg max-w-xl mx-auto lg:mx-0"
            >
              Quantum Hospital has been treating families in this city since 2008.
              Nine specialty departments, doctors who actually pick up the phone, and a
              dashboard that keeps your reports, bills, and prescriptions in one place.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-4"
            >
              <Link to="/login">
                <motion.button whileHover={{ y: -3 }} whileTap={{ y: 0 }} className="btn-primary">
                  Book Appointment <ArrowRight size={16} />
                </motion.button>
              </Link>
              <a href="#departments">
                <motion.button whileHover={{ y: -3 }} whileTap={{ y: 0 }} className="btn-ghost">
                  Explore Services
                </motion.button>
              </a>
            </motion.div>
          </div>

          {/* 3D floating hero card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotateY: -8 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative hidden lg:block"
          >
            <TiltCard max={14}>
              <div className="glass-card p-8 shadow-glow-lg relative overflow-hidden">
                <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-accent/20 blur-3xl animate-pulseSoft" />
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-14 w-14 rounded-full bg-accent/10 border-2 border-accent flex items-center justify-center animate-heartbeat">
                    <HeartPulse size={24} className="text-accent" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-lg">Priya&rsquo;s Dashboard</p>
                    <p className="text-xs text-muted">What a patient sees after logging in</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { label: "Appointment confirmed", sub: "Dr. Aditi Rao &middot; Today, 4:30 PM", icon: CalendarClock },
                    { label: "Prescription issued", sub: "3 medicines &middot; Diet plan attached", icon: Sparkles },
                    { label: "Bill paid", sub: "\u20B92,450 &middot; Consultation + Labs", icon: ShieldCheck },
                  ].map((row, i) => (
                    <motion.div
                      key={row.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.15 }}
                      className="flex items-center gap-3 rounded-xl bg-fg/5 border border-fg/10 px-4 py-3"
                    >
                      <div className="h-9 w-9 shrink-0 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                        <row.icon size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{row.label}</p>
                        <p className="text-xs text-muted truncate" dangerouslySetInnerHTML={{ __html: row.sub }} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </section>

      {/* Statistics */}
      <Section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="glass-card p-6 text-center"
            >
              <p className="font-heading font-extrabold text-3xl md:text-4xl text-accent">
                <Counter value={s.value} suffix={s.suffix} />
              </p>
              <p className="text-xs text-muted mt-2 uppercase tracking-wide">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Departments */}
      <Section id="departments" className="max-w-7xl mx-auto px-6 pb-24">
        <div className="text-center mb-14">
          <p className="text-accent text-xs font-semibold tracking-widest uppercase mb-3">Departments</p>
          <h2 className="font-heading font-bold text-3xl md:text-4xl">Care across every specialty</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {departments.map((d, i) => (
            <motion.div
              key={d.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
            >
              <TiltCard max={8}>
                <div className="glass-card overflow-hidden group cursor-default h-full">
                  <div className="h-32 overflow-hidden relative">
                    <img
                      src={d.img}
                      alt={d.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface/80 via-transparent to-transparent" />
                    <div className="absolute -bottom-4 left-5 h-10 w-10 rounded-xl bg-surface border border-glassBorder text-accent flex items-center justify-center shadow-lg">
                      <d.icon size={18} strokeWidth={1.75} />
                    </div>
                  </div>
                  <div className="p-6 pt-7">
                    <h3 className="font-heading font-semibold mb-1.5">{d.name}</h3>
                    <p className="text-sm text-muted leading-relaxed">{d.desc}</p>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Featured Doctors */}
      <Section id="doctors" className="max-w-7xl mx-auto px-6 pb-24">
        <div className="text-center mb-14">
          <p className="text-accent text-xs font-semibold tracking-widest uppercase mb-3">Our Specialists</p>
          <h2 className="font-heading font-bold text-3xl md:text-4xl">Meet a few of our best doctors</h2>
          <p className="text-muted max-w-xl mx-auto mt-4">
            Every doctor gets a full profile patients can search, review, and request
            appointments with directly from their dashboard.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredDoctors.map((doc, i) => (
            <motion.div
              key={doc.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
            >
              <TiltCard max={10}>
                <div className="glass-card overflow-hidden h-full">
                  <div className="h-48 overflow-hidden">
                    <img src={doc.img} alt={doc.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-5">
                    <p className="font-heading font-semibold">Dr. {doc.name}</p>
                    <p className="text-xs text-accent mt-0.5">{doc.dept}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-muted flex items-center gap-1">
                        <GraduationCap size={13} /> {doc.exp} yrs exp
                      </span>
                      <Stars count={5} />
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/login">
            <motion.button whileHover={{ y: -3 }} whileTap={{ y: 0 }} className="btn-ghost">
              View All Doctors <ArrowRight size={15} />
            </motion.button>
          </Link>
        </div>
      </Section>

      {/* Why Choose Us */}
      <Section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="glass-card overflow-hidden relative">
          <div className="absolute inset-0 -z-10">
            <img
              src="https://images.unsplash.com/photo-1516841273335-e39b37888115?w=1200&h=500&fit=crop&auto=format&q=80&crop=faces"
              alt=""
              className="w-full h-full object-cover opacity-[0.14] dark:opacity-[0.18]"
            />
            <div className="absolute inset-0 bg-surface/70" />
          </div>
          <div className="p-8 md:p-12 grid sm:grid-cols-3 gap-8 relative">
          {[
            { icon: Award, title: "Accredited Excellence", desc: "18 years of nationally recognized quality care." },
            { icon: Users, title: "120+ Specialists", desc: "Deep expertise across every major department." },
            { icon: ShieldCheck, title: "Secure by Design", desc: "Your records, prescriptions, and bills stay private." },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center sm:text-left"
            >
              <div className="h-12 w-12 mx-auto sm:mx-0 rounded-full bg-surface border-2 border-accent/40 text-accent flex items-center justify-center mb-4">
                <f.icon size={20} strokeWidth={1.75} />
              </div>
              <h3 className="font-heading font-semibold mb-1.5">{f.title}</h3>
              <p className="text-sm text-muted">{f.desc}</p>
            </motion.div>
          ))}
          </div>
        </div>
      </Section>

      {/* Reviews */}
      <Section id="reviews" className="max-w-7xl mx-auto px-6 pb-24">
        <div className="text-center mb-14">
          <p className="text-accent text-xs font-semibold tracking-widest uppercase mb-3">Patient Stories</p>
          <h2 className="font-heading font-bold text-3xl md:text-4xl">Loved by the people we care for</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {reviews.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
            >
              <TiltCard max={6}>
                <div className="glass-card p-6 h-full flex flex-col">
                  <Quote className="text-accent/40 mb-3" size={26} />
                  <p className="text-sm text-muted leading-relaxed flex-1">{r.text}</p>
                  <div className="flex items-center gap-3 mt-6">
                    <img src={r.img} alt={r.name} className="h-11 w-11 rounded-full object-cover" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{r.name}</p>
                      <p className="text-xs text-muted truncate">{r.role}</p>
                    </div>
                    <div className="ml-auto"><Stars count={r.rating} /></div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="glass-card p-10 md:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-accent-cyan/5 -z-10" />
          <FloatingIcons count={6} />
          <h2 className="font-heading font-bold text-2xl md:text-3xl mb-4">
            Ready to take the next step in your care?
          </h2>
          <p className="text-muted max-w-xl mx-auto mb-8">
            Doctors and patients get their own secure dashboard the moment an account
            is created &mdash; appointments, prescriptions, and reports, all in one place.
          </p>
          <Link to="/login">
            <motion.button whileHover={{ y: -3 }} whileTap={{ y: 0 }} className="btn-primary">
              Log In to Your Dashboard
            </motion.button>
          </Link>
        </div>
      </Section>

      {/* Contact */}
      <Section className="max-w-7xl mx-auto px-6 pb-24" id="contact">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div>
            <p className="text-accent text-xs font-semibold tracking-widest uppercase mb-3">Contact</p>
            <h2 className="font-heading font-bold text-3xl mb-6">Visit or reach us anytime</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-muted">
                <MapPin size={18} className="text-accent shrink-0" />
                4th Cross, Kadri Hills, Mangaluru, Karnataka 575002
              </div>
              <div className="flex items-center gap-3 text-sm text-muted">
                <Phone size={18} className="text-accent shrink-0" />
                +91 82478 32178
              </div>
              <div className="flex items-center gap-3 text-sm text-muted">
                <Mail size={18} className="text-accent shrink-0" />
                care@quantumhospital.in
              </div>
              <div className="flex items-center gap-3 text-sm text-muted">
                <Clock size={18} className="text-accent shrink-0" />
                OPD: Mon&ndash;Sat, 8:00 AM &ndash; 8:00 PM &middot; Emergency: 24/7
              </div>
            </div>
          </div>
          <div className="glass-card p-2 h-64 md:h-full min-h-[280px]">
            <MapEmbed className="h-full" />
          </div>
        </div>
      </Section>

      <footer className="border-t border-glassBorder py-8 text-center text-xs text-muted">
        &copy; {new Date().getFullYear()} Quantum Hospital. All rights reserved.
      </footer>
    </div>
  );
}
