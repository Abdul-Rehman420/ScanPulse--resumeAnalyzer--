import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#2AC5CA",
          50: "#E6FAFB",
          100: "#B3F0F2",
          200: "#80E5E9",
          300: "#4DDBDF",
          400: "#2AC5CA",
          500: "#1FAEB2",
          600: "#1A9296",
          700: "#147679",
          800: "#0F5A5C",
          900: "#0A3E3F",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#CA492A",
          50: "#FDF2EF",
          100: "#F9D5CB",
          200: "#F4B8A7",
          300: "#EF9B83",
          400: "#E87D5F",
          500: "#CA492A",
          600: "#A63C22",
          700: "#822F1B",
          800: "#5E2214",
          900: "#3A150D",
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "#CA492A",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "progress-fill": {
          "0%": { width: "0%" },
          "100%": { width: "var(--progress-width)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out",
        "slide-up": "slide-up 0.6s ease-out",
        "progress-fill": "progress-fill 1.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};
export default config;
