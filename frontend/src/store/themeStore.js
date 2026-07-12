import { create } from "zustand";

const applyThemeClass = (theme) => {
  const root = document.documentElement;
  if (theme === "light") {
    root.classList.add("light");
  } else {
    root.classList.remove("light");
  }
};

const stored = localStorage.getItem("hms_theme");
const initial = stored === "light" || stored === "dark" ? stored : "dark";

// Apply immediately on module load so there's no flash of the wrong theme.
applyThemeClass(initial);

const useThemeStore = create((set, get) => ({
  theme: initial,

  setTheme: (theme) => {
    localStorage.setItem("hms_theme", theme);
    applyThemeClass(theme);
    set({ theme });
  },

  toggleTheme: () => {
    const next = get().theme === "dark" ? "light" : "dark";
    get().setTheme(next);
  },
}));

export default useThemeStore;
