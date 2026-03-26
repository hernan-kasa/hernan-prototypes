import {
  FormControl,
  Select,
  MenuItem,
  Typography,
  Chip,
  Stack,
} from "@mui/material";
import type { Property } from "../types";
import { colors } from "../theme";

interface PropertySelectorProps {
  properties: Property[];
  selectedPropertyId: string;
  onChange: (propertyId: string) => void;
  disabled?: boolean;
}

export default function PropertySelector({
  properties,
  selectedPropertyId,
  onChange,
  disabled,
}: PropertySelectorProps) {
  const selected = properties.find((p) => p.id === selectedPropertyId);

  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Target Property</Typography>
      <FormControl fullWidth size="small">
        <Select
          value={selectedPropertyId}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          displayEmpty
        >
          {properties.map((p) => (
            <MenuItem key={p.id} value={p.id}>
              <Stack direction="row" spacing={1} alignItems="center">
                <span>{p.name}</span>
                <Chip
                  label={`${p.room_types.length} room types`}
                  size="small"
                  sx={{
                    bgcolor: colors.neutral[200],
                    color: colors.neutral[700],
                    fontWeight: 700,
                    fontSize: "0.625rem",
                    height: 18,
                  }}
                />
              </Stack>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {selected && (
        <Typography variant="body2" sx={{ color: colors.neutral[600], fontSize: "0.75rem" }}>
          Room types: {selected.room_types.map((rt) => rt.name).join(", ")}
        </Typography>
      )}
    </Stack>
  );
}
