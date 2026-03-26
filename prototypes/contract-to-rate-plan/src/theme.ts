import { createTheme } from "@mui/material/styles";

// Kontrol design tokens
export const colors = {
  neutral: {
    50: "#FFFFFF",
    100: "#F1F5FB",
    200: "#E6E9F1",
    300: "#CDD6E5",
    400: "#93A2BA",
    500: "#72839D",
    600: "#526480",
    700: "#1A3865",
    800: "#001D4A",
    900: "#001029",
  },
  blue: {
    100: "#E9F1FF",
    200: "#A8CAFE",
    300: "#448CFB",
    400: "#2678F5",
    500: "#1058C5",
    600: "#08357A",
  },
  green: {
    100: "#E3FAE4",
    200: "#B7EAC5",
    300: "#01A62F",
    500: "#005F1A",
  },
  red: {
    100: "#FFEAEA",
    200: "#FDCCCC",
    300: "#E85959",
    400: "#CD0F0F",
    500: "#AF0D0D",
  },
  orange: {
    100: "#FFF4E3",
    200: "#FFE3BA",
    300: "#FFBB54",
    400: "#C37F19",
    600: "#774100",
  },
  purple: {
    100: "#F4EBF3",
    200: "#ECD2E9",
    300: "#8F3985",
  },
};

const theme = createTheme({
  palette: {
    primary: {
      main: colors.blue[400],
      light: colors.blue[200],
      dark: colors.blue[500],
      contrastText: colors.neutral[50],
    },
    secondary: {
      main: colors.purple[300],
      light: colors.purple[100],
      dark: colors.purple[300],
    },
    success: {
      main: colors.green[300],
      light: colors.green[100],
      dark: colors.green[500],
    },
    warning: {
      main: colors.orange[300],
      light: colors.orange[100],
      dark: colors.orange[400],
    },
    error: {
      main: colors.red[400],
      light: colors.red[100],
      dark: colors.red[500],
    },
    background: {
      default: colors.neutral[100],
      paper: colors.neutral[50],
    },
    text: {
      primary: colors.neutral[800],
      secondary: colors.neutral[600],
    },
    divider: colors.neutral[200],
    grey: {
      50: colors.neutral[100],
      100: colors.neutral[200],
      200: colors.neutral[300],
      300: colors.neutral[400],
      400: colors.neutral[500],
      500: colors.neutral[600],
      600: colors.neutral[700],
      700: colors.neutral[800],
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, fontSize: "1.75rem", lineHeight: 1.25, color: colors.neutral[800] },
    h2: { fontWeight: 700, fontSize: "1.5rem", lineHeight: 1.25, color: colors.neutral[800] },
    h3: { fontWeight: 700, fontSize: "1.25rem", lineHeight: 1.5, color: colors.neutral[800] },
    h4: { fontWeight: 700, fontSize: "1rem", lineHeight: 1.5, color: colors.neutral[800] },
    h5: { fontWeight: 700, fontSize: "0.875rem", lineHeight: 1.5, color: colors.neutral[800] },
    h6: { fontWeight: 700, fontSize: "0.75rem", lineHeight: 1.5, color: colors.neutral[800] },
    subtitle1: { fontWeight: 700, fontSize: "1rem", lineHeight: 1.5, color: colors.neutral[800] },
    subtitle2: { fontWeight: 700, fontSize: "0.875rem", lineHeight: 1.5, color: colors.neutral[800] },
    body1: { fontWeight: 400, fontSize: "1rem", lineHeight: 1.5, color: colors.neutral[800] },
    body2: { fontWeight: 400, fontSize: "0.875rem", lineHeight: 1.5, color: colors.neutral[800] },
    caption: { fontWeight: 400, fontSize: "0.625rem", lineHeight: "1rem", color: colors.neutral[600] },
  },
  shape: { borderRadius: 12 },
  shadows: [
    "none",
    "6px 6px 20px rgba(26, 56, 101, 0.1)",    // shadow[1] — standard elevation
    "0px 0px 124px rgba(26, 56, 101, 0.3)",    // shadow[2] — deep
    "10px 0px 20px rgba(26, 56, 101, 0.1)",    // shadow[3] — right panel
    "-10px 0px 20px rgba(26, 56, 101, 0.1)",   // shadow[4] — left panel
    "2px 2px 4px rgba(0, 29, 74, 0.1)",        // shadow[5] — micro
    "2px 2px 24px rgba(0, 29, 74, 0.15)",      // shadow[6] — strong
    ...Array(18).fill("none"),
  ] as unknown as typeof createTheme extends (o: infer T) => unknown ? T extends { shadows?: infer S } ? S : never : never,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: "none" as const,
          fontWeight: 700,
          fontSize: "0.875rem",
          lineHeight: "1.5rem",
          padding: "8px 16px",
          boxShadow: "none",
          "&:hover": { boxShadow: "none" },
        },
        sizeSmall: {
          height: 30,
          fontSize: "0.75rem",
          lineHeight: "1rem",
          padding: "4px 12px",
        },
        contained: {
          "&:hover": {
            boxShadow: "6px 6px 20px rgba(26, 56, 101, 0.1)",
          },
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: "none",
        },
      },
    },
    MuiTextField: {
      defaultProps: { size: "small" as const },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
            minHeight: 40,
            "& fieldset": {
              borderColor: colors.neutral[300],
            },
            "&:hover fieldset": {
              borderColor: colors.neutral[500],
            },
            "&.Mui-focused fieldset": {
              borderColor: colors.blue[400],
              boxShadow: "0px 0px 0px 4px #B0D1FC",
            },
            "& input": {
              padding: "9px 12px",
            },
          },
        },
      },
    },
    MuiSelect: {
      defaultProps: { size: "small" as const },
      styleOverrides: {
        root: {
          borderRadius: 12,
          minHeight: 40,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          minHeight: 40,
          "& fieldset": {
            borderColor: colors.neutral[300],
          },
          "&:hover fieldset": {
            borderColor: colors.neutral[500],
          },
          "&.Mui-focused fieldset": {
            borderColor: colors.blue[400],
            boxShadow: "0px 0px 0px 4px #B0D1FC",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          fontSize: "0.875rem",
          borderRadius: 8,
        },
        sizeSmall: {
          fontSize: "0.75rem",
        },
        colorPrimary: {
          backgroundColor: colors.blue[100],
          color: colors.blue[600],
        },
        colorSuccess: {
          backgroundColor: colors.green[100],
          color: colors.green[500],
        },
        colorError: {
          backgroundColor: colors.red[100],
          color: colors.red[400],
        },
        colorWarning: {
          backgroundColor: colors.orange[100],
          color: colors.orange[600],
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          alignItems: "center",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: colors.neutral[200],
        },
      },
    },
    MuiAccordion: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: `1px solid ${colors.neutral[200]}`,
          "&:before": { display: "none" },
          "&.Mui-expanded": { margin: 0 },
        },
      },
    },
    MuiStepper: {
      styleOverrides: {
        root: {
          "& .MuiStepIcon-root": {
            color: colors.neutral[300],
            "&.Mui-active": { color: colors.blue[400] },
            "&.Mui-completed": { color: colors.blue[400] },
          },
          "& .MuiStepLabel-label": {
            fontWeight: 700,
            fontSize: "0.875rem",
            "&.Mui-active": { color: colors.neutral[800] },
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          "& .Mui-checked": {
            color: colors.green[300],
          },
          "& .Mui-checked + .MuiSwitch-track": {
            backgroundColor: colors.green[200],
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 8,
          fontSize: "0.75rem",
          fontWeight: 400,
        },
      },
    },
  },
});

export default theme;
