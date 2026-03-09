import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PromoCodeTable from "../../components/admin/PromoCodeTable";
import { usePromoCodes } from "../../hooks/usePromoCodes";

export default function PromoCodeList() {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const { codes, loading, refetch } = usePromoCodes(statusFilter || undefined);

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
        <Box>
          <Typography variant="h5">Promo Codes</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            Manage promo codes for direct bookings
          </Typography>
        </Box>
        <Button
          component={RouterLink}
          to="/admin/create"
          variant="contained"
          startIcon={<AddIcon />}
          size="small"
        >
          Create Code
        </Button>
      </Box>

      {/* Filters bar */}
      <Box sx={{ mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Data table */}
      <Paper variant="outlined">
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress size={28} />
          </Box>
        ) : (
          <PromoCodeTable codes={codes} onStatusToggle={refetch} />
        )}
      </Paper>
    </Box>
  );
}
