// theme.ts
import { extendTheme, theme as defaultTheme } from "@chakra-ui/react";

const fonts = {
  heading:
    "Raleway, sans-serif",
  body: "Raleway, sans-serif",
};

export const colors = {
  ...defaultTheme.colors,
//   blue: {
//     500: "#5686f5",
//     400: "#1c2433",
//   },
//   "button-color": "#222730",
//   "border-color": "#2b303b",
//   "main-bg": "#16181d",
//   "main-color": "#bbc3d3"
};

const theme = extendTheme({
  ...defaultTheme,
  colors,
  fonts,
});

export default theme;