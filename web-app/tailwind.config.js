/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Greenlite control-tower palette (near-black, layered surfaces).
        ink: {
          950: "#08080c", // app background
          900: "#0c0c12", // sidebar / deepest panel
          850: "#101019",
          800: "#15151f", // cards
          750: "#1a1a26",
          700: "#22222f", // borders / hover
          600: "#2c2c3b",
        },
        brand: {
          DEFAULT: "#8b5cf6",
          2: "#a855f7",
        },
        good: "#34c777",
        warn: "#f5b942",
        bad: "#f26d6d",
        txt: {
          DEFAULT: "#ecebf5",
          dim: "#a4a0bb",
          faint: "#6f6b85",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      fontSize: {
        "2xs": ["11px", "15px"],
      },
      boxShadow: {
        card: "0 1px 0 0 rgba(255,255,255,0.03) inset, 0 14px 40px -22px rgba(0,0,0,0.8)",
        pop: "0 24px 60px -24px rgba(0,0,0,0.85)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        ping2: {
          "0%": { boxShadow: "0 0 0 0 rgba(52,199,120,0.5)" },
          "70%": { boxShadow: "0 0 0 6px rgba(52,199,120,0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(52,199,120,0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.25s cubic-bezier(0.22,1,0.36,1)",
        "slide-in": "slide-in 0.28s cubic-bezier(0.22,1,0.36,1)",
        ping2: "ping2 2s infinite",
      },
    },
  },
  plugins: [],
};
