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
        "bg-primary": "#0A0A1A",
        "bg-secondary": "#1E1B4B",
        "bg-tertiary": "#2A1D5C",
        "accent-primary": "#A78BFA",
        "accent-secondary": "#EC4899",
        "text-primary": "#E2E8F0",
        "text-secondary": "#B0B3C1",
        "border-color": "#3D3B5C",
      },
      boxShadow: {
        glow: "0 0 30px rgba(167, 139, 250, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
