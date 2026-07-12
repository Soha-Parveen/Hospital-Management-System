# MediCore — Hospital Management System Frontend

React + Vite frontend built to the locked "Sleek Medical Bionic" design spec, wired to your
existing Express/MongoDB backend with **no changes to the backend's routes, controllers, or
models**.

## Stack

React 18 + Vite, Tailwind CSS, Framer Motion, Recharts, Lucide icons, React Hook Form,
React Router DOM, Axios, Zustand, Sonner (toasts).

## Setup

1. **Backend** — from your `backend/backend` folder:
   ```
   npm install
   npm run dev
   ```
   Make sure `.env` has `MONGO_URI`, `JWT_SECRET`, and `PORT` (defaults to 5000).
   Run `node seeders/adminSeeder.js` if you haven't created the admin account yet.

2. **Frontend** — from this folder:
   ```
   npm install
   npm run dev
   ```
   The dev server runs on port 5173 and proxies `/api` and `/uploads` requests to
   `http://localhost:5000` (configured in `vite.config.js`), so no CORS setup is needed locally.

3. Open `http://localhost:5173`. Use the single **Log In** button in the nav — the same
   form handles Admin, Doctor, and Patient logins, exactly like the backend's single
   `/api/auth/login` endpoint. The role returned by the backend decides which dashboard
   you land on.

## Deploying separately

If you deploy the backend elsewhere, set an environment variable before building:
```
VITE_API_URL=https://your-backend-domain.com npm run build
```

## Structure

```
src/
  lib/api.js           All API calls, one function per backend route
  store/authStore.js   Zustand store: token, role, name (persisted to localStorage)
  components/          GlassCard, StatCard, DashboardShell (sidebar), Modal, Loader, EmptyState
  pages/
    Home.jsx            Public marketing homepage
    Login.jsx            Unified login (Admin / Doctor / Patient)
    admin/               Overview (stats) + Doctors (add/edit/delete)
    doctor/              Overview, Patients, Appointments, Prescriptions, Lab Reports, Billing
    patient/             Overview, Appointments, Prescriptions, Lab Reports, Billing
```

## Notes on backend behavior this UI respects as-is

- `POST /api/prescriptions/create` and `POST /api/lab-reports/upload` have no matching
  "list mine" endpoints for doctors, so those two pages show a live "issued/uploaded this
  session" feed rather than a persisted history — nothing was added to the backend to
  change this.
- The `Prescription` model doesn't include a `dietAdvice`/`reportTitle` field (the model
  has `dietPlan` instead, and the lab report model has no title field at all), so those
  two form fields are sent for parity with the controllers but Mongoose will silently
  drop them — this is existing backend behavior, left untouched per your instructions.
