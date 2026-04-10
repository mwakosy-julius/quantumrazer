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
        white: "var(--white)",
        black: "var(--black)",
        grey: {
          100: "var(--grey-100)",
          200: "var(--grey-200)",
          300: "var(--grey-300)",
          500: "var(--grey-500)",
          700: "var(--grey-700)",
        },
        "logo-green": "var(--logo-green)",
      },
      fontFamily: {
        sans: ['"Helvetica Neue"', "Helvetica", "Arial", "sans-serif"],
      },
      maxWidth: {
        content: "1440px",
      },
      spacing: {
        nav: "60px",
        announce: "36px",
      },
      borderRadius: {
        brand: "4px",
        pill: "30px",
        none: "0",
      },
      boxShadow: {
        mega: "0 4px 8px rgba(0,0,0,0.06)",
        dropdown: "0 4px 8px rgba(0,0,0,0.1)",
        arrow: "0 2px 8px rgba(0,0,0,0.1)",
      },
      transitionDuration: {
        fast: "150ms",
        med: "200ms",
      },
    },
  },
  plugins: [],
};
export default config;
