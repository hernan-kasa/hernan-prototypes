import { createTheme } from "@mui/material/styles";

/**
 * MUI theme matching kontrol-ui design system.
 * Color palette sourced from kontrol-ui/libs/shared/themes/base-theme.
 */
const theme = createTheme({
  palette: {
    primary: {
      main: "#2678F5",
      light: "#448CFB",
      dark: "#1058C5",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#6B7280",
    },
    success: {
      main: "#0D8A4E",
      light: "#E6F4ED",
    },
    error: {
      main: "#D32F2F",
      light: "#FDEDED",
    },
    warning: {
      main: "#ED6C02",
      light: "#FFF4E5",
    },
    grey: {
      50: "#FAFBFC",
      100: "#F5F5F5",
      200: "#E8E8E8",
      300: "#D0D0D0",
      400: "#9E9E9E",
      500: "#757575",
      600: "#616161",
      700: "#424242",
      800: "#303030",
      900: "#2D2D2D",
    },
    background: {
      default: "#FAFBFC",
      paper: "#FFFFFF",
    },
    divider: "#E8E8E8",
  },
  typography: {
    fontFamily:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h5: { fontWeight: 600, fontSize: "1.25rem" },
    h6: { fontWeight: 600, fontSize: "1rem" },
    subtitle1: { fontWeight: 600, fontSize: "0.875rem" },
    subtitle2: { fontWeight: 600, fontSize: "0.8125rem", color: "#424242" },
    body2: { fontSize: "0.8125rem" },
    caption: { fontSize: "0.75rem", color: "#757575" },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiAppBar: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #E8E8E8",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          fontSize: "0.8125rem",
          borderRadius: 6,
        },
        contained: {
          boxShadow: "none",
          "&:hover": { boxShadow: "none" },
        },
        outlined: {
          borderColor: "#D0D0D0",
          color: "#424242",
          "&:hover": { borderColor: "#9E9E9E", backgroundColor: "#FAFBFC" },
        },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        outlined: {
          borderColor: "#E8E8E8",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          fontSize: "0.75rem",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          color: "#757575",
          borderBottomColor: "#E8E8E8",
        },
        root: {
          borderBottomColor: "#F5F5F5",
          fontSize: "0.8125rem",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 500, fontSize: "0.75rem" },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontSize: "0.8125rem",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#D0D0D0",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#9E9E9E",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { fontSize: "0.8125rem" },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: "1px solid #E8E8E8",
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { borderColor: "#E8E8E8" },
      },
    },
  },
});

export default theme;
