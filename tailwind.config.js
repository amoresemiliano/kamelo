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
          espresso: "#4B4038",
          dark: "#3E342F",
          terracotta: "#C98F7A",
          salmon: "#DFA28F",
          amber: "#D6A36D",
          sage: "#7D9882",
          linen: "#F7F3EE",
          sand: "#D8C7B8",
          beigemed: "#CBB8A6",
          card: "#FBF8F4",
          border: "#E7DDD4",
          muted: "#7A6E65",
          text: "#4B4038",
        }
      }
    },
  },
  plugins: [],
};
