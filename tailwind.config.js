/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-dark": "green",
        "primary-plan": "#054499", //header bg
        primary: "#074393", //txt
        "primary-light": "#004AAD", //login btn
        border: "#004AAD66", //input field
        "border-dark": "#004AADB2", //input section wrapper
        "border-light": "#E8E8E8", //layout
        secondary: "#F3F6F9", //table bakgrund
        "secondary-dark": "#D1E3FB", //active/in-active bg badge
        "secondary-light": "#F4F8FD", //question name bg, side bar bg
        tertiary: "#F9B80A",
        error: "#F54135",
        layout: "#F9F9F9",
      },
      borderRadius: {
        layout: "29px",
        card: "20px",
      },
      boxShadow: {
        "main-content": "14px -1px 28.5px 4px rgba(112, 144, 176, 0.08)",
        "primary-content": "0px 4px 8px 0px #0A3A6414;"
      },
      screens: {
        xlgMax: { max: "1050px" },
        lgMax: { max: "992px" },
        mdMax: { max: "768px" },
        smMax: { max: "580px" },
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};
