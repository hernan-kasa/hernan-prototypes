import { createTheme } from "@mui/material/styles";

/**
 * MUI theme matching kontrol-ui design system.
 * Color palette sourced from kontrol-ui/libs/shared/themes/base-theme.
 */

// kontrol-ui color tokens
const blue = {
  100: "#E9F1FF",
  200: "#A8CAFE",
  300: "#448CFB",
  400: "#2678F5",
  500: "#1058C5",
  600: "#08357A",
};

const neutral = {
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
};

const green = {
  100: "#E3FAE4",
  200: "#B7EAC5",
  300: "#01A62F",
  400: "#01A62F",
  500: "#005F1A",
};

const red = {
  100: "#FFEAEA",
  200: "#FDCCCC",
  300: "#E85959",
  400: "#CD0F0F",
  500: "#AF0D0D",
};

const orange = {
  100: "#FFF4E3",
  200: "#FFE3BA",
  300: "#FFBB54",
  400: "#C37F19",
  600: "#774100",
};

const INTER_FAMILY = "Inter, Helvetica, Arial, sans-serif";
const ROBOTO_MONO_FAMILY = "Roboto Mono, monospace";

const theme = createTheme({
  palette: {
    primary: {
      main: blue[400],
      light: blue[300],
      dark: blue[500],
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: blue[100],
      dark: blue[100],
      contrastText: blue[400],
    },
    success: {
      main: green[300],
      light: green[100],
    },
    error: {
      main: red[400],
      light: red[100],
    },
    warning: {
      main: orange[300],
      light: orange[100],
    },
    grey: {
      50: neutral[50],
      100: neutral[100],
      200: neutral[200],
      300: neutral[300],
      400: neutral[400],
      500: neutral[500],
      600: neutral[600],
      700: neutral[700],
      800: neutral[800],
      900: neutral[900],
    },
    text: {
      primary: neutral[800],
      secondary: neutral[600],
    },
    background: {
      default: neutral[100],
      paper: neutral[50],
    },
    divider: neutral[200],
  },
  typography: {
    fontFamily: INTER_FAMILY,
    allVariants: {
      color: neutral[800],
    },
    h1: { fontWeight: 700, fontSize: "1.75rem", lineHeight: 1.25 },
    h2: { fontWeight: 700, fontSize: "1.5rem", lineHeight: 1.25 },
    h3: { fontWeight: 700, fontSize: "1.25rem", lineHeight: 1.5 },
    h4: { fontWeight: 700, fontSize: "1rem", lineHeight: 1.5 },
    h5: { fontWeight: 700, fontSize: "0.875rem", lineHeight: 1.5 },
    h6: { fontWeight: 700, fontSize: "0.75rem", lineHeight: 1.5 },
    subtitle1: { fontWeight: 700, fontSize: "1rem", lineHeight: 1.5 },
    subtitle2: { fontWeight: 700, fontSize: "0.875rem", lineHeight: 1.5 },
    body1: { fontWeight: 400, fontSize: "1rem", lineHeight: 1.5 },
    body2: { fontWeight: 400, fontSize: "0.875rem", lineHeight: 1.5 },
    caption: { fontWeight: 400, fontSize: "0.625rem", color: neutral[600] },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiAppBar: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundColor: neutral[50],
          borderBottom: `1px solid ${neutral[200]}`,
          borderRadius: 0,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 700,
          fontSize: "0.875rem",
          lineHeight: "1.5rem",
          borderRadius: 12,
          fontFamily: INTER_FAMILY,
        },
        sizeSmall: {
          height: 30,
          fontSize: "0.75rem",
          lineHeight: "1rem",
        },
        contained: {
          boxShadow: "none",
          "&:hover": { boxShadow: "none" },
        },
        outlined: {
          borderColor: neutral[300],
          color: neutral[700],
          "&:hover": {
            borderColor: neutral[400],
            backgroundColor: neutral[100],
          },
        },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        outlined: {
          borderColor: neutral[200],
          borderRadius: "12px !important",
        },
        rounded: {
          borderRadius: 12,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          fontSize: "0.75rem",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          color: neutral[500],
          borderBottomColor: neutral[200],
        },
        root: {
          borderBottomColor: neutral[200],
          fontSize: "0.875rem",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          fontSize: "0.875rem",
          borderRadius: 8,
          fontFamily: INTER_FAMILY,
        },
        sizeSmall: {
          fontSize: "0.75rem",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontSize: "0.875rem",
          lineHeight: "1.375rem",
          borderRadius: 12,
          minHeight: 40,
          backgroundColor: "white",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: neutral[300],
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: neutral[400],
          },
        },
        input: {
          padding: "9px 12px",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { fontSize: "0.875rem" },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: "white",
          "&.Mui-disabled": {
            backgroundColor: neutral[100],
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: `1px solid ${neutral[200]}`,
          borderRadius: 0,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 0,
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { borderColor: neutral[200] },
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
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: "none",
          textUnderlineOffset: 3,
          textDecorationColor: "inherit",
          "&:hover": {
            color: blue[500],
            textDecoration: "underline",
          },
        },
      },
    },
  },
});

export { ROBOTO_MONO_FAMILY };
export default theme;
