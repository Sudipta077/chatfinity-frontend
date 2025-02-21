/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        mygreen:"var(--mygreen)",
        myblue:"var(--myblue)",
        myblack:"var(--myblack)",
        myyellow:'var(--myyellow)',
        textcolor:'var(--text)'
      },
      fontFamily: {
        rubik: ["rubik"],
      },
    },
  },
  plugins: [],
};
