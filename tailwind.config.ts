import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
    "./src/actions/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-dream-900": "var(--bg-dream-900)",
        "bg-dream-800": "var(--bg-dream-800)",
        "bg-dream-700": "var(--bg-dream-700)",
        "accent-purple": "var(--accent-purple)",
        "accent-pink": "var(--accent-pink)",
        "accent-blue": "var(--accent-blue)",
        "text-dream-50": "var(--text-dream-50)",
        "text-dream-400": "var(--text-dream-400)",
        "border-dream": "var(--border-dream)",
      },
      boxShadow: {
        glow: "0 0 30px rgba(167, 139, 250, 0.35)",
        neon: "0 10px 30px rgba(167, 139, 250, 0.35)",
        "dream-sm": "0 2px 8px rgba(0, 0, 0, 0.3)",
        "dream-md": "0 10px 25px rgba(167, 139, 250, 0.15)",
        "dream-lg": "0 20px 40px rgba(167, 139, 250, 0.25)",
      },
      fontFamily: {
        inter: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
