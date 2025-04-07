/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,json}'],
  corePlugins: {
    textColor: true
  },
  theme: {
    colors: {
      primary: "var(--primary)",
      "primary-light": "var(--primaryLight)",
      secondary: "var(--secondary)",
      "secondary-light": "var(--secondaryLight)",
      "text-base": "var(--textBase)",
    },
    extend: {},
  },
  plugins: [
    function ({ addComponents }) {
      const newUtilities = {
        '.fade-in': {
          '@apply opacity-0 transition-opacity ease-linear duration-700': {},
          '&.show': {
            '@apply opacity-100': {},
          },
        },
      };
      addComponents(newUtilities);
    },
  ],
}