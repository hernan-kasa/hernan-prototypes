import { useState } from "react";
import {
  Box,
  Button,
  Collapse,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import {
  ConfirmationNumber as PromoIcon,
  CheckCircleOutline as CheckIcon,
} from "@mui/icons-material";
import type { ValidateResponse } from "../../types";

interface Props {
  onApply: (code: string) => Promise<void>;
  onRemove: () => void;
  result: ValidateResponse | null;
  loading: boolean;
}

export default function PromoCodeInput({
  onApply,
  onRemove,
  result,
  loading,
}: Props) {
  const [code, setCode] = useState("");
  const [expanded, setExpanded] = useState(false);

  const handleApply = () => {
    if (!code.trim()) return;
    onApply(code.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleApply();
    }
  };

  /* --- Applied state: inline success chip --- */
  if (result?.valid) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          py: 1,
          px: 1.5,
          bgcolor: "rgba(46, 125, 50, 0.08)",
          borderRadius: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CheckIcon sx={{ fontSize: 18, color: "success.main" }} />
          <Box>
            <Typography
              variant="body2"
              fontWeight={600}
              color="success.main"
              sx={{ lineHeight: 1.3 }}
            >
              {code.toUpperCase()} applied
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {result.discount_type === "PERCENTAGE"
                ? `${result.discount_value}% off`
                : `$${result.discount_value?.toFixed(2)} off`}
            </Typography>
          </Box>
        </Box>
        <Link
          component="button"
          variant="caption"
          underline="always"
          onClick={() => {
            setCode("");
            setExpanded(false);
            onRemove();
          }}
          sx={{ color: "text.secondary" }}
        >
          Remove
        </Link>
      </Box>
    );
  }

  /* --- Default: collapsible promo input --- */
  return (
    <Box>
      {/* Collapsed: clickable link */}
      {!expanded && (
        <Link
          component="button"
          variant="body2"
          underline="always"
          onClick={() => setExpanded(true)}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            color: "text.secondary",
            "&:hover": { color: "primary.main" },
          }}
        >
          <PromoIcon sx={{ fontSize: 16 }} />
          Add promotional code
        </Link>
      )}

      {/* Expanded: text field + Apply */}
      <Collapse in={expanded}>
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            size="small"
            fullWidth
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyDown={handleKeyDown}
            placeholder="Enter code"
            disabled={loading}
            slotProps={{
              input: {
                sx: {
                  fontFamily: "monospace",
                  textTransform: "uppercase",
                  fontSize: "0.85rem",
                },
              },
            }}
          />
          <Button
            variant="outlined"
            onClick={handleApply}
            disabled={loading || !code.trim()}
            size="small"
            sx={{ whiteSpace: "nowrap", minWidth: "auto", px: 2 }}
          >
            {loading ? "..." : "Apply"}
          </Button>
        </Box>
        {result && !result.valid && (
          <Typography
            variant="caption"
            color="error"
            sx={{ mt: 0.5, display: "block" }}
          >
            {result.message}
          </Typography>
        )}
      </Collapse>
    </Box>
  );
}
