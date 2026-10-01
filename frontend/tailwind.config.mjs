/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,ts,js}'],
  theme: { extend: {
    colors: { ink: '#03131F', midnight: '#061D2B', lime: '#39FF14', pitch: '#0B5D28', mist: '#D6DEE3' },
    fontFamily: { display: ['Barlow Condensed', 'sans-serif'], sans: ['Montserrat', 'sans-serif'], script: ['Caveat', 'cursive'] },
    boxShadow: { neon: '0 0 28px rgba(57,255,20,.18)' }
  } },
  plugins: []
};
