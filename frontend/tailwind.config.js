module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    backgroundSize: {
      auto: "auto",
      cover: "cover",
      contain: "contain",
      "50%": "50%",
      16: "4rem",
    },
    extend: {
      backgroundImage: {
        background: "url('/background.jpeg')",
        "footer-texture": "url('/img/footer-texture.png')",
      },
      translate: {
        "down50%": "-50%",
      },
      spacing: {
        280: "285px",
        350: "350px",
        700: "700px",
      },
      colors: {
        shade: "rgba(0, 0, 0, 0.5)",
      },
      maxWidth: {},
    },
  },
  plugins: [],
};
