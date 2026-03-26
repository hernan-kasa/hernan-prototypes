import { AppBar, Toolbar, Typography, Box, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { colors } from "../theme";

export default function AppHeader() {
  const navigate = useNavigate();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: colors.neutral[50],
        borderBottom: `1px solid ${colors.neutral[200]}`,
        height: 56,
        justifyContent: "center",
      }}
    >
      <Toolbar sx={{ minHeight: "56px !important" }}>
        <Box
          onClick={() => navigate("/")}
          sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}
        >
          <Typography
            variant="subtitle1"
            sx={{ color: colors.neutral[800], fontWeight: 700 }}
          >
            Kontrol
          </Typography>
          <Typography sx={{ color: colors.neutral[400] }}>/</Typography>
          <Typography variant="body2" sx={{ color: colors.neutral[600] }}>
            Rate Plans
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Chip
          label="Prototype"
          size="small"
          sx={{
            bgcolor: colors.blue[100],
            color: colors.blue[600],
            fontWeight: 700,
            fontSize: "0.75rem",
          }}
        />
      </Toolbar>
    </AppBar>
  );
}
