/** @type {import('tailwindcss').Config} */
module.exports = {
content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
],
theme: {
    extend: {
     fontFamily: {
         scans: ['Roboto','scans-serif']
     },
     gridTemplateColumns: {
        '70/30':'70% 28%'
     }
    },
},
plugins: [],
}