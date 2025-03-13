/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,json}'],
  darkMode: false,
  corePlugins: {
    textColor: true
  },
  theme: {
    colors: {
      primary: "var(--theme-primary)",
      "primary-light": "var(--theme-primary-light)",
      secondary: "var(--theme-secondary)",
      "secondary-light": "var(--theme-secondary-light)",
      "text-base": "var(--theme-text-base)",
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