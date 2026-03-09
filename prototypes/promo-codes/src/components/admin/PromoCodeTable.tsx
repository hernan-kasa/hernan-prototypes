import EditIcon from "@mui/icons-material/Edit";
import {
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import type { PromoCode } from "../../types";
import StatusToggle from "./StatusToggle";

interface Props {
  codes: PromoCode[];
  onStatusToggle: () => void;
}

function formatDiscount(code: PromoCode) {
  return code.discount_type === "PERCENTAGE"
    ? `${code.discount_value}%`
    : `$${code.discount_value.toFixed(2)}`;
}

function formatDateRange(code: PromoCode) {
  if (!code.valid_after && !code.valid_before) return "\u2014";
  const after = code.valid_after
    ? new Date(code.valid_after).toLocaleDateString()
    : "\u2014";
  const before = code.valid_before
    ? new Date(code.valid_before).toLocaleDateString()
    : "\u2014";
  return `${after} \u2192 ${before}`;
}

function formatUsage(code: PromoCode) {
  const max = code.max_uses !== null ? code.max_uses : "\u221E";
  return `${code.current_uses} / ${max}`;
}

export default function PromoCodeTable({ codes, onStatusToggle }: Props) {
  if (codes.length === 0) {
    return (
      <Typography color="text.secondary" align="center" sx={{ py: 8 }}>
        No promo codes found.
      </Typography>
    );
  }

  return (
    <TableContainer sx={{ overflowX: "auto" }}>
      <Table size="small" sx={{ minWidth: 800 }}>
        <TableHead>
          <TableRow sx={{ "& th": { bgcolor: "grey.50", whiteSpace: "nowrap" } }}>
            <TableCell>Code</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Discount</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Valid Period</TableCell>
            <TableCell>Usage</TableCell>
            <TableCell>Min Nights</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {codes.map((code) => (
            <TableRow
              key={code.id}
              hover
              sx={{ "&:last-child td": { borderBottom: 0 } }}
            >
              <TableCell>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 600,
                    color: "primary.main",
                    fontSize: "0.8125rem",
                  }}
                >
                  {code.code}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{code.name}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight={500}>
                  {formatDiscount(code)}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={code.is_active ? "Active" : "Inactive"}
                  size="small"
                  sx={{
                    bgcolor: code.is_active ? "success.light" : "grey.100",
                    color: code.is_active ? "success.main" : "grey.600",
                    fontWeight: 600,
                    fontSize: "0.6875rem",
                    height: 22,
                  }}
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {formatDateRange(code)}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {formatUsage(code)}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {code.min_nights ?? "\u2014"}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <StatusToggle
                  id={code.id}
                  isActive={code.is_active}
                  onToggle={onStatusToggle}
                />
                <Tooltip title="Edit">
                  <IconButton
                    component={Link}
                    to={`/admin/edit/${code.id}`}
                    size="small"
                    sx={{ color: "grey.500", "&:hover": { color: "primary.main" } }}
                  >
                    <EditIcon sx={{ fontSize: "1rem" }} />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
