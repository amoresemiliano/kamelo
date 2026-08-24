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
          blanco: "#FFFFFF",     // Blanco puro
          marfil: "#FCFBF8",     // Marfil luminoso (fondo principal)
          papel: "#F7F4EE",      // Papel / lino sutil (tarjetas secundarias)
          arena: "#E9E1D7",      // Arena suave (bordes y divisores delicados)
          arenasubtil: "#F0EAE1",// Arena muy suave
          salvia: "#77866F",     // Verde salvia principal (acento botánico de autor)
          salviaclara: "#A6B39A",// Salvia clara
          salviasuave: "#8E9A7B",// Salvia suave
          salviaoscura: "#596454",// Salvia oscura / bosque profundo
          salmon: "#77866F",     // Alias para compatibilidad -> salvia
          terracota: "#596454",  // Alias para compatibilidad -> salvia oscura
          blush: "#D8A094",      // Blush / terracota suave (secundario mínimo)
          ambar: "#C8A26B",      // Ámbar suave artesanal
          tabaco: "#44403C",     // Tabaco / carbón cálido suave
          espresso: "#1C1917",   // Carbón tinta profundo (para textos de máxima jerarquía o detalles mínimos)
          tinta: "#1C1917",      // Tinta negra / carbón atelier
          griscalido: "#78716C", // Gris cálido editorial
          card: "#FFFFFF",       // Superficie limpia de tarjetas
          border: "#E9E1D7",     // Bordes sutiles
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
