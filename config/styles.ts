import { createTheme } from "@mui/material/styles";

// Create a theme instance.
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#15BFFD",
    },
    secondary: {
      main: "#6DC3FF",
    },
    info: {
      main: "#FFFFFF",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "rgba(255, 255, 255, 0.68)",
    },
    background: {
      default: "#080B2A",
      paper: "#080B2A",
    },
  },
  typography: {
    fontFamily: "Kelson Sans",
    fontSize: 16,
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: "Kelson Sans",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        outlined: {
          textTransform: "capitalize",
          position: "relative",
          paddingLeft: "24px",
          paddingRight: "24px",
          color: "#6DC3FF",
          border: "transparent",
          "--border": "1px",
          "--radius": "4px",
          "--t": 0,
          "--path": "0 0px,20px 0,100% 0,100% calc(100% - 13px),calc(100% - 24px) 100%,0 100%",
          "-webkit-mask": "paint(rounded-shape)",
          "background": "transparent",

          "&:before": {
            content: '""',
            position: "absolute",
            inset: 0,
            "--t": 1,
            background: "linear-gradient(152.14deg, #15BFFD 9.96%, #9C37FD 100%)",
            "-webkit-mask": "paint(rounded-shape)"
          },
          "&:hover": {
            border: "transparent"
          }
        },
        outlinedSecondary: {
          color: "#15BFFD",
          "&:before": {
            background: "#15BFFD",
          },
        },
        contained: {
          textTransform: "capitalize",
          position: "relative",
          paddingLeft: "24px",
          paddingRight: "24px",
          color: "#FFFFFF",
          border: "transparent",
          "--border": "1px",
          "--radius": "4px",
          "--t": 0,
          "--path": "0 0px,20px 0,100% 0,100% calc(100% - 13px),calc(100% - 24px) 100%,0 100%",
          "-webkit-mask": "paint(rounded-shape)",
          "background": "linear-gradient(92.49deg, #06AEEC 0.4%, #9C37FD 86.02%)",

          "&:hover": {
            border: "transparent"
          }
        },
      }
    }
  },
});

export default theme;
