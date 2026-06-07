/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
        pacifico: ['Playfair Display', 'Georgia', 'serif'],
        playfair: ['Playfair Display', 'Georgia', 'serif'],
      },
      colors: {
        rosa: '#FFB5D8',
        mint: '#B5EAD7',
        lila: '#C5B5EA',
        peach: '#FFDAC1',
        cream: '#FAFAFA',
        'rosa-dark': '#ff8ec3',
        'mint-dark': '#8dd5bb',
        'lila-dark': '#a99bd4',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
