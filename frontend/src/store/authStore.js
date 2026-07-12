import { create } from "zustand";

const useAuthStore = create((set) => ({
  token: localStorage.getItem("hms_token") || null,
  role: localStorage.getItem("hms_role") || null,
  name: localStorage.getItem("hms_name") || null,

  setAuth: ({ token, role, name }) => {
    localStorage.setItem("hms_token", token);
    localStorage.setItem("hms_role", role);
    localStorage.setItem("hms_name", name || "");
    set({ token, role, name });
  },

  logout: () => {
    localStorage.removeItem("hms_token");
    localStorage.removeItem("hms_role");
    localStorage.removeItem("hms_name");
    set({ token: null, role: null, name: null });
  },
}));

export default useAuthStore;
