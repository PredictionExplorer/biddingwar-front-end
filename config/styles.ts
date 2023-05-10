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
      paper: "#101441",
    },
  },
  typography: {
    fontFamily: "Inter",
    fontSize: 16,
  },
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: 15,
          padding: "12px 16px !important"
        },
        input: {
          padding: "0 !important"
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontSize: 16,
        },
        h4: {
          fontFamily: "ClashDisplay-Variable",
          fontWeight: 600,
          fontSize: 45,
        },
        h5: {
          fontFamily: "ClashDisplay-Variable",
          fontWeight: 600,
          fontSize: 29,
        },
        h6: {
          fontFamily: "ClashDisplay-Variable",
          fontWeight: 600,
          fontSize: 21,
          lineHeight: "60px"
        },
        subtitle1: {
          fontFamily: "ClashDisplay-Variable",
          fontSize: 20,
          fontWeight: 500,
        },
        caption: {
          fontSize: 14,
        },
        body2: {
          fontSize: 13,
          color: "rgba(255, 255, 255, 0.68)"
        }
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
          border: 0,
          "--border": "1px",
          "--radius": "4px",
          "--t": 0,
          "--path": "0 0px,20px 0,100% 0,100% calc(100% - 16px),calc(100% - 20px) 100%,0 100%",
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
            border: 0
          }
        },
        outlinedSecondary: {
          color: "#15BFFD",
          "&:before": {
            background: "#15BFFD",
          },
        },
        text: {
          color: "#fff",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          background: "rgba(255, 255, 255, 0.02)",
          borderRadius: 0
        },
        contained: {
          textTransform: "capitalize",
          position: "relative",
          paddingLeft: "24px",
          paddingRight: "24px",
          color: "#FFFFFF",
          border: 0,
          "--border": "1px",
          "--radius": "4px",
          "--t": 0,
          "--path": "0 0px,20px 0,100% 0,100% calc(100% - 16px),calc(100% - 20px) 100%,0 100%",
          "-webkit-mask": "paint(rounded-shape)",
          "background": "linear-gradient(92.49deg, #06AEEC 0.4%, #9C37FD 86.02%)",

          "&:hover": {
            border: 0
          }
        },
      },
      variants: [
        {
          props: { variant: 'outlined', color: 'info' },
          style: {
            color: "#fff",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            "&:before": {
              background: "rgba(255, 255, 255, 0.02)"
            },
          },
        },
      ],
    },
    MuiPaginationItem: {
      styleOverrides: {
        rounded: {
          position: "relative",
          border: 0,
          backgroundColor: "#1B2262",
          color: "#A8AABF",
          "--border": "1px",
          "--radius": "4px",
          "--t": 0,
          "--path": "0 0px,0 0,100% 0,100% calc(100% - 8px),calc(100% -12px) 100%,0 100%",
          "-webkit-mask": "paint(rounded-shape)",

          "&:hover": {
            border: 0
          }
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundImage: "none"
        }
      }
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: "transparent",
          backgroundImage: "none",
          boxShadow: "none",
          "&:before": {
            display: "none",
          },
        }
      }
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          minHeight: "48px !important",
          borderBottom: "1px solid rgba(217, 217, 217, 0.3)",
          padding: 0
        },
        content: {
          marginTop: 8,
          marginBottom: 8,
          "&.Mui-expanded": {
            marginTop: 8,
            marginBottom: 8,
          }
        },
      }
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: "16px 0 0 0"
        }
      }
    }
  },
});

export default theme;
