/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        chinese: ['"Noto Sans SC"', 'sans-serif'],
      },
      borderRadius: {
        xl2: '20px',
        xl3: '30px',
      },
    },
  },
  plugins: [],
}
