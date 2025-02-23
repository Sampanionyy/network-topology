module.exports = {
  content: ['./src/**/*.{html,js,jsx}'],
  theme: {
    extend: {
      colors: {
        red: {
          100: '#FEE2E2',
          300: '#FCA5A5',
        },
      },
      fontFamily: {
        corben: ["Corben", "cursive"], // Ajoute la police Corben
      },
    },
  },
  plugins: [],
}
