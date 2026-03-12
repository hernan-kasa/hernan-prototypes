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
  return code.discount_type === "percentage"
    ? `${code.discount_value}%`
    : `$${code.discount_value.toFixed(2)}`;
}

function formatDateRange(code: PromoCode) {
  if (!code.valid_from && !code.valid_until) return "\u2014";
  const from = code.valid_from
    ? new Date(code.valid_from).toLocaleDateString()
    : "\u2014";
  const until = code.valid_until
    ? new Date(code.valid_until).toLocaleDateString()
    : "\u2014";
  return `${from} \u2192 ${until}`;
}

function formatUsage(code: PromoCode) {
  const max = code.max_uses !== null ? code.max_uses : "\u221E";
  return `${code.current_uses} / ${max}`;
}

function formatPerGuest(code: PromoCode) {
  if (code.max_uses_per_guest === null) return "\u2014";
  return `${code.max_uses_per_guest}/guest`;
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
      <Table size="small" sx={{ minWidth: 900 }}>
        <TableHead>
          <TableRow sx={{ "& th": { bgcolor: "grey.50", whiteSpace: "nowrap" } }}>
            <TableCell>Code</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Discount</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Valid Period</TableCell>
            <TableCell>Usage</TableCell>
            <TableCell>Per-Guest</TableCell>
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
                <Chip
                  label={code.category}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: "0.7rem", textTransform: "capitalize" }}
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight={500}>
                  {formatDiscount(code)}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={code.status === "active" ? "Active" : "Inactive"}
                  size="small"
                  sx={{
                    bgcolor: code.status === "active" ? "success.light" : "grey.100",
                    color: code.status === "active" ? "success.main" : "grey.600",
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
                  {formatPerGuest(code)}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <StatusToggle
                  id={code.id}
                  status={code.status}
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
