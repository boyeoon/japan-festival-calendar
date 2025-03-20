import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        LINESeedKR: ["var(--font-line-kr)"],
        LINESeedJP: ["var(--font-line-jp)"],
        LINESeedEN: ["var(--font-line-en)"],
      },
    },
  },
  plugins: [],
} satisfies Config;
