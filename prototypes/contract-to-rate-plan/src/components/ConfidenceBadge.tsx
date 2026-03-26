import { Chip, Tooltip } from "@mui/material";
import type { Confidence } from "../types";
import { colors } from "../theme";

const CONFIG: Record<Confidence, { label: string; bg: string; color: string; tooltip: string }> = {
  high: {
    label: "High",
    bg: colors.green[100],
    color: colors.green[500],
    tooltip: "Confidently extracted — field was clearly present in the contract",
  },
  medium: {
    label: "Review",
    bg: colors.orange[100],
    color: colors.orange[600],
    tooltip: "Requires review — field was present but needed interpretation",
  },
  low: {
    label: "Verify",
    bg: colors.red[100],
    color: colors.red[400],
    tooltip: "Low confidence — field may be inferred or uncertain. Please verify manually.",
  },
};

export default function ConfidenceBadge({ level }: { level: Confidence }) {
  const { label, bg, color, tooltip } = CONFIG[level];

  return (
    <Tooltip title={tooltip} arrow placement="top">
      <Chip
        label={label}
        size="small"
        sx={{
          bgcolor: bg,
          color: color,
          fontWeight: 700,
          fontSize: "0.625rem",
          height: 20,
          border: "none",
          animation: level === "low" ? "pulse-low 2s ease-in-out infinite" : undefined,
        }}
      />
    </Tooltip>
  );
}
