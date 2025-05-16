/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors:{
        ruddy:{
          ligth:'#3AB0FF',
          default: '#007BFF',
          dark:'0056B3'
        }
      }
    },
  },
  plugins: [],
}

