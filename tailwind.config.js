/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        kamelo: {
          espresso: "#2A1E17",
          terracotta: "#C86D51",
          amber: "#D9822B",
          sage: "#6E8B74",
          linen: "#F7F4EE",
          sand: "#E6DFC8",
          card: "#FFFFFF",
          muted: "#7A6B61"
        }
      }
    },
  },
  plugins: [],
};
