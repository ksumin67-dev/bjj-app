import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        // Surface
        bg: {
          base: "var(--bg-base)",
          elevated: "var(--bg-elevated)",
          overlay: "var(--bg-overlay)",
          hover: "var(--bg-hover)",
        },
        // Text
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          tertiary: "var(--text-tertiary)",
          disabled: "var(--text-disabled)",
          inverse: "var(--text-inverse)",
        },
        // Border
        border: {
          subtle: "var(--border-subtle)",
          DEFAULT: "var(--border-default)",
          strong: "var(--border-strong)",
          focus: "var(--border-focus)",
        },
        // Brand
        brand: {
          primary: "var(--brand-primary)",
          hover: "var(--brand-hover)",
          pressed: "var(--brand-pressed)",
          subtle: "var(--brand-subtle)",
        },
        // Semantic
        success: "var(--success)",
        warning: "var(--warning)",
        danger: "var(--danger)",
        info: "var(--info)",
        // BJJ Belt
        belt: {
          white: "var(--belt-white)",
          blue: "var(--belt-blue)",
          purple: "var(--belt-purple)",
          brown: "var(--belt-brown)",
          black: "var(--belt-black)",
        },
      },
      borderRadius: {
        xs: "var(--radius-xs)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        "card-hover": "var(--shadow-hover)",
        modal: "var(--shadow-modal)",
        glow: "var(--glow-active)",
      },
      transitionTimingFunction: {
        spring: "var(--motion-spring)",
        "out-soft": "var(--motion-ease)",
      },
      transitionDuration: {
        fast: "120ms",
        base: "200ms",
        slow: "320ms",
      },
      zIndex: {
        sticky: "10",
        fab: "20",
        bottomtab: "30",
        overlay: "40",
        modal: "50",
        toast: "60",
        tooltip: "70",
      },
    },
  },
  plugins: [],
};

export default config;
