import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ConfidenceBadge from "./ConfidenceBadge";
import { colors } from "../theme";
import type { Confidence, Property } from "../types";

interface RoomTypeMapperRowProps {
  contractName: string;
  confidence: Confidence;
  property: Property;
  selectedId: string | null;
  onChange: (id: string, name: string) => void;
}

const bgMap: Record<Confidence, string> = {
  high: colors.green[100],
  medium: colors.orange[100],
  low: colors.red[100],
};

export default function RoomTypeMapperRow({
  contractName,
  confidence,
  property,
  selectedId,
  onChange,
}: RoomTypeMapperRowProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        py: 1,
        px: 2,
        borderRadius: 1.5,
        bgcolor: bgMap[confidence],
        mb: 1,
      }}
    >
      <Stack sx={{ flex: 1 }}>
        <Typography variant="subtitle2" sx={{ fontSize: "0.8125rem" }}>
          "{contractName}"
        </Typography>
        <Typography sx={{ fontSize: "0.625rem", color: colors.neutral[600] }}>
          from contract
        </Typography>
      </Stack>

      <ArrowForwardIcon sx={{ color: colors.neutral[400], fontSize: 16 }} />

      <Box sx={{ flex: 1 }}>
        <FormControl fullWidth size="small">
          <Select
            value={selectedId ?? ""}
            onChange={(e) => {
              const rt = property.room_types.find((r) => r.id === e.target.value);
              if (rt) onChange(rt.id, rt.name);
            }}
            displayEmpty
          >
            <MenuItem value="">
              <em>Select room type...</em>
            </MenuItem>
            {property.room_types.map((rt) => (
              <MenuItem key={rt.id} value={rt.id}>
                {rt.name} ({rt.code})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <ConfidenceBadge level={confidence} />
    </Box>
  );
}
