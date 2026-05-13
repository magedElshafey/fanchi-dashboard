/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        orangeColor: "#FE5621",
        blueColor: "#0D47A1",
        textColor: "#656565",
        grayColor: "#F6F6F6",
        grayBg: "#212524",
      },
      boxShadow: {
        mainShadow: "0px 0px 60px #00000012",
      },
    },
  },
};
