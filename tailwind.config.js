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
        mejunje: {
          papel: "#EFE6D8",      // Papel / lino envejecido
          marfil: "#F5EFE6",     // Marfil cálido (superficies)
          arena: "#D7C3A8",      // Arena (bordes suaves y divisores)
          beigetabaco: "#B8A086",// Beige tabaco
          ambar: "#8A5A32",      // Vidrio ámbar
          tabaco: "#5A4030",     // Marrón tabaco
          espresso: "#342A24",   // Espresso envejecido
          salmon: "#C88978",     // Salmón empolvado
          terracota: "#A96F5B",  // Terracota muy apagada
          tinta: "#292622",      // Carbón tinta
          griscalido: "#857A70", // Gris cálido
          card: "#FAF6F0",       // Fondo tarjetas
          border: "#E5D9C8",     // Bordes sutiles
        },
      },
      fontFamily: {
        typewriter: ['"Special Elite"', '"Courier Prime"', 'Courier', 'monospace'],
        serif: ['"Newsreader"', '"EB Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'atelier': '0 1px 3px 0 rgba(52, 42, 36, 0.05), 0 1px 2px -1px rgba(52, 42, 36, 0.05)',
        'atelier-md': '0 4px 6px -1px rgba(52, 42, 36, 0.07), 0 2px 4px -2px rgba(52, 42, 36, 0.07)',
        'atelier-lg': '0 10px 15px -3px rgba(52, 42, 36, 0.08), 0 4px 6px -4px rgba(52, 42, 36, 0.08)',
      }
    },
  },
  plugins: [],
};
