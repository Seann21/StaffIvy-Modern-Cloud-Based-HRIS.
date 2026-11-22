import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-jakarta)", "Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#EEF3FF",
          100: "#E0E9FF",
          200: "#C5D5FF",
          300: "#9CB6FF",
          400: "#6D8EFF",
          500: "#4368FF",
          600: "#3B63F6",
          700: "#2D4FD9",
          800: "#2540B0",
          900: "#1E358A",
        },
        obsidian: {
          900: "#0F172A",
          800: "#111827",
          700: "#1E293B",
        },
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -2px rgba(15, 23, 42, 0.03)",
        card: "0 10px 35px -5px rgba(15, 23, 42, 0.06), 0 2px 10px -3px rgba(15, 23, 42, 0.03)",
        hero: "0 24px 70px -12px rgba(59, 99, 246, 0.16), 0 12px 32px -8px rgba(15, 23, 42, 0.08)",
        "blue-glow": "0 10px 26px -6px rgba(59, 99, 246, 0.45)",
      },
    },
  },
  plugins: [],
};
export default config;

