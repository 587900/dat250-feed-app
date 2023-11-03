import { createTheme } from "@mui/material/styles";

// Define your color tokens
const colorTokens = {
  black: {
    1: "#1B1B1B",
    2: "#000"
  },
  brown: {
    1: "#E2A145",
    2: "#CE8F6E",
    3: "#8D4A2E",
    4: "#5E311E",
  },
  red: {
    1: "#F50057",
    2: "#CC1100",
    3: "#800000",
    4: "#660000",
  },
  white: {
    1: "#F8F7F7",
    2: "#f5f5f5",
  },
};

// Create your theme
export const theme = createTheme({
  palette: {
    primary: {
      main: colorTokens.brown[1],
      light: colorTokens.brown[2],
      dark: colorTokens.brown[3],
    },
    secondary: {
      main: colorTokens.red[2],
      light: colorTokens.brown[1],
      dark: colorTokens.brown[4],
    },
    text: {
      primary: colorTokens.black[1],
      secondary: colorTokens.brown[3],
    },
    background: {
      default: colorTokens.white[2],
      paper: colorTokens.white[1],
    },
  },
  typography: {
    fontFamily: ["Source Sans Pro", "monospace"].join(","),
    fontSize: 12,
    h1: {
      fontFamily: ["montserrat", "monospace"].join(","),
      fontSize: 40,
    },
    h2: {
      fontFamily: ["montserrat", "monospace"].join(","),
      fontSize: 32,
    },
    h3: {
      fontFamily: ["montserrat", "monospace"].join(","),
      fontSize: 24,
    },
    h4: {
      fontFamily: ["montserrat", "monospace"].join(","),
      fontSize: 20,
    },
    h5: {
      fontFamily: ["montserrat", "monospace"].join(","),
      fontSize: 16,
    },
    h6: {
      fontFamily: ["montserrat", "monospace"].join(","),
      fontSize: 14,
    },
  },
  components: {
    MuiIconButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "#2879AA25", // Change this to your desired color
          },
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 360,
      sm: 430,
      md: 900,
      lg: 1280,
      xl: 1920,
    },
  },
});
