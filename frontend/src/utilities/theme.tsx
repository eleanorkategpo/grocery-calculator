import { ThemeOptions } from "@mui/material/styles";
const cssVar = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export const getTheme = (): ThemeOptions => {
  return {
    palette: {
      mode: "dark",
      primary: {
        main: cssVar("--primary-color"),
        light: cssVar("--primary-color-light"),
      },
      secondary: {
        main: cssVar("--secondary-color"),
        light: cssVar("--secondary-color-light"),
      },
      background: {
        default: cssVar("--background-color"),
        paper: cssVar("--paper-background-color"),
      },
      text: {
        primary: cssVar("--text-color"),
        secondary: cssVar("--text-secondary-color"),
        
      },
      
    },
    typography: {
      fontFamily: cssVar("--primary-font"),
      fontWeightBold: 700,
      
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            backgroundColor: cssVar("--primary-color"),
            '&:disabled': {
              backgroundColor: cssVar("--primary-color-light"),
            },
          },
        },
      },
  
      MuiTextField: {
        styleOverrides: {
          root: {
            backgroundColor: cssVar("--paper-background-color"),
            boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
            borderRadius: '4px',
            borderColor: cssVar("--primary-color"),
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: cssVar("--text-color"),
          },
        },
      },
      
    },
  };
};
