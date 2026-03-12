import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  Checkbox,
  Chip,
  Collapse,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { VpnKey as CodeIcon } from "@mui/icons-material";
import BookingSummary from "../../components/checkout/BookingSummary";
import PromoCodeInput from "../../components/checkout/PromoCodeInput";
import {
  useProperties,
  useRatePlans,
  useRatePlanPolicy,
  useValidatePromoCode,
} from "../../hooks/usePromoCodes";

/* ---------- Property demo data ---------- */

const PROPERTY_IMAGES: Record<string, string> = {
  "prop-001":
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=400&fit=crop",
  "prop-002":
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=400&fit=crop",
  "prop-003":
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=400&fit=crop",
  "prop-004":
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=400&fit=crop",
  "prop-005":
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=400&fit=crop",
};

const PROPERTY_ADDRESSES: Record<string, string> = {
  "prop-001": "123 S Figueroa St, Los Angeles, CA 90012",
  "prop-002": "2015 Lombard St, San Francisco, CA 94123",
  "prop-003": "1100 S Congress Ave, Austin, TX 78704",
  "prop-004": "1701 Wynkoop St, Denver, CO 80202",
  "prop-005": "1009 Broadway, Nashville, TN 37203",
};

/* ---------- Pricing ---------- */

const RATE_BASE_PRICES: Record<string, number> = {
  "rp-001": 210, // Best Available Rate
  "rp-002": 189, // Non-Refundable Rate
  "rp-004": 179, // Corporate Rate (negotiated)
  "rp-007": 165, // Group Rate (negotiated)
};

const KASA_DISCOUNT_PCT = 10;

const ACCESS_CODE_MAP: Record<string, string[]> = {
  CORP: ["rp-004"],
  GROUP: ["rp-007"],
};

/* ---------- Helpers ---------- */

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function calcNights(checkIn: string, checkOut: string): number {
  const ci = new Date(checkIn + "T12:00:00");
  const co = new Date(checkOut + "T12:00:00");
  return Math.max(
    1,
    Math.round((co.getTime() - ci.getTime()) / (1000 * 60 * 60 * 24)),
  );
}

/* ---------- Section wrapper ---------- */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
      <Typography
        variant="h6"
        sx={{ fontWeight: 600, mb: 2.5, fontSize: "1.1rem" }}
      >
        {title}
      </Typography>
      {children}
    </Paper>
  );
}

/* ========================================
   CheckoutPage
   ======================================== */

export default function CheckoutPage() {
  const properties = useProperties();
  const ratePlans = useRatePlans();

  /* --- Booking state --- */
  const [propertyId, setPropertyId] = useState("prop-001");
  const [ratePlanId, setRatePlanId] = useState("rp-001");
  const [checkInDate, setCheckInDate] = useState("2026-03-15");
  const [checkOutDate, setCheckOutDate] = useState("2026-03-18");
  const [promoCode, setPromoCode] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [kasaDiscount, setKasaDiscount] = useState(true);

  /* --- Guest info --- */
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  /* --- Access code (corporate / group access) --- */
  const [accessCodeInput, setAccessCodeInput] = useState("");
  const [accessCodeExpanded, setAccessCodeExpanded] = useState(false);
  const [activeAccessCode, setActiveAccessCode] = useState<string | null>(null);
  const [accessCodeError, setAccessCodeError] = useState<string | null>(null);

  /* --- Promo validation --- */
  const { result, loading, validate, clear } = useValidatePromoCode();

  /* --- Rate plan policy (determines if promos are blocked) --- */
  const { policy } = useRatePlanPolicy(ratePlanId);

  /* --- Derived values --- */
  const nights = calcNights(checkInDate, checkOutDate);
  const baseRate = RATE_BASE_PRICES[ratePlanId] ?? 210;
  const effectiveRate = kasaDiscount
    ? Math.round(baseRate * (1 - KASA_DISCOUNT_PCT / 100))
    : baseRate;
  const bookingAmount = nights * effectiveRate;

  // Visible rate plans: negotiated when access code is active, else Standard + NRF
  const visibleRatePlans = activeAccessCode
    ? ratePlans.filter((rp) =>
        ACCESS_CODE_MAP[activeAccessCode]?.includes(rp.id),
      )
    : ratePlans.filter((rp) => rp.id === "rp-001" || rp.id === "rp-002");

  // Promo blocked when policy is "none"
  const promoBlocked = policy?.promo_code_policy === "none";
  const selectedProperty = properties.find((p) => p.id === propertyId);
  const selectedRatePlan = ratePlans.find((rp) => rp.id === ratePlanId);

  /* --- Handlers --- */
  const handleApply = async (code: string) => {
    setPromoCode(code);
    await validate({
      code,
      property_id: propertyId,
      rate_plan_id: ratePlanId,
      booking_amount: bookingAmount,
      guest_id: email || undefined,
      check_in_date: checkInDate,
      check_out_date: checkOutDate,
    });
  };

  const handleRemove = () => {
    setPromoCode("");
    clear();
  };

  const handleRatePlanChange = (id: string) => {
    setRatePlanId(id);
    handleRemove();
  };

  const handlePropertyChange = (id: string) => {
    setPropertyId(id);
    handleRemove();
  };

  const handleAccessCodeApply = () => {
    const code = accessCodeInput.trim().toUpperCase();
    if (!code) return;
    const matchedPlanIds = ACCESS_CODE_MAP[code];
    if (matchedPlanIds) {
      setActiveAccessCode(code);
      setAccessCodeError(null);
      setAccessCodeExpanded(false);
      setRatePlanId(matchedPlanIds[0]);
      handleRemove();
    } else {
      setAccessCodeError("Invalid code. Please check and try again.");
    }
  };

  const handleAccessCodeClear = () => {
    setActiveAccessCode(null);
    setAccessCodeInput("");
    setAccessCodeError(null);
    setAccessCodeExpanded(false);
    setRatePlanId("rp-001");
    handleRemove();
  };

  const handleAccessCodeKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAccessCodeApply();
    }
  };

  /* ========== Render ========== */
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f7f7f7" }}>
      {/* ---- Header ---- */}
      <AppBar
        position="static"
        elevation={0}
        sx={{ borderBottom: "1px solid", borderColor: "divider" }}
      >
        <Toolbar
          sx={{
            maxWidth: 1100,
            width: "100%",
            mx: "auto",
            minHeight: "56px !important",
            px: { xs: 2, md: 3 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexGrow: 1,
            }}
          >
            <Box
              sx={{
                width: 28,
                height: 28,
                bgcolor: "primary.main",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                sx={{ color: "white", fontWeight: 700, fontSize: "0.8rem" }}
              >
                K
              </Typography>
            </Box>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "grey.900",
              }}
            >
              kasa
            </Typography>
          </Box>
          <Button
            component={RouterLink}
            to="/admin"
            size="small"
            variant="outlined"
          >
            Back to Admin
          </Button>
        </Toolbar>
      </AppBar>

      {/* ---- Property Hero ---- */}
      <Box
        sx={{
          position: "relative",
          height: 220,
          overflow: "hidden",
          bgcolor: "grey.800",
        }}
      >
        <Box
          component="img"
          src={PROPERTY_IMAGES[propertyId] ?? PROPERTY_IMAGES["prop-001"]}
          alt={selectedProperty?.name}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.7,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
            px: { xs: 2, md: 3 },
            py: 3,
          }}
        >
          <Box sx={{ maxWidth: 1100, mx: "auto" }}>
            <Typography
              variant="h5"
              sx={{ color: "white", fontWeight: 700, mb: 0.5 }}
            >
              {selectedProperty?.name ?? "Select a property"}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "rgba(255,255,255,0.8)", mb: 1 }}
            >
              {PROPERTY_ADDRESSES[propertyId] ?? ""}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Chip
                label={`${formatDate(checkInDate)} \u2192 ${formatDate(checkOutDate)}`}
                size="small"
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  color: "white",
                  fontWeight: 500,
                }}
              />
              <Chip
                label={`${nights} night${nights > 1 ? "s" : ""}`}
                size="small"
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  color: "white",
                  fontWeight: 500,
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ---- Main Content ---- */}
      <Box sx={{ maxWidth: 1100, mx: "auto", px: { xs: 2, md: 3 }, py: 4 }}>
        <Grid container spacing={4}>
          {/* ========== Left Column: Forms ========== */}
          <Grid size={{ xs: 12, md: 7 }}>
            {/* Demo Controls */}
            <Paper
              variant="outlined"
              sx={{ p: 2, mb: 3, bgcolor: "grey.50", borderStyle: "dashed" }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  display: "block",
                  mb: 1.5,
                }}
              >
                Demo Controls
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <FormControl size="small" sx={{ minWidth: 200, flex: 1 }}>
                  <InputLabel>Property</InputLabel>
                  <Select
                    value={propertyId}
                    label="Property"
                    onChange={(e) => handlePropertyChange(e.target.value)}
                  >
                    {properties.map((p) => (
                      <MenuItem key={p.id} value={p.id}>
                        {p.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  type="date"
                  size="small"
                  label="Check-in"
                  value={checkInDate}
                  onChange={(e) => {
                    setCheckInDate(e.target.value);
                    handleRemove();
                  }}
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{ flex: 0.5 }}
                />
                <TextField
                  type="date"
                  size="small"
                  label="Check-out"
                  value={checkOutDate}
                  onChange={(e) => {
                    setCheckOutDate(e.target.value);
                    handleRemove();
                  }}
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{ flex: 0.5 }}
                />
              </Box>
            </Paper>

            {/* Your Details */}
            <Section title="Your details">
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  size="small"
                  fullWidth
                  label="Email address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="guest@example.com"
                />
                <Box sx={{ display: "flex", gap: 2 }}>
                  <TextField
                    size="small"
                    fullWidth
                    label="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <TextField
                    size="small"
                    fullWidth
                    label="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </Box>
                <TextField
                  size="small"
                  fullWidth
                  label="Phone number"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                />
              </Box>
            </Section>

            {/* Select Your Rate */}
            <Section title="Select your rate">
              {/* kasa.com discount checkbox */}
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={kasaDiscount}
                    onChange={(e) => {
                      setKasaDiscount(e.target.checked);
                      handleRemove();
                    }}
                    sx={{
                      color: "success.main",
                      "&.Mui-checked": { color: "success.main" },
                    }}
                  />
                }
                label={
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Apply kasa.com discount
                    </Typography>
                    <Chip
                      label={`Save ${KASA_DISCOUNT_PCT}%`}
                      size="small"
                      sx={{
                        bgcolor: "rgba(46, 125, 50, 0.08)",
                        color: "success.main",
                        fontWeight: 600,
                        fontSize: "0.7rem",
                        height: 22,
                      }}
                    />
                  </Box>
                }
                sx={{ mb: 0.5, alignItems: "center", mr: 0 }}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", ml: 4, mb: 2.5 }}
              >
                Book direct on kasa.com and save compared to OTA rates.
              </Typography>

              {/* Access code applied badge */}
              {activeAccessCode && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 2,
                    py: 1,
                    px: 1.5,
                    bgcolor: "rgba(38, 120, 245, 0.06)",
                    borderRadius: 1,
                  }}
                >
                  <CodeIcon sx={{ fontSize: 16, color: "primary.main" }} />
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color="primary.main"
                  >
                    {activeAccessCode} rate applied
                  </Typography>
                  <Link
                    component="button"
                    variant="caption"
                    underline="always"
                    onClick={handleAccessCodeClear}
                    sx={{ color: "text.secondary", ml: "auto" }}
                  >
                    Clear
                  </Link>
                </Box>
              )}

              {/* Rate plan cards */}
              <RadioGroup
                value={ratePlanId}
                onChange={(e) => handleRatePlanChange(e.target.value)}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                  }}
                >
                  {visibleRatePlans.map((rp) => {
                    const selected = ratePlanId === rp.id;
                    const rpBase = RATE_BASE_PRICES[rp.id] ?? 210;
                    const rpEffective = kasaDiscount
                      ? Math.round(rpBase * (1 - KASA_DISCOUNT_PCT / 100))
                      : rpBase;
                    return (
                      <Paper
                        key={rp.id}
                        variant="outlined"
                        sx={{
                          p: 2,
                          cursor: "pointer",
                          borderColor: selected ? "primary.main" : "divider",
                          borderWidth: selected ? 2 : 1,
                          bgcolor: selected
                            ? "rgba(38, 120, 245, 0.04)"
                            : "transparent",
                          transition: "all 0.15s ease",
                          "&:hover": { borderColor: "primary.main" },
                        }}
                        onClick={() => handleRatePlanChange(rp.id)}
                      >
                        <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                          <Radio
                            value={rp.id}
                            size="small"
                            sx={{ mt: -0.5, mr: 1 }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                mb: 0.5,
                              }}
                            >
                              <Typography
                                variant="body1"
                                sx={{ fontWeight: 600 }}
                              >
                                {rp.name}
                              </Typography>
                              <Box sx={{ textAlign: "right" }}>
                                {kasaDiscount && (
                                  <Typography
                                    variant="caption"
                                    color="text.disabled"
                                    sx={{
                                      textDecoration: "line-through",
                                      display: "block",
                                      lineHeight: 1.2,
                                    }}
                                  >
                                    ${rpBase}
                                  </Typography>
                                )}
                                <Typography
                                  variant="body1"
                                  sx={{ fontWeight: 700 }}
                                >
                                  ${rpEffective}
                                  <Typography
                                    component="span"
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ fontWeight: 400 }}
                                  >
                                    /night
                                  </Typography>
                                </Typography>
                              </Box>
                            </Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 1 }}
                            >
                              {rp.description}
                            </Typography>
                            <Chip
                              label={rp.cancellation_policy}
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                        </Box>
                      </Paper>
                    );
                  })}
                </Box>
              </RadioGroup>

              {/* Access code */}
              {!activeAccessCode && (
                <Box sx={{ mt: 2 }}>
                  {!accessCodeExpanded && (
                    <Link
                      component="button"
                      variant="body2"
                      underline="always"
                      onClick={() => setAccessCodeExpanded(true)}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        color: "text.secondary",
                        "&:hover": { color: "primary.main" },
                      }}
                    >
                      <CodeIcon sx={{ fontSize: 16 }} />
                      Have a corporate or group code?
                    </Link>
                  )}

                  <Collapse in={accessCodeExpanded}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <TextField
                        size="small"
                        fullWidth
                        value={accessCodeInput}
                        onChange={(e) =>
                          setAccessCodeInput(e.target.value.toUpperCase())
                        }
                        onKeyDown={handleAccessCodeKeyDown}
                        placeholder="Enter access code"
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
                        onClick={handleAccessCodeApply}
                        disabled={!accessCodeInput.trim()}
                        size="small"
                        sx={{
                          whiteSpace: "nowrap",
                          minWidth: "auto",
                          px: 2,
                        }}
                      >
                        Apply
                      </Button>
                    </Box>
                    {accessCodeError && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ mt: 0.5, display: "block" }}
                      >
                        {accessCodeError}
                      </Typography>
                    )}
                  </Collapse>
                </Box>
              )}
            </Section>
          </Grid>

          {/* ========== Right Column: Cart ========== */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper
              variant="outlined"
              sx={{ p: 3, position: "sticky", top: 24 }}
            >
              {/* Cart header */}
              <Box sx={{ display: "flex", gap: 2, mb: 2.5 }}>
                <Box
                  component="img"
                  src={
                    PROPERTY_IMAGES[propertyId] ?? PROPERTY_IMAGES["prop-001"]
                  }
                  alt={selectedProperty?.name}
                  sx={{
                    width: 80,
                    height: 60,
                    borderRadius: 1,
                    objectFit: "cover",
                    flexShrink: 0,
                  }}
                />
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {selectedProperty?.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(checkInDate)} \u2014 {formatDate(checkOutDate)}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    {nights} night{nights > 1 ? "s" : ""} &middot;{" "}
                    {selectedRatePlan?.name ?? "Standard"}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 2.5 }} />

              {/* Price breakdown */}
              <BookingSummary
                nights={nights}
                baseNightlyRate={baseRate}
                kasaDiscount={kasaDiscount}
                appliedPromo={result?.valid ? result : null}
                promoCode={promoCode}
              />

              {/* Promo Code — hidden when rate plan blocks all promos */}
              {!promoBlocked && (
                <Box sx={{ mt: 2.5 }}>
                  <PromoCodeInput
                    onApply={handleApply}
                    onRemove={handleRemove}
                    result={result}
                    loading={loading}
                  />
                </Box>
              )}

              {promoBlocked && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mt: 2, fontStyle: "italic" }}
                >
                  Promo codes are not available with the{" "}
                  {selectedRatePlan?.name} rate.
                </Typography>
              )}

              <Divider sx={{ my: 2.5 }} />

              {/* Cancellation policy */}
              {selectedRatePlan && (
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 600, display: "block", mb: 0.5 }}
                  >
                    Cancellation policy
                  </Typography>
                  <Typography variant="body2">
                    {selectedRatePlan.cancellation_policy === "Non-Refundable"
                      ? "This rate is non-refundable. No cancellations or modifications."
                      : selectedRatePlan.cancellation_policy === "Flexible"
                        ? "Free cancellation up to 24 hours before check-in."
                        : selectedRatePlan.cancellation_policy === "Moderate"
                          ? "Free cancellation up to 5 days before check-in."
                          : selectedRatePlan.cancellation_policy === "Strict"
                            ? "Free cancellation up to 14 days before check-in. 50% refund within 14 days."
                            : "Cancellation fees may apply. See terms for details."}
                  </Typography>
                </Box>
              )}

              {/* Terms */}
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                  />
                }
                label={
                  <Typography variant="caption" color="text.secondary">
                    I agree to the{" "}
                    <Typography
                      component="span"
                      variant="caption"
                      color="primary"
                      sx={{ cursor: "pointer" }}
                    >
                      Terms of Service
                    </Typography>{" "}
                    and{" "}
                    <Typography
                      component="span"
                      variant="caption"
                      color="primary"
                      sx={{ cursor: "pointer" }}
                    >
                      Privacy Policy
                    </Typography>
                  </Typography>
                }
                sx={{ mb: 2, alignItems: "flex-start", mr: 0 }}
              />

              {/* Book Now */}
              <Button
                variant="contained"
                fullWidth
                size="large"
                disabled={!agreedToTerms}
                sx={{ fontWeight: 600, py: 1.5 }}
              >
                Book now
              </Button>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                textAlign="center"
                sx={{ mt: 1.5 }}
              >
                Demo only &mdash; no booking will be created
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
