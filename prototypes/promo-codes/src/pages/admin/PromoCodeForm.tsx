import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Grid,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  InputLabel,
  FormControl,
} from "@mui/material";
import api from "../../api/client";
import PropertySelector from "../../components/admin/PropertySelector";

interface FormData {
  code: string;
  name: string;
  discount_type: "PERCENTAGE" | "FIXED";
  discount_value: string;
  property_ids: string[];
  valid_after: string;
  valid_before: string;
  max_uses: string;
  min_booking_amount: string;
  min_nights: string;
  max_nights: string;
}

const EMPTY_FORM: FormData = {
  code: "",
  name: "",
  discount_type: "PERCENTAGE",
  discount_value: "",
  property_ids: [],
  valid_after: "",
  valid_before: "",
  max_uses: "",
  min_booking_amount: "",
  min_nights: "",
  max_nights: "",
};

export default function PromoCodeForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    api.get(`/promo-codes/${id}`).then((res) => {
      const d = res.data.data.attributes;
      setForm({
        code: d.code,
        name: d.name,
        discount_type: d.discount_type,
        discount_value: String(d.discount_value),
        property_ids: d.property_ids,
        valid_after: d.valid_after ? d.valid_after.slice(0, 16) : "",
        valid_before: d.valid_before ? d.valid_before.slice(0, 16) : "",
        max_uses: d.max_uses !== null ? String(d.max_uses) : "",
        min_booking_amount:
          d.min_booking_amount !== null ? String(d.min_booking_amount) : "",
        min_nights: d.min_nights !== null ? String(d.min_nights) : "",
        max_nights: d.max_nights !== null ? String(d.max_nights) : "",
      });
    });
  }, [id]);

  const set = (field: keyof FormData, value: string | string[]) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const payload = {
      code: form.code,
      name: form.name,
      discount_type: form.discount_type,
      discount_value: parseFloat(form.discount_value),
      property_ids: form.property_ids,
      valid_after: form.valid_after || null,
      valid_before: form.valid_before || null,
      max_uses: form.max_uses ? parseInt(form.max_uses) : null,
      min_booking_amount: form.min_booking_amount
        ? parseFloat(form.min_booking_amount)
        : null,
      min_nights: form.min_nights ? parseInt(form.min_nights) : null,
      max_nights: form.max_nights ? parseInt(form.max_nights) : null,
    };

    try {
      if (isEdit) {
        await api.put(`/promo-codes/${id}`, payload);
      } else {
        await api.post("/promo-codes", payload);
      }
      navigate("/admin");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to save promo code");
    }
    setSaving(false);
  };

  return (
    <Box sx={{ maxWidth: 680 }}>
      {/* Page header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5">
          {isEdit ? "Edit Promo Code" : "Create Promo Code"}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
          {isEdit ? "Update the promo code details below" : "Fill in the details to create a new promo code"}
        </Typography>
      </Box>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Section: Basic Info */}
          <Typography variant="subtitle2" sx={{ mb: 2, color: "grey.600", textTransform: "uppercase", fontSize: "0.6875rem", letterSpacing: "0.05em" }}>
            Basic Information
          </Typography>
          <Grid container spacing={2.5}>
            <Grid size={12}>
              <TextField
                label="Code"
                required
                fullWidth
                size="small"
                value={form.code}
                onChange={(e) => set("code", e.target.value.toUpperCase())}
                placeholder="SUMMER25"
                slotProps={{ input: { sx: { fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase" } } }}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                label="Internal Name"
                required
                fullWidth
                size="small"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Summer 2026 — 25% Off"
              />
            </Grid>
            <Grid size={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Discount Type</InputLabel>
                <Select
                  value={form.discount_type}
                  label="Discount Type"
                  onChange={(e) =>
                    set("discount_type", e.target.value as "PERCENTAGE" | "FIXED")
                  }
                >
                  <MenuItem value="PERCENTAGE">Percentage (%)</MenuItem>
                  <MenuItem value="FIXED">Fixed Amount ($)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={6}>
              <TextField
                label="Discount Value"
                required
                fullWidth
                size="small"
                type="number"
                slotProps={{
                  htmlInput: {
                    min: 0,
                    max: form.discount_type === "PERCENTAGE" ? 100 : undefined,
                    step: "0.01",
                  },
                }}
                value={form.discount_value}
                onChange={(e) => set("discount_value", e.target.value)}
                placeholder={form.discount_type === "PERCENTAGE" ? "25" : "50.00"}
              />
            </Grid>
          </Grid>

          {/* Section: Properties */}
          <Typography variant="subtitle2" sx={{ mt: 4, mb: 2, color: "grey.600", textTransform: "uppercase", fontSize: "0.6875rem", letterSpacing: "0.05em" }}>
            Properties
          </Typography>
          <PropertySelector
            selected={form.property_ids}
            onChange={(ids) => set("property_ids", ids)}
          />

          {/* Section: Validity */}
          <Typography variant="subtitle2" sx={{ mt: 4, mb: 2, color: "grey.600", textTransform: "uppercase", fontSize: "0.6875rem", letterSpacing: "0.05em" }}>
            Validity Period
          </Typography>
          <Grid container spacing={2.5}>
            <Grid size={6}>
              <TextField
                label="Valid After"
                type="datetime-local"
                fullWidth
                size="small"
                value={form.valid_after}
                onChange={(e) => set("valid_after", e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                label="Valid Before"
                type="datetime-local"
                fullWidth
                size="small"
                value={form.valid_before}
                onChange={(e) => set("valid_before", e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>
          </Grid>

          {/* Section: Constraints */}
          <Typography variant="subtitle2" sx={{ mt: 4, mb: 2, color: "grey.600", textTransform: "uppercase", fontSize: "0.6875rem", letterSpacing: "0.05em" }}>
            Constraints
          </Typography>
          <Grid container spacing={2.5}>
            <Grid size={6}>
              <TextField
                label="Max Uses"
                type="number"
                fullWidth
                size="small"
                slotProps={{ htmlInput: { min: 1 } }}
                value={form.max_uses}
                onChange={(e) => set("max_uses", e.target.value)}
                placeholder="Unlimited"
              />
            </Grid>
            <Grid size={6}>
              <TextField
                label="Min Booking Amount ($)"
                type="number"
                fullWidth
                size="small"
                slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
                value={form.min_booking_amount}
                onChange={(e) => set("min_booking_amount", e.target.value)}
                placeholder="No minimum"
              />
            </Grid>
            <Grid size={6}>
              <TextField
                label="Min Nights"
                type="number"
                fullWidth
                size="small"
                slotProps={{ htmlInput: { min: 1 } }}
                value={form.min_nights}
                onChange={(e) => set("min_nights", e.target.value)}
                placeholder="No minimum"
              />
            </Grid>
            <Grid size={6}>
              <TextField
                label="Max Nights"
                type="number"
                fullWidth
                size="small"
                slotProps={{ htmlInput: { min: 1 } }}
                value={form.max_nights}
                onChange={(e) => set("max_nights", e.target.value)}
                placeholder="No maximum"
              />
            </Grid>
          </Grid>

          {/* Actions */}
          <Box sx={{ display: "flex", gap: 1.5, mt: 4, pt: 3, borderTop: 1, borderColor: "divider" }}>
            <Button type="submit" variant="contained" size="small" disabled={saving}>
              {saving ? "Saving..." : isEdit ? "Update Code" : "Create Code"}
            </Button>
            <Button variant="outlined" size="small" onClick={() => navigate("/admin")}>
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
