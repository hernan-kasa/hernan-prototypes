import { Box, Typography, Button, Card, CardContent, Chip, Stack } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";
import { colors } from "../theme";

interface SuccessScreenProps {
  ratePlanName: string;
  ratePlanCode: string;
  planType: string;
  isAmendment?: boolean;
}

export default function SuccessScreen({
  ratePlanName,
  ratePlanCode,
  planType,
  isAmendment,
}: SuccessScreenProps) {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex", justifyContent: "center", pt: 8 }}>
      <Card elevation={0} sx={{ maxWidth: 480, textAlign: "center" }}>
        <CardContent sx={{ py: 5, px: 4 }}>
          <CheckCircleIcon sx={{ fontSize: 56, color: colors.green[300], mb: 2 }} />
          <Typography variant="h3" sx={{ mb: 1 }}>
            Rate Plan {isAmendment ? "Updated" : "Created"}
          </Typography>
          <Typography variant="body2" sx={{ color: colors.neutral[600], mb: 3 }}>
            The rate plan is now live in Kontrol and will propagate to channels
            within 30 minutes to 2 hours.
          </Typography>

          <Stack
            spacing={1.5}
            sx={{ bgcolor: colors.neutral[100], borderRadius: 1.5, p: 2.5, mb: 3, textAlign: "left" }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="body2" sx={{ color: colors.neutral[600], fontSize: "0.75rem" }}>Name</Typography>
              <Typography variant="subtitle2" sx={{ fontSize: "0.8125rem" }}>{ratePlanName}</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="body2" sx={{ color: colors.neutral[600], fontSize: "0.75rem" }}>Code</Typography>
              <Typography sx={{ fontFamily: '"Roboto Mono", monospace', fontSize: "0.8125rem", fontWeight: 700 }}>{ratePlanCode}</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="body2" sx={{ color: colors.neutral[600], fontSize: "0.75rem" }}>Type</Typography>
              <Chip
                label={planType}
                size="small"
                sx={{ bgcolor: colors.blue[100], color: colors.blue[600], fontWeight: 700, fontSize: "0.625rem", height: 20 }}
              />
            </Box>
          </Stack>

          <Stack direction="row" spacing={1} justifyContent="center">
            <Button variant="outlined" onClick={() => navigate("/")}>
              Back to Home
            </Button>
            <Button variant="contained" onClick={() => navigate("/create")}>
              Create Another
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
