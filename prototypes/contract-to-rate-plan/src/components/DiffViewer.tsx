import {
  Box,
  Typography,
  Card,
  CardContent,
  Switch,
  Divider,
  Chip,
  Stack,
} from "@mui/material";
import { colors } from "../theme";
import type { FieldDiff } from "../types";

interface DiffViewerProps {
  diffs: FieldDiff[];
  onToggle: (index: number) => void;
}

export default function DiffViewer({ diffs, onToggle }: DiffViewerProps) {
  const changedCount = diffs.length;
  const acceptedCount = diffs.filter((d) => d.accepted).length;

  return (
    <Card elevation={0}>
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography variant="h4">Amendment Changes</Typography>
          <Stack direction="row" spacing={1}>
            <Chip
              label={`${changedCount} changed`}
              size="small"
              sx={{ bgcolor: colors.orange[100], color: colors.orange[600], fontWeight: 700, fontSize: "0.625rem", height: 20 }}
            />
            <Chip
              label={`${acceptedCount} accepted`}
              size="small"
              sx={{ bgcolor: colors.green[100], color: colors.green[500], fontWeight: 700, fontSize: "0.625rem", height: 20 }}
            />
          </Stack>
        </Stack>
        <Divider sx={{ mb: 2 }} />

        {diffs.length === 0 ? (
          <Typography variant="body2" sx={{ color: colors.neutral[600], py: 3, textAlign: "center" }}>
            No changes detected between the existing rate plan and the amendment.
          </Typography>
        ) : (
          <Stack spacing={0}>
            {/* Header */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "180px 1fr 32px 1fr 56px",
                gap: 1,
                px: 2,
                py: 1,
                bgcolor: colors.neutral[100],
                borderRadius: 1.5,
                mb: 0.5,
              }}
            >
              <Typography variant="h6">Field</Typography>
              <Typography variant="h6">Current Value</Typography>
              <Box />
              <Typography variant="h6">Proposed Value</Typography>
              <Typography variant="h6" sx={{ textAlign: "center" }}>Accept</Typography>
            </Box>

            {diffs.map((diff, index) => (
              <Box
                key={diff.field}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "180px 1fr 32px 1fr 56px",
                  gap: 1,
                  px: 2,
                  py: 1.5,
                  alignItems: "center",
                  borderBottom: `1px solid ${colors.neutral[200]}`,
                  bgcolor: diff.accepted ? "rgba(1, 166, 47, 0.03)" : "transparent",
                  transition: "background 0.2s",
                }}
              >
                <Typography variant="subtitle2" sx={{ fontSize: "0.8125rem" }}>
                  {diff.label}
                </Typography>

                <Box
                  sx={{
                    bgcolor: diff.accepted ? colors.red[100] : colors.neutral[100],
                    borderRadius: 1,
                    px: 1.5,
                    py: 0.75,
                    transition: "all 0.2s",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: '"Roboto Mono", monospace',
                      fontSize: "0.75rem",
                      textDecoration: diff.accepted ? "line-through" : "none",
                      opacity: diff.accepted ? 0.5 : 1,
                      wordBreak: "break-word",
                      color: colors.neutral[800],
                    }}
                  >
                    {formatValue(diff.oldValue)}
                  </Typography>
                </Box>

                <Typography sx={{ textAlign: "center", color: colors.neutral[400], fontSize: 16 }}>
                  →
                </Typography>

                <Box
                  sx={{
                    bgcolor: diff.accepted ? colors.green[100] : colors.neutral[100],
                    borderRadius: 1,
                    px: 1.5,
                    py: 0.75,
                    transition: "all 0.2s",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: '"Roboto Mono", monospace',
                      fontSize: "0.75rem",
                      fontWeight: diff.accepted ? 700 : 400,
                      wordBreak: "break-word",
                      color: colors.neutral[800],
                    }}
                  >
                    {formatValue(diff.newValue)}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Switch
                    checked={diff.accepted}
                    onChange={() => onToggle(index)}
                    size="small"
                  />
                </Box>
              </Box>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return value.toString();
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    if (value.length === 0) return "(none)";
    return value
      .map((v) => {
        if (typeof v === "object" && v !== null) {
          if ("label" in v && "start" in v)
            return `${(v as { label: string }).label}: ${(v as { start: string }).start}–${(v as { end: string }).end}`;
          if ("start" in v)
            return `${(v as { start: string }).start}–${(v as { end: string }).end}`;
          return JSON.stringify(v);
        }
        return String(v);
      })
      .join(", ");
  }
  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    if ("start" in obj && "end" in obj) return `${obj.start} — ${obj.end}`;
    return JSON.stringify(value);
  }
  return String(value);
}
