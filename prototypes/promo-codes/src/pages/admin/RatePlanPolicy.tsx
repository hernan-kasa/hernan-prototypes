import { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import api from "../../api/client";
import { usePromoCodes, useRatePlans } from "../../hooks/usePromoCodes";
import type { PromoCode, RatePlanPromoPolicy } from "../../types";

type PolicyMode = "all" | "none" | "allowlist" | "blocklist";

interface CodeOption {
  label: string;
  value: string; // promo code ID
}

function buildCodeOptions(codes: PromoCode[]): CodeOption[] {
  return codes
    .filter((c) => c.status === "active")
    .map((c) => ({
      label: `${c.code} \u2014 ${c.name}`,
      value: c.id,
    }));
}

/** Summary chip for the table row */
function PolicySummary({
  policy,
}: {
  policy: RatePlanPromoPolicy | null | undefined;
}) {
  if (!policy || policy.promo_code_policy === "all") {
    return (
      <Chip
        label="All allowed"
        size="small"
        sx={{
          bgcolor: "success.50",
          color: "success.main",
          fontWeight: 500,
          fontSize: "0.75rem",
        }}
      />
    );
  }
  if (policy.promo_code_policy === "none") {
    return (
      <Chip
        label="All blocked"
        size="small"
        sx={{
          bgcolor: "error.50",
          color: "error.main",
          fontWeight: 500,
          fontSize: "0.75rem",
        }}
      />
    );
  }
  if (policy.promo_code_policy === "allowlist") {
    return (
      <Chip
        label={`${policy.promo_code_ids.length} allowed`}
        size="small"
        sx={{
          bgcolor: "success.50",
          color: "success.main",
          fontWeight: 500,
          fontSize: "0.75rem",
        }}
      />
    );
  }
  // blocklist
  return (
    <Chip
      label={`${policy.promo_code_ids.length} blocked`}
      size="small"
      sx={{
        bgcolor: "warning.50",
        color: "warning.dark",
        fontWeight: 500,
        fontSize: "0.75rem",
      }}
    />
  );
}

export default function RatePlanPolicy() {
  const ratePlans = useRatePlans();
  const { codes } = usePromoCodes();
  const [policies, setPolicies] = useState<
    Record<string, RatePlanPromoPolicy>
  >({});
  const [loadingPolicies, setLoadingPolicies] = useState(true);

  // Drawer state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [policyMode, setPolicyMode] = useState<PolicyMode>("all");
  const [selectedCodes, setSelectedCodes] = useState<CodeOption[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const codeOptions = buildCodeOptions(codes);
  const editingPlan = ratePlans.find((rp) => rp.id === editingId);

  // Load all policies
  useEffect(() => {
    if (ratePlans.length === 0) return;
    setLoadingPolicies(true);
    Promise.all(
      ratePlans.map((rp) =>
        api
          .get(`/rate-plans/${rp.id}/promo-policy`)
          .then((res) => {
            const d = res.data.data.attributes;
            return {
              rpId: rp.id,
              policy: {
                id: res.data.data.id,
                ...d,
              } as RatePlanPromoPolicy,
            };
          })
          .catch(() => ({ rpId: rp.id, policy: null }))
      )
    ).then((results) => {
      const map: Record<string, RatePlanPromoPolicy> = {};
      results.forEach(({ rpId, policy }) => {
        if (policy) map[rpId] = policy;
      });
      setPolicies(map);
      setLoadingPolicies(false);
    });
  }, [ratePlans]);

  // Open edit drawer
  const openEdit = (rpId: string) => {
    const policy = policies[rpId] || null;
    if (policy) {
      setPolicyMode(policy.promo_code_policy as PolicyMode);
      setSelectedCodes(
        codeOptions.filter((o) => policy.promo_code_ids.includes(o.value))
      );
    } else {
      setPolicyMode("all");
      setSelectedCodes([]);
    }
    setEditingId(rpId);
    setSaved(false);
  };

  const closeEdit = () => {
    setEditingId(null);
    setSaved(false);
  };

  const save = async () => {
    if (!editingId) return;
    setSaving(true);
    const payload = {
      promo_code_policy: policyMode,
      promo_code_ids:
        policyMode === "allowlist" || policyMode === "blocklist"
          ? selectedCodes.map((o) => o.value)
          : [],
    };
    const res = await api.put(
      `/rate-plans/${editingId}/promo-policy`,
      payload
    );
    const d = res.data.data.attributes;
    setPolicies((prev) => ({
      ...prev,
      [editingId]: { id: res.data.data.id, ...d },
    }));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const showCodePicker = policyMode === "allowlist" || policyMode === "blocklist";

  return (
    <Box>
      {/* Page header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5">Rate Plans</Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.25 }}
        >
          Configure promo code stacking policies for each rate plan
        </Typography>
      </Box>

      {/* Rate plan table */}
      <Paper variant="outlined">
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table size="small" sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ whiteSpace: "nowrap" }}>CODE</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>PLAN NAME</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  MARKET SEGMENT
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  BOOKING TYPE
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  CANCELLATION
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  PROMO POLICY
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }} align="right">
                  ACTIONS
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ratePlans.map((rp) => (
                <TableRow
                  key={rp.id}
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={() => openEdit(rp.id)}
                >
                  <TableCell>
                    <Typography
                      sx={{
                        fontFamily: "Roboto Mono, monospace",
                        fontSize: "0.8125rem",
                        color: "primary.main",
                        fontWeight: 500,
                      }}
                    >
                      {rp.code}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {rp.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={rp.market_segment}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: "0.75rem" }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {rp.booking_type}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {rp.cancellation_policy}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {!loadingPolicies && (
                      <PolicySummary policy={policies[rp.id]} />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEdit(rp.id);
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Edit Drawer */}
      <Drawer
        anchor="right"
        open={editingId !== null}
        onClose={closeEdit}
        PaperProps={{ sx: { width: { xs: "100%", sm: 480 } } }}
      >
        {editingPlan && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            {/* Drawer header */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 3,
                py: 2,
                borderBottom: 1,
                borderColor: "divider",
              }}
            >
              <Box>
                <Typography variant="h6" sx={{ fontSize: "1rem" }}>
                  {editingPlan.name}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    fontFamily: "Roboto Mono, monospace",
                  }}
                >
                  {editingPlan.code} &middot; {editingPlan.id}
                </Typography>
              </Box>
              <IconButton size="small" onClick={closeEdit}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            {/* Drawer body */}
            <Box sx={{ flex: 1, overflow: "auto", px: 3, py: 3 }}>
              {/* Rate plan info */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: "grey.500",
                    fontSize: "0.6875rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    mb: 1,
                  }}
                >
                  Rate Plan Details
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{ p: 2, bgcolor: "grey.50" }}
                >
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 1.5,
                    }}
                  >
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        Market Segment
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {editingPlan.market_segment}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        Booking Type
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {editingPlan.booking_type}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        Cancellation Policy
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {editingPlan.cancellation_policy}
                      </Typography>
                    </Box>
                  </Box>
                  {editingPlan.description && (
                    <Box sx={{ mt: 1.5 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        Description
                      </Typography>
                      <Typography variant="body2">
                        {editingPlan.description}
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </Box>

              <Divider sx={{ mb: 3 }} />

              {/* Promo code stacking policy */}
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: "grey.500",
                    fontSize: "0.6875rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    mb: 0.5,
                  }}
                >
                  Promo Code Stacking Policy
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2, fontSize: "0.8125rem" }}
                >
                  Control which promo codes are valid when guests book under
                  this rate plan.
                </Typography>

                {/* Policy mode selector */}
                <FormControl fullWidth size="small" sx={{ mb: 2.5 }}>
                  <InputLabel>Policy</InputLabel>
                  <Select
                    value={policyMode}
                    label="Policy"
                    onChange={(e) => {
                      setPolicyMode(e.target.value as PolicyMode);
                      if (
                        e.target.value === "all" ||
                        e.target.value === "none"
                      ) {
                        setSelectedCodes([]);
                      }
                    }}
                  >
                    <MenuItem value="all">
                      All codes valid
                    </MenuItem>
                    <MenuItem value="none">
                      No codes valid
                    </MenuItem>
                    <MenuItem value="allowlist">
                      Only these codes (allowlist)
                    </MenuItem>
                    <MenuItem value="blocklist">
                      All except these codes (blocklist)
                    </MenuItem>
                  </Select>
                </FormControl>

                {/* Code picker for allowlist/blocklist */}
                {showCodePicker && (
                  <Autocomplete
                    multiple
                    options={codeOptions}
                    value={selectedCodes}
                    onChange={(_, newValue) => setSelectedCodes(newValue)}
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) =>
                      option.value === value.value
                    }
                    disableCloseOnSelect
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder={
                          selectedCodes.length === 0
                            ? "Search promo codes..."
                            : ""
                        }
                        size="small"
                        label={
                          policyMode === "allowlist"
                            ? "Allowed Codes"
                            : "Blocked Codes"
                        }
                      />
                    )}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => {
                        const { key, ...rest } = getTagProps({ index });
                        return (
                          <Chip
                            key={key}
                            label={
                              codes.find((c) => c.id === option.value)
                                ?.code ?? option.value
                            }
                            size="small"
                            {...rest}
                            sx={{
                              fontFamily: "Roboto Mono, monospace",
                              fontSize: "0.75rem",
                            }}
                          />
                        );
                      })
                    }
                    sx={{ mb: 2 }}
                  />
                )}

                {/* Preview of current state */}
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    bgcolor:
                      policyMode === "none"
                        ? "error.50"
                        : policyMode === "blocklist"
                          ? "warning.50"
                          : policyMode === "allowlist"
                            ? "info.50"
                            : "success.50",
                    borderColor:
                      policyMode === "none"
                        ? "error.200"
                        : policyMode === "blocklist"
                          ? "warning.200"
                          : policyMode === "allowlist"
                            ? "info.200"
                            : "success.200",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color:
                        policyMode === "none"
                          ? "error.dark"
                          : policyMode === "blocklist"
                            ? "warning.dark"
                            : policyMode === "allowlist"
                              ? "info.dark"
                              : "success.dark",
                      fontSize: "0.8125rem",
                    }}
                  >
                    {policyMode === "all" &&
                      "All promo codes are accepted for this rate plan."}
                    {policyMode === "none" &&
                      "No promo codes will be accepted. The promo code field will be hidden at checkout."}
                    {policyMode === "allowlist" &&
                      (selectedCodes.length === 0
                        ? "No codes selected yet. Only selected codes will be accepted."
                        : `Only ${selectedCodes.length} code${selectedCodes.length > 1 ? "s" : ""} will be accepted: ${selectedCodes.map((s) => codes.find((c) => c.id === s.value)?.code ?? s.value).join(", ")}`)}
                    {policyMode === "blocklist" &&
                      (selectedCodes.length === 0
                        ? "No codes blocked. All codes will be accepted."
                        : `${selectedCodes.length} code${selectedCodes.length > 1 ? "s" : ""} will be blocked: ${selectedCodes.map((s) => codes.find((c) => c.id === s.value)?.code ?? s.value).join(", ")}`)}
                  </Typography>
                </Paper>
              </Box>
            </Box>

            {/* Drawer footer */}
            <Box
              sx={{
                px: 3,
                py: 2,
                borderTop: 1,
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 1.5,
              }}
            >
              {saved && (
                <Typography
                  variant="body2"
                  color="success.main"
                  sx={{ fontSize: "0.8125rem" }}
                >
                  Saved successfully
                </Typography>
              )}
              <Button variant="outlined" size="small" onClick={closeEdit}>
                Cancel
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={save}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Policy"}
              </Button>
            </Box>
          </Box>
        )}
      </Drawer>
    </Box>
  );
}
