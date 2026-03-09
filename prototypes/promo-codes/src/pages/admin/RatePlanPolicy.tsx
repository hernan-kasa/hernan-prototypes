import { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  IconButton,
  Paper,
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

const ALL_COUPONS_VALUE = "__ALL_COUPONS__";

interface AutocompleteOption {
  label: string;
  value: string;
  group: string;
}

function buildOptions(codes: PromoCode[]): AutocompleteOption[] {
  return [
    {
      label: "All current and future promo codes",
      value: ALL_COUPONS_VALUE,
      group: "Apply universally",
    },
    ...codes
      .filter((c) => c.is_active)
      .map((c) => ({
        label: `${c.code} — ${c.name}`,
        value: c.code,
        group: "Apply individually",
      })),
  ];
}

function policyToSelected(
  policy: RatePlanPromoPolicy | null,
  allOptions: AutocompleteOption[]
): AutocompleteOption[] {
  if (!policy) return [];
  if (policy.disallow_all_promo_codes) {
    return allOptions.filter((o) => o.value === ALL_COUPONS_VALUE);
  }
  return allOptions.filter((o) =>
    policy.promo_codes_to_disallow.includes(o.value)
  );
}

function selectedToPayload(selected: AutocompleteOption[]) {
  const isAll = selected.some((o) => o.value === ALL_COUPONS_VALUE);
  return {
    disallow_all_promo_codes: isAll,
    promo_codes_to_disallow: isAll
      ? []
      : selected.map((o) => o.value),
  };
}

/** Summary chip for the table row */
function PolicySummary({
  policy,
}: {
  policy: RatePlanPromoPolicy | null | undefined;
}) {
  if (!policy) {
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
  if (policy.disallow_all_promo_codes) {
    return (
      <Chip
        label="All excluded"
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
  if (policy.promo_codes_to_disallow.length > 0) {
    return (
      <Chip
        label={`${policy.promo_codes_to_disallow.length} excluded`}
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

export default function RatePlanPolicy() {
  const ratePlans = useRatePlans();
  const { codes } = usePromoCodes();
  const [policies, setPolicies] = useState<
    Record<string, RatePlanPromoPolicy>
  >({});
  const [loadingPolicies, setLoadingPolicies] = useState(true);

  // Drawer state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selected, setSelected] = useState<AutocompleteOption[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const options = buildOptions(codes);
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
            return { rpId: rp.id, policy: { id: res.data.data.id, ...d } as RatePlanPromoPolicy };
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
    setSelected(policyToSelected(policy, options));
    setEditingId(rpId);
    setSaved(false);
  };

  const closeEdit = () => {
    setEditingId(null);
    setSaved(false);
  };

  // Handle autocomplete change
  const handleSelectionChange = (
    _: unknown,
    newValue: AutocompleteOption[]
  ) => {
    // If "All" was just selected, clear individual selections
    const hadAll = selected.some((o) => o.value === ALL_COUPONS_VALUE);
    const hasAll = newValue.some((o) => o.value === ALL_COUPONS_VALUE);

    if (!hadAll && hasAll) {
      // User just selected "All" — keep only the All option
      setSelected(newValue.filter((o) => o.value === ALL_COUPONS_VALUE));
    } else if (hadAll && newValue.length > 1) {
      // User selected an individual while "All" was active — remove "All"
      setSelected(newValue.filter((o) => o.value !== ALL_COUPONS_VALUE));
    } else {
      setSelected(newValue);
    }
  };

  const save = async () => {
    if (!editingId) return;
    setSaving(true);
    const payload = selectedToPayload(selected);
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

  const isAllSelected = selected.some(
    (o) => o.value === ALL_COUPONS_VALUE
  );

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
          Manage promo code exclusion policies for each rate plan
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
                        fontFamily: "'JetBrains Mono', monospace",
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
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {editingPlan.code} · {editingPlan.id}
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

              {/* Promo code exclusion */}
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
                  Promo Codes to Exclude
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2, fontSize: "0.8125rem" }}
                >
                  Adding a promo code to this section means it will not
                  be considered a valid entry at checkout for guests
                  booking under this rate plan.
                </Typography>

                <Autocomplete
                  multiple
                  options={options}
                  value={selected}
                  onChange={handleSelectionChange}
                  groupBy={(option) => option.group}
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
                  getOptionDisabled={(option) =>
                    isAllSelected &&
                    option.value !== ALL_COUPONS_VALUE
                  }
                  disableCloseOnSelect
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={
                        selected.length === 0
                          ? "Search promo codes..."
                          : ""
                      }
                      size="small"
                    />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => {
                      const { key, ...rest } = getTagProps({ index });
                      return (
                        <Chip
                          key={key}
                          label={
                            option.value === ALL_COUPONS_VALUE
                              ? "All promo codes"
                              : option.value
                          }
                          size="small"
                          {...rest}
                          sx={{
                            fontFamily:
                              option.value !== ALL_COUPONS_VALUE
                                ? "'JetBrains Mono', monospace"
                                : undefined,
                            fontSize: "0.75rem",
                          }}
                        />
                      );
                    })
                  }
                  renderGroup={(params) => (
                    <li key={params.key}>
                      <Typography
                        sx={{
                          px: 2,
                          py: 0.75,
                          fontSize: "0.6875rem",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          color: "grey.500",
                          bgcolor: "grey.50",
                        }}
                      >
                        {params.group}
                      </Typography>
                      <ul style={{ padding: 0 }}>
                        {params.children}
                      </ul>
                    </li>
                  )}
                  sx={{ mb: 2 }}
                />

                {/* Preview of current state */}
                {selected.length > 0 && (
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      bgcolor: isAllSelected
                        ? "error.50"
                        : "warning.50",
                      borderColor: isAllSelected
                        ? "error.200"
                        : "warning.200",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: isAllSelected
                          ? "error.dark"
                          : "warning.dark",
                        fontSize: "0.8125rem",
                      }}
                    >
                      {isAllSelected
                        ? "All promo codes will be blocked for this rate plan. No promo codes will be accepted at checkout."
                        : `${selected.length} promo code${selected.length > 1 ? "s" : ""} will be blocked: ${selected.map((s) => s.value).join(", ")}`}
                    </Typography>
                  </Paper>
                )}
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
