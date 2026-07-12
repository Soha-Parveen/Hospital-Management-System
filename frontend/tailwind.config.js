/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--color-bg) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        fg: "rgb(var(--color-fg) / <alpha-value>)",
        glass: "var(--color-glass)",
        glassBorder: "var(--color-glass-border)",
        accent: {
          DEFAULT: "rgb(var(--color-accent) / <alpha-value>)",
          cyan: "rgb(var(--color-accent-cyan) / <alpha-value>)",
        },
        danger: "rgb(var(--color-danger) / <alpha-value>)",
        warning: "rgb(var(--color-warning) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
      },
      fontFamily: {
        heading: ["'Plus Jakarta Sans'", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        glow: "0 10px 40px rgba(16,185,129,.18)",
        "glow-cyan": "0 10px 40px rgba(6,182,212,.18)",
        "glow-danger": "0 10px 40px rgba(239,68,68,.18)",
        "glow-lg": "0 25px 70px rgba(16,185,129,.25)",
      },
      backdropBlur: {
        glass: "18px",
      },
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-14px) rotate(3deg)" },
        },
        floatySlow: {
          "0%, 100%": { transform: "translateY(0px) translateX(0px)" },
          "33%": { transform: "translateY(-18px) translateX(8px)" },
          "66%": { transform: "translateY(10px) translateX(-6px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.55 },
        },
        spinSlow: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        drift: {
          "0%": { transform: "translate(0,0) scale(1)" },
          "50%": { transform: "translate(30px,-20px) scale(1.05)" },
          "100%": { transform: "translate(0,0) scale(1)" },
        },
        heartbeat: {
          "0%, 100%": { transform: "scale(1)" },
          "14%": { transform: "scale(1.18)" },
          "28%": { transform: "scale(1)" },
          "42%": { transform: "scale(1.12)" },
          "70%": { transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        floaty: "floaty 6s ease-in-out infinite",
        floatySlow: "floatySlow 12s ease-in-out infinite",
        pulseSoft: "pulseSoft 1.6s ease-in-out infinite",
        spinSlow: "spinSlow 14s linear infinite",
        drift: "drift 16s ease-in-out infinite",
        heartbeat: "heartbeat 2.4s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
      },
    },
  },
  plugins: [],
};
