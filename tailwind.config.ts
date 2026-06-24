import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        paper: "#F8FAFC",
        line: "#E5E7EB",
        brand: "#2563EB",
        hint: "#F59E0B",
        success: "#16A34A",
      },
      boxShadow: {
        soft: "0 18px 60px rgba(17, 24, 39, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
