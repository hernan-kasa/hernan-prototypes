import { useState } from "react";
import {
  Box,
  TextField,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Chip,
  InputAdornment,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { colors } from "../theme";
import type { ExistingRatePlan } from "../types";

interface PlanSelectorProps {
  plans: ExistingRatePlan[];
  selectedPlanId: string | null;
  onSelect: (plan: ExistingRatePlan) => void;
}

export default function PlanSelector({ plans, selectedPlanId, onSelect }: PlanSelectorProps) {
  const [search, setSearch] = useState("");

  const filtered = plans.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase()) ||
      p.planType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Stack spacing={2}>
      <TextField
        fullWidth
        placeholder="Search rate plans by name, code, or type..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: colors.neutral[400] }} />
              </InputAdornment>
            ),
          },
        }}
      />

      <Stack spacing={1}>
        {filtered.length === 0 && (
          <Typography variant="body2" sx={{ color: colors.neutral[600], py: 2, textAlign: "center" }}>
            No rate plans found matching "{search}"
          </Typography>
        )}
        {filtered.map((plan) => (
          <Card
            key={plan.id}
            elevation={0}
            sx={{
              border: `2px solid`,
              borderColor: selectedPlanId === plan.id ? colors.blue[400] : colors.neutral[200],
              transition: "border-color 0.2s",
            }}
          >
            <CardActionArea onClick={() => onSelect(plan)}>
              <CardContent sx={{ py: 1.5, px: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="subtitle2">{plan.name}</Typography>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                      <Typography sx={{ fontFamily: '"Roboto Mono", monospace', fontSize: "0.75rem", color: colors.neutral[600] }}>
                        {plan.code}
                      </Typography>
                      <Chip
                        label={plan.planType}
                        size="small"
                        sx={{ bgcolor: colors.blue[100], color: colors.blue[600], fontWeight: 700, fontSize: "0.625rem", height: 18 }}
                      />
                    </Stack>
                  </Box>
                  {plan.applicabilityConfiguration.effectiveDateRange && (
                    <Typography variant="body2" sx={{ color: colors.neutral[600], fontSize: "0.75rem" }}>
                      {plan.applicabilityConfiguration.effectiveDateRange.start} — {plan.applicabilityConfiguration.effectiveDateRange.end}
                    </Typography>
                  )}
                </Stack>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}
