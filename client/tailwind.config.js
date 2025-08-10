/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "sf-pro": ["SF Pro Display", "system-ui", "sans-serif"],
        sans: ["SF Pro Display", "system-ui", "sans-serif"],
      },
      colors: {
        primary: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#8039DF", // Our main brand color
          700: "#7c3aed",
          800: "#6d28d9",
          900: "#5b21b6",
        },
        arsenic: "#101010", // Dark text
        cultured: "#191736", // Dark sections
        floral: "#D6D6D6", // Light sections
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #8039df 0%, #667eea 100%)",
        "gradient-secondary":
          "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
        "gradient-hero": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        "gradient-purple-pink":
          "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
        "gradient-blue-purple":
          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        "gradient-orange-pink":
          "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
        "gradient-green-blue":
          "linear-gradient(135deg, #a8edea 0%, #667eea 100%)",
        "gradient-cosmic":
          "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #8b5cf6 100%)",
        "gradient-sunset": "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
        "gradient-ocean": "linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)",
        "gradient-radial":
          "radial-gradient(ellipse at center, var(--tw-gradient-stops))",
      },
      boxShadow: {
        "3xl": "0 35px 60px -12px rgba(0, 0, 0, 0.25)",
        glow: "0 0 30px rgba(128, 57, 223, 0.5)",
        "glow-blue": "0 0 30px rgba(59, 130, 246, 0.5)",
        "glow-pink": "0 0 30px rgba(236, 72, 153, 0.5)",
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        "pulse-slow": "pulse 2s ease-in-out infinite",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
