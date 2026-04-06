import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "var(--black)",
        white: "var(--white)",
        grey: {
          100: "var(--grey-100)",
          200: "var(--grey-200)",
          300: "var(--grey-300)",
          500: "var(--grey-500)",
          700: "var(--grey-700)",
        },
        red: { brand: "var(--red)" },
        gold: "var(--gold)",
      },
      fontFamily: {
        sans: ["var(--font-primary)", "Helvetica", "Arial", "sans-serif"],
      },
      maxWidth: {
        content: "var(--max-width)",
      },
      spacing: {
        nav: "var(--nav-height)",
        announce: "var(--announcement-height)",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        drawer: "var(--shadow-drawer)",
        mega: "var(--shadow-mega)",
      },
      transitionDuration: {
        fast: "150ms",
        med: "300ms",
        slow: "600ms",
      },
      borderRadius: {
        pill: "var(--radius-pill)",
      },
    },
  },
  plugins: [],
};
export default config;
