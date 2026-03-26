import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  AppBar,
  Toolbar,
  Snackbar,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import MenuIcon from "@mui/icons-material/Menu";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import SettingsIcon from "@mui/icons-material/Settings";
import CreateRatePlanDialog from "../components/CreateRatePlanDialog";
import { colors } from "../theme";

const CATEGORY_CHIPS: Record<string, { bg: string; color: string }> = {
  Transient: { bg: colors.blue[100], color: colors.blue[500] },
  Group: { bg: colors.green[100], color: colors.green[500] },
  Comp: { bg: colors.purple[100], color: colors.purple[300] },
};

const MOCK_RATE_PLANS = [
  { code: "NEG-ARITZIA-PIN", name: "NEG-ARITZIA-PIN", cancellation: "Same Day 6pm", category: "Transient", segment: "Corporate", segmentDetail: "NLRA", bookingType: "Reservation, Extension", assignedTo: "StudioK-PIN + S..." },
  { code: "GRP-WILDERW26", name: "Group Wilder Wedding c...", cancellation: "48 Hour", category: "Group", segment: "SMERF", segmentDetail: "SMERF", bookingType: "Reservation, Extension", assignedTo: "Q-View-CAD +" },
  { code: "PKG-BAR-ROMANTIC", name: "Romantic Getaway Add On", cancellation: "Non-refundable", category: "Transient", segment: "Retail", segmentDetail: "Retail", bookingType: "Reservation", assignedTo: "Room2Q-DXT +" },
  { code: "PKG-BAR-MF-PARKING-...", name: "Park and Stay", cancellation: "5 Day", category: "Transient", segment: "Retail", segmentDetail: "Retail", bookingType: "Reservation", assignedTo: "K-ARG + KK-AR..." },
  { code: "PKG-BAR-PARKING-RCS", name: "Park and Stay", cancellation: "48 Hour", category: "Transient", segment: "Retail", segmentDetail: "Retail", bookingType: "Reservation", assignedTo: "STU-K-DLA + S..." },
  { code: "PKG-BAR-BFAST-RCS", name: "Breakfast Package", cancellation: "48 Hour", category: "Transient", segment: "Retail", segmentDetail: "Retail", bookingType: "Reservation", assignedTo: "STU-K-DLA + S..." },
  { code: "QUAL-BEL-ROMPKG", name: "The Bell Athens - Roman...", cancellation: "Non-refundable", category: "Transient", segment: "Retail", segmentDetail: "Retail", bookingType: "Reservation", assignedTo: "KKKK-BEL + Stu..." },
  { code: "GRP-TDCOTRNPR26-DLA", name: "NPR Tiny Desk COTR 2026", cancellation: "48 Hour", category: "Group", segment: "SMERF", segmentDetail: "SMERF", bookingType: "Reservation", assignedTo: "STU-K-DLA + S..." },
  { code: "GRP-MUR426-PIN", name: "Murmuration Inc. April 2...", cancellation: "24 Hour", category: "Group", segment: "Corporate", segmentDetail: "Corporate", bookingType: "Reservation, Extension", assignedTo: "StudioK-Deluxe..." },
  { code: "QUAL-BEL-LOCAL20", name: "Athens Local Discount R...", cancellation: "Non-refundable", category: "Transient", segment: "Qualified Discount", segmentDetail: "Qualified Discount", bookingType: "Reservation, Extension", assignedTo: "KKKK-BEL + Stu..." },
  { code: "NEG-NTUSA", name: "Nomad Tents USA", cancellation: "48 Hour", category: "Transient", segment: "Corporate", segmentDetail: "LRA", bookingType: "Reservation, Extension", assignedTo: "Q-B-BAS + Q-F..." },
  { code: "INT-MEETINGSPACE", name: "Meeting Space Rate Code", cancellation: "Non-refundable", category: "Transient", segment: "Corporate", segmentDetail: "LRA", bookingType: "Reservation, Extension", assignedTo: "All current and fu..." },
  { code: "INT-AJU-Comp", name: "Comp Rate for Aju", cancellation: "24 Hour", category: "Transient", segment: "Qualified Discount", segmentDetail: "Qualified Discount", bookingType: "Reservation", assignedTo: "STU-K-DLA + S..." },
  { code: "NEG-KIMMINS26-MVN", name: "Kimmins Mortuary Servic...", cancellation: "48 Hour", category: "Transient", segment: "Corporate", segmentDetail: "NLRA", bookingType: "Reservation, Extension", assignedTo: "K-Deluxe-MVN" },
  { code: "GRP-WMPC-GVD", name: "Westminster Presbyteria...", cancellation: "24 Hour", category: "Group", segment: "SMERF", segmentDetail: "SMERF", bookingType: "Reservation, Extension", assignedTo: "K-GVD + KQ-GV..." },
  { code: "GRP-KLERK", name: "KLERK", cancellation: "5 Day", category: "Group", segment: "Corporate", segmentDetail: "Corporate", bookingType: "Reservation, Extension", assignedTo: "K-CPK" },
  { code: "GRP-DAMOURVIC2026", name: "Damour Wedding", cancellation: "48 Hour", category: "Group", segment: "SMERF", segmentDetail: "SMERF", bookingType: "Reservation, Extension", assignedTo: "K-SST + KQ-SS..." },
  { code: "INT-GXCOMP", name: "GX Zero Rez", cancellation: "Default CXL Policy", category: "Comp", segment: "Comp", segmentDetail: "Comp", bookingType: "Reservation, Extension", assignedTo: "KX-SVF + K-AO..." },
  { code: "GRP-ASCOT-ETN", name: "Ascot Travel Entertainme...", cancellation: "48 Hour", category: "Group", segment: "SMERF", segmentDetail: "SMERF", bookingType: "Reservation, Extension", assignedTo: "K-ETN + KQ-ET..." },
];

interface LocationState {
  created?: boolean;
  isAmendment?: boolean;
  ratePlan?: { code: string; name: string; planType: string };
}

export default function HomePage() {
  const location = useLocation();
  const navState = location.state as LocationState | null;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [createdPlan, setCreatedPlan] = useState<{ code: string; name: string; planType: string } | null>(null);
  const [isAmendment, setIsAmendment] = useState(false);

  useEffect(() => {
    if (navState?.created && navState.ratePlan) {
      setCreatedPlan(navState.ratePlan);
      setIsAmendment(!!navState.isAmendment);
      setSnackOpen(true);
      // Clear navigation state so refresh doesn't re-trigger
      window.history.replaceState({}, "");
    }
  }, [navState]);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: colors.neutral[50] }}>
      {/* Kontrol header */}
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
        <Toolbar sx={{ minHeight: "56px !important", gap: 1.5 }}>
          <IconButton size="small" sx={{ color: colors.neutral[600] }}>
            <MenuIcon fontSize="small" />
          </IconButton>
          <Stack direction="row" spacing={0.75} alignItems="center">
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: 1,
                bgcolor: colors.blue[400],
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "0.75rem" }}>K</Typography>
            </Box>
            <Typography variant="subtitle1" sx={{ color: colors.neutral[800] }}>Kontrol</Typography>
          </Stack>

          <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <TextField
              placeholder="Search for Reservations, Listings, or Guests"
              size="small"
              sx={{
                width: 400,
                "& .MuiOutlinedInput-root": {
                  bgcolor: colors.neutral[50],
                  borderRadius: 3,
                  height: 36,
                  fontSize: "0.8125rem",
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ fontSize: 18, color: colors.neutral[400] }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>

          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: colors.neutral[700] }}>
            <LocationOnOutlinedIcon sx={{ fontSize: 18 }} />
            <Typography variant="subtitle2" sx={{ fontSize: "0.8125rem" }}>Full portfolio</Typography>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Page content */}
      <Box sx={{ px: 3, py: 3 }}>
        {/* Title row */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography variant="h2" sx={{ fontSize: "1.375rem" }}>Rate plans</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
            sx={{ borderRadius: 2 }}
          >
            Create rate plan
          </Button>
        </Stack>

        {/* Search + Filters bar */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Stack direction="row" spacing={0.75} alignItems="center" sx={{ cursor: "pointer", color: colors.neutral[700] }}>
            <SearchIcon sx={{ fontSize: 18 }} />
            <Typography variant="subtitle2" sx={{ fontSize: "0.8125rem" }}>Search</Typography>
          </Stack>
          <Stack direction="row" spacing={0.75} alignItems="center" sx={{ cursor: "pointer", color: colors.neutral[700] }}>
            <FilterListIcon sx={{ fontSize: 18 }} />
            <Typography variant="subtitle2" sx={{ fontSize: "0.8125rem" }}>Filters</Typography>
          </Stack>
          <Box sx={{ flex: 1 }} />
          <IconButton size="small" sx={{ color: colors.neutral[500] }}>
            <SettingsIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Stack>

        {/* Rate plans table */}
        <TableContainer sx={{ bgcolor: colors.neutral[50] }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                {["Internal code", "Plan name", "Cancellation policy", "Market category", "Market segment", "Market segment detail", "Booking type", "Assigned to", "Actions"].map((h) => (
                  <TableCell
                    key={h}
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.8125rem",
                      color: colors.neutral[800],
                      borderBottom: `1px solid ${colors.neutral[200]}`,
                      py: 1.5,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {createdPlan && (
                <TableRow
                  sx={{
                    bgcolor: colors.green[100],
                    "@keyframes fadeHighlight": {
                      "0%": { bgcolor: colors.green[100] },
                      "100%": { bgcolor: "transparent" },
                    },
                    animation: "fadeHighlight 4s ease-out forwards",
                    "& td": {
                      borderBottom: `1px solid ${colors.neutral[200]}`,
                      py: 1.25,
                      fontSize: "0.8125rem",
                      color: colors.neutral[800],
                    },
                  }}
                >
                  <TableCell>
                    <Typography sx={{ color: colors.blue[400], fontSize: "0.8125rem", fontWeight: 400 }}>
                      {createdPlan.code || "—"}
                    </Typography>
                  </TableCell>
                  <TableCell>{createdPlan.name}</TableCell>
                  <TableCell>24 Hour</TableCell>
                  <TableCell>
                    <Chip
                      label={createdPlan.planType.includes("Group") ? "Group" : "Transient"}
                      size="small"
                      sx={{
                        bgcolor: createdPlan.planType.includes("Group") ? colors.green[100] : colors.blue[100],
                        color: createdPlan.planType.includes("Group") ? colors.green[500] : colors.blue[500],
                        fontWeight: 700,
                        fontSize: "0.6875rem",
                        height: 22,
                      }}
                    />
                  </TableCell>
                  <TableCell>Corporate</TableCell>
                  <TableCell>Negotiated</TableCell>
                  <TableCell>Reservation</TableCell>
                  <TableCell>—</TableCell>
                  <TableCell>
                    <IconButton size="small" sx={{ color: colors.neutral[500] }}>
                      <MoreHorizIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )}
              {MOCK_RATE_PLANS.map((rp) => {
                const chipStyle = CATEGORY_CHIPS[rp.category] ?? CATEGORY_CHIPS["Transient"];
                return (
                  <TableRow
                    key={rp.code}
                    hover
                    sx={{
                      "&:hover": { bgcolor: colors.neutral[100] },
                      "& td": {
                        borderBottom: `1px solid ${colors.neutral[200]}`,
                        py: 1.25,
                        fontSize: "0.8125rem",
                        color: colors.neutral[800],
                      },
                    }}
                  >
                    <TableCell>
                      <Typography
                        sx={{
                          color: colors.blue[400],
                          fontSize: "0.8125rem",
                          fontWeight: 400,
                          cursor: "pointer",
                          "&:hover": { textDecoration: "underline" },
                        }}
                      >
                        {rp.code}
                      </Typography>
                    </TableCell>
                    <TableCell>{rp.name}</TableCell>
                    <TableCell>{rp.cancellation}</TableCell>
                    <TableCell>
                      <Chip
                        label={rp.category}
                        size="small"
                        sx={{
                          bgcolor: chipStyle.bg,
                          color: chipStyle.color,
                          fontWeight: 700,
                          fontSize: "0.6875rem",
                          height: 22,
                        }}
                      />
                    </TableCell>
                    <TableCell>{rp.segment}</TableCell>
                    <TableCell>{rp.segmentDetail}</TableCell>
                    <TableCell>{rp.bookingType}</TableCell>
                    <TableCell sx={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {rp.assignedTo}
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" sx={{ color: colors.neutral[500] }}>
                        <MoreHorizIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <CreateRatePlanDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />

      <Snackbar
        open={snackOpen}
        autoHideDuration={6000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ top: 72 }}
      >
        <Alert
          onClose={() => setSnackOpen(false)}
          severity="success"
          sx={{ width: "100%", borderRadius: 3, boxShadow: "2px 2px 24px rgba(0, 29, 74, 0.15)" }}
        >
          Rate plan <strong>{createdPlan?.name}</strong> {isAmendment ? "updated" : "created"} successfully
        </Alert>
      </Snackbar>
    </Box>
  );
}
