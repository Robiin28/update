import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.5rem", md: "2rem", lg: "3rem" },
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Outfit", "Inter", "system-ui", "sans-serif"],
      },
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        card: {
          DEFAULT: "rgb(var(--card) / <alpha-value>)",
          foreground: "rgb(var(--card-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "rgb(var(--popover) / <alpha-value>)",
          foreground: "rgb(var(--popover-foreground) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "rgb(var(--primary) / <alpha-value>)",
          foreground: "rgb(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary) / <alpha-value>)",
          foreground: "rgb(var(--secondary-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "rgb(var(--muted) / <alpha-value>)",
          foreground: "rgb(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          foreground: "rgb(var(--accent-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "rgb(var(--destructive) / <alpha-value>)",
          foreground: "rgb(var(--destructive-foreground) / <alpha-value>)",
        },
        border: "rgb(var(--border) / <alpha-value>)",
        input: "rgb(var(--input) / <alpha-value>)",
        ring: "rgb(var(--ring) / <alpha-value>)",
        "neon-terracotta": "rgb(var(--neon-terracotta) / <alpha-value>)",
        "neon-saffron": "rgb(var(--neon-saffron) / <alpha-value>)",
        "neon-sage": "rgb(var(--neon-sage) / <alpha-value>)",
        "neon-amber": "rgb(var(--neon-amber) / <alpha-value>)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-neon": "linear-gradient(135deg, rgb(var(--primary)) 0%, rgb(var(--accent)) 100%)",
        "gradient-warm": "linear-gradient(135deg, rgb(var(--primary)) 0%, rgb(var(--secondary)) 100%)",
        "gradient-full": "linear-gradient(135deg, rgb(var(--primary)) 0%, rgb(var(--accent)) 50%, rgb(var(--secondary)) 100%)",
      },
      boxShadow: {
        "neon-terracotta": "0 0 20px rgb(var(--primary) / 0.4), 0 0 60px rgb(var(--primary) / 0.15)",
        "neon-saffron":    "0 0 20px rgb(var(--accent) / 0.4), 0 0 60px rgb(var(--accent) / 0.15)",
        "card":            "0 4px 24px rgb(0 0 0 / 0.4), inset 0 1px 0 rgb(255 255 255 / 0.05)",
        "card-hover":      "0 8px 48px rgb(0 0 0 / 0.5), 0 0 30px rgb(var(--primary) / 0.15)",
        "glass":       "0 8px 32px rgb(0 0 0 / 0.4), inset 0 1px 0 rgb(255 255 255 / 0.06)",
      },
      borderRadius: {
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      animation: {
        "fade-up":    "fade-up 0.7s ease forwards",
        "fade-in":    "fade-in 0.5s ease forwards",
        "float":      "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s ease-in-out infinite",
        "spin-slow":  "spin 20s linear infinite",
        "gradient":   "gradient-shift 8s ease infinite",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(30px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-20px)" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%":      { backgroundPosition: "100% 50%" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
